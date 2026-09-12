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
  FileStorageBackend,
  WebStorageBackend,
  createDefaultSecretStorage,
  SECRET_KEY_PREFIX,
  RECOVERY_KEY_PREFIX
} from '../src/storage/index.js'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as os from 'node:os'
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

describe('FileStorageBackend', () => {
  const testDir = path.join(os.tmpdir(), `knishio-js-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const testFile = path.join(testDir, 'subdir', 'secrets.json')

  test('throws on empty path', () => {
    expect(() => new FileStorageBackend('')).toThrow('Storage file path cannot be empty')
  })

  test('stores and retrieves key-value pairs atomically with 0o600 permissions', async () => {
    const backend = new FileStorageBackend(testFile)

    expect(await backend.getItem('key1')).toBeNull()
    expect(await backend.keys()).toEqual([])

    await backend.setItem('key1', 'value1')
    await backend.setItem('key2', 'value2')

    expect(await backend.getItem('key1')).toBe('value1')
    expect(await backend.getItem('key2')).toBe('value2')
    expect((await backend.keys()).sort()).toEqual(['key1', 'key2'])

    // Verify file permissions on POSIX
    if (process.platform !== 'win32') {
      const stat = await fs.stat(testFile)
      expect(stat.mode & 0o777).toBe(0o600)
    }

    // Re-instantiate from existing file
    const backend2 = new FileStorageBackend(testFile)
    expect(await backend2.getItem('key1')).toBe('value1')
    expect(await backend2.getItem('key2')).toBe('value2')

    // Remove item
    expect(await backend2.removeItem('key1')).toBe(true)
    expect(await backend2.getItem('key1')).toBeNull()
    expect(await backend2.removeItem('nonexistent')).toBe(false)
  })

  test('throws decryptionFailed on corrupted storage file', async () => {
    const corruptDir = path.join(os.tmpdir(), `knishio-js-corrupt-${Date.now()}`)
    const corruptFile = path.join(corruptDir, 'bad.json')
    await fs.mkdir(corruptDir, { recursive: true })
    await fs.writeFile(corruptFile, '{ invalid json: bad', 'utf8')

    const backend = new FileStorageBackend(corruptFile)
    await expect(backend.getItem('key')).rejects.toThrow('Corrupted storage file format')

    await fs.rm(corruptDir, { recursive: true, force: true })
  })
})

describe('WebStorageBackend', () => {
  function createMockStorage () {
    const map = new Map()
    return {
      getItem: (key) => map.get(key) ?? null,
      setItem: (key, value) => { map.set(key, value) },
      removeItem: (key) => { map.delete(key) },
      clear: () => { map.clear() },
      key: (index) => Array.from(map.keys())[index] ?? null,
      get length () { return map.size }
    }
  }

  test('wraps Storage and filters keys by prefix', () => {
    const mockStorage = createMockStorage()
    mockStorage.setItem('knishio:secret:1', 'secret1')
    mockStorage.setItem('knishio:recovery:1', 'recovery1')
    mockStorage.setItem('other:app:data', 'ignore-me')

    const backend = new WebStorageBackend(mockStorage)

    expect(backend.getItem('knishio:secret:1')).toBe('secret1')
    expect(backend.getItem('other:app:data')).toBe('ignore-me')

    const keys = backend.keys()
    expect(keys.sort()).toEqual(['knishio:recovery:1', 'knishio:secret:1'])
    expect(keys.includes('other:app:data')).toBe(false)

    expect(backend.removeItem('knishio:secret:1')).toBe(true)
    expect(backend.getItem('knishio:secret:1')).toBeNull()
    expect(backend.removeItem('nonexistent')).toBe(false)
  })

  test('allows custom prefix or empty prefix', () => {
    const mockStorage = createMockStorage()
    mockStorage.setItem('custom:1', 'c1')
    mockStorage.setItem('other:2', 'o2')

    const backend = new WebStorageBackend(mockStorage, 'custom:')
    expect(backend.keys()).toEqual(['custom:1'])

    const allBackend = new WebStorageBackend(mockStorage, '')
    expect(allBackend.keys().sort()).toEqual(['custom:1', 'other:2'])
  })
})

describe('Secret Recovery Workflow', () => {
  test('stores recovery envelope and recovers successfully in WebCryptoSecretStorageProvider', async () => {
    const backend = new MemoryStorageBackend()
    const provider = new WebCryptoSecretStorageProvider({
      backend,
      defaultPassphrase: 'primary-passphrase'
    })

    const bundle = 'bundle-recovery-test'
    const secret = 'ultra-secure-master-secret'

    await provider.storeSecret(bundle, secret, {
      recoveryPassphrase: 'backup-recovery-pass'
    })

    // Primary envelope exists
    expect(await backend.getItem(`${SECRET_KEY_PREFIX}${bundle}`)).not.toBeNull()
    // Recovery envelope exists
    expect(await backend.getItem(`${RECOVERY_KEY_PREFIX}${bundle}`)).not.toBeNull()

    // listSecrets only lists primary, not recovery
    const list = await provider.listSecrets()
    expect(list.length).toBe(1)
    expect(list[0]?.bundleHash).toBe(bundle)

    // Simulate corrupting or wiping the primary record
    await backend.setItem(`${SECRET_KEY_PREFIX}${bundle}`, 'corrupted-data')
    await expect(provider.retrieveSecret(bundle)).rejects.toThrow()

    // Recover secret using recovery passphrase
    await provider.recoverSecret(bundle, 'backup-recovery-pass')

    // Direct retrieve now succeeds with primary passphrase
    const retrieved = await provider.retrieveSecret(bundle)
    expect(retrieved).toBe(secret)

    // Delete secret deletes both primary and recovery records
    await provider.deleteSecret(bundle)
    expect(await backend.getItem(`${SECRET_KEY_PREFIX}${bundle}`)).toBeNull()
    expect(await backend.getItem(`${RECOVERY_KEY_PREFIX}${bundle}`)).toBeNull()
  })

  test('recovers secret in MemorySecretStorageProvider', async () => {
    const provider = new MemorySecretStorageProvider()
    const bundle = 'mem-bundle-rec'
    const secret = 'mem-secret-value'

    await provider.storeSecret(bundle, secret, {
      recoveryPassphrase: 'mem-recovery-pass'
    })

    // Directly overwrite secret in memory to corrupt it
    await provider.recoverSecret(bundle, 'mem-recovery-pass')
    expect(await provider.retrieveSecret(bundle)).toBe(secret)
  })

  test('fails recoverSecret with wrong recovery passphrase or missing bundle', async () => {
    const backend = new MemoryStorageBackend()
    const provider = new WebCryptoSecretStorageProvider({
      backend,
      defaultPassphrase: 'pass'
    })

    await provider.storeSecret('bundleX', 'secretX', {
      recoveryPassphrase: 'correct-pass'
    })

    await expect(
      provider.recoverSecret('bundleX', 'wrong-pass')
    ).rejects.toThrow(SecretStorageException)

    await expect(
      provider.recoverSecret('missing-bundle', 'correct-pass')
    ).rejects.toThrow(SecretStorageException)
  })
})
