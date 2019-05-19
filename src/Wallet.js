// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import {shake256,} from 'js-sha3';
import bigInt from 'big-integer/BigInteger';
import {chunkSubstr, randomString,} from './util/strings';

export default class Wallet {

  /**
   * @param secret - typically a 2048-character biometric hash
   * @param token - slug for the token this wallet is intended for
   * @param position - hexadecimal string used to salt the secret and produce one-time signatures
   * @param saltLength - length of the position parameter that should be generated if position is not provided
   */
  constructor(secret, token = 'USER', position = null, saltLength = 64) {
    // console.log('Wallet constructor(): START');
    // Position via which (combined with token) we will generate the one-time keys
    this.position = position > 0 ? position : bigInt(randomString(saltLength), 16);
    this.token = token;
    this.key = Wallet.generateWalletKey(secret, this.token, this.position);
    this.address = Wallet.generateWalletAddress(this.key);
    this.balance = 0;
    this.molecules = {};
    this.bundle = Wallet.generateBundleHash(secret);
    // console.log('Wallet constructor(): FINISH');
  }

  /**
   * Hashes the user secret to produce a wallet bundle
   *
   * @returns string
   */
  static generateBundleHash(secret) {
    const bundleSponge = shake256.create(256);
    bundleSponge.update(secret);
    return bundleSponge.hex();
  }

  /**
   *
   * @param secret
   * @param token
   * @param position
   * @return string
   */
  static generateWalletKey(secret, token, position,) {
    // Converting secret to bigInt
    let bigIntSecret = bigInt(secret, 16);
    // console.log(bigIntSecret.toString(16));

    // Adding new position to the user secret to produce the indexed key
    const indexedKey = bigIntSecret.add(bigInt(position, 16));
    // console.log(indexedKey.toString(16));

    // Hashing the indexed key to produce the intermediate key
    const intermediateKeySponge = shake256.create(8192);
    intermediateKeySponge.update(indexedKey.toString(16));
    if (token)
      intermediateKeySponge.update(token);

    const intermediateKey = intermediateKeySponge.hex(); // bigInt.fromArray(intermediateKeySponge.array(), 256, false).toString(16).padStart(2048, '0');

    // Hashing the intermediate key to produce the private key
    const privateKeySponge = shake256.create(8192);
    privateKeySponge.update(intermediateKey);

    return privateKeySponge.hex(); // bigInt.fromArray(privateKeySponge.array(), 256, false).toString(16).padStart(2048, '0');
  }

  static generateWalletAddress(key) {
    // console.log('generateWalletAddress(): START');
    // Subdivide private key into 16 fragments of 128 characters each
    const keyFragments = chunkSubstr(key, 128);
    // console.log(`generateWalletAddress(): keyFragments has ${ Object.keys(keyFragments).length } pieces of length ${ keyFragments[0].length }`);

    // Generating wallet digest
    const digestSponge = shake256.create(8192);
    keyFragments.forEach(function (fragment, index) {
      let workingFragment = fragment;
      for (let i = 1; i <= 16; i++) {
        let workingSponge = shake256.create(512);
        workingSponge.update(workingFragment);
        workingFragment = workingSponge.hex(); // bigInt.fromArray(workingSponge.array(), 256, false).toString(16).padStart(128, '0');
      }
      // console.log(`generateWalletAddress(): fragment ${ index } - ${ workingFragment }`);
      digestSponge.update(workingFragment);
    });
    const digest = digestSponge.hex(); // bigInt.fromArray(digestSponge.array(), 256, false).toString(16).padStart(2048, '0');
    // console.log(`generateWalletAddress(): digest - ${ digest }`);

    // Producing wallet address
    const walletSponge = shake256.create(256);
    walletSponge.update(digest);
    const walletAddress = walletSponge.hex(); // bigInt.fromArray(walletSponge.array(), 256, false).toString(16).padStart(64, '0');
    // console.log(`generateWalletAddress(): address - ${ walletAddress }`);
    // console.log('generateWalletAddress(): FINISH');
    return walletAddress;
  }
}
