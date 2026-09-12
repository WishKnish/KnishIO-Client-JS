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
import { zeroizeBytes } from '../libraries/secureMemory.js'

export const ENVELOPE_ALGORITHM = 'AES-GCM'
export const DEFAULT_ITERATIONS = 100000
const GCM_IV_LENGTH = 12
const SALT_LENGTH = 16

const textEncoder = new TextEncoder()

/**
 * Helper to convert Uint8Array to base64
 *
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function uint8ArrayToBase64 (bytes) {
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
export function base64ToUint8Array (base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * Derive an AES-GCM CryptoKey from a passphrase and salt using PBKDF2
 *
 * @param {string} passphrase
 * @param {Uint8Array} salt
 * @param {number} [iterations]
 * @returns {Promise<CryptoKey>}
 */
export async function deriveEnvelopeKey (passphrase, salt, iterations = DEFAULT_ITERATIONS) {
  if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.subtle === 'undefined') {
    throw new SecretStorageException('WebCrypto API is not available')
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
 * Seal a secret string into an EncryptedSecretPayload envelope
 *
 * @param {string} secret
 * @param {string} passphrase
 * @param {object} metadata
 * @returns {Promise<object>}
 */
export async function sealEnvelope (secret, passphrase, metadata) {
  if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.subtle === 'undefined') {
    throw new SecretStorageException('WebCrypto API is not available')
  }

  const salt = new Uint8Array(SALT_LENGTH)
  const iv = new Uint8Array(GCM_IV_LENGTH)
  globalThis.crypto.getRandomValues(salt)
  globalThis.crypto.getRandomValues(iv)

  const key = await deriveEnvelopeKey(passphrase, salt, DEFAULT_ITERATIONS)
  const secretBytes = textEncoder.encode(secret)

  try {
    const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
      {
        name: ENVELOPE_ALGORITHM,
        iv
      },
      key,
      secretBytes
    )

    const ciphertext = uint8ArrayToBase64(new Uint8Array(encryptedBuffer))
    return {
      version: 1,
      ciphertext,
      iv: uint8ArrayToBase64(iv),
      salt: uint8ArrayToBase64(salt),
      algorithm: ENVELOPE_ALGORITHM,
      iterations: DEFAULT_ITERATIONS,
      metadata
    }
  } finally {
    zeroizeBytes(secretBytes)
  }
}

/**
 * Open an EncryptedSecretPayload envelope with a passphrase, returning the decrypted secret bytes
 *
 * @param {object} payload
 * @param {string} passphrase
 * @returns {Promise<Uint8Array>}
 */
export async function openEnvelope (payload, passphrase) {
  if (typeof globalThis.crypto === 'undefined' || typeof globalThis.crypto.subtle === 'undefined') {
    throw new SecretStorageException('WebCrypto API is not available')
  }

  const salt = base64ToUint8Array(payload.salt)
  const iv = base64ToUint8Array(payload.iv)
  const ciphertext = base64ToUint8Array(payload.ciphertext)

  const key = await deriveEnvelopeKey(passphrase, salt, payload.iterations ?? DEFAULT_ITERATIONS)
  const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
    {
      name: ENVELOPE_ALGORITHM,
      iv
    },
    key,
    ciphertext
  )

  return new Uint8Array(decryptedBuffer)
}
