import { describe, test, expect } from '@jest/globals'
import WebAuthnPrfSecretStorageProvider from '../src/storage/WebAuthnPrfSecretStorageProvider.js'
import { MemoryStorageBackend } from '../src/storage/WebCryptoSecretStorageProvider.js'
import SecretStorageException from '../src/exception/SecretStorageException.js'
import { openEnvelope } from '../src/storage/secretEnvelope.js'
import {
  FROZEN_TS_0_9_7_ENVELOPE,
  XSDK_PASSPHRASE,
  XSDK_PLAINTEXT
} from './fixtures/frozenEnvelope.js'

function createFakeCredentials (prfBytes = new Uint8Array(32).fill(42)) {
  const credentialId = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
  return {
    create: async () => ({
      rawId: credentialId.buffer,
      getClientExtensionResults: () => ({
        prf: {
          enabled: true,
          results: {
            first: prfBytes.buffer
          }
        }
      })
    }),
    get: async () => ({
      rawId: credentialId.buffer,
      getClientExtensionResults: () => ({
        prf: {
          enabled: true,
          results: {
            first: prfBytes.buffer
          }
        }
      })
    })
  }
}

describe('WebAuthnPrfSecretStorageProvider', () => {
  const rp = { id: 'localhost', name: 'KnishIO Local' }
  const user = { id: new Uint8Array([1, 2, 3]), name: 'testuser', displayName: 'Test User' }

  test('enrolls and round-trips a secret', async () => {
    const backend = new MemoryStorageBackend()
    const credentials = createFakeCredentials()
    const provider = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials
    })

    expect(await provider.isAvailable()).toBe(true)
    expect(provider.isHardwareBacked()).toBe(false)
    expect(provider.providerType).toBe('webauthn-prf')

    // Before enrollment, storing throws unavailable (no enrolled credential)
    await expect(provider.storeSecret('bundle1', 'my-master-secret')).rejects.toThrow(SecretStorageException)

    await provider.enroll()
    const record = await backend.getItem('knishio:webauthn-prf:default')
    expect(record).not.toBeNull()

    // Store and retrieve
    await provider.storeSecret('bundle1', 'my-master-secret')
    const retrieved = await provider.retrieveSecret('bundle1')
    expect(retrieved).toBe('my-master-secret')

    // withSecret works
    const result = await provider.withSecret('bundle1', (s) => s.toUpperCase())
    expect(result).toBe('MY-MASTER-SECRET')

    // Lock clears cached passphrase, then next retrieve unlocks again
    provider.lock()
    const retrievedAfterLock = await provider.retrieveSecret('bundle1')
    expect(retrievedAfterLock).toBe('my-master-secret')
  })

  test('allows a second instance on the same backend to retrieve the secret', async () => {
    const backend = new MemoryStorageBackend()
    const credentials = createFakeCredentials()

    const instance1 = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials
    })
    await instance1.enroll()
    await instance1.storeSecret('bundleX', 'shared-passkey-secret')

    const instance2 = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials
    })
    const retrieved = await instance2.retrieveSecret('bundleX')
    expect(retrieved).toBe('shared-passkey-secret')
  })

  test('fails decryption when PRF outputs differ (wrong passkey)', async () => {
    const backend = new MemoryStorageBackend()
    const originalCredentials = createFakeCredentials(new Uint8Array(32).fill(42))

    const provider = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials: originalCredentials
    })
    await provider.enroll()
    await provider.storeSecret('bundle-mismatch', 'secret-val')
    provider.lock()

    // Different authenticator PRF output
    const differentCredentials = createFakeCredentials(new Uint8Array(32).fill(99))
    const wrongProvider = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials: differentCredentials
    })

    await expect(wrongProvider.retrieveSecret('bundle-mismatch')).rejects.toThrow(SecretStorageException)
  })

  test('rejects caller-provided options.passphrase', async () => {
    const backend = new MemoryStorageBackend()
    const credentials = createFakeCredentials()
    const provider = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials
    })
    await provider.enroll()

    await expect(
      provider.storeSecret('b1', 'secret', { passphrase: 'custom' })
    ).rejects.toThrow('WebAuthnPrfSecretStorageProvider derives its passphrase from the authenticator; options.passphrase is not accepted')

    await expect(
      provider.retrieveSecret('b1', { passphrase: 'custom' })
    ).rejects.toThrow('WebAuthnPrfSecretStorageProvider derives its passphrase from the authenticator; options.passphrase is not accepted')

    await expect(
      provider.withSecret('b1', () => {}, { passphrase: 'custom' })
    ).rejects.toThrow('WebAuthnPrfSecretStorageProvider derives its passphrase from the authenticator; options.passphrase is not accepted')
  })

  test('emits metadata contract with omit-when-absent convention', async () => {
    const backend = new MemoryStorageBackend()
    const credentials = createFakeCredentials()
    const provider = new WebAuthnPrfSecretStorageProvider({
      backend,
      rp,
      user,
      credentials
    })
    await provider.enroll()
    await provider.storeSecret('bundle-meta', 'secret')

    const raw = await backend.getItem('knishio:secret:bundle-meta')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw)
    const metadata = parsed.metadata

    expect(metadata.bundleHash).toBe('bundle-meta')
    expect(metadata.hardwareBacked).toBe(false)
    expect(metadata.providerType).toBe('webauthn-prf')
    expect(typeof metadata.createdAt).toBe('number')
    expect('label' in metadata).toBe(false)

    for (const forbidden of ['bundle_hash', 'created_at', 'hardware_backed', 'provider_type']) {
      expect(forbidden in metadata).toBe(false)
    }
  })

  test('still decrypts frozen cross-SDK envelope via openEnvelope', async () => {
    const payload = JSON.parse(FROZEN_TS_0_9_7_ENVELOPE)
    const decryptedBytes = await openEnvelope(payload, XSDK_PASSPHRASE)
    const text = new TextDecoder().decode(decryptedBytes)
    expect(text).toBe(XSDK_PLAINTEXT)
  })
})
