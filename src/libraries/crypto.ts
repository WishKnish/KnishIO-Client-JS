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
 */
export function generateSecret (seed: string = null, length: number = 2048): string {
  // console.info(`Crypto::generateSecret() - Computing new secret${ seed ? ' from existing seed' : '' }...`)
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
 */
export function generateBundleHash (secret: string): string {
  const sponge = new JsSHA('SHAKE256', 'TEXT')
  sponge.update(secret)
  return sponge.getHash('HEX', { outputLen: 256 })
}

/**
 * Returns a new batch ID for stackable tokens
 */
export function generateBatchId ({
  molecularHash = null as string | null,
  index = null as number | null
}): string {
  if (molecularHash !== null && index !== null) {
    return generateBundleHash(String(molecularHash) + String(index))
  }

  return randomString(64)
}
