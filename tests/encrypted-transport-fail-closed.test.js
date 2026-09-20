/**
 * Encrypted transport must fail CLOSED (PQ-transport Phase E).
 *
 * An encryption-enabled client that has no authorized wallet or no validator ML-KEM public key
 * used to fall through to the plaintext body: `cipherFetch` gated encryption on
 * `wallet && serverPubkey && …`, and when that was false it simply POSTed the unencrypted
 * operation. The caller asked for an encrypted transport and silently got none — no error, no
 * log, confidential request on the wire.
 *
 * PHP (Libraries/Cipher.php) and Kotlin (httpClient/HttpClient.kt) already threw
 * `Authorized wallet missing.` / `Server public key missing.` in exactly this situation; these
 * tests pin the same behaviour for JS.
 *
 * The bypass set must keep working: the auth bootstrap (`__schema`, `ContinuId`, `AccessToken`,
 * U-isotope `ProposeMolecule`) cannot be encrypted, because the server pubkey is what it is
 * fetching. If those raised, an encrypted client could never authenticate at all.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import UrqlClientWrapper from '../src/libraries/urql/UrqlClientWrapper'
import Wallet from '../src/Wallet'

const testUri = 'https://test.local/graphql'
const SECRET = 'a1b2c3d4e5f6'.repeat(8)
const BALANCE_QUERY = 'query B { Balance(token: "USER") { address } }'
const INTROSPECTION_QUERY = 'query { __schema { types { name } } }'

const originalFetch = globalThis.fetch

/** Records every fetch that reaches the network and answers with an empty GraphQL result. */
function recordingFetch () {
  const sent = []
  globalThis.fetch = jest.fn(async (input, init) => {
    sent.push({ url: String(input), body: init && init.body })
    return new Response(JSON.stringify({ data: {} }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
  return sent
}

/** urql surfaces a throwing fetch as a CombinedError networkError on the formatted response. */
function networkErrorMessage (response) {
  const error = response.errors && response.errors[0]
  return error && error.networkError ? error.networkError.message : (error && error.message)
}

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('an encryption-enabled client with no transport keys', () => {
  test('refuses to send a normal operation instead of downgrading to plaintext', async () => {
    const sent = recordingFetch()
    const wrapper = new UrqlClientWrapper({ serverUri: testUri, encrypt: true })

    const response = await wrapper.query({ query: BALANCE_QUERY, variables: {} })

    expect(networkErrorMessage(response)).toBe('Authorized wallet missing.')
    // The decisive assertion: nothing at all went on the wire.
    expect(sent).toHaveLength(0)
  })

  test('refuses when only the validator public key is missing', async () => {
    const sent = recordingFetch()
    const wrapper = new UrqlClientWrapper({ serverUri: testUri, encrypt: true })
    wrapper.setAuthData({ token: 'T', pubkey: null, wallet: new Wallet({ secret: SECRET, token: 'AUTH' }) })

    const response = await wrapper.query({ query: BALANCE_QUERY, variables: {} })

    expect(networkErrorMessage(response)).toBe('Server public key missing.')
    expect(sent).toHaveLength(0)
  })

  test('still sends a bypassed operation in plaintext, so the auth bootstrap works', async () => {
    const sent = recordingFetch()
    const wrapper = new UrqlClientWrapper({ serverUri: testUri, encrypt: true })

    const response = await wrapper.query({ query: INTROSPECTION_QUERY, variables: {} })

    expect(response.errors).toBeUndefined()
    expect(sent).toHaveLength(1)
    expect(String(sent[0].body)).toContain('__schema')
  })
})

describe('an encryption-enabled client WITH transport keys', () => {
  test('wraps the operation in the CipherHash envelope', async () => {
    const sent = recordingFetch()
    const wallet = new Wallet({ secret: SECRET, token: 'AUTH' })
    const wrapper = new UrqlClientWrapper({ serverUri: testUri, encrypt: true })
    wrapper.setAuthData({ token: 'T', pubkey: wallet.pubkey, wallet })

    await wrapper.query({ query: BALANCE_QUERY, variables: {} })

    expect(sent).toHaveLength(1)
    const body = JSON.parse(String(sent[0].body))
    expect(body.query).toContain('CipherHash')
    expect(typeof body.variables.Hash).toBe('string')
    expect(String(sent[0].body)).not.toContain('Balance')
  })
})
