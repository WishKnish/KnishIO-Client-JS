// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import { shake256 } from 'js-sha3';
import bigInt from 'big-integer/BigInteger';
import {
  chunkSubstr,
  randomString
} from './libraries/strings';
import {
  generateEncPrivateKey,
  generateEncPublicKey,
  generateEncSharedKey,
  decryptMessage, generateBundleHash
} from './libraries/crypto';

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
    this.bundle = generateBundleHash( secret );
    this.privkey = generateEncPrivateKey( this.key );
    this.pubkey = generateEncPublicKey( this.privkey );

  }

  /**
   * Derives a private key for encrypting data with this wallet's key
   *
   * @returns {Buffer}
   */
  getMyEncPrivateKey () {

    return generateEncPrivateKey( this.key );

  }

  /**
   * Dervies a public key for encrypting data for this wallet's consumption
   *
   * @returns {Buffer}
   */
  getMyEncPublicKey () {

    return generateEncPublicKey( this.getMyEncPrivateKey() );

  }

  /**
   * Creates a shared key by combining this wallet's private key and another wallet's public key
   *
   * @param otherPublicKey
   * @returns {*|Promise|Promise<unknown>}
   */
  getMyEncSharedKey ( otherPublicKey ) {

    return generateEncSharedKey( this.getMyEncPrivateKey(), otherPublicKey );

  }

  /**
   * Uses the current wallet's private key to decrypt the given message
   *
   * @param message
   * @returns {*}
   */
  decryptMyMessage ( message ) {

    return decryptMessage( message, this.getMyEncPrivateKey() );

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
