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

// Path relative to project root — Jest runs from project root
import vectors from '../../KnishIO-Client-Rust/tests/fixtures/cross-platform-test-vectors.json'

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
