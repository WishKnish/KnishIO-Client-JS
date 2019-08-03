import { bufferToHexString, hexStringToBuffer } from './strings';
import { shake256 } from 'js-sha3';
import eccrypto from 'eccrypto';
import {
  decodeUTF8,
  encodeUTF8
} from 'tweetnacl-util';

/**
 * Encrypts the given message or data with the recipient's public key
 *
 * @param message
 * @param recipientPublicKey
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function encryptMessage ( message, recipientPublicKey ) {
  const encodedMessage = decodeUTF8( JSON.stringify( message ) );
  return eccrypto.encrypt( recipientPublicKey, encodedMessage, {} )
    .then( function ( encryptedMessage ) {
      // Converting buffer array to hex
      Object.keys( encryptedMessage ).forEach( function ( key ) {
        encryptedMessage[ key ] = bufferToHexString( encryptedMessage[ key ] );
      } );
      return JSON.stringify( encryptedMessage );
    } );
}

/**
 * Uses the given private key to decrypt an encrypted message
 *
 * @param message
 * @param recipientPrivateKey
 * @returns {*}
 */
export function decryptMessage ( message, recipientPrivateKey ) {
  const encryptedMessage = JSON.parse( message );
  // Converting hex back into buffer array
  Object.keys( encryptedMessage ).forEach( function ( key ) {
    encryptedMessage[ key ] = hexStringToBuffer( encryptedMessage[ key ] );
  } );

  return eccrypto.decrypt( recipientPrivateKey, {
    iv: encryptedMessage.iv,
    ephemPublicKey: encryptedMessage.ephemPublicKey,
    ciphertext: encryptedMessage.ciphertext,
    mac: encryptedMessage.mac,
  } )
    .then( function ( decrypted ) {
        return JSON.parse( encodeUTF8( decrypted ) );
      }
    );
}

/**
 * Derives a private key for encrypting data with the given key
 *
 * @param key
 * @returns {Buffer}
 */
export function generateEncPrivateKey ( key ) {
  const sponge = shake256.create( 128 );
  sponge.update( key );
  return Buffer.from( sponge.hex() );
}

/**
 * Derives a public key for encrypting data for this wallet's consumption
 *
 * @param privateKey
 * @returns {Buffer}
 */
export function generateEncPublicKey ( privateKey ) {
  return eccrypto.getPublic( privateKey );
}

/**
 * Creates a shared key by combining this wallet's private key and another wallet's public key
 *
 * @param privateKey
 * @param otherPublicKey
 * @returns {*|Promise<unknown>|Promise|Promise}
 */
export function generateEncSharedKey ( privateKey, otherPublicKey ) {
  return eccrypto.derive( privateKey, otherPublicKey );
}
