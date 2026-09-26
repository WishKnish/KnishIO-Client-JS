import {
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  jest
} from '@jest/globals'
import KnishIOClient from '../src/KnishIOClient'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import AuthToken from '../src/AuthToken'
import {
  generateSecret,
  generateBundleHash
} from '../src'
import MutationTransferTokens from '../src/mutation/MutationTransferTokens'
import MutationCreateToken from '../src/mutation/MutationCreateToken'
import MutationCreateMeta from '../src/mutation/MutationCreateMeta'
import MutationCreateWallet from '../src/mutation/MutationCreateWallet'
import MutationClaimShadowWallet from '../src/mutation/MutationClaimShadowWallet'
import QueryAtom from '../src/query/QueryAtom'
import QueryContinuId from '../src/query/QueryContinuId'
import MutationRequestAuthorization from '../src/mutation/MutationRequestAuthorization'
import ResponseRequestAuthorization from '../src/response/ResponseRequestAuthorization'
import ResponseContinuId from '../src/response/ResponseContinuId'
import AuthorizationRejectedException from '../src/exception/AuthorizationRejectedException'

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

  // Validator 0.5.0 no longer executes the I-atom of an unproven
  // re-authorization, so the auth molecule's USER remainder is never
  // registered. The next molecule must be signed from the ContinuID pointer.
  test('signs the first molecule after profile auth from the ContinuID pointer, not the auth remainder', async () => {
    const client = knishIOClientInstance
    const continuIdPosition = Wallet.generatePosition()

    const executeSpy = jest.spyOn(MutationRequestAuthorization.prototype, 'execute')
      .mockImplementation(async function () {
        this.$__response = new ResponseRequestAuthorization({
          query: this,
          json: {
            data: {
              ProposeMolecule: {
                molecularHash: 'offline',
                status: 'accepted',
                reason: null,
                payload: JSON.stringify({
                  token: 'offline-token',
                  time: Math.floor(Date.now() / 1000) + 3600,
                  key: 'offline-pubkey',
                  encrypt: false
                })
              }
            }
          }
        })
        return this.$__response
      })

    const queryContinuIdSpy = jest.spyOn(client, 'queryContinuId')
      .mockImplementation(async ({ bundle }) => {
        const pointer = new Wallet({
          secret: unitSecret,
          token: 'USER',
          position: continuIdPosition
        })
        return new ResponseContinuId({
          query: client.createQuery(QueryContinuId),
          json: {
            data: {
              ContinuId: {
                tokenSlug: 'USER',
                address: pointer.address,
                position: continuIdPosition,
                bundleHash: bundle,
                batchId: null,
                characters: 'BASE64',
                pubkey: null,
                amount: 0
              }
            }
          }
        })
      })

    try {
      await client.requestProfileAuthToken({ secret: unitSecret, encrypt: false })
      const authRemainderPosition = client.getRemainderWallet().position
      queryContinuIdSpy.mockClear()

      const molecule = await client.createMolecule({})

      expect(queryContinuIdSpy).toHaveBeenCalledTimes(1)
      expect(molecule.sourceWallet.position).toBe(continuIdPosition)
      expect(molecule.sourceWallet.position).not.toBe(authRemainderPosition)
    } finally {
      executeSpy.mockRestore()
      queryContinuIdSpy.mockRestore()
    }
  })
})

// Validator 0.5.0 proves a re-login only when it is signed from the identity's ContinuID
// pointer: atoms[0] at the pointer position, from the USER wallet registered there.
// The tests log in through requestAuthToken, as consumers do, unless they test a direct call.
describe('KnishIOClient - profile re-login from the ContinuID pointer', () => {
  const secret = generateSecret()
  let client
  let continuIdVariables
  let proposals
  let spies

  const stubContinuId = (continuId) => {
    spies.push(jest.spyOn(QueryContinuId.prototype, 'execute')
      .mockImplementation(async function ({ variables }) {
        continuIdVariables.push(variables)
        return new ResponseContinuId({
          query: this,
          json: { data: { ContinuId: continuId } }
        })
      }))
  }

  const stubAuthorization = (...verdicts) => {
    spies.push(jest.spyOn(MutationRequestAuthorization.prototype, 'execute')
      .mockImplementation(async function () {
        const accepted = verdicts[proposals.length]
        proposals.push(this.molecule())
        return new ResponseRequestAuthorization({
          query: this,
          json: {
            data: {
              ProposeMolecule: accepted
                ? {
                    molecularHash: 'offline',
                    status: 'accepted',
                    reason: null,
                    payload: JSON.stringify({
                      token: `offline-token-${ proposals.length }`,
                      time: Math.floor(Date.now() / 1000) + 3600,
                      key: 'offline-pubkey',
                      encrypt: false
                    })
                  }
                : {
                    molecularHash: 'offline',
                    status: 'rejected',
                    reason: 'offline rejection',
                    payload: null
                  }
            }
          }
        })
      }))
  }

  const userPointer = (position, overrides = {}) => ({
    tokenSlug: 'USER',
    address: new Wallet({ secret, token: 'USER', position }).address,
    position,
    bundleHash: generateBundleHash(secret),
    batchId: null,
    characters: 'BASE64',
    pubkey: null,
    amount: 0,
    ...overrides
  })

  beforeEach(() => {
    client = new KnishIOClient({
      uri: testUri,
      cellSlug: testCell,
      logging: false
    })
    continuIdVariables = []
    proposals = []
    spies = []
  })

  afterEach(() => {
    spies.forEach(spy => spy.mockRestore())
  })

  test('signs a re-login from the USER wallet at the pointer and binds the token to it', async () => {
    const position = Wallet.generatePosition()
    stubContinuId(userPointer(position))
    stubAuthorization(true)

    await client.requestAuthToken({ secret, encrypt: false })

    expect(continuIdVariables[0]).toEqual({ bundle: generateBundleHash(secret), token: 'USER' })
    expect(proposals).toHaveLength(1)
    const [signer, continuId] = proposals[0].atoms
    expect(signer.isotope).toBe('U')
    expect(signer.token).toBe('USER')
    expect(signer.position).toBe(position)
    expect(signer.walletAddress).toBe(new Wallet({ secret, token: 'USER', position }).address)
    expect(continuId.isotope).toBe('I')
    expect(continuId.aggregatedMeta().previousPosition).toBe(position)
    expect(continuId.position).not.toBe(position)

    const authWallet = client.getAuthToken().getWallet()
    expect(authWallet.token).toBe('USER')
    expect(authWallet.position).toBe(position)
  })

  test.each([
    ['no pointer', () => null],
    ['a non-USER wallet', () => userPointer(Wallet.generatePosition(), { tokenSlug: 'AUTH' })],
    ['a pointer whose address the secret does not derive', () => userPointer(Wallet.generatePosition(), { address: 'f'.repeat(64) })]
  ])('signs from a fresh AUTH wallet when ContinuID returns %s', async (_, continuId) => {
    stubContinuId(continuId())
    stubAuthorization(true)

    await client.requestAuthToken({ secret, encrypt: false })

    expect(proposals).toHaveLength(1)
    expect(proposals[0].atoms[0].token).toBe('AUTH')
    expect(client.getAuthToken().getWallet().token).toBe('AUTH')
  })

  test('falls back to an AUTH login once when the pointer-signed login is rejected', async () => {
    stubContinuId(userPointer(Wallet.generatePosition()))
    stubAuthorization(false, true)

    await client.requestAuthToken({ secret, encrypt: false })

    expect(proposals).toHaveLength(2)
    expect(proposals[0].atoms[0].token).toBe('USER')
    expect(proposals[1].atoms[0].token).toBe('AUTH')
    expect(client.getAuthToken().getToken()).toBe('offline-token-2')
  })

  test('raises the rejection of the AUTH fallback without a third attempt', async () => {
    stubContinuId(userPointer(Wallet.generatePosition()))
    stubAuthorization(false, false)

    await expect(client.requestAuthToken({ secret, encrypt: false }))
      .rejects.toThrow(AuthorizationRejectedException)
    expect(proposals).toHaveLength(2)
    expect(proposals[1].atoms[0].token).toBe('AUTH')
  })

  test('clears the in-progress flag after a rejected login so client() authorizes again', async () => {
    const position = Wallet.generatePosition()
    stubContinuId(userPointer(position))
    stubAuthorization(false, false, true)

    await expect(client.requestAuthToken({ secret, encrypt: false }))
      .rejects.toThrow(AuthorizationRejectedException)
    expect(client.$__authInProcess).toBe(false)

    const login = jest.spyOn(client, 'requestAuthToken')
    spies.push(login)
    client.client()

    expect(login).toHaveBeenCalledTimes(1)
    await login.mock.results[0].value
    expect(proposals).toHaveLength(3)
    expect(proposals[2].atoms[0].position).toBe(position)
    expect(client.getAuthToken().getToken()).toBe('offline-token-3')
    expect(client.$__authInProcess).toBe(false)
  })

  test('a direct profile login keeps client() from starting a second login', async () => {
    const position = Wallet.generatePosition()
    stubContinuId(userPointer(position))
    stubAuthorization(true, true)
    const background = jest.spyOn(client, 'requestAuthToken')
    spies.push(background)

    const login = client.requestProfileAuthToken({ secret, encrypt: false })
    client.client()
    await login
    await Promise.allSettled(background.mock.results.map(result => result.value))

    expect(proposals).toHaveLength(1)
    expect(proposals[0].atoms[0].token).toBe('USER')
    expect(proposals[0].atoms[0].position).toBe(position)
    expect(client.$__authInProcess).toBe(false)
  })
})

describe('AuthToken snapshot', () => {
  const secret = generateSecret()

  test('restores the wallet a pointer-signed token is bound to', () => {
    const wallet = new Wallet({ secret, token: 'USER', position: Wallet.generatePosition() })
    const snapshot = AuthToken.create(
      { token: 'T', expiresAt: 9999999999, pubkey: 'validator-pubkey', encrypt: true },
      wallet
    ).getSnapshot()

    const restored = AuthToken.restore(snapshot, secret).getWallet()
    expect(restored.token).toBe('USER')
    expect(restored.address).toBe(wallet.address)
    expect(restored.pubkey).toBe(wallet.pubkey)
  })

  test('restores a snapshot without a wallet token as AUTH', () => {
    const wallet = new Wallet({ secret, token: 'AUTH' })
    const snapshot = {
      token: 'T',
      expiresAt: 9999999999,
      pubkey: 'validator-pubkey',
      encrypt: true,
      wallet: {
        position: wallet.position,
        characters: wallet.characters,
        mlKemParameterSet: wallet.mlKemParameterSet
      }
    }

    const restored = AuthToken.restore(snapshot, secret).getWallet()
    expect(restored.token).toBe('AUTH')
    expect(restored.address).toBe(wallet.address)
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
