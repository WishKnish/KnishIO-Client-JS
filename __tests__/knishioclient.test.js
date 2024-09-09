import { describe, test, expect, beforeEach, jest } from '@jest/globals'
import KnishIOClient from '../src/KnishIOClient'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import { generateSecret } from '../src'

// Mock ApolloClient
jest.mock('../src/libraries/apollo/ApolloClient')

describe('KnishIOClient', () => {
  const testUri = 'https://eteplitsky.testnet.knish.io:443/graphql'
  const testSecret = generateSecret()
  let knishIOClientInstance = new KnishIOClient({
    uri: testUri,
    cellSlug: 'TESTCELL',
    logging: false
  })

  beforeEach(() => {
    knishIOClientInstance = new KnishIOClient({
      uri: testUri,
      cellSlug: 'TESTCELL',
      logging: false
    })
    knishIOClientInstance.setSecret(testSecret)
  })

  test('initializes client correctly', () => {
    expect(knishIOClientInstance.uri()).toBe(testUri)
    expect(knishIOClientInstance.cellSlug()).toBe('testCell')
    expect(knishIOClientInstance.getSecret()).toBe(testSecret)
  })

  test('creates molecule correctly', async () => {
    const molecule = await knishIOClientInstance.createMolecule({})
    expect(molecule).toBeInstanceOf(Molecule)
    expect(molecule.secret).toBe(testSecret)
    expect(molecule.cellSlug).toBe('testCell')
  })

  test('creates wallet correctly', async () => {
    const wallet = await knishIOClientInstance.getSourceWallet()
    expect(wallet).toBeInstanceOf(Wallet)
    expect(wallet.token).toBe('USER')
    expect(wallet.bundle).toBeTruthy()
  })

  test('prepares token transfer correctly', async () => {
    const recipientSecret = generateSecret()
    const recipientBundle = new Wallet({ secret: recipientSecret, token: 'TEST' }).bundle

    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: jest.fn()
    })

    await mutation.fillMolecule({
      recipientWallet: Wallet.create({ bundle: recipientBundle, token: 'TEST' }),
      amount: '100'
    })

    const molecule = mutation.molecule()
    expect(molecule.atoms).toHaveLength(3)
    expect(molecule.atoms[0].isotope).toBe('V')
    expect(molecule.atoms[0].value).toBe('-100')
    expect(molecule.atoms[1].isotope).toBe('V')
    expect(molecule.atoms[1].value).toBe('100')
    expect(molecule.atoms[2].isotope).toBe('V')
  })

  test('signs and checks molecule correctly', async () => {
    const molecule = await knishIOClientInstance.createMolecule({})
    molecule.addAtom(Wallet.create({ secret: testSecret, token: 'TEST' }))

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
      mutationClass: jest.fn()
    })

    await mutation.fillMolecule({
      token: 'NEWTOKEN',
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
    expect(molecule.atoms[1].isotope).toBe('I')
  })

  test('prepares meta creation correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: jest.fn()
    })

    await mutation.fillMolecule({
      metaType: 'TestMeta',
      metaId: 'test123',
      meta: {
        key1: 'value1',
        key2: 'value2'
      }
    })

    const molecule = mutation.molecule()
    expect(molecule.atoms).toHaveLength(3)
    expect(molecule.atoms[0].isotope).toBe('M')
    expect(molecule.atoms[0].metaType).toBe('TestMeta')
    expect(molecule.atoms[0].metaId).toBe('test123')
    expect(molecule.atoms[1].isotope).toBe('R')
    expect(molecule.atoms[2].isotope).toBe('I')
  })

  test('prepares wallet creation correctly', async () => {
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: jest.fn()
    })

    await mutation.fillMolecule({
      token: 'NEWTOKEN'
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
      mutationClass: jest.fn()
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

  test('handles encryption toggle correctly', () => {
    expect(knishIOClientInstance.switchEncryption(true)).toBe(true)
    expect(knishIOClientInstance.switchEncryption(true)).toBe(false) // No change, already true
    expect(knishIOClientInstance.switchEncryption(false)).toBe(true)
    expect(knishIOClientInstance.switchEncryption(false)).toBe(false) // No change, already false
  })

  test('creates query correctly', () => {
    const MockQueryClass = jest.fn()
    const query = knishIOClientInstance.createQuery(MockQueryClass)
    expect(MockQueryClass).toHaveBeenCalledWith(knishIOClientInstance.client())
  })

  test('creates molecule mutation correctly', async () => {
    const MockMutationClass = jest.fn()
    const mutation = await knishIOClientInstance.createMoleculeMutation({
      mutationClass: MockMutationClass
    })
    expect(MockMutationClass).toHaveBeenCalled()
    expect(mutation.molecule()).toBeInstanceOf(Molecule)
  })

  test('handles auth token correctly', () => {
    const mockAuthToken = {
      getToken: jest.fn().mockReturnValue('testToken'),
      getAuthData: jest.fn().mockReturnValue({ token: 'testToken', pubkey: 'testPubkey' })
    }
    knishIOClientInstance.setAuthToken(mockAuthToken)
    expect(knishIOClientInstance.getAuthToken()).toBe(mockAuthToken)
  })
})
