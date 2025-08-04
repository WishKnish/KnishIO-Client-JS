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

import { randomString } from './strings'
import JsSHA from 'jssha'

/**
 * Generates a secret based on an optional seed
 * @param seed - Optional seed string for deterministic generation
 * @param length - Length of the generated secret (default: 2048)
 * @returns Generated secret string
 */
export function generateSecret (seed: string | null = null, length: number = 2048): string {
  if (seed) {
    const sponge = new JsSHA('SHAKE256', 'TEXT')
    sponge.update(seed)
    return sponge.getHash('HEX', { outputLen: length * 2 })
  } else {
    return randomString(length)
  }
}

/**
 * Hashes the user secret to produce a bundle hash
 * @param secret - User secret string
 * @param _source - Optional source identifier (currently unused)
 * @returns Bundle hash string
 */
export function generateBundleHash (secret: string, _source: string | null = null): string {
  const sponge = new JsSHA('SHAKE256', 'TEXT')
  sponge.update(secret)
  return sponge.getHash('HEX', { outputLen: 256 })
}

/**
 * Options for generating a batch ID
 */
interface BatchIdOptions {
  molecularHash?: string | null
  index?: number | null
}

/**
 * Returns a new batch ID for stackable tokens
 * @param options - Configuration for batch ID generation
 * @returns Generated batch ID string
 */
export function generateBatchId ({
  molecularHash = null,
  index = null
}: BatchIdOptions = {}): string {
  if (molecularHash !== null && index !== null) {
    return generateBundleHash(String(molecularHash) + String(index), 'generateBatchId')
  }

  return randomString(64)
}
