import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
import Atom from '../src/Atom'
import Molecule from '../src/Molecule'
import AuthToken from '../src/AuthToken'
import {
  generateBundleHash,
  shake256
} from '../src'

/**
 * Canonical cross-platform test vectors — verifies JS SDK against
 * the shared cross-platform-test-vectors.json (Rust reference implementation).
 *
 * Unlike cross-platform.test.js (which tests against JS's own output),
 * this test validates against the canonical vectors shared across ALL SDKs.
 */

// Shared cross-SDK master (same convention as patent-vectors.test.js → ../../shared-test-results/)
import vectors from '../../shared-test-results/cross-platform-test-vectors.json'

describe('Canonical Cross-Platform SHAKE256 Vectors', () => {
  const shake256Tests = vectors.vectors.shake256.tests

  test.each(shake256Tests)('SHAKE256: $name', (vector) => {
    // Vector file uses bytes for outputLength, JS SDK uses bits
    const outputBits = vector.outputLength * 8
    const result = shake256(vector.input, outputBits)
    expect(result).toBe(vector.expected)
  })
})

describe('Canonical Cross-Platform Bundle Hash Vectors', () => {
  const bundleTests = vectors.vectors.bundle_hash.tests

  test.each(bundleTests)('Bundle hash: $name', (vector) => {
    const result = generateBundleHash(vector.secret)
    expect(result).toBe(vector.expected)
  })
})

describe('Canonical Cross-Platform Wallet Address Vectors', () => {
  const walletTests = vectors.vectors.wallet_generation.tests

  test('standard_wallet address matches Rust reference', () => {
    const vector = walletTests.find(t => t.name === 'standard_wallet')
    expect(vector).toBeDefined()

    const wallet = new Wallet({
      secret: vector.secret,
      token: vector.token,
      position: vector.position
    })

    // Bundle hash must match
    const bundle = generateBundleHash(vector.secret)
    expect(bundle).toBe(vector.expectedBundle)

    // Wallet address must match Rust reference
    expect(wallet.address).toBe(vector.expectedAddress)
  })

  test('user_wallet address matches Rust reference', () => {
    const vector = walletTests.find(t => t.name === 'user_wallet')
    expect(vector).toBeDefined()
    const wallet = new Wallet({ secret: vector.secret, token: vector.token, position: vector.position })
    expect(generateBundleHash(vector.secret)).toBe(vector.expectedBundle)
    expect(wallet.address).toBe(vector.expectedAddress)
  })

  test('bitcoin_wallet address matches Rust reference', () => {
    const vector = walletTests.find(t => t.name === 'bitcoin_wallet')
    expect(vector).toBeDefined()
    const wallet = new Wallet({ secret: vector.secret, token: vector.token, position: vector.position })
    expect(generateBundleHash(vector.secret)).toBe(vector.expectedBundle)
    expect(wallet.address).toBe(vector.expectedAddress)
  })
})

describe('Canonical Cross-Platform ML-KEM768 Vectors', () => {
  const mlkem = vectors.vectors.mlkem768

  // Keygen-from-seed is deterministic (FIPS-203) → byte-frozen pubkey, like a SHAKE vector.
  test('ML-KEM768 keygen: deterministic pubkey matches canonical', () => {
    const { secret, token, position, expectedPubkey } = mlkem.keygen
    const wallet = new Wallet({ secret, token, position, mlKemParameterSet: 768 })
    expect(wallet.pubkey).toBe(expectedPubkey)
  })

  // Encapsulation is non-deterministic, but decapsulation + AES-256-GCM decrypt is deterministic →
  // one frozen {cipherText, encryptedMessage} sample must decrypt to the canonical plaintext in every SDK.
  test('ML-KEM768 decrypt: frozen sample decrypts to canonical plaintext', async () => {
    const { secret, token, position, cipherText, encryptedMessage, expectedPlaintext } = mlkem.decrypt
    const wallet = new Wallet({ secret, token, position, mlKemParameterSet: 768 })
    const plaintext = await wallet.decryptMessage({ cipherText, encryptedMessage })
    expect(plaintext).toBe(expectedPlaintext)
  })
})

describe('Canonical Cross-Platform ML-KEM1024 Vectors', () => {
  const mlkem = vectors.vectors.mlkem1024

  // Keygen-from-seed is deterministic (FIPS-203) → byte-frozen pubkey, like a SHAKE vector.
  test('ML-KEM1024 keygen: deterministic pubkey matches canonical (default 1024)', () => {
    const { secret, token, position, expectedPubkey } = mlkem.keygen
    const wallet = new Wallet({ secret, token, position })
    expect(wallet.pubkey).toBe(expectedPubkey)
  })

  // Encapsulation is non-deterministic, but decapsulation + AES-256-GCM decrypt is deterministic →
  // one frozen {cipherText, encryptedMessage} sample must decrypt to the canonical plaintext in every SDK.
  test('ML-KEM1024 decrypt: frozen sample decrypts to canonical plaintext', async () => {
    const { secret, token, position, cipherText, encryptedMessage, expectedPlaintext } = mlkem.decrypt
    const wallet = new Wallet({ secret, token, position })
    const plaintext = await wallet.decryptMessage({ cipherText, encryptedMessage })
    expect(plaintext).toBe(expectedPlaintext)
  })
})

describe('Backwards compatibility: a 1024-default build reads pre-bump ML-KEM-768 records', () => {
  const mlkem768 = vectors.vectors.mlkem768.decrypt

  // (a) The whole point of dual-identity inbound decryption: no second wallet, no explicit step-back.
  test('a default (1024) wallet decrypts a frozen 768 envelope addressed to its own 768 identity', async () => {
    const { secret, token, position, cipherText, encryptedMessage, expectedPlaintext } = mlkem768
    const wallet = new Wallet({ secret, token, position })
    expect(wallet.mlKemParameterSet).toBe(1024)
    await expect(wallet.decryptMessage({ cipherText, encryptedMessage })).resolves.toBe(expectedPlaintext)
  })

  // (b) Permissive inbound must NOT change what the wallet advertises — that value goes into
  // signed molecule meta and into auth, so moving it would change hashed bytes.
  test('the advertised public key is still ML-KEM-1024', () => {
    const { secret, token, position } = mlkem768
    const wallet = new Wallet({ secret, token, position })
    expect(Buffer.from(wallet.pubkey, 'base64')).toHaveLength(1568)
  })

  // (d) A ciphertext at neither parameter set must still fail on the existing observable.
  test('a ciphertext matching neither parameter set still returns null', async () => {
    const { secret, token, position, encryptedMessage } = mlkem768
    const wallet = new Wallet({ secret, token, position })
    const malformed = wallet.serializeKey(new Uint8Array(64))
    await expect(wallet.decryptMessage({ cipherText: malformed, encryptedMessage })).resolves.toBeNull()
  })

  // (e) The transport path is map-addressed, so without trying both hash shares the length
  // dispatch in (a) is never even reached.
  test('the CipherHash map path finds an envelope addressed to the 768 hash share', async () => {
    const { secret, token, position, cipherText, encryptedMessage, expectedPlaintext } = mlkem768
    const wallet = new Wallet({ secret, token, position })
    const wallet768 = new Wallet({ secret, token, position, mlKemParameterSet: 768 })
    const map = { [wallet768.hashShare(wallet768.pubkey)]: { cipherText, encryptedMessage } }

    // decryptMyMessageML returns the RAW response text (the normal parser JSON.parses it).
    const raw = await wallet.decryptMyMessageML(map)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw)).toBe(expectedPlaintext)
  })
})

describe('Backwards compatibility: session snapshots keep their ML-KEM parameter set', () => {
  const { secret, position } = vectors.vectors.mlkem768.decrypt

  test('a stepped-back 768 session survives a snapshot round trip', () => {
    const wallet = new Wallet({ secret, token: 'AUTH', position, mlKemParameterSet: 768 })
    const snapshot = AuthToken.create(
      { token: 'T', expiresAt: 9999999999, pubkey: wallet.pubkey, encrypt: true },
      wallet
    ).getSnapshot()

    expect(AuthToken.restore(snapshot, secret).getWallet().pubkey).toBe(wallet.pubkey)
  })

  test('a legacy snapshot with no parameter set restores as 768, not the 1024 default', () => {
    const wallet768 = new Wallet({ secret, token: 'AUTH', position, mlKemParameterSet: 768 })

    // The exact shape an 0.9.x build persisted: no parameter-set field anywhere, and `pubkey`
    // is the validator's 768 key because every pre-bump session was 768.
    const legacySnapshot = {
      token: 'T',
      expiresAt: 9999999999,
      pubkey: wallet768.pubkey,
      encrypt: 'true',
      wallet: {
        position: wallet768.position,
        characters: wallet768.characters
      }
    }

    const restored = AuthToken.restore(legacySnapshot, secret).getWallet()
    expect(restored.pubkey).toBe(wallet768.pubkey)
    expect(Buffer.from(restored.pubkey, 'base64')).toHaveLength(1184)
  })
})

describe('Canonical pre-bump ML-KEM-768 auth molecule validates from a 1024 default', () => {
  const legacy = vectors.vectors.legacyMlkem768AuthMolecule

  // Fails loudly if the fixture is ever regenerated at the 1024 default — at which point it
  // would no longer be evidence about pre-bump records at all.
  test('the U-atom walletPubkey meta really is an ML-KEM-768 key', () => {
    const walletPubkeys = legacy.molecule.atoms
      .flatMap(atom => atom.meta || [])
      .filter(meta => meta.key === 'walletPubkey')
      .map(meta => meta.value)

    expect(walletPubkeys).toHaveLength(1)
    expect(Buffer.from(walletPubkeys[0], 'base64')).toHaveLength(legacy.expectedWalletPubkeyBytes)
  })

  test('its molecular hash still verifies', () => {
    const atoms = legacy.atoms.map(atom => Atom.fromJSON(atom))
    expect(Atom.hashAtoms({ atoms })).toBe(legacy.expectedMolecularHash)
  })

  test('full check() — hash plus WOTS+ signature — passes', () => {
    const molecule = Molecule.fromJSON(legacy.molecule, {
      includeValidationContext: true,
      validateStructure: true,
      strictMode: false
    })
    expect(molecule.molecularHash).toBe(legacy.expectedMolecularHash)
    expect(molecule.check(molecule.sourceWallet)).toBe(true)
  })
})
