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

    // ONE session, transport toggled on it — the queried balance wallet stays fixed. (A fresh
    // second auth would rotate the USER remainder via ContinuID → a different address/position/
    // pubkey, which is correct protocol behaviour, not a transport bug — so it must NOT be the
    // variable under test.)
    //
    // The session authenticates PLAINTEXT on purpose. The AUTH wallet's ML-KEM pubkey is conveyed
    // as a signed `walletPubkey` U-atom meta regardless of `encrypt` (KnishIOClient.js:2506-2509),
    // and the validator's CipherHash handler needs only that key — so an `encrypt: false` session
    // still speaks the encrypted transport. Authenticating with `encrypt: true` instead would make
    // the plaintext baseline leg below a silent downgrade, which the validator rejects when
    // ENFORCE_ENCRYPTED_TRANSPORT is at its secure default. (That rejection is the subject of the
    // second test in this file, which authenticates with encrypt: true on purpose.)
    const mlKemParameterSet = process.env.CIPHERHASH_MLKEM_PARAMETER_SET ? Number(process.env.CIPHERHASH_MLKEM_PARAMETER_SET) : 1024
    const client = new KnishIOClient({ uri: testUrl, cellSlug: 'public', logging: false, mlKemParameterSet })
    await client.requestAuthToken({ secret, encrypt: false })

    // Encrypted round-trip: the validator ML-KEM-decrypts the request, executes it, and encrypts
    // the response back to the client's ML-KEM pubkey, which the client decrypts.
    client.switchEncryption(true)
    const encResp = await client.queryBalance({ token: 'USER' })

    // Plaintext baseline of the SAME wallet on the SAME authed session — only the transport differs.
    client.switchEncryption(false)
    const plainResp = await client.queryBalance({ token: 'USER' })

    // The PQ transport must be transparent: not just a non-error response, but the SAME data.
    // toEqual is order-insensitive (the encrypted path's data comes back with alphabetically-sorted
    // keys from the validator's serde re-serialization; the values are identical).
    expect(encResp.success()).toBe(plainResp.success())
    expect(encResp.data()).toEqual(plainResp.data())
  }, 60000)

  // Live coverage of the enforcement path: extract_encrypt_flag → auth_tokens.encrypted →
  // requires_encrypted_transport. It also proves this SDK's signed `encrypt` meta literal is the
  // one the validator honours — a session that authenticated with encrypt: true must NOT be able
  // to fall back to plaintext.
  test('a session authenticated with encrypt: true is refused when it drops to plaintext', async () => {
    const secret = generateSecret()
    const mlKemParameterSet = process.env.CIPHERHASH_MLKEM_PARAMETER_SET ? Number(process.env.CIPHERHASH_MLKEM_PARAMETER_SET) : 1024
    const client = new KnishIOClient({ uri: testUrl, cellSlug: 'public', logging: false, mlKemParameterSet })
    await client.requestAuthToken({ secret, encrypt: true })

    // The encrypted transport still works for this session.
    const encResp = await client.queryBalance({ token: 'USER' })
    expect(encResp.data()).not.toBeNull()

    // Dropping to plaintext on the same session is the silent downgrade the validator refuses.
    client.switchEncryption(false)
    await expect(client.queryBalance({ token: 'USER' }))
      .rejects.toThrow(/send requests through the CipherHash encrypted transport/)
  }, 60000)
})
