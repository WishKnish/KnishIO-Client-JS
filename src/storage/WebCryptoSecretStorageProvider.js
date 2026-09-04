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

/**
 * Default in-memory backend for WebCrypto encrypted payloads
 */
export class MemoryStorageBackend {
  constructor () {
    this.store = new Map()
  }

  getItem (key) {
    return this.store.get(key) ?? null
  }

  setItem (key, value) {
    this.store.set(key, value)
  }

  removeItem (key) {
    return this.store.delete(key)
  }

  keys () {
    return Array.from(this.store.keys())
  }
}

/**
 * Helper to convert Uint8Array to base64
 *
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function uint8ArrayToBase64 (bytes) {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    const byte = bytes[i]
    if (byte !== undefined) {
      binary += String.fromCharCode(byte)
    }
  }
  return btoa(binary)
}

/**
 * Helper to convert base64 to Uint8Array
 *
 * @param {string} base64
 * @returns {Uint8Array}
 */
function base64ToUint8Array (base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const KEY_PREFIX = 'knishio:secret:'
const DEFAULT_ITERATIONS = 100000

/**
 * Hardware-compatible envelope encryption secret storage provider
 * Uses WebCrypto AES-GCM (256-bit) with PBKDF2-HMAC-SHA256 key derivation
 */
export default class WebCryptoSecretStorageProvider {
  /**
   * @param {{ backend?: object, defaultPassphrase?: string, hardwareBacked?: boolean }} [options]
   */
  constructor (options = {}) {
    this.providerType = 'webcrypto-aes-gcm'
    this.backend = options.backend || new MemoryStorageBackend()
    this.defaultPassphrase = options.defaultPassphrase
    this.hardwareBacked = options.hardwareBacked || false
  }

  /**
   * Whether this provider is backed by hardware
   *
   * @returns {boolean}
   */
  isHardwareBacked () {
    return this.hardwareBacked
  }

  /**
   * Check if WebCrypto subtle API is available
   *
   * @returns {Promise<boolean>}
   */
  async isAvailable () {
    return (
      typeof globalThis.crypto !== 'undefined' &&
      typeof globalThis.crypto.subtle !== 'undefined'
    )
  }

  /**
   * Derive an AES-GCM CryptoKey from a passphrase and salt using PBKDF2
   *
   * @param {string} passphrase
   * @param {Uint8Array} salt
   * @param {number} [iterations]
   * @returns {Promise<CryptoKey>}
   */
  async deriveKey (passphrase, salt, iterations = DEFAULT_ITERATIONS) {
    if (!await this.isAvailable()) {
      throw SecretStorageException.unavailable(this.providerType, 'WebCrypto API is not available')
    }

    const passphraseBytes = textEncoder.encode(passphrase)
    try {
      const baseKey = await globalThis.crypto.subtle.importKey(
        'raw',
        passphraseBytes,
        'PBKDF2',
        false,
        ['deriveKey']
      )

      return await globalThis.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations,
          hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      )
    } finally {
      zeroizeBytes(passphraseBytes)
    }
  }

  /**
   * Store and encrypt a master secret
   *
   * @param {string} bundleHash
   * @param {string} secret
   * @param {{ label?: string, passphrase?: string }} [options]
   * @returns {Promise<void>}
   */
  async storeSecret (bundleHash, secret, options = {}) {
    if (!bundleHash) {
      throw new SecretStorageException('Bundle hash cannot be empty')
    }
    if (!secret) {
      throw new SecretStorageException('Secret cannot be empty')
    }

    const passphrase = options.passphrase || this.defaultPassphrase
    if (!passphrase) {
      throw new SecretStorageException('Passphrase required for envelope encryption')
    }

    const salt = new Uint8Array(16)
    const iv = new Uint8Array(12)
    globalThis.crypto.getRandomValues(salt)
    globalThis.crypto.getRandomValues(iv)

    const key = await this.deriveKey(passphrase, salt, DEFAULT_ITERATIONS)
    const secretBytes = textEncoder.encode(secret)

    try {
      const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        secretBytes
      )

      const ciphertext = uint8ArrayToBase64(new Uint8Array(encryptedBuffer))
      const metadata = {
        bundleHash,
        label: options.label,
        createdAt: Date.now(),
        hardwareBacked: this.hardwareBacked,
        providerType: this.providerType
      }

      const payload = {
        version: 1,
        ciphertext,
        iv: uint8ArrayToBase64(iv),
        salt: uint8ArrayToBase64(salt),
        algorithm: 'AES-GCM',
        iterations: DEFAULT_ITERATIONS,
        metadata
      }

      await this.backend.setItem(`${KEY_PREFIX}${bundleHash}`, JSON.stringify(payload))
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new SecretStorageException(`Encryption failed: ${msg}`)
    } finally {
      zeroizeBytes(secretBytes)
    }
  }

  /**
   * Retrieve and decrypt the master secret
   *
   * @param {string} bundleHash
   * @param {{ passphrase?: string }} [options]
   * @returns {Promise<string|null>}
   */
  async retrieveSecret (bundleHash, options = {}) {
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

    const passphrase = options.passphrase || this.defaultPassphrase
    if (!passphrase) {
      throw new SecretStorageException('Passphrase required for secret decryption')
    }

    const salt = base64ToUint8Array(payload.salt)
    const iv = base64ToUint8Array(payload.iv)
    const ciphertext = base64ToUint8Array(payload.ciphertext)

    try {
      const key = await this.deriveKey(passphrase, salt, payload.iterations || DEFAULT_ITERATIONS)
      const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        ciphertext
      )

      const decryptedBytes = new Uint8Array(decryptedBuffer)
      try {
        return textDecoder.decode(decryptedBytes)
      } finally {
        zeroizeBytes(decryptedBytes)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw SecretStorageException.decryptionFailed(msg)
    }
  }

  /**
   * Delete a stored secret
   *
   * @param {string} bundleHash
   * @returns {Promise<boolean>}
   */
  async deleteSecret (bundleHash) {
    const key = `${KEY_PREFIX}${bundleHash}`
    const result = await this.backend.removeItem(key)
    return result !== false
  }

  /**
   * Check if a secret exists
   *
   * @param {string} bundleHash
   * @returns {Promise<boolean>}
   */
  async hasSecret (bundleHash) {
    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    return raw !== null
  }

  /**
   * List all stored secret metadata
   *
   * @returns {Promise<Array<{ bundleHash: string, label?: string, createdAt: number, hardwareBacked: boolean, providerType: string }>>}
   */
  async listSecrets () {
    const keys = await this.backend.keys()
    const matchingKeys = keys.filter(k => k.startsWith(KEY_PREFIX))
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
          // Ignore corrupted entries
        }
      }
    }

    return results
  }

  /**
   * Execute callback with unwrapped secret, zeroizing the decrypted buffer upon completion
   *
   * @template T
   * @param {string} bundleHash
   * @param {(secret: string) => Promise<T>|T} fn
   * @param {{ passphrase?: string }} [options]
   * @returns {Promise<T>}
   */
  async withSecret (bundleHash, fn, options = {}) {
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

    const passphrase = options.passphrase || this.defaultPassphrase
    if (!passphrase) {
      throw new SecretStorageException('Passphrase required for secret decryption')
    }

    const salt = base64ToUint8Array(payload.salt)
    const iv = base64ToUint8Array(payload.iv)
    const ciphertext = base64ToUint8Array(payload.ciphertext)

    try {
      const key = await this.deriveKey(passphrase, salt, payload.iterations || DEFAULT_ITERATIONS)
      const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        ciphertext
      )

      const decryptedBytes = new Uint8Array(decryptedBuffer)
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
}
