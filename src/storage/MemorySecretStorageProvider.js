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
import { withSecureString } from '../libraries/secureMemory.js'

/**
 * In-memory secret storage provider
 * Used for testing, headless runners, and backward-compatible fallback
 */
export default class MemorySecretStorageProvider {
  constructor () {
    this.providerType = 'memory'
    this.secrets = new Map()
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
  }
}
