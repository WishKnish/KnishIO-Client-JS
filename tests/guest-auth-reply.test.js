/**
 * requestGuestAuthToken over a stubbed transport. MutationRequestAuthorizationGuest selects
 * `token pubkey expiresAt`, so a reply of exactly that shape must produce an auth token; the
 * legacy reply shape (`key`, `encrypt`) must keep working. The transport is stubbed on the
 * prototype: calling client() first would start a background login of its own.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import KnishIOClient from '../src/KnishIOClient.js'
import AuthToken from '../src/AuthToken.js'
import UrqlClientWrapper from '../src/libraries/urql/UrqlClientWrapper.js'
import { generateBundleHash, generateSecret } from '../src/libraries/crypto.js'

const makeClient = () => new KnishIOClient({ uri: 'https://test.local/graphql', cellSlug: 'cell', logging: false })
const inAnHour = () => Math.floor(Date.now() / 1000) + 3600

afterEach(() => {
  jest.restoreAllMocks()
})

describe('requestGuestAuthToken', () => {
  test('accepts a reply carrying exactly the fields the guest mutation selects', async () => {
    const client = makeClient()
    jest.spyOn(client, 'getFingerprint').mockResolvedValue('fingerprint-1')
    const mutate = jest.spyOn(UrqlClientWrapper.prototype, 'mutate').mockResolvedValue({
      data: { AccessToken: { token: 'guest-token', pubkey: 'server-key', expiresAt: inAnHour() } }
    })

    await client.requestGuestAuthToken({ cellSlug: 'cell', encrypt: true })

    const authToken = client.getAuthToken()
    expect(authToken).toBeInstanceOf(AuthToken)
    expect(authToken.getToken()).toBe('guest-token')
    const wallet = authToken.getWallet()
    expect([wallet.token, wallet.bundle]).toEqual(['AUTH', generateBundleHash(generateSecret('fingerprint-1'))])
    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate.mock.calls[0][0].variables).toEqual({ cellSlug: 'cell', pubkey: wallet.pubkey, encrypt: true })
    expect(client.client().getPubKey()).toBe('server-key')
    // The reply carries no `encrypt`: the requested mode applies
    expect(authToken.getSnapshot().encrypt).toBe(true)
  })

  test('keeps the requested plaintext mode when the reply carries no encrypt flag', async () => {
    const client = makeClient()
    jest.spyOn(client, 'getFingerprint').mockResolvedValue('fingerprint-2')
    jest.spyOn(UrqlClientWrapper.prototype, 'mutate').mockResolvedValue({
      data: { AccessToken: { token: 'guest-token', pubkey: 'server-key', expiresAt: inAnHour() } }
    })

    await client.requestGuestAuthToken({ cellSlug: 'cell', encrypt: false })

    expect(client.getAuthToken().getSnapshot().encrypt).toBe(false)
  })

  test('still accepts the legacy reply with key and encrypt', async () => {
    const client = makeClient()
    jest.spyOn(client, 'getFingerprint').mockResolvedValue('fingerprint-3')
    jest.spyOn(UrqlClientWrapper.prototype, 'mutate').mockResolvedValue({
      data: { AccessToken: { token: 'legacy-token', key: 'legacy-key', encrypt: true, expiresAt: inAnHour() } }
    })

    await client.requestGuestAuthToken({ cellSlug: 'cell', encrypt: false })

    const authToken = client.getAuthToken()
    expect(authToken.getToken()).toBe('legacy-token')
    expect(client.client().getPubKey()).toBe('legacy-key')
    expect(authToken.getSnapshot().encrypt).toBe(true)
  })
})
