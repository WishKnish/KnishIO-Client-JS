// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import {
  shake256,
} from 'js-sha3';
import {
  box,
  randomBytes,
  scalarMult,
} from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
} from 'tweetnacl-util';
import {
  bufferToHexString,
  hexStringToBuffer,
  randomString,
} from './strings';

/**
 * Generates a secret based on an optional seed
 *
 * @param seed
 * @param length
 * @returns {string|*}
 */
export function generateSecret ( seed = null, length = 2048 ) {

  if ( seed ) {

    const sponge = shake256.create( length * 2 );

    sponge.update( seed );

    return sponge.hex();
  }
  else {

    return randomString( length );

  }

}

/**
 * Hashes the user secret to produce a bundle hash
 *
 * @param {string} secret
 * @returns {string}
 */
export function generateBundleHash ( secret ) {

  const sponge = shake256.create( 256 );

  sponge.update( secret );

  return sponge.hex();

}

/**
 * Encrypts the given message or data with the recipient's public key
 *
 * @param message
 * @param {string} recipientPrivateKey
 * @returns {string}
 */
export function encryptMessage ( message, recipientPrivateKey ) {

  const jsonMessage = decodeUTF8( JSON.stringify( message ) ),
    nonce = randomBytes( box.nonceLength ),
    publicKey = generateEncPublicKey( recipientPrivateKey ),
    shared = generateEncSharedKey( recipientPrivateKey, publicKey ),
    noise = box.after(
      jsonMessage,
      nonce,
      box.before( hexStringToBuffer( publicKey ), hexStringToBuffer( shared ) )
    );

  return [
    bufferToHexString( nonce ),
    shared,
    bufferToHexString( noise )
  ].join('');

}

/**
 * Uses the given private key to decrypt an encrypted message
 *
 * @param {string} message
 * @param {string} recipientPublicKey
 * @returns {Array | Object | null}
 */
export function decryptMessage ( message, recipientPublicKey ) {

  let target = null;

  const cipher = hexStringToBuffer( message );

  if ( cipher.length > ( box.nonceLength + box.sharedKeyLength ) ) {

    const payload = box.open.after(
        cipher.slice( box.nonceLength + box.sharedKeyLength ),
        cipher.slice( 0, box.nonceLength ),
        box.before(
          hexStringToBuffer( recipientPublicKey ),
          cipher.slice( box.nonceLength, box.nonceLength + box.sharedKeyLength )
        )
      );

    target = payload === null ? null : JSON.parse( encodeUTF8( payload ) );

  }

  return target;

}

/**
 * Derives a private key for encrypting data with the given key
 *
 * @param key
 * @returns {string}
 */
export function generateEncPrivateKey ( key ) {

  const sponge = shake256.create( box.secretKeyLength * 8 );

  sponge.update( key );

  return sponge.hex();

}

/**
 * Derives a public key for encrypting data for this wallet's consumption
 *
 * @param {string} privateKey
 * @returns {string}
 */
export function generateEncPublicKey ( privateKey ) {

  const boxKey = box.keyPair.fromSecretKey(  hexStringToBuffer( privateKey ) );

  return bufferToHexString( boxKey.publicKey );

}

/**
 * Creates a shared key by combining this wallet's private key and another wallet's public key
 *
 * @param {string} privateKey
 * @param {string} otherPublicKey
 * @returns {string}
 */
export function generateEncSharedKey ( privateKey, otherPublicKey ) {

  return bufferToHexString(
      scalarMult(
          hexStringToBuffer( privateKey ),
          hexStringToBuffer( otherPublicKey )
      )
  );

}
