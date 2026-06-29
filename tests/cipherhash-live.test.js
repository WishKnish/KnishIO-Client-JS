import {
  describe,
  test,
  expect
} from '@jest/globals'
import KnishIOClient from '../src/KnishIOClient'
import { generateSecret } from '../src'

/**
 * Live ML-KEM768 CipherHash encrypted-transport round-trip against a running validator
 * (PQ-transport Phase E, cycle 163 — the JS reference SDK).
 *
 * Gated on CIPHERHASH_TEST_URL (skips cleanly when unset). Run live against the dev validator:
 *   CIPHERHASH_TEST_URL=http://localhost:8081/graphql npm test -- tests/cipherhash-live.test.js
 *
 * The encrypted client conveys its AUTH source wallet's ML-KEM pubkey at auth (a signed
 * walletPubkey U-atom meta); the validator decrypts the encrypted queryBalance request, executes
 * it, and encrypts the response back to that pubkey, which the client decrypts. The transport is
 * transparent → the encrypted result must match the plaintext baseline.
 */
const testUrl = process.env.CIPHERHASH_TEST_URL || 'http://localhost:8081/graphql'
const runCipherHash = !!process.env.CIPHERHASH_TEST_URL
const describeCipherHash = runCipherHash ? describe : describe.skip

describeCipherHash('CipherHash live ML-KEM round-trip (PQ Phase E)', () => {
  test('encrypted queryBalance round-trips (matches plaintext)', async () => {
    const secret = generateSecret()

    // Plaintext baseline (same secret/bundle).
    const plain = new KnishIOClient({ uri: testUrl, cellSlug: 'public', logging: false })
    await plain.requestAuthToken({ secret, encrypt: false })
    const plainResp = await plain.queryBalance({ token: 'USER' })

    // Encrypted round-trip.
    const enc = new KnishIOClient({ uri: testUrl, cellSlug: 'public', logging: false })
    await enc.requestAuthToken({ secret, encrypt: true })
    const encResp = await enc.queryBalance({ token: 'USER' })

    expect(encResp.success()).toBe(plainResp.success())
  }, 60000)
})
