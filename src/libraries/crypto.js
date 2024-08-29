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
import jsSHA from 'jssha'

/**
 * Generates a secret based on an optional seed
 *
 * @param seed
 * @param length
 * @return {string|*}
 */
export function generateSecret ( seed = null, length = 2048 ) {
  console.info( `Crypto::generateSecret() - Computing new secret${ seed ? ' from existing seed' : '' }...` )

  if ( seed ) {
    const sponge = new jsSHA( 'SHAKE256', 'TEXT' )
    sponge.update( seed )
    return sponge.getHash( 'HEX', { outputLen: length * 2 } )
  } else {
    return randomString( length )
  }
}

/**
 * Hashes the user secret to produce a bundle hash
 *
 * @param {string} secret
 * @param {string|null} source
 * @return {string}
 */
export function generateBundleHash ( secret, source = null ) {
  console.info( `Crypto::generateBundleHash(${ source ? `source: ${ source }` : '' }) - Computing wallet bundle from secret...` )

  const sponge = new jsSHA( 'SHAKE256', 'TEXT' )
  sponge.update( secret )
  return sponge.getHash( 'HEX', { outputLen: 256 } )
}

/**
 * Returns a new batch ID for stackable tokens
 *
 * @param {string|null} molecularHash
 * @param {number|null} index
 *
 * @return {string}
 */
export function generateBatchId ( {
  molecularHash = null,
  index = null
} ) {
  if ( molecularHash !== null && index !== null ) {
    return generateBundleHash( String( molecularHash ) + String( index ), 'generateBatchId' )
  }

  return randomString( 64 )
}
