import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
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
    const wallet = new Wallet({ secret, token, position })
    expect(wallet.pubkey).toBe(expectedPubkey)
  })

  // Encapsulation is non-deterministic, but decapsulation + AES-256-GCM decrypt is deterministic →
  // one frozen {cipherText, encryptedMessage} sample must decrypt to the canonical plaintext in every SDK.
  test('ML-KEM768 decrypt: frozen sample decrypts to canonical plaintext', async () => {
    const { secret, token, position, cipherText, encryptedMessage, expectedPlaintext } = mlkem.decrypt
    const wallet = new Wallet({ secret, token, position })
    const plaintext = await wallet.decryptMessage({ cipherText, encryptedMessage })
    expect(plaintext).toBe(expectedPlaintext)
  })
})
