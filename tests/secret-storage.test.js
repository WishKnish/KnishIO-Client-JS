import { describe, test, expect } from '@jest/globals'
import {
  zeroizeBytes,
  withSecureBytes,
  withSecureString,
  constantTimeCompare
} from '../src/libraries/secureMemory.js'
import {
  MemorySecretStorageProvider,
  WebCryptoSecretStorageProvider,
  MemoryStorageBackend,
  createDefaultSecretStorage
} from '../src/storage/index.js'
import {
  FROZEN_TS_0_9_7_ENVELOPE,
  XSDK_BUNDLE,
  XSDK_PASSPHRASE,
  XSDK_PLAINTEXT
} from './fixtures/frozenEnvelope.js'
import SecretStorageException from '../src/exception/SecretStorageException.js'

describe('Secure Memory & Zeroization Utilities', () => {
  test('zeroizeBytes sets all bytes to 0 in Uint8Array', () => {
    const buf = new Uint8Array([1, 2, 3, 4, 5])
    zeroizeBytes(buf)
    expect(Array.from(buf)).toEqual([0, 0, 0, 0, 0])
  })

  test('zeroizeBytes sets all numbers to 0 in Array', () => {
    const arr = [10, 20, 30]
    zeroizeBytes(arr)
    expect(arr).toEqual([0, 0, 0])
  })

  test('withSecureBytes executes callback and zeroes buffer afterwards', async () => {
    const buf = new Uint8Array([42, 43, 44])
    let observedInCallback = 0

    await withSecureBytes(buf, (bytes) => {
      observedInCallback = bytes[0] ?? 0
    })

    expect(observedInCallback).toBe(42)
    expect(buf[0]).toBe(0)
    expect(buf[1]).toBe(0)
    expect(buf[2]).toBe(0)
  })

  test('withSecureBytes zeroes buffer even if callback throws', async () => {
    const buf = new Uint8Array([99, 98, 97])

    await expect(
      withSecureBytes(buf, () => {
        throw new Error('Test crash')
      })
    ).rejects.toThrow('Test crash')

    expect(buf[0]).toBe(0)
    expect(buf[1]).toBe(0)
    expect(buf[2]).toBe(0)
  })

  test('withSecureString executes callback with secret', async () => {
    const secret = 'super-secret-key-12345'
    const result = await withSecureString(secret, (sec) => sec.toUpperCase())
    expect(result).toBe('SUPER-SECRET-KEY-12345')
  })

  test('constantTimeCompare returns true for identical data and false for different', () => {
    expect(constantTimeCompare('secret123', 'secret123')).toBe(true)
    expect(constantTimeCompare('secret123', 'secret124')).toBe(false)
    expect(constantTimeCompare('secret123', 'secret12')).toBe(false)

    const bytes1 = new Uint8Array([1, 2, 3])
    const bytes2 = new Uint8Array([1, 2, 3])
    const bytes3 = new Uint8Array([1, 2, 4])
    expect(constantTimeCompare(bytes1, bytes2)).toBe(true)
    expect(constantTimeCompare(bytes1, bytes3)).toBe(false)
  })
})

describe('MemorySecretStorageProvider', () => {
  test('implements storage provider contract correctly', async () => {
    const provider = new MemorySecretStorageProvider()

    expect(provider.providerType).toBe('memory')
    expect(provider.isHardwareBacked()).toBe(false)
    expect(await provider.isAvailable()).toBe(true)

    const bundle = 'bundle_hash_test_123'
    const secret = 'master_secret_value_xyz'

    expect(await provider.hasSecret(bundle)).toBe(false)
    expect(await provider.retrieveSecret(bundle)).toBeNull()

    await provider.storeSecret(bundle, secret, { label: 'Primary Key' })
    expect(await provider.hasSecret(bundle)).toBe(true)
    expect(await provider.retrieveSecret(bundle)).toBe(secret)

    const list = await provider.listSecrets()
    expect(list.length).toBe(1)
    expect(list[0]?.bundleHash).toBe(bundle)
    expect(list[0]?.label).toBe('Primary Key')

    const length = await provider.withSecret(bundle, (s) => s.length)
    expect(length).toBe(secret.length)

    const deleted = await provider.deleteSecret(bundle)
    expect(deleted).toBe(true)
    expect(await provider.hasSecret(bundle)).toBe(false)
    expect(await provider.retrieveSecret(bundle)).toBeNull()
  })

  test('withSecret throws SecretStorageException for unknown bundle', async () => {
    const provider = new MemorySecretStorageProvider()
    await expect(
      provider.withSecret('non_existent', (s) => s)
    ).rejects.toThrow(SecretStorageException)
  })

  test('storeSecret rejects empty parameters', async () => {
    const provider = new MemorySecretStorageProvider()
    await expect(provider.storeSecret('', 'secret')).rejects.toThrow(SecretStorageException)
    await expect(provider.storeSecret('bundle', '')).rejects.toThrow(SecretStorageException)
  })
})

describe('WebCryptoSecretStorageProvider', () => {
  test('encrypts and decrypts master secret using AES-GCM envelope encryption', async () => {
    const provider = new WebCryptoSecretStorageProvider({
      defaultPassphrase: 'user-passphrase-alpha'
    })

    expect(await provider.isAvailable()).toBe(true)
    expect(provider.providerType).toBe('webcrypto-aes-gcm')

    const bundle = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const secret = 'a'.repeat(256)

    await provider.storeSecret(bundle, secret, { label: 'Production Seed' })
    expect(await provider.hasSecret(bundle)).toBe(true)

    const retrieved = await provider.retrieveSecret(bundle)
    expect(retrieved).toBe(secret)

    const transformed = await provider.withSecret(bundle, (s) => s.slice(0, 10))
    expect(transformed).toBe('aaaaaaaaaa')

    const list = await provider.listSecrets()
    expect(list.length).toBe(1)
    expect(list[0]?.bundleHash).toBe(bundle)
    expect(list[0]?.label).toBe('Production Seed')
    expect(list[0]?.providerType).toBe('webcrypto-aes-gcm')
  })

  test('fails decryption with wrong passphrase', async () => {
    const provider = new WebCryptoSecretStorageProvider()
    const bundle = 'test_bundle_passphrase_check'
    const secret = 'super_secret_payload'

    await provider.storeSecret(bundle, secret, { passphrase: 'correct-password' })

    await expect(
      provider.retrieveSecret(bundle, { passphrase: 'wrong-password' })
    ).rejects.toThrow(SecretStorageException)

    await expect(
      provider.withSecret(bundle, (s) => s, { passphrase: 'wrong-password' })
    ).rejects.toThrow(SecretStorageException)
  })

  test('deletes stored secret and returns null on subsequent retrieval', async () => {
    const provider = new WebCryptoSecretStorageProvider({ defaultPassphrase: 'test-pass' })
    const bundle = 'bundle_to_delete'
    await provider.storeSecret(bundle, 'value')

    expect(await provider.hasSecret(bundle)).toBe(true)
    const deleted = await provider.deleteSecret(bundle)
    expect(deleted).toBe(true)
    expect(await provider.hasSecret(bundle)).toBe(false)
    expect(await provider.retrieveSecret(bundle)).toBeNull()
  })

  test('fails withSecret when bundle is not found', async () => {
    const provider = new WebCryptoSecretStorageProvider({ defaultPassphrase: 'test-pass' })
    await expect(
      provider.withSecret('absent_bundle', (s) => s)
    ).rejects.toThrow(SecretStorageException)
  })

  test('cannot be made to claim hardware custody by its caller', async () => {
    const backend = new MemoryStorageBackend()
    const provider = new WebCryptoSecretStorageProvider({ backend, hardwareBacked: true })
    expect(provider.isHardwareBacked()).toBe(false)
    await provider.storeSecret('b', 's', { passphrase: 'p' })
    const stored = JSON.parse(backend.getItem('knishio:secret:b') || '{}')
    expect(stored.metadata.hardwareBacked).toBe(false)
    expect(stored.metadata.providerType).toBe('webcrypto-aes-gcm')
  })

  test('decrypts the frozen cross-SDK envelope and emits the metadata contract', async () => {
    const backend = new MemoryStorageBackend()
    backend.setItem(`knishio:secret:${XSDK_BUNDLE}`, FROZEN_TS_0_9_7_ENVELOPE)
    const provider = new WebCryptoSecretStorageProvider({ backend })
    const decrypted = await provider.retrieveSecret(XSDK_BUNDLE, { passphrase: XSDK_PASSPHRASE })
    expect(decrypted).toBe(XSDK_PLAINTEXT)

    const freshBackend = new MemoryStorageBackend()
    const freshProvider = new WebCryptoSecretStorageProvider({ backend: freshBackend })
    await freshProvider.storeSecret(XSDK_BUNDLE, XSDK_PLAINTEXT, { passphrase: XSDK_PASSPHRASE })
    const storedRaw = freshBackend.getItem(`knishio:secret:${XSDK_BUNDLE}`)
    expect(storedRaw).not.toBeNull()
    const stored = JSON.parse(storedRaw)
    const metadata = stored.metadata

    for (const key of ['bundleHash', 'createdAt', 'hardwareBacked', 'providerType']) {
      expect(key in metadata).toBe(true)
    }
    for (const key of ['bundle_hash', 'created_at', 'hardware_backed', 'provider_type']) {
      expect(key in metadata).toBe(false)
    }
    expect('label' in metadata).toBe(false)
    expect(metadata.hardwareBacked).toBe(false)
    expect(metadata.providerType).toBe('webcrypto-aes-gcm')
  })
})

describe('createDefaultSecretStorage factory', () => {
  test('creates MemorySecretStorageProvider when requested', () => {
    const storage = createDefaultSecretStorage({ type: 'memory' })
    expect(storage.providerType).toBe('memory')
  })

  test('creates WebCryptoSecretStorageProvider in supported environments by default', () => {
    const storage = createDefaultSecretStorage({ defaultPassphrase: 'test' })
    expect(storage.providerType).toBe('webcrypto-aes-gcm')
  })
})
