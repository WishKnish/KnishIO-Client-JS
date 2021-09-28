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
import { shake256 } from 'js-sha3';
import { randomString } from './strings';
import Soda from './../libraries/Soda';

/**
 * Generates a secret based on an optional seed
 *
 * @param seed
 * @param length
 * @return {string|*}
 */
export function generateSecret ( seed = null, length = 2048 ) {

  console.info( `Crypto::generateSecret() - Computing new secret${ seed ? ' from existing seed' : '' }...` );

  if ( seed ) {

    const sponge = shake256.create( length * 2 );

    sponge.update( seed );

    return sponge.hex();

  } else {

    return randomString( length );

  }
}

/**
 * Hashes the user secret to produce a bundle hash
 *
 * @param {string} secret
 * @return {string}
 */
export function generateBundleHash ( secret ) {

  console.info( 'Crypto::generateBundleHash() - Computing wallet bundle from secret...' );

  const sponge = shake256.create( 256 );
  sponge.update( secret );
  return sponge.hex();

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
    return generateBundleHash( String( molecularHash ) + String( index ) );
  }

  return randomString( 64 );
}


/**
 * Generate wallet position
 *
 * @return {string}
 */
export function generateWalletPosition ( saltLength = 64 ) {
  return randomString( saltLength, 'abcdef0123456789' );
}

/**
 * Encrypts the given message or data with the recipient's public key
 *
 * @param message
 * @param {string} recipientPublicKey
 * @param {string|null} characters
 * @return {string}
 */
export function encryptMessage ( message, recipientPublicKey, characters = null ) {
  return ( new Soda( characters ) ).encrypt( message, recipientPublicKey );
}

/**
 * Uses the given private key to decrypt an encrypted message
 *
 * @param {string} message
 * @param {string} privateKey
 * @param {string} publicKey
 * @param {string|null} characters
 * @return {array|object|null}
 */
export function decryptMessage ( message, privateKey, publicKey, characters = null ) {
  return ( new Soda( characters ) ).decrypt( message, privateKey, publicKey );
}

/**
 * Derives a private key for encrypting data with the given key
 *
 * @param {string} key
 * @param {string|null} characters
 * @return {string}
 */
export function generateEncPrivateKey ( key, characters = null ) {
  return ( new Soda( characters ) ).generatePrivateKey( key );
}

/**
 * Derives a public key for encrypting data for this wallet's consumption
 *
 * @param {string} privateKey
 * @param {string|null} characters
 * @return {string}
 */
export function generateEncPublicKey ( privateKey, characters = null ) {
  return ( new Soda( characters ) ).generatePublicKey( privateKey );
}

/**
 *
 * @param {string} key
 * @param {string|null} characters
 * @return {string}
 */
export function hashShare ( key, characters = null ) {
  return ( new Soda( characters ) ).shortHash( key );
}
