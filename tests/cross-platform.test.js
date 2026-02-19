import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
import Atom from '../src/Atom'
import Molecule from '../src/Molecule'
import {
  generateBundleHash,
  shake256
} from '../src'
import vectors from '../../../sdks/shared-test-results/javascript-results.json'

/**
 * Cross-platform test vectors — verifies JS SDK produces identical outputs
 * to canonical test data in shared-test-results/javascript-results.json
 */
describe('Cross-Platform Test Vectors', () => {
  const secret = vectors.tests.crypto.secret
  const expectedBundle = vectors.tests.crypto.expectedBundle

  test('bundle hash matches canonical vector', () => {
    const bundle = generateBundleHash(secret)
    expect(bundle).toBe(expectedBundle)
  })

  test('wallet address matches canonical vector for USER token', () => {
    const position = '0123456789abcdeffedcba9876543210fedcba9876543210fedcba9876543210'
    const wallet = new Wallet({
      secret,
      token: 'USER',
      position
    })
    expect(wallet.address).toBe('d9c4c73876c6b8546f9857137cae5ac5b291c326aa846bd5b9ed77b59e1b1e3e')
  })

  test('metadata molecular hash matches canonical vector', () => {
    const moleculeData = JSON.parse(vectors.molecules.metadata)
    const atoms = moleculeData.atoms.map(atomData => {
      const atom = new Atom({
        position: atomData.position,
        walletAddress: atomData.walletAddress,
        isotope: atomData.isotope,
        token: atomData.token,
        value: atomData.value,
        batchId: atomData.batchId,
        metaType: atomData.metaType,
        metaId: atomData.metaId,
        meta: atomData.meta,
        index: atomData.index,
        otsFragment: atomData.otsFragment
      })
      atom.createdAt = atomData.createdAt
      return atom
    })

    const hash = Atom.hashAtoms({ atoms })
    expect(hash).toBe(vectors.tests.metaCreation.molecularHash)
  })

  test('simple transfer molecular hash matches canonical vector', () => {
    const moleculeData = JSON.parse(vectors.molecules.simpleTransfer)
    const atoms = moleculeData.atoms.map(atomData => {
      const atom = new Atom({
        position: atomData.position,
        walletAddress: atomData.walletAddress,
        isotope: atomData.isotope,
        token: atomData.token,
        value: atomData.value,
        batchId: atomData.batchId,
        metaType: atomData.metaType,
        metaId: atomData.metaId,
        meta: atomData.meta,
        index: atomData.index,
        otsFragment: atomData.otsFragment
      })
      atom.createdAt = atomData.createdAt
      return atom
    })

    const hash = Atom.hashAtoms({ atoms })
    expect(hash).toBe(vectors.tests.simpleTransfer.molecularHash)
  })

  test('complex transfer molecular hash matches canonical vector', () => {
    const moleculeData = JSON.parse(vectors.molecules.complexTransfer)
    const atoms = moleculeData.atoms.map(atomData => {
      const atom = new Atom({
        position: atomData.position,
        walletAddress: atomData.walletAddress,
        isotope: atomData.isotope,
        token: atomData.token,
        value: atomData.value,
        batchId: atomData.batchId,
        metaType: atomData.metaType,
        metaId: atomData.metaId,
        meta: atomData.meta,
        index: atomData.index,
        otsFragment: atomData.otsFragment
      })
      atom.createdAt = atomData.createdAt
      return atom
    })

    const hash = Atom.hashAtoms({ atoms })
    expect(hash).toBe(vectors.tests.complexTransfer.molecularHash)
  })

  test('SHAKE256 produces consistent output', () => {
    const hash = shake256('test', 256)
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]+$/)
    // Verify deterministic — same input always produces same output
    expect(shake256('test', 256)).toBe(hash)
  })

  test('different secrets produce different bundles', () => {
    const bundle1 = generateBundleHash(secret)
    const otherSecret = 'a'.repeat(1024)
    const bundle2 = generateBundleHash(otherSecret)
    expect(bundle1).not.toBe(bundle2)
  })

  test('molecular hash is base17 encoded and 64 chars', () => {
    const moleculeData = JSON.parse(vectors.molecules.metadata)
    const hash = moleculeData.molecularHash
    expect(hash).toHaveLength(64)
    // Base17 uses 0-9 and a-g
    expect(hash).toMatch(/^[0-9a-g]+$/)
  })

  test('atom count matches for metadata molecule', () => {
    const moleculeData = JSON.parse(vectors.molecules.metadata)
    expect(moleculeData.atoms).toHaveLength(vectors.tests.metaCreation.atomCount)
  })

  test('atom count matches for simple transfer molecule', () => {
    const moleculeData = JSON.parse(vectors.molecules.simpleTransfer)
    expect(moleculeData.atoms).toHaveLength(vectors.tests.simpleTransfer.atomCount)
  })

  test('atom count matches for complex transfer molecule', () => {
    const moleculeData = JSON.parse(vectors.molecules.complexTransfer)
    expect(moleculeData.atoms).toHaveLength(vectors.tests.complexTransfer.atomCount)
  })

  test('remainder wallet present in complex transfer', () => {
    const moleculeData = JSON.parse(vectors.molecules.complexTransfer)
    expect(moleculeData.remainderWallet).toBeTruthy()
    expect(vectors.tests.complexTransfer.hasRemainder).toBe(true)
  })
})
