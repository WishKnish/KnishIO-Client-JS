/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                            (//////////(                      (////)
                            (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/

import SecretStorageException from '../exception/SecretStorageException.js'
import { zeroizeBytes, withSecureBytes } from '../libraries/secureMemory.js'
import {
  sealEnvelope,
  openEnvelope,
  uint8ArrayToBase64,
  base64ToUint8Array,
  SECRET_KEY_PREFIX,
  RECOVERY_KEY_PREFIX
} from './secretEnvelope.js'

const KEY_PREFIX = SECRET_KEY_PREFIX
const GCM_IV_LENGTH = 12

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

/**
 * In-memory key store for tests and non-browser environments
 */
export class MemoryKeyStore {
  constructor () {
    this.keys = new Map()
  }

  async get (name) {
    return this.keys.get(name)
  }

  async put (name, key) {
    this.keys.set(name, key)
  }

  async delete (name) {
    return this.keys.delete(name)
  }
}

/**
 * IndexedDB key store for browser environments
 */
export class IndexedDbKeyStore {
  constructor (dbName = 'knishio-secret-storage') {
    this.dbName = dbName
    this.storeName = 'keys'
  }

  async getDb () {
    if (typeof globalThis.indexedDB === 'undefined') {
      throw SecretStorageException.unavailable(
        'webcrypto-nonextractable',
        'IndexedDB is not available'
      )
    }

    return new Promise((resolve, reject) => {
      const request = globalThis.indexedDB.open(this.dbName, 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get (name) {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly')
      const store = tx.objectStore(this.storeName)
      const request = store.get(name)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async put (name, key) {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.put(key, name)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async delete (name) {
    const db = await this.getDb()
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite')
      const store = tx.objectStore(this.storeName)
      const request = store.delete(name)
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }
}

/**
 * Secret storage provider backed by a non-extractable CryptoKey stored in IndexedDB.
 * The KEK cannot be exported from the browser's WebCrypto context.
 */
export default class NonExtractableKeySecretStorageProvider {
  /**
   * @param {object} options
   * @param {object} options.backend
   * @param {object} [options.keyStore]
   * @param {string} [options.alias]
   */
  constructor (options) {
    this.providerType = 'webcrypto-nonextractable'
    this.backend = options.backend
    this.keyStore = options.keyStore || new IndexedDbKeyStore()
    this.alias = options.alias || 'default'
    this.cachedPassphrase = undefined
  }

  get recordKey () {
    return `knishio:kek:webcrypto-nonextractable:${this.alias}`
  }

  get kekStoreKey () {
    return `knishio:kek:${this.alias}`
  }

  isHardwareBacked () {
    // Non-extractable WebCrypto keys prevent JS extraction, but are not verified
    // hardware-enclave keys.
    return false
  }

  async isAvailable () {
    return (
      typeof globalThis.crypto !== 'undefined' &&
      typeof globalThis.crypto.subtle !== 'undefined'
    )
  }

  /**
   * Unlock or initialize the device passphrase using the non-extractable KEK
   */
  async unlock () {
    if (this.cachedPassphrase) {
      return this.cachedPassphrase
    }

    if (!await this.isAvailable()) {
      throw SecretStorageException.unavailable(
        this.providerType,
        'WebCrypto API is not available'
      )
    }

    const rawRecord = await this.backend.getItem(this.recordKey)
    if (!rawRecord) {
      // First use: create non-extractable KEK and wrap new device passphrase
      let kek = await this.keyStore.get(this.kekStoreKey)
      if (!kek) {
        kek = await globalThis.crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt', 'decrypt']
        )
        await this.keyStore.put(this.kekStoreKey, kek)
      }

      const devicePassphraseBytes = new Uint8Array(32)
      globalThis.crypto.getRandomValues(devicePassphraseBytes)
      const devicePassphrase = uint8ArrayToBase64(devicePassphraseBytes)

      const iv = new Uint8Array(GCM_IV_LENGTH)
      globalThis.crypto.getRandomValues(iv)

      const passphraseBytes = textEncoder.encode(devicePassphrase)
      try {
        const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
          {
            name: 'AES-GCM',
            iv
          },
          kek,
          passphraseBytes
        )

        const record = {
          version: 1,
          iv: uint8ArrayToBase64(iv),
          ciphertext: uint8ArrayToBase64(new Uint8Array(encryptedBuffer))
        }

        await this.backend.setItem(this.recordKey, JSON.stringify(record))
        this.cachedPassphrase = devicePassphrase
        return devicePassphrase
      } finally {
        zeroizeBytes(passphraseBytes)
        zeroizeBytes(devicePassphraseBytes)
      }
    }

    // Subsequent use: unwrap device passphrase with stored KEK
    let record
    try {
      record = JSON.parse(rawRecord)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted key record format')
    }

    const kek = await this.keyStore.get(this.kekStoreKey)
    if (!kek) {
      throw SecretStorageException.unavailable(
        this.providerType,
        `no non-extractable key found for alias '${this.alias}'`
      )
    }

    const iv = base64ToUint8Array(record.iv)
    const ciphertext = base64ToUint8Array(record.ciphertext)

    try {
      const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        kek,
        ciphertext
      )

      const decryptedBytes = new Uint8Array(decryptedBuffer)
      try {
        this.cachedPassphrase = textDecoder.decode(decryptedBytes)
        return this.cachedPassphrase
      } finally {
        zeroizeBytes(decryptedBytes)
      }
    } catch {
      throw SecretStorageException.decryptionFailed(
        'wrapped device passphrase failed authentication under non-extractable key'
      )
    }
  }

  /**
   * Lock the provider by clearing cached passphrase material
   */
  lock () {
    this.cachedPassphrase = undefined
  }

  /**
   * Unenroll the non-extractable key, removing the stored wrapped record and KEK
   *
   * @returns {Promise<void>}
   */
  async unenroll () {
    this.lock()
    await this.backend.removeItem(this.recordKey)
    await this.keyStore.delete(this.kekStoreKey)
  }

  async storeSecret (bundleHash, secret, options = {}) {
    if (!bundleHash) {
      throw new SecretStorageException('Bundle hash cannot be empty')
    }
    if (!secret) {
      throw new SecretStorageException('Secret cannot be empty')
    }
    if (options.passphrase) {
      throw new SecretStorageException(
        'NonExtractableKeySecretStorageProvider derives its passphrase from the non-extractable device key; options.passphrase is not accepted'
      )
    }

    if (!options.recoveryPassphrase && !options.allowUnrecoverable) {
      throw SecretStorageException.validationError(
        'Recovery passphrase required for non-exportable hardware key unless allowUnrecoverable is true'
      )
    }

    const passphrase = await this.unlock()
    const metadata = {
      bundleHash,
      label: options.label,
      createdAt: Date.now(),
      hardwareBacked: false,
      providerType: this.providerType
    }

    const payload = await sealEnvelope(secret, passphrase, metadata)
    await this.backend.setItem(`${KEY_PREFIX}${bundleHash}`, JSON.stringify(payload))

    if (options.recoveryPassphrase) {
      const recoveryMetadata = {
        bundleHash,
        label: options.label,
        createdAt: Date.now(),
        hardwareBacked: false,
        providerType: 'webcrypto-aes-gcm'
      }
      const recoveryPayload = await sealEnvelope(secret, options.recoveryPassphrase, recoveryMetadata)
      await this.backend.setItem(`${RECOVERY_KEY_PREFIX}${bundleHash}`, JSON.stringify(recoveryPayload))
    }
  }

  async retrieveSecret (bundleHash, options = {}) {
    if (options.passphrase) {
      throw new SecretStorageException(
        'NonExtractableKeySecretStorageProvider derives its passphrase from the non-extractable device key; options.passphrase is not accepted'
      )
    }

    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    if (!raw) {
      return null
    }

    let payload
    try {
      payload = JSON.parse(raw)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted payload format')
    }

    const passphrase = await this.unlock()
    try {
      const decryptedBytes = await openEnvelope(payload, passphrase)
      try {
        return textDecoder.decode(decryptedBytes)
      } finally {
        zeroizeBytes(decryptedBytes)
      }
    } catch (err) {
      if (err instanceof SecretStorageException) {
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      throw SecretStorageException.decryptionFailed(msg)
    }
  }

  async withSecret (bundleHash, fn, options = {}) {
    if (options.passphrase) {
      throw new SecretStorageException(
        'NonExtractableKeySecretStorageProvider derives its passphrase from the non-extractable device key; options.passphrase is not accepted'
      )
    }

    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    if (!raw) {
      throw SecretStorageException.notFound(bundleHash)
    }

    let payload
    try {
      payload = JSON.parse(raw)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted payload format')
    }

    const passphrase = await this.unlock()
    try {
      const decryptedBytes = await openEnvelope(payload, passphrase)
      return await withSecureBytes(decryptedBytes, async (bytes) => {
        const secretString = textDecoder.decode(bytes)
        return await fn(secretString)
      })
    } catch (err) {
      if (err instanceof SecretStorageException) {
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      throw SecretStorageException.decryptionFailed(msg)
    }
  }

  async deleteSecret (bundleHash) {
    const key = `${KEY_PREFIX}${bundleHash}`
    const recoveryKey = `${RECOVERY_KEY_PREFIX}${bundleHash}`
    const result = await this.backend.removeItem(key)
    await this.backend.removeItem(recoveryKey)
    return result !== false
  }

  async hasSecret (bundleHash) {
    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    return raw !== null
  }

  async listSecrets () {
    const keys = await this.backend.keys()
    const matchingKeys = keys.filter(k => k.startsWith(KEY_PREFIX) && !k.startsWith(RECOVERY_KEY_PREFIX))
    const results = []

    for (const key of matchingKeys) {
      const raw = await this.backend.getItem(key)
      if (raw) {
        try {
          const payload = JSON.parse(raw)
          if (payload.metadata) {
            results.push(payload.metadata)
          }
        } catch {
          // Ignore unparseable entries
        }
      }
    }

    return results
  }

  /**
   * Recover a secret using its recovery envelope and re-enroll it under a fresh non-extractable KEK
   *
   * @param {string} bundleHash
   * @param {string} recoveryPassphrase
   * @param {{ label?: string }} [options]
   * @returns {Promise<void>}
   */
  async recoverSecret (bundleHash, recoveryPassphrase, options = {}) {
    if (!bundleHash) {
      throw new SecretStorageException('Bundle hash cannot be empty')
    }
    if (!recoveryPassphrase) {
      throw new SecretStorageException('Recovery passphrase cannot be empty')
    }

    const raw = await this.backend.getItem(`${RECOVERY_KEY_PREFIX}${bundleHash}`)
    if (!raw) {
      throw SecretStorageException.notFound(bundleHash)
    }

    let payload
    try {
      payload = JSON.parse(raw)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted recovery payload format')
    }

    let decryptedBytes
    try {
      decryptedBytes = await openEnvelope(payload, recoveryPassphrase)
    } catch (err) {
      if (err instanceof SecretStorageException) {
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      throw SecretStorageException.decryptionFailed(msg)
    }

    let secretStr
    try {
      secretStr = textDecoder.decode(decryptedBytes)
    } finally {
      zeroizeBytes(decryptedBytes)
    }

    await this.storeSecret(bundleHash, secretStr, {
      ...options,
      recoveryPassphrase
    })
  }
}
