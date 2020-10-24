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
import bigInt from 'big-integer/BigInteger';
import Base58 from './libraries/Base58';
import Decimal from './libraries/Decimal';
import {
  chunkSubstr,
  randomString
} from './libraries/strings';
import {
  generateEncPrivateKey,
  generateEncPublicKey,
  decryptMessage,
  encryptMessage,
  generateBundleHash,
  hashShare,
} from './libraries/crypto';
import WalletShadow from "./WalletShadow";

/**
 * Wallet class represents the set of public and private
 * keys to sign Molecules
 */
export default class Wallet {

  /**
   * Class constructor
   *
   * @param {string | null} secret - typically a 2048-character biometric hash
   * @param {string} token - slug for the token this wallet is intended for
   * @param {string | null} position - hexadecimal string used to salt the secret and produce one-time signatures
   * @param {number} saltLength - length of the position parameter that should be generated if position is not provided
   * @param {string|null} characters
   */
  constructor ( secret = null, token = 'USER', position = null, saltLength = 64, characters = null ) {

    // Position via which (combined with token) we will generate the one-time keys
    this.position = position ? position : randomString( saltLength, 'abcdef0123456789' );
    this.token = token;
    this.balance = 0;
    this.molecules = {};
    this.batchId = null;
    this.characters = ( new Base58() )[ characters ] !== 'undefined' ? characters : null;

    this.key = null;
    this.address = null;
    this.bundle = null;
    this.privkey = null;
    this.pubkey = null;

    if ( secret ) {
      this.prepareKeys( secret );
    }

  }

  /**
   * Creates a new Wallet instance
   *
   * @param {string} secretOrBundle
   * @param {string} token
   * @param {string|null} batchId
   * @param {string|null} characters
   * @returns {Wallet|WalletShadow}
   */
  static create ( secretOrBundle, token, batchId = null, characters = null ) {

    // Shadow wallet
    if ( Wallet.isBundleHash( secretOrBundle ) ) {
      return new WalletShadow( secretOrBundle, token, batchId, characters );
    }

    // Base wallet
    const wallet = new Wallet( secretOrBundle, token );

    wallet.batchId = batchId;
    wallet.characters = ( new Base58() )[ characters ] !== 'undefined' ? characters : null;

    return wallet;
  }

  /**
   * Determines if the provided string is a bundle hash
   *
   * @param {string} maybeBundleHash
   * @returns {boolean}
   */
  static isBundleHash ( maybeBundleHash ) {

    if ( typeof maybeBundleHash !== 'string' ) {
      return false;
    }

    return maybeBundleHash.length === 64 && isHex( maybeBundleHash );
  }

  /**
   * Prepares wallet for signing by generating all required keys
   *
   * @param {string} secret
   */
  prepareKeys ( secret ) {
    if ( this.key === null && this.address === null && this.bundle === null ) {
      this.key = Wallet.generatePrivateKey( secret, this.token, this.position );
      this.address = Wallet.generatePublicKey( this.key );
      this.bundle = generateBundleHash( secret );
      this.getMyEncPrivateKey();
      this.getMyEncPublicKey();
    }
  }

  /**
   * Returns a new batch ID for stackable tokens
   *
   * @returns {string}
   */
  static generateBatchId () {
    return randomString( 64 );
  }

  /**
   * Sets up a batch ID - either using the sender's, or a new one
   *
   * @param {Wallet} senderWallet
   * @param {number} transferAmount
   */
  initBatchId ( senderWallet, transferAmount ) {

    if ( senderWallet.batchId ) {

      // Set batchID to recipient wallet
      this.batchId = ( !this.batchId && Decimal.cmp( senderWallet.balance, transferAmount ) > 0 ) ?
        // Has a remainder value (source balance is bigger than a transfer value)
        Wallet.generateBatchId() :
        // Has no remainder? use batch ID from the source wallet
        senderWallet.batchId;
    }
  }

  /**
   * Derives a private key for encrypting data with this wallet's key
   *
   * @returns {string}
   */
  getMyEncPrivateKey () {

    if ( this.privkey === null && this.key !== null ) {
      this.privkey = generateEncPrivateKey( this.key, this.characters );
    }

    return this.privkey;
  }

  /**
   * Dervies a public key for encrypting data for this wallet's consumption
   *
   * @returns {string}
   */
  getMyEncPublicKey () {

    const privateKey = this.getMyEncPrivateKey();

    if ( this.pubkey === null && privateKey !== null ) {
      this.pubkey = generateEncPublicKey( privateKey, this.characters );
    }

    return this.pubkey;
  }

  /**
   * Encrypts a message for this wallet instance
   *
   * @param {Object|Array} message
   * @returns {Object}
   */
  encryptMyMessage ( message ) {

    const encrypt = {};

    for ( let index = 1, length = arguments.length; index < length; index++ ) {
      encrypt[ hashShare( arguments[ index ], this.characters ) ] = encryptMessage( message, arguments[ index ], this.characters );
    }

    return encrypt;
  }

  /**
   * Uses the current wallet's private key to decrypt the given message
   *
   * @param {string | Object} message
   * @returns {Array | Object | null}
   */
  decryptMyMessage ( message ) {

    const pubKey = this.getMyEncPublicKey();
    let encrypt = message;

    if ( message !== null
      && typeof message === 'object'
      && Object.prototype.toString.call( message ) === '[object Object]' ) {

      encrypt = message[ hashShare( pubKey, this.characters ) ] || '';
    }

    return decryptMessage( encrypt, this.getMyEncPrivateKey(), pubKey, this.characters );
  }

  /**
   * Generates a private key for the given parameters
   *
   * @param {string} secret
   * @param {string} token
   * @param {string} position
   * @return {string}
   */
  static generatePrivateKey ( secret, token, position ) {

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
   * Generates a public key (wallet address)
   *
   * @param {string} key
   * @return {string}
   */
  static generatePublicKey ( key ) {

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
