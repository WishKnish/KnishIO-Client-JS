import {
  describe,
  test,
  expect,
  jest
} from '@jest/globals'
import fs from 'fs'
import path from 'path'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import CheckMolecule from '../src/libraries/CheckMolecule'
import SignatureMismatchException from '../src/exception/SignatureMismatchException'
import SignatureMalformedException from '../src/exception/SignatureMalformedException'
import KnishIOClient from '../src/KnishIOClient'

/**
 * OTS v2 cross-SDK vectors (docs/OTS_V2_SPECIFICATION.md): key derivation, address, the
 * normalized hash, ML-KEM identities of v2 wallets, and molecule verdicts.
 *
 * Shared master (absent in a standalone checkout of this SDK, where the file registers one
 * visible skipped test and nothing else). Produced by scripts/gen-ots-v2-vectors.mjs.
 */
const VECTORS_PATH = path.resolve(__dirname, '../../shared-test-results/ots-v2-vectors.json')
const vectors = fs.existsSync(VECTORS_PATH) ? JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf8')).vectors : null
const describeWithVectors = vectors ? describe : () => {}

if (!vectors) {
  test.skip('ots-v2-vectors.test.js: skipped — ../shared-test-results/ots-v2-vectors.json not found (standalone checkout)', () => {})
}

const EXCEPTIONS = {
  SignatureMismatch: SignatureMismatchException,
  SignatureMalformed: SignatureMalformedException
}

describeWithVectors('OTS v2 key derivation and address', () => {
  test.each(vectors ? vectors.key_derivation.tests : [])('$name', (vector) => {
    const { secret, token, position } = vector
    expect(Wallet.generateKey({ secret, token, position })).toBe(vector.expectedKeyV1)
    expect(Wallet.generateKey({ secret, token, position, otsVersion: 2 })).toBe(vector.expectedKeyV2)
    expect(Wallet.generateAddress(vector.expectedKeyV1)).toBe(vector.expectedAddressV1)
    expect(Wallet.generateAddress(vector.expectedKeyV2)).toBe(vector.expectedAddressV2)
    expect(new Wallet({ secret, token, position, otsVersion: 2 }).address).toBe(vector.expectedAddressV2)
  })

  test('an unsupported OTS version is refused', () => {
    expect(() => new Wallet({ secret: 'x', otsVersion: 3 })).toThrow(/unsupported OTS version 3/)
  })
})

describeWithVectors('OTS v2 normalized hash', () => {
  test.each(vectors ? vectors.signature.tests : [])('$name', (vector) => {
    expect(Molecule.normalize(Molecule.enumerate(vector.molecularHash))).toEqual(vector.expectedNormalized)
  })
})

describeWithVectors('OTS v2 wallet ML-KEM identities', () => {
  test.each(vectors ? vectors.mlkem_identity.tests : [])('$name', (vector) => {
    const { secret, token, position } = vectors.key_derivation.tests.find(k => k.name === vector.keyFrom)
    const pubkey = mlKemParameterSet => new Wallet({ secret, token, position, otsVersion: 2, mlKemParameterSet }).pubkey
    expect(pubkey(1024)).toBe(vector.expectedMlKem1024Pubkey)
    expect(pubkey(768)).toBe(vector.expectedMlKem768Pubkey)
  })
})

describeWithVectors('OTS v2 molecule verdicts', () => {
  test.each(vectors ? vectors.molecules.tests : [])('$name → $expected', (vector) => {
    const molecule = Molecule.fromJSON(vector.molecule)
    if (vector.expected === 'verified') {
      expect(molecule.check()).toBe(true)
    } else {
      expect(() => molecule.check()).toThrow(EXCEPTIONS[vector.expected])
    }
  })

  test.each(['genuine_v2', 'genuine_v1_control'])('re-signing %s reproduces every otsFragment', (name) => {
    const vector = vectors.molecules.tests.find(t => t.name === name)
    const { secret, position } = vectors.key_derivation.tests.find(k => k.name === 'hex_secret_user')
    const molecule = Molecule.fromJSON(vector.molecule)
    molecule.secret = secret
    molecule.sourceWallet = new Wallet({ secret, token: 'USER', position, otsVersion: vector.otsVersion })
    molecule.sign()
    expect(molecule.atoms.map(atom => atom.otsFragment)).toEqual(vector.molecule.atoms.map(atom => atom.otsFragment))
  })
})

describeWithVectors('OTS malformed declared hash', () => {
  // CheckMolecule.ots() on its own, without a prior molecular-hash check: refused before any chain work
  test.each(vectors ? vectors.malformed_hash.tests : [])('$name → $expected', (vector) => {
    const check = new CheckMolecule(Molecule.fromJSON(vector.molecule))
    expect(() => check.ots()).toThrow(EXCEPTIONS[vector.expected])
  })
})

describe('createMolecule with an OTS v2 source wallet', () => {
  test('the default remainder wallet keeps the source wallet OTS version', async () => {
    const secret = 'a'.repeat(2048)
    const client = new KnishIOClient({ uri: 'http://127.0.0.1:9/graphql', cellSlug: 'ots-v2', logging: false })
    const sourceWallet = Wallet.create({ secret, token: 'USER', otsVersion: 2 })
    const getSourceWallet = jest.spyOn(client, 'getSourceWallet')
    const molecule = await client.createMolecule({ secret, bundle: sourceWallet.bundle, sourceWallet })
    expect(getSourceWallet).not.toHaveBeenCalled()
    expect(molecule.remainderWallet.otsVersion).toBe(2)
    expect(client.getRemainderWallet().otsVersion).toBe(2)
  })
})
