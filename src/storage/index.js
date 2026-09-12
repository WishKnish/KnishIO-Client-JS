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
export { default as FileStorageBackend } from './FileStorageBackend.js'
export { default as WebStorageBackend } from './WebStorageBackend.js'
export {
  default as WebAuthnPrfSecretStorageProvider,
  PRF_SALT_LABEL,
  KEK_INFO
} from './WebAuthnPrfSecretStorageProvider.js'
export {
  default as NonExtractableKeySecretStorageProvider,
  IndexedDbKeyStore,
  MemoryKeyStore
} from './NonExtractableKeySecretStorageProvider.js'
export {
  sealEnvelope,
  openEnvelope,
  uint8ArrayToBase64,
  base64ToUint8Array,
  deriveEnvelopeKey,
  ENVELOPE_ALGORITHM,
  DEFAULT_ITERATIONS,
  SECRET_KEY_PREFIX,
  RECOVERY_KEY_PREFIX
} from './secretEnvelope.js'

import MemorySecretStorageProvider from './MemorySecretStorageProvider.js'
import WebCryptoSecretStorageProvider from './WebCryptoSecretStorageProvider.js'

/**
 * Factory function to create a secret storage provider
 *
 * @param {{ type?: 'webcrypto'|'memory', defaultPassphrase?: string, backend?: object }} [options]
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
      defaultPassphrase: options.defaultPassphrase
    })
  }

  return new MemorySecretStorageProvider()
}
