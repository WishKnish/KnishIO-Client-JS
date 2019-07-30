// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import { shake256 } from 'js-sha3';
import bigInt from 'big-integer/BigInteger';
import { chunkSubstr, randomString, } from './libraries/strings';
import eccrypto from 'eccrypto';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from 'tweetnacl-util';

/**
 * class Wallet
 *
 * @property {string} position
 * @property {string} token
 * @property {string} key
 * @property {string} address
 * @property {number} balance
 * @property {Object} molecules
 * @property {string} bundle
 */
export default class Wallet {

  /**
   * @param {string} secret - typically a 2048-character biometric hash
   * @param {string} token - slug for the token this wallet is intended for
   * @param {string | null} position - hexadecimal string used to salt the secret and produce one-time signatures
   * @param {number} saltLength - length of the position parameter that should be generated if position is not provided
   */
  constructor ( secret, token = 'USER', position = null, saltLength = 64 ) {
    // Position via which (combined with token) we will generate the one-time keys
    this.position = position ? position : randomString( saltLength, 'abcdef0123456789' );
    this.token = token;
    this.key = Wallet.generateWalletKey( secret, this.token, this.position );
    this.address = Wallet.generateWalletAddress( this.key );
    this.balance = 0;
    this.molecules = {};
    this.bundle = Wallet.generateBundleHash( secret );
    this.pubkey = Wallet.generateEncPrivateKey( this.key );
  }

  /**
   * Derives a private key for encrypting data with this wallet's key
   *
   * @returns {Buffer}
   */
  getMyEncPrivateKey () {
    return Wallet.generateEncPrivateKey( this.key );
  }

  /**
   * Dervies a public key for encrypting data for this wallet's consumption
   *
   * @returns {Buffer}
   */
  getMyEncPublicKey () {
    return Wallet.generateEncPublicKey( this.getMyEncPrivateKey() )
  }

  /**
   * Creates a shared key by combining this wallet's private key and another wallet's public key
   *
   * @param otherPublicKey
   * @returns {*|Promise|Promise<unknown>}
   */
  getMyEncSharedKey ( otherPublicKey ) {
    return Wallet.generateEncSharedKey( this.getMyEncPrivateKey(), otherPublicKey );
  }

  /**
   * Uses the current wallet's private key to decrypt the given message
   *
   * @param message
   * @returns {*}
   */
  decryptMyMessage ( message ) {
    return Wallet.decryptMessage( message, this.getMyEncPrivateKey() );
  }

  /**
   * Encrypts the given message or data with the recipient's public key
   *
   * @param message
   * @param recipientPublicKey
   * @returns {PromiseLike<ArrayBuffer>}
   */
  static encryptMessage ( message, recipientPublicKey ) {
    const encodedMessage = decodeUTF8( JSON.stringify( message ) );
    return eccrypto.encrypt( recipientPublicKey, encodedMessage, {} )
      .then(function(encryptedMessage) {
        return encryptedMessage;
      });
  }

  /**
   * Uses the given private key to decrypt an encrypted message
   *
   * @param message
   * @param senderPrivateKey
   * @returns {*}
   */
  static decryptMessage ( message, senderPrivateKey ) {
    return eccrypto.decrypt( senderPrivateKey, {
      iv: message.iv,
      ephemPublicKey: message.ephemPublicKey,
      ciphertext: message.ciphertext,
      mac: message.mac,
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
  static generateEncPrivateKey ( key ) {
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
  static generateEncPublicKey ( privateKey ) {
    return eccrypto.getPublic( privateKey );
  }

  /**
   * Creates a shared key by combining this wallet's private key and another wallet's public key
   *
   * @param privateKey
   * @param otherPublicKey
   * @returns {*|Promise<unknown>|Promise|Promise}
   */
  static generateEncSharedKey ( privateKey, otherPublicKey ) {
    return eccrypto.derive( privateKey, otherPublicKey );
  }

  /**
   * Hashes the user secret to produce a wallet bundle
   *
   * @param {string} secret
   * @returns {string}
   */
  static generateBundleHash ( secret ) {
    return shake256.create( 256 ).update( secret ).hex();
  }

  /**
   *
   * @param {string} secret
   * @param {string} token
   * @param {string} position
   * @return {string}
   */
  static generateWalletKey ( secret, token, position ) {
    // Converting secret to bigInt
    const bigIntSecret = bigInt( secret, 16 ),
      // Adding new position to the user secret to produce the indexed key
      indexedKey = bigIntSecret.add( bigInt( position, 16 ) ),
      // Hashing the indexed key to produce the intermediate key
      intermediateKeySponge = shake256.create( 8192 );

    intermediateKeySponge.update( indexedKey.toString( 16 ) );

    if ( token ) {
      intermediateKeySponge.update( token );
    }
    // Hashing the intermediate key to produce the private key
    return shake256.create( 8192 ).update( intermediateKeySponge.hex() ).hex();
  }

  /**
   * @param {string} key
   * @return {string}
   */
  static generateWalletAddress ( key ) {
    // Subdivide private key into 16 fragments of 128 characters each
    const keyFragments = chunkSubstr( key, 128 ),
      // Generating wallet digest
      digestSponge = shake256.create( 8192 );

    for ( const index in keyFragments ) {
      let workingFragment = keyFragments[ index ];
      for ( let i = 1; i <= 16; i++ ) {
        workingFragment = shake256.create( 512 ).update( workingFragment ).hex();
      }
      digestSponge.update( workingFragment );
    }
    // Producing wallet address
    return shake256.create( 256 ).update( digestSponge.hex() ).hex();
  }
}
