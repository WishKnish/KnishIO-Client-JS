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

export { default as MemorySecretStorageProvider } from './MemorySecretStorageProvider.js'
export {
  default as WebCryptoSecretStorageProvider,
  MemoryStorageBackend
} from './WebCryptoSecretStorageProvider.js'

import MemorySecretStorageProvider from './MemorySecretStorageProvider.js'
import WebCryptoSecretStorageProvider from './WebCryptoSecretStorageProvider.js'

/**
 * Factory function to create a secret storage provider
 *
 * @param {{ type?: 'webcrypto'|'memory', defaultPassphrase?: string, backend?: object, hardwareBacked?: boolean }} [options]
 * @returns {object}
 */
export function createDefaultSecretStorage (options = {}) {
  if (options.type === 'memory') {
    return new MemorySecretStorageProvider()
  }

  // Default to WebCrypto if available
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.subtle !== 'undefined') {
    return new WebCryptoSecretStorageProvider({
      backend: options.backend,
      defaultPassphrase: options.defaultPassphrase,
      hardwareBacked: options.hardwareBacked
    })
  }

  return new MemorySecretStorageProvider()
}
