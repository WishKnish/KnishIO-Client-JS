import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import Atom from '../src/Atom'
import JsSHA from 'jssha'
import {
  generateBundleHash,
  generateSecret,
  shake256,
  charsetBaseConvert,
  chunkSubstr
} from '../src'
import vectors from '../../shared-test-results/canonical-patent-vectors.json'

/**
 * Patent Vector Validation
 *
 * Validates the JavaScript SDK against canonical patent test vectors
 * generated from the Rust reference implementation. These vectors provide
 * reduction-to-practice evidence for patent claims covering:
 *   - Claims 1-2: O(k) WOTS+ signatures
 *   - Claims 4-5: Base17 encoding, ContinuID
 *   - Claim 8: Multi-isotope molecule construction
 *   - Claims 12-14: ContinuID chain relay
 *   - Claim 21: Multi-isotope dispatch
 */
describe('Patent Vector Validation', () => {
  // -----------------------------------------------------------------
  // 0. generateSecret cross-SDK parity (Batch AO) — seed → 2048 hex secret
  // -----------------------------------------------------------------
  describe('generateSecret', () => {
    const secretTests = vectors.vectors.generate_secret.tests

    test.each(secretTests)('$name: secret matches canonical (2048 hex)', (vector) => {
      const secret = generateSecret(vector.seed)
      expect(secret).toBe(vector.expectedSecret)
      expect(secret.length).toBe(vector.length)
    })
  })

  // -----------------------------------------------------------------
  // 0b. Atom value formatting cross-SDK parity (Batch AQ) — JS is the reference
  //     anchor (String(n) drops a whole number's ".0"); the validator parses
  //     V/B/F values as i128, so the value must be an integer string.
  // -----------------------------------------------------------------
  describe('Atom value formatting', () => {
    const valueTests = vectors.vectors.atom_value_format.tests

    test.each(valueTests)('$name: value serializes as integer string', (vector) => {
      const atom = new Atom({ position: 'pos', walletAddress: 'addr', isotope: 'V', token: 'TOKEN', value: vector.value })
      expect(atom.value).toBe(vector.expected)
    })
  })

  // -----------------------------------------------------------------
  // 1. ContinuID Chain Relay (Patent Claims 5, 12-14)
  // -----------------------------------------------------------------
  describe('ContinuID Chain Relay', () => {
    const chainTests = vectors.vectors.continuid_chain.tests

    test.each(chainTests)('$name: bundle hash matches', (vector) => {
      const bundle = generateBundleHash(vector.secret)
      expect(bundle).toBe(vector.expectedBundle)
    })

    test.each(chainTests)('$name: address at position1 matches', (vector) => {
      const wallet1 = new Wallet({
        secret: vector.secret,
        token: vector.token,
        position: vector.position1
      })
      expect(wallet1.address).toBe(vector.expectedAddress1)
    })

    test.each(chainTests)('$name: position2 derived from shake256(position1, 256) matches', (vector) => {
      // Position2 = SHAKE256(position1, 256 bits) => 64 hex chars
      const derivedPosition2 = shake256(vector.position1, 256)
      expect(derivedPosition2).toBe(vector.expectedPosition2)
    })

    test.each(chainTests)('$name: address at position2 matches', (vector) => {
      const wallet2 = new Wallet({
        secret: vector.secret,
        token: vector.token,
        position: vector.expectedPosition2
      })
      expect(wallet2.address).toBe(vector.expectedAddress2)
    })

    test.each(chainTests)('$name: invariants hold (same bundle, different positions, different addresses)', (vector) => {
      const bundle = generateBundleHash(vector.secret)

      const wallet1 = new Wallet({
        secret: vector.secret,
        token: vector.token,
        position: vector.position1
      })

      const derivedPosition2 = shake256(vector.position1, 256)
      const wallet2 = new Wallet({
        secret: vector.secret,
        token: vector.token,
        position: derivedPosition2
      })

      // Same bundle for both wallets
      expect(wallet1.bundle).toBe(bundle)
      expect(wallet2.bundle).toBe(bundle)

      // Different positions
      expect(vector.position1).not.toBe(derivedPosition2)

      // Different addresses
      expect(wallet1.address).not.toBe(wallet2.address)
    })
  })

  // -----------------------------------------------------------------
  // 2. Base17 Enumeration (Patent Claim 5)
  // -----------------------------------------------------------------
  describe('Base17 Enumeration', () => {
    const base17Tests = vectors.vectors.base17_enumeration.tests

    test.each(base17Tests)('$name: hex-to-base17 conversion matches', (vector) => {
      // charsetBaseConvert(hex, 16, 17, srcAlphabet, destAlphabet) padded to 64 chars
      const base17 = charsetBaseConvert(
        vector.hexInput,
        16,
        17,
        '0123456789abcdef',
        '0123456789abcdefg'
      )

      // Pad to 64 characters (same as Atom.hashAtoms default output)
      const padded = typeof base17 === 'string'
        ? base17.padStart(64, '0')
        : String(base17).padStart(64, '0')

      expect(padded).toBe(vector.expectedBase17)
    })

    test.each(base17Tests)('$name: normalized sum is zero', (vector) => {
      const base17 = charsetBaseConvert(
        vector.hexInput,
        16,
        17,
        '0123456789abcdef',
        '0123456789abcdefg'
      )
      const padded = typeof base17 === 'string'
        ? base17.padStart(64, '0')
        : String(base17).padStart(64, '0')

      // Enumerate and normalize, then verify sum is zero
      const enumerated = Molecule.enumerate(padded)
      const normalized = Molecule.normalize(enumerated)
      const sum = normalized.reduce((acc, val) => acc + val, 0)
      expect(sum).toBe(vector.normalizedSum)
    })
  })

  // -----------------------------------------------------------------
  // 3. Multi-Isotope Molecule (Patent Claims 8, 21)
  // -----------------------------------------------------------------
  describe('Multi-Isotope Molecule', () => {
    const multiTests = vectors.vectors.multi_isotope_molecule.tests

    test.each(multiTests)('$name: bundle hash matches', (vector) => {
      const bundle = generateBundleHash(vector.secret)
      expect(bundle).toBe(vector.expectedBundle)
    })

    test.each(multiTests)('$name: V-isotope position derived correctly', (vector) => {
      const sourcePosition = vector.invariants.source_position
      // V position = shake256(sourcePosition + 'V', 256 bits)
      const derivedPosition = shake256(sourcePosition + 'V', 256)
      expect(derivedPosition).toBe(vector.isotopes.V.expectedPosition)
    })

    test.each(multiTests)('$name: V-isotope address matches', (vector) => {
      const wallet = new Wallet({
        secret: vector.secret,
        token: vector.isotopes.V.token,
        position: vector.isotopes.V.expectedPosition
      })
      expect(wallet.address).toBe(vector.isotopes.V.expectedAddress)
    })

    test.each(multiTests)('$name: M-isotope position derived correctly', (vector) => {
      const sourcePosition = vector.invariants.source_position
      // M position = shake256(sourcePosition + 'M', 256 bits)
      const derivedPosition = shake256(sourcePosition + 'M', 256)
      expect(derivedPosition).toBe(vector.isotopes.M.expectedPosition)
    })

    test.each(multiTests)('$name: M-isotope address matches', (vector) => {
      const wallet = new Wallet({
        secret: vector.secret,
        token: vector.isotopes.M.token,
        position: vector.isotopes.M.expectedPosition
      })
      expect(wallet.address).toBe(vector.isotopes.M.expectedAddress)
    })

    test.each(multiTests)('$name: I-isotope position derived correctly', (vector) => {
      const sourcePosition = vector.invariants.source_position
      // I position = shake256(sourcePosition + 'I', 256 bits)
      const derivedPosition = shake256(sourcePosition + 'I', 256)
      expect(derivedPosition).toBe(vector.isotopes.I.expectedPosition)
    })

    test.each(multiTests)('$name: I-isotope address matches', (vector) => {
      const wallet = new Wallet({
        secret: vector.secret,
        token: vector.isotopes.I.token,
        position: vector.isotopes.I.expectedPosition
      })
      expect(wallet.address).toBe(vector.isotopes.I.expectedAddress)
    })

    test.each(multiTests)('$name: all isotope addresses are unique', (vector) => {
      const addresses = new Set()
      for (const [, isoData] of Object.entries(vector.isotopes)) {
        const wallet = new Wallet({
          secret: vector.secret,
          token: isoData.token,
          position: isoData.expectedPosition
        })
        addresses.add(wallet.address)
      }
      // Three isotopes must produce three unique addresses
      expect(addresses.size).toBe(Object.keys(vector.isotopes).length)
    })
  })

  // -----------------------------------------------------------------
  // 4. BigInt Carry Edge Cases (Patent Claim 5)
  // -----------------------------------------------------------------
  describe('BigInt Carry Edge Cases', () => {
    const bigintTests = vectors.vectors.bigint_carry_edge.tests

    test.each(bigintTests)('$name: SHAKE256 hash matches', (vector) => {
      // SHAKE256 of the hex input string, output 256 bits = 64 hex chars
      const result = shake256(vector.input, 256)
      expect(result).toBe(vector.expectedShake256)
    })

    test.each(bigintTests)('$name: base17 of SHAKE256 output matches', (vector) => {
      const hash = shake256(vector.input, 256)
      const base17 = charsetBaseConvert(
        hash,
        16,
        17,
        '0123456789abcdef',
        '0123456789abcdefg'
      )
      const padded = typeof base17 === 'string'
        ? base17.padStart(64, '0')
        : String(base17).padStart(64, '0')

      expect(padded).toBe(vector.expectedBase17OfHash)
    })

    test.each(bigintTests)('$name: key generation produces expected length', (vector) => {
      // Use the input as a hex secret with a test token and position
      const key = Wallet.generateKey({
        secret: vector.input,
        token: 'USER',
        position: '0000000000000000000000000000000000000000000000000000000000000001'
      })
      expect(key).toHaveLength(vector.expectedKeyLength)
      expect(key).toMatch(/^[0-9a-f]+$/)
    })

    test.each(bigintTests)('$name: input length is as specified', (vector) => {
      expect(vector.input.length).toBe(vector.inputLength)
    })
  })

  // -----------------------------------------------------------------
  // 5. WOTS+ Roundtrip (Patent Claims 1-2, 5)
  // -----------------------------------------------------------------
  describe('WOTS+ Roundtrip', () => {
    const wotsTests = vectors.vectors.wots_roundtrip.tests

    test.each(wotsTests)('$name: OTS address matches canonical vector (two-pass)', (vector) => {
      // The canonical expectedOtsAddress is the two-pass protocol address:
      //   digest = shake256(joined_public_fragments, 8192); address = shake256(digest, 256)
      // This matches Wallet.generateAddress and the validator's CheckMolecule.ots
      // (the address OTS verification compares against), and equals the
      // continuid_chain vector's expectedAddress1 for this secret+position.
      const key = Wallet.generateKey({
        secret: vector.secret,
        token: vector.token,
        position: vector.position
      })
      expect(key).toHaveLength(2048)

      const otsAddress = Wallet.generateAddress(key)
      expect(otsAddress).toHaveLength(64)
      expect(otsAddress).toBe(vector.expectedOtsAddress)
    })

    test.each(wotsTests)('$name: molecular hash base17 matches', (vector) => {
      // Convert the hex molecular hash to base17
      const base17 = charsetBaseConvert(
        vector.molecularHashHex,
        16,
        17,
        '0123456789abcdef',
        '0123456789abcdefg'
      )
      const padded = typeof base17 === 'string'
        ? base17.padStart(64, '0')
        : String(base17).padStart(64, '0')

      expect(padded).toBe(vector.molecularHashBase17)
    })

    test.each(wotsTests)('$name: signature has expected fragment count', (vector) => {
      // Generate key and produce signature fragments
      const key = Wallet.generateKey({
        secret: vector.secret,
        token: vector.token,
        position: vector.position
      })
      const keyChunks = chunkSubstr(key, 128)
      expect(keyChunks).toHaveLength(vector.expectedSignatureFragmentCount)

      // Enumerate and normalize the molecular hash (base17)
      const normalizedHash = Molecule.normalize(
        Molecule.enumerate(vector.molecularHashBase17)
      )

      // Sign: for each key chunk, hash it (8 - normalizedHash[i]) times
      const signatureFragments = []
      for (let i = 0; i < keyChunks.length; i++) {
        let workingChunk = keyChunks[i]
        const iterations = 8 - normalizedHash[i]
        for (let j = 0; j < iterations; j++) {
          const sponge = new JsSHA('SHAKE256', 'TEXT')
          sponge.update(workingChunk)
          workingChunk = sponge.getHash('HEX', { outputLen: 512 })
        }
        signatureFragments.push(workingChunk)
      }

      expect(signatureFragments).toHaveLength(vector.expectedSignatureFragmentCount)
    })

    test.each(wotsTests)('$name: signature fragment 0 matches', (vector) => {
      const key = Wallet.generateKey({
        secret: vector.secret,
        token: vector.token,
        position: vector.position
      })
      const keyChunks = chunkSubstr(key, 128)
      const normalizedHash = Molecule.normalize(
        Molecule.enumerate(vector.molecularHashBase17)
      )

      // Compute fragment 0
      let workingChunk = keyChunks[0]
      const iterations = 8 - normalizedHash[0]
      for (let j = 0; j < iterations; j++) {
        const sponge = new JsSHA('SHAKE256', 'TEXT')
        sponge.update(workingChunk)
        workingChunk = sponge.getHash('HEX', { outputLen: 512 })
      }

      expect(workingChunk).toBe(vector.expectedSignatureFragment0)
    })

    test.each(wotsTests)('$name: signature fragment 15 matches', (vector) => {
      const key = Wallet.generateKey({
        secret: vector.secret,
        token: vector.token,
        position: vector.position
      })
      const keyChunks = chunkSubstr(key, 128)
      const normalizedHash = Molecule.normalize(
        Molecule.enumerate(vector.molecularHashBase17)
      )

      // Compute fragment 15
      let workingChunk = keyChunks[15]
      const iterations = 8 - normalizedHash[15]
      for (let j = 0; j < iterations; j++) {
        const sponge = new JsSHA('SHAKE256', 'TEXT')
        sponge.update(workingChunk)
        workingChunk = sponge.getHash('HEX', { outputLen: 512 })
      }

      expect(workingChunk).toBe(vector.expectedSignatureFragment15)
    })

    test.each(wotsTests)('$name: full sign-then-verify roundtrip (two-pass)', (vector) => {
      const key = Wallet.generateKey({
        secret: vector.secret,
        token: vector.token,
        position: vector.position
      })
      const keyChunks = chunkSubstr(key, 128)
      const normalizedHash = Molecule.normalize(
        Molecule.enumerate(vector.molecularHashBase17)
      )

      // --- Sign: hash each key chunk (8 - normalizedHash[i]) times ---
      const signatureFragments = []
      for (let i = 0; i < keyChunks.length; i++) {
        let workingChunk = keyChunks[i]
        const signIterations = 8 - normalizedHash[i]
        for (let j = 0; j < signIterations; j++) {
          const sponge = new JsSHA('SHAKE256', 'TEXT')
          sponge.update(workingChunk)
          workingChunk = sponge.getHash('HEX', { outputLen: 512 })
        }
        signatureFragments.push(workingChunk)
      }

      // --- Verify: hash each fragment (8 + normalizedHash[i]) times to recover public fragments ---
      let publicKeyFragments = ''
      for (let i = 0; i < signatureFragments.length; i++) {
        let workingChunk = signatureFragments[i]
        const verifyIterations = 8 + normalizedHash[i]
        for (let j = 0; j < verifyIterations; j++) {
          const sponge = new JsSHA('SHAKE256', 'TEXT')
          sponge.update(workingChunk)
          workingChunk = sponge.getHash('HEX', { outputLen: 512 })
        }
        publicKeyFragments += workingChunk
      }

      // Two-pass (matches CheckMolecule.ots): digest(8192 bits) then address(256 bits)
      const digestSponge = new JsSHA('SHAKE256', 'TEXT')
      digestSponge.update(publicKeyFragments)
      const digest = digestSponge.getHash('HEX', { outputLen: 8192 })

      const addressSponge = new JsSHA('SHAKE256', 'TEXT')
      addressSponge.update(digest)
      const recoveredAddress = addressSponge.getHash('HEX', { outputLen: 256 })

      // Recovered address must match the canonical vector AND generateAddress
      expect(recoveredAddress).toBe(vector.expectedOtsAddress)
      expect(recoveredAddress).toBe(Wallet.generateAddress(key))
      expect(vector.expectedVerified).toBe(true)
    })
  })
})
