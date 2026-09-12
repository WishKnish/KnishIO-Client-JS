import { describe, test, expect } from '@jest/globals'
import NonExtractableKeySecretStorageProvider, {
  MemoryKeyStore
} from '../src/storage/NonExtractableKeySecretStorageProvider.js'
import { MemoryStorageBackend } from '../src/storage/WebCryptoSecretStorageProvider.js'
import SecretStorageException from '../src/exception/SecretStorageException.js'

describe('NonExtractableKeySecretStorageProvider', () => {
  test('round-trips secrets using MemoryKeyStore', async () => {
    const backend = new MemoryStorageBackend()
    const keyStore = new MemoryKeyStore()
    const provider = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'test-alias'
    })

    expect(await provider.isAvailable()).toBe(true)
    expect(provider.isHardwareBacked()).toBe(false)
    expect(provider.providerType).toBe('webcrypto-nonextractable')

    await provider.storeSecret('bundle1', 'my-super-secret')
    const retrieved = await provider.retrieveSecret('bundle1')
    expect(retrieved).toBe('my-super-secret')

    const withSec = await provider.withSecret('bundle1', (s) => s.length)
    expect(withSec).toBe('my-super-secret'.length)

    // Lock and retrieve again
    provider.lock()
    const retrievedAfterLock = await provider.retrieveSecret('bundle1')
    expect(retrievedAfterLock).toBe('my-super-secret')
  })

  test('allows second instance sharing both stores to retrieve', async () => {
    const backend = new MemoryStorageBackend()
    const keyStore = new MemoryKeyStore()

    const instance1 = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'shared'
    })
    await instance1.storeSecret('bundle2', 'shared-data')

    const instance2 = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'shared'
    })
    const retrieved = await instance2.retrieveSecret('bundle2')
    expect(retrieved).toBe('shared-data')
  })

  test('throws unavailable if record exists but key is missing from keyStore', async () => {
    const backend = new MemoryStorageBackend()
    const keyStore = new MemoryKeyStore()

    const provider1 = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'missing-key'
    })
    await provider1.storeSecret('bundle3', 'data')

    // Delete the key from keyStore
    await keyStore.delete('knishio:kek:missing-key')

    const provider2 = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'missing-key'
    })
    await expect(provider2.retrieveSecret('bundle3')).rejects.toThrow(SecretStorageException)
  })

  test('throws decryptionFailed if key in keyStore is wrong', async () => {
    const backend = new MemoryStorageBackend()
    const keyStore = new MemoryKeyStore()

    const provider1 = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'wrong-key'
    })
    await provider1.storeSecret('bundle4', 'data')

    // Overwrite the key with a different newly generated key
    const differentKey = await globalThis.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    )
    await keyStore.put('knishio:kek:wrong-key', differentKey)

    const provider2 = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore,
      alias: 'wrong-key'
    })
    await expect(provider2.retrieveSecret('bundle4')).rejects.toThrow(SecretStorageException)
  })

  test('rejects caller-provided options.passphrase', async () => {
    const backend = new MemoryStorageBackend()
    const keyStore = new MemoryKeyStore()
    const provider = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore
    })

    await expect(
      provider.storeSecret('b1', 's', { passphrase: 'bad' })
    ).rejects.toThrow('NonExtractableKeySecretStorageProvider derives its passphrase from the non-extractable device key; options.passphrase is not accepted')

    await expect(
      provider.retrieveSecret('b1', { passphrase: 'bad' })
    ).rejects.toThrow('NonExtractableKeySecretStorageProvider derives its passphrase from the non-extractable device key; options.passphrase is not accepted')

    await expect(
      provider.withSecret('b1', () => {}, { passphrase: 'bad' })
    ).rejects.toThrow('NonExtractableKeySecretStorageProvider derives its passphrase from the non-extractable device key; options.passphrase is not accepted')
  })

  test('emits metadata contract with omit-when-absent convention', async () => {
    const backend = new MemoryStorageBackend()
    const keyStore = new MemoryKeyStore()
    const provider = new NonExtractableKeySecretStorageProvider({
      backend,
      keyStore
    })

    await provider.storeSecret('bundle-meta', 'secret')
    const raw = await backend.getItem('knishio:secret:bundle-meta')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw)
    const metadata = parsed.metadata

    expect(metadata.bundleHash).toBe('bundle-meta')
    expect(metadata.hardwareBacked).toBe(false)
    expect(metadata.providerType).toBe('webcrypto-nonextractable')
    expect(typeof metadata.createdAt).toBe('number')
    expect('label' in metadata).toBe(false)

    for (const forbidden of ['bundle_hash', 'created_at', 'hardware_backed', 'provider_type']) {
      expect(forbidden in metadata).toBe(false)
    }
  })
})
