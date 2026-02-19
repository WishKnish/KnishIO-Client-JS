import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  jest
} from '@jest/globals'
import KnishIOClient from '../src/KnishIOClient'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import {
  generateSecret
} from '../src'
import MutationTransferTokens from '../src/mutation/MutationTransferTokens'
import MutationCreateToken from '../src/mutation/MutationCreateToken'
import MutationCreateMeta from '../src/mutation/MutationCreateMeta'
import MutationCreateWallet from '../src/mutation/MutationCreateWallet'
import MutationClaimShadowWallet from '../src/mutation/MutationClaimShadowWallet'
import QueryAtom from '../src/query/QueryAtom'

const testUri = process.env.KNISHIO_TEST_URI || 'https://eteplitsky.testnet.knish.io:443/graphql'
const testCell = 'TESTCELL'
const unitSecret = generateSecret()
const integrationSecret = generateSecret()

// Integration tests require a running Knish.IO server.
// Set KNISHIO_TEST_URI env var to enable them.
const runIntegration = !!process.env.KNISHIO_TEST_URI
const describeIntegration = runIntegration ? describe : describe.skip

describe('KnishIOClient - Unit', () => {
  let knishIOClientInstance

  beforeEach(() => {
    knishIOClientInstance = new KnishIOClient({
      uri: testUri,
      cellSlug: testCell,
      logging: false
    })
    knishIOClientInstance.setSecret(unitSecret)
  })

  test('initializes client correctly', () => {
    expect(knishIOClientInstance.getUri()).toBe(testUri)
    expect(knishIOClientInstance.getCellSlug()).toBe(testCell)
    expect(knishIOClientInstance.getSecret()).toBe(unitSecret)
  })

  test('handles encryption toggle correctly', () => {
    expect(knishIOClientInstance.switchEncryption(true)).toBe(true)
    expect(knishIOClientInstance.switchEncryption(true)).toBe(false) // No change, already true
    expect(knishIOClientInstance.switchEncryption(false)).toBe(true)
    expect(knishIOClientInstance.switchEncryption(false)).toBe(false) // No change, already false
  })

  test('creates query correctly', () => {
    const query = knishIOClientInstance.createQuery(QueryAtom)
    expect(query).toBeInstanceOf(QueryAtom)

    const variables = QueryAtom.createVariables({
      metaTypes: ['foo', 'bar']
    })
    expect(variables).toBeInstanceOf(Object)

    const queryObj = query.createQuery({ variables })
    expect(queryObj).toBeInstanceOf(Object)
    expect(queryObj.variables).toBe(variables)
  })

  test('handles auth token correctly', () => {
    const mockAuthToken = {
      getToken: jest.fn().mockReturnValue('testToken'),
      getAuthData: jest.fn().mockReturnValue({
        token: 'testToken',
        pubkey: 'testPubkey'
      })
    }
    knishIOClientInstance.setAuthToken(mockAuthToken)
    expect(knishIOClientInstance.getAuthToken()).toBe(mockAuthToken)
  })
})

describeIntegration('KnishIOClient - Integration (requires server)', () => {
  let knishIOClientInstance

  beforeAll(async () => {
    knishIOClientInstance = new KnishIOClient({
      uri: testUri,
      cellSlug: testCell,
      logging: false
    })
    knishIOClientInstance.setSecret(integrationSecret)
    // Pre-authenticate so wallet bundle is created once
    await knishIOClientInstance.requestAuthToken({
      secret: integrationSecret
    })
    // Prevent re-authentication attempts during test suite.
    // PHP server does plain INSERT for wallet bundles (not UPSERT),
    // so a second requestAuthToken with the same secret causes a
    // duplicate key error. Setting a far-future expiration ensures
    // executeQuery() never triggers re-auth.
    const authToken = knishIOClientInstance.getAuthToken()
    if (authToken) {
      authToken.$__expiresAt = Math.floor(Date.now() / 1000) + 86400
    }
  })

  test('creates molecule correctly', async () => {
    const molecule = await knishIOClientInstance.createMolecule({})
    expect(molecule).toBeInstanceOf(Molecule)
    expect(molecule.secret).toBe(integrationSecret)
    expect(molecule.cellSlug).toBe(testCell)
  })

  test('creates wallet correctly', async () => {
    // Use createMolecule to get the source wallet (avoids duplicate auth)
    const molecule = await knishIOClientInstance.createMolecule({})
    expect(molecule.sourceWallet).toBeInstanceOf(Wallet)
    expect(molecule.sourceWallet.token).toBe('USER')
    expect(molecule.sourceWallet.bundle).toBeTruthy()
  })

  test('ensures insufficient balance is triggered', async () => {
    const recipientSecret = generateSecret()
    const recipientBundle = new Wallet({
      secret: recipientSecret,
      token: 'TEST'
    }).bundle

    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MutationTransferTokens
    })

    expect(() => {
      mutation.fillMolecule({
        recipientWallet: Wallet.create({
          bundle: recipientBundle,
          token: 'TEST'
        }),
        amount: '100000'
      })
    }).toThrowError('Insufficient balance for requested transfer')
  })

  test('signs and checks molecule correctly', async () => {
    const molecule = await knishIOClientInstance.createMolecule({})
    molecule.initMeta({
      metaType: 'TestMeta',
      metaId: 'test123',
      meta: {
        key1: 'value1',
        key2: 'value2'
      }
    })
    molecule.sign({})
    expect(molecule.molecularHash).toBeTruthy()
    expect(() => molecule.check()).not.toThrow()
  })

  test('generates and verifies client fingerprint', async () => {
    const fingerprint = await knishIOClientInstance.getFingerprint()
    expect(fingerprint).toBeTruthy()
    expect(typeof fingerprint).toBe('string')

    const fingerprintData = await knishIOClientInstance.getFingerprintData()
    expect(fingerprintData).toBeTruthy()
    expect(typeof fingerprintData).toBe('object')
  })

  test('prepares token creation correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MutationCreateToken
    })

    const recipientWallet = new Wallet({
      secret: integrationSecret,
      token: 'NEWTOKEN',
      position: '1234567890abcdef',
      characters: 'BASE64'
    })

    await mutation.fillMolecule({
      recipientWallet,
      amount: '1000000',
      meta: {
        name: 'New Token',
        fungibility: 'fungible',
        supply: 'limited',
        decimals: '2'
      }
    })

    const molecule = mutation.molecule()
    expect(molecule.atoms).toHaveLength(2)
    expect(molecule.atoms[0].isotope).toBe('C')
    expect(molecule.atoms[0].token).toBe('USER')
    expect(molecule.atoms[0].metaType).toBe('token')
    expect(molecule.atoms[0].metaId).toBe('NEWTOKEN')

    // I-isotope atom carries ContinuID chain metadata
    const iAtom = molecule.atoms[1]
    expect(iAtom.isotope).toBe('I')
    expect(iAtom.meta.find(m => m.key === 'characters')).toBeDefined()
    expect(iAtom.meta.find(m => m.key === 'pubkey')).toBeDefined()
  })

  test('prepares meta creation correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MutationCreateMeta
    })

    await mutation.fillMolecule({
      metaType: 'TestMeta',
      metaId: 'test123',
      meta: {
        key1: 'value1',
        key2: 'value2'
      }
    })

    // Without policy, initMeta creates M + I atoms (no R atom)
    const molecule = mutation.molecule()
    expect(molecule.atoms).toHaveLength(2)
    expect(molecule.atoms[0].isotope).toBe('M')
    expect(molecule.atoms[0].metaType).toBe('TestMeta')
    expect(molecule.atoms[0].metaId).toBe('test123')

    // I-isotope atom carries ContinuID chain metadata
    const iAtom = molecule.atoms[1]
    expect(iAtom.isotope).toBe('I')
    expect(iAtom.meta.find(m => m.key === 'characters')).toBeDefined()
  })

  test('prepares wallet creation correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MutationCreateWallet
    })

    const wallet = new Wallet({
      secret: integrationSecret,
      token: 'NEWTOKEN'
    })

    await mutation.fillMolecule({
      wallet
    })

    const molecule = mutation.molecule()
    expect(molecule.atoms).toHaveLength(2)
    expect(molecule.atoms[0].isotope).toBe('C')
    expect(molecule.atoms[0].token).toBe('USER')
    expect(molecule.atoms[0].metaType).toBe('wallet')
    expect(molecule.atoms[1].isotope).toBe('I')
  })

  test('prepares shadow wallet claim correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MutationClaimShadowWallet
    })

    await mutation.fillMolecule({
      token: 'SHADOWTOKEN',
      batchId: 'testBatchId'
    })

    const molecule = mutation.molecule()
    expect(molecule.atoms).toHaveLength(2)
    expect(molecule.atoms[0].isotope).toBe('C')
    expect(molecule.atoms[0].token).toBe('USER')
    expect(molecule.atoms[0].metaType).toBe('wallet')
    expect(molecule.atoms[0].batchId).toBe('testBatchId')
    expect(molecule.atoms[1].isotope).toBe('I')
  })

  test('creates molecule mutation correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MutationCreateMeta
    })
    expect(mutation.molecule()).toBeInstanceOf(Molecule)
  })
})
