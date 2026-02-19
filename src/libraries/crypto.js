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
import { randomString } from './strings.js'
import JsSHA from 'jssha'

/**
 * Generates a secret based on an optional seed
 *
 * @param seed
 * @param length
 * @return {string|*}
 */
export function generateSecret (seed = null, length = 2048) {
  // console.info(`Crypto::generateSecret() - Computing new secret${ seed ? ' from existing seed' : '' }...`)
  if (seed) {
    const sponge = new JsSHA('SHAKE256', 'TEXT')
    sponge.update(seed)
    // Fix: outputLen is in BITS, so for 'length' hex chars (length/2 bytes), we need length*2 bits
    return sponge.getHash('HEX', { outputLen: length * 2 })
  } else {
    return randomString(length)
  }
}

/**
 * Hashes the user secret to produce a bundle hash
 *
 * @param {string} secret
 * @param {string|null} source
 * @return {string}
 */
export function generateBundleHash (secret, source = null) {
  const sponge = new JsSHA('SHAKE256', 'TEXT')
  sponge.update(secret)
  return sponge.getHash('HEX', { outputLen: 64 * 4 }) // 64 bytes = 512 bits
}

/**
 * SHAKE256 hash function
 *
 * @param {string} input - The input string to hash
 * @param {number} outputLength - The desired output length in bits
 * @return {string} The hex-encoded hash
 */
export function shake256 (input, outputLength) {
  const sponge = new JsSHA('SHAKE256', 'TEXT')
  sponge.update(input)
  return sponge.getHash('HEX', { outputLen: outputLength })
}

/**
 * Returns a new batch ID for stackable tokens
 *
 * @param {string|null} molecularHash
 * @param {number|null} index
 *
 * @return {string}
 */
export function generateBatchId ({
  molecularHash = null,
  index = null
}) {
  if (molecularHash !== null && index !== null) {
    return generateBundleHash(String(molecularHash) + String(index), 'generateBatchId')
  }

  return randomString(64)
}
