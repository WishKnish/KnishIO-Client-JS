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

/**
 * Memory hygiene and zeroization utilities for sensitive cryptographic material
 */

const textEncoder = new TextEncoder()

/**
 * Overwrite byte array contents with zeros
 *
 * @param {Uint8Array|number[]} buffer
 */
export function zeroizeBytes (buffer) {
  if (buffer instanceof Uint8Array) {
    buffer.fill(0)
  } else if (Array.isArray(buffer)) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = 0
    }
  }
}

/**
 * Execute a callback with a byte buffer and guarantee zeroization upon completion
 *
 * @template T
 * @param {Uint8Array} bytes
 * @param {(bytes: Uint8Array) => Promise<T>|T} fn
 * @returns {Promise<T>}
 */
export async function withSecureBytes (bytes, fn) {
  try {
    return await fn(bytes)
  } finally {
    zeroizeBytes(bytes)
  }
}

/**
 * Execute a callback with a secret string, ensuring temporary byte buffers are cleared
 *
 * @template T
 * @param {string} secret
 * @param {(cleanSecret: string) => Promise<T>|T} fn
 * @returns {Promise<T>}
 */
export async function withSecureString (secret, fn) {
  const bytes = textEncoder.encode(secret)
  try {
    return await fn(secret)
  } finally {
    zeroizeBytes(bytes)
  }
}

/**
 * Constant-time comparison of two byte arrays or strings to prevent timing attacks
 *
 * @param {Uint8Array|string} a
 * @param {Uint8Array|string} b
 * @returns {boolean}
 */
export function constantTimeCompare (a, b) {
  const bytesA = typeof a === 'string' ? textEncoder.encode(a) : a
  const bytesB = typeof b === 'string' ? textEncoder.encode(b) : b

  let result = bytesA.length === bytesB.length ? 0 : 1
  const len = Math.min(bytesA.length, bytesB.length)

  for (let i = 0; i < len; i++) {
    result |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0)
  }

  if (typeof a === 'string') zeroizeBytes(bytesA)
  if (typeof b === 'string') zeroizeBytes(bytesB)

  return result === 0
}
