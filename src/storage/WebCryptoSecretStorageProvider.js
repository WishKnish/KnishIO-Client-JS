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
  deriveEnvelopeKey,
  DEFAULT_ITERATIONS,
  SECRET_KEY_PREFIX,
  RECOVERY_KEY_PREFIX
} from './secretEnvelope.js'

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

const textDecoder = new TextDecoder()
const KEY_PREFIX = SECRET_KEY_PREFIX

/**
 * Software envelope-encryption secret storage provider: WebCrypto AES-256-GCM with PBKDF2-HMAC-SHA256.
 * Writes the cross-SDK envelope format; never hardware-backed.
 */
export default class WebCryptoSecretStorageProvider {
  /**
   * @param {{ backend?: object, defaultPassphrase?: string }} [options]
   */
  constructor (options = {}) {
    this.providerType = 'webcrypto-aes-gcm'
    this.backend = options.backend || new MemoryStorageBackend()
    this.defaultPassphrase = options.defaultPassphrase
  }

  /**
   * True only when this provider holds a non-exportable key inside platform-secure
   * hardware (Android TEE/StrongBox, Secure Enclave, TPM) and learned that from the
   * platform itself — never from a caller argument. Software envelope providers
   * return false. The value is persisted as `metadata.hardwareBacked` in every
   * envelope this provider writes.
   *
   * @returns {boolean}
   */
  isHardwareBacked () {
    return false
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
    return await deriveEnvelopeKey(passphrase, salt, iterations)
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

    if (!await this.isAvailable()) {
      throw SecretStorageException.unavailable(this.providerType, 'WebCrypto API is not available')
    }

    try {
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
    } catch (err) {
      if (err instanceof SecretStorageException) {
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      throw new SecretStorageException(`Encryption failed: ${msg}`)
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
    if (!await this.isAvailable()) {
      throw SecretStorageException.unavailable(this.providerType, 'WebCrypto API is not available')
    }

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

  /**
   * Delete a stored secret
   *
   * @param {string} bundleHash
   * @returns {Promise<boolean>}
   */
  async deleteSecret (bundleHash) {
    const key = `${KEY_PREFIX}${bundleHash}`
    const recoveryKey = `${RECOVERY_KEY_PREFIX}${bundleHash}`
    const result = await this.backend.removeItem(key)
    await this.backend.removeItem(recoveryKey)
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

    if (!await this.isAvailable()) {
      throw SecretStorageException.unavailable(this.providerType, 'WebCrypto API is not available')
    }

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

  /**
   * Recover a secret using its recovery envelope and re-enroll it
   *
   * @param {string} bundleHash
   * @param {string} recoveryPassphrase
   * @param {{ label?: string, passphrase?: string }} [options]
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

    const storePassphrase = options.passphrase || this.defaultPassphrase || recoveryPassphrase
    await this.storeSecret(bundleHash, secretStr, {
      ...options,
      passphrase: storePassphrase,
      recoveryPassphrase
    })
  }
}
