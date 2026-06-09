import {
  describe,
  test,
  expect
} from '@jest/globals'
import Molecule from '../src/Molecule'
import Wallet from '../src/Wallet'
import Atom from '../src/Atom'
import AtomMeta from '../src/AtomMeta'
import CheckMolecule from '../src/libraries/CheckMolecule'
import {
  generateSecret,
  generateBundleHash
} from '../src'

/**
 * Helper to build a signed M-isotope molecule and convert it to server format.
 * Simulates what the PHP server would return in a MetaType query response.
 */
function buildSignedMetaMolecule () {
  const secret = generateSecret()
  const bundle = generateBundleHash(secret)
  const sourceWallet = new Wallet({
    secret,
    token: 'USER'
  })

  const molecule = new Molecule({
    secret,
    bundle,
    sourceWallet,
    remainderWallet: new Wallet({ secret, token: 'USER' })
  })

  molecule.initMeta({
    meta: { name: 'TestAsset', description: 'A test meta asset' },
    metaType: 'TestType',
    metaId: 'test-id-123'
  })

  molecule.sign({})

  return { molecule, secret, bundle }
}

/**
 * Converts a client-side molecule (after toJSON) into the server format
 * that would be returned by the PHP server's MetaType GraphQL query.
 */
function moleculeToServerFormat (molecule) {
  const jsonData = molecule.toJSON()
  return {
    molecularHash: jsonData.molecularHash,
    bundleHash: jsonData.bundle,
    cellSlug: jsonData.cellSlug || null,
    status: jsonData.status || 'accepted',
    createdAt: jsonData.createdAt,
    atoms: jsonData.atoms.map(atom => ({
      position: atom.position,
      walletAddress: atom.walletAddress,
      isotope: atom.isotope,
      tokenSlug: atom.token,
      value: atom.value,
      batchId: atom.batchId,
      metaType: atom.metaType,
      metaId: atom.metaId,
      index: atom.index,
      createdAt: atom.createdAt,
      otsFragment: atom.otsFragment,
      metasJson: JSON.stringify(atom.meta || [])
    }))
  }
}

describe('Meta Query Tamper Verification', () => {
  describe('CheckMolecule.fromServerData()', () => {
    test('server data format mapping: tokenSlug→token, metasJson→meta[]', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      // Verify server format uses tokenSlug (not token)
      expect(serverData.atoms[0].tokenSlug).toBeDefined()
      expect(serverData.atoms[0].token).toBeUndefined()

      // Verify server format uses metasJson (not meta)
      expect(typeof serverData.atoms[0].metasJson).toBe('string')

      // Reconstruct via fromServerData
      const reconstructed = CheckMolecule.fromServerData(serverData)

      // Verify field mapping worked
      expect(reconstructed.atoms[0].token).toBe(molecule.atoms[0].token)
      expect(reconstructed.molecularHash).toBe(molecule.molecularHash)
      expect(Array.isArray(reconstructed.atoms[0].meta)).toBe(true)
    })

    test('handles null/missing metasJson gracefully', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      // Remove metasJson from all atoms
      for (const atom of serverData.atoms) {
        delete atom.metasJson
      }

      // Should not throw
      const reconstructed = CheckMolecule.fromServerData(serverData)
      expect(reconstructed.molecularHash).toBe(molecule.molecularHash)
    })

    test('handles malformed metasJson gracefully', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      // Set invalid JSON
      serverData.atoms[0].metasJson = 'not-valid-json{'

      // Should not throw — falls back to empty meta
      const reconstructed = CheckMolecule.fromServerData(serverData)
      expect(reconstructed).toBeDefined()
      expect(Array.isArray(reconstructed.atoms[0].meta)).toBe(true)
    })
  })

  describe('Hash round-trip verification', () => {
    test('molecularHash check passes for untampered server data', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      const reconstructed = CheckMolecule.fromServerData(serverData)
      const check = new CheckMolecule(reconstructed)

      // This should NOT throw — hash should match
      expect(check.molecularHash()).toBe(true)
    })

    test('tampered atom value causes MolecularHashMismatchException', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      // Tamper with an atom's value
      serverData.atoms[0].value = '999999'

      const reconstructed = CheckMolecule.fromServerData(serverData)

      expect(() => {
        new CheckMolecule(reconstructed).molecularHash()
      }).toThrow('molecular hash does not match')
    })

    test('missing atom causes hash mismatch', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      // Remove last atom
      serverData.atoms.pop()

      const reconstructed = CheckMolecule.fromServerData(serverData)

      expect(() => {
        new CheckMolecule(reconstructed).molecularHash()
      }).toThrow('molecular hash does not match')
    })
  })

  describe('OTS signature round-trip verification', () => {
    test('OTS check passes for untampered server data', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      const reconstructed = CheckMolecule.fromServerData(serverData)
      const check = new CheckMolecule(reconstructed)

      // Both hash and OTS should pass
      expect(check.molecularHash()).toBe(true)
      expect(check.ots()).toBe(true)
    })

    test('tampered OTS fragment causes SignatureMismatchException', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      // Tamper with the OTS fragment
      const original = serverData.atoms[0].otsFragment
      serverData.atoms[0].otsFragment = 'a'.repeat(original.length)

      const reconstructed = CheckMolecule.fromServerData(serverData)

      // Hash will still match (OTS is not part of molecular hash)
      // But OTS verification should fail
      expect(() => {
        new CheckMolecule(reconstructed).ots()
      }).toThrow()
    })
  })

  describe('Full verify() round-trip', () => {
    test('full verification passes for untampered server data', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      const reconstructed = CheckMolecule.fromServerData(serverData)
      const check = new CheckMolecule(reconstructed)

      expect(check.verify()).toBe(true)
    })
  })

  describe('verifyFromServerData() convenience', () => {
    test('returns verified:true for valid molecule', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)

      const result = CheckMolecule.verifyFromServerData(serverData)

      expect(result.verified).toBe(true)
      expect(result.molecularHash).toBe(molecule.molecularHash)
      expect(result.error).toBeNull()
    })

    test('returns verified:false with error for tampered molecule', () => {
      const { molecule } = buildSignedMetaMolecule()
      const serverData = moleculeToServerFormat(molecule)
      serverData.atoms[0].value = '999999'

      const result = CheckMolecule.verifyFromServerData(serverData)

      expect(result.verified).toBe(false)
      expect(result.error).toBeTruthy()
    })
  })
})
