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

import BaseException from './BaseException.js'

/**
 * Exception thrown when secret storage or hardware envelope encryption fails
 */
export default class SecretStorageException extends BaseException {
  /**
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor (message = 'Secret storage operation failed', fileName = null, lineNumber = null) {
    super(message, fileName, lineNumber)
    this.name = 'SecretStorageException'
  }

  /**
   * Factory method: secret not found for bundle
   *
   * @param {string} bundleHash
   * @returns {SecretStorageException}
   */
  static notFound (bundleHash) {
    return new SecretStorageException(`Secret not found for bundle: ${bundleHash}`)
  }

  /**
   * Factory method: decryption failed
   *
   * @param {string} [reason]
   * @returns {SecretStorageException}
   */
  static decryptionFailed (reason = 'Invalid passphrase or corrupted ciphertext') {
    return new SecretStorageException(`Failed to decrypt master secret: ${reason}`)
  }

  /**
   * Factory method: provider unavailable
   *
   * @param {string} provider
   * @param {string} [reason]
   * @returns {SecretStorageException}
   */
  static unavailable (provider, reason = 'Hardware or API not accessible') {
    return new SecretStorageException(`Secret storage provider '${provider}' is unavailable: ${reason}`)
  }
}
