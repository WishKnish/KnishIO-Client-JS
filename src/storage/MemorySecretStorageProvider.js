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
import { withSecureString, zeroizeBytes } from '../libraries/secureMemory.js'
import { sealEnvelope, openEnvelope } from './secretEnvelope.js'

/**
 * In-memory secret storage provider
 * Used for testing, headless runners, and backward-compatible fallback
 */
export default class MemorySecretStorageProvider {
  constructor () {
    this.providerType = 'memory'
    this.secrets = new Map()
    this.recoverySecrets = new Map()
  }

  /**
   * Memory storage is not hardware backed
   *
   * @returns {boolean}
   */
  isHardwareBacked () {
    return false
  }

  /**
   * Memory storage is always available
   *
   * @returns {Promise<boolean>}
   */
  async isAvailable () {
    return true
  }

  /**
   * Store a secret in memory
   *
   * @param {string} bundleHash
   * @param {string} secret
   * @param {{ label?: string }} [options]
   * @returns {Promise<void>}
   */
  async storeSecret (bundleHash, secret, options = {}) {
    if (!bundleHash) {
      throw new SecretStorageException('Bundle hash cannot be empty')
    }
    if (!secret) {
      throw new SecretStorageException('Secret cannot be empty')
    }

    const metadata = {
      bundleHash,
      label: options.label,
      createdAt: Date.now(),
      hardwareBacked: false,
      providerType: this.providerType
    }

    this.secrets.set(bundleHash, { secret, metadata })

    if (options.recoveryPassphrase) {
      const recoveryMetadata = {
        bundleHash,
        label: options.label,
        createdAt: Date.now(),
        hardwareBacked: false,
        providerType: 'webcrypto-aes-gcm'
      }
      const recoveryPayload = await sealEnvelope(secret, options.recoveryPassphrase, recoveryMetadata)
      this.recoverySecrets.set(bundleHash, JSON.stringify(recoveryPayload))
    }
  }

  /**
   * Retrieve a secret from memory
   *
   * @param {string} bundleHash
   * @returns {Promise<string|null>}
   */
  async retrieveSecret (bundleHash) {
    const entry = this.secrets.get(bundleHash)
    return entry ? entry.secret : null
  }

  /**
   * Delete a stored secret
   *
   * @param {string} bundleHash
   * @returns {Promise<boolean>}
   */
  async deleteSecret (bundleHash) {
    this.recoverySecrets.delete(bundleHash)
    return this.secrets.delete(bundleHash)
  }

  /**
   * Check if a secret exists
   *
   * @param {string} bundleHash
   * @returns {Promise<boolean>}
   */
  async hasSecret (bundleHash) {
    return this.secrets.has(bundleHash)
  }

  /**
   * List all stored secret metadata
   *
   * @returns {Promise<Array<{ bundleHash: string, label?: string, createdAt: number, hardwareBacked: boolean, providerType: string }>>}
   */
  async listSecrets () {
    return Array.from(this.secrets.values()).map(entry => ({ ...entry.metadata }))
  }

  /**
   * Execute callback with unwrapped secret and ensure cleanup
   *
   * @template T
   * @param {string} bundleHash
   * @param {(secret: string) => Promise<T>|T} fn
   * @returns {Promise<T>}
   */
  async withSecret (bundleHash, fn) {
    const entry = this.secrets.get(bundleHash)
    if (!entry) {
      throw SecretStorageException.notFound(bundleHash)
    }

    return withSecureString(entry.secret, fn)
  }

  /**
   * Clear all secrets from memory
   */
  clear () {
    this.secrets.clear()
    this.recoverySecrets.clear()
  }

  /**
   * Recover a secret using its recovery envelope and restore it
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

    const raw = this.recoverySecrets.get(bundleHash)
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
      secretStr = new TextDecoder().decode(decryptedBytes)
    } finally {
      zeroizeBytes(decryptedBytes)
    }

    await this.storeSecret(bundleHash, secretStr, {
      ...options,
      recoveryPassphrase
    })
  }
}
