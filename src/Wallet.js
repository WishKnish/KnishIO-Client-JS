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
  isHex,
  randomString
} from './libraries/strings';
import {
  generateEncPrivateKey,
  generateEncPublicKey,
  decryptMessage,
  encryptMessage,
  generateBundleHash,
  generateWalletPosition,
  generateBatchId,
  hashShare,
} from './libraries/crypto';

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
   * @param {string} batchID
   * @param {string|null} characters
   */
  constructor ( secret = null, token = 'USER', position = null, batchId = null, characters = null ) {

    this.token = token;
    this.balance = 0;
    this.molecules = {};

    // Empty values
    this.key = null;
    this.address = null;
    this.privkey = null;
    this.pubkey = null;

    this.bundle = secret ? generateBundleHash( secret ) : null;
    this.batchId = batchId;
    this.position = position;
    this.characters = ( new Base58() )[ characters ] !== 'undefined' ? characters : null;

    if ( secret ) {

      this.position = this.position || generateWalletPosition();

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
   * @returns {Wallet}
   */
  static create ( secretOrBundle, token, batchId = null, characters = null ) {

    let secret = Wallet.isBundleHash( secretOrBundle ) ? null : secretOrBundle;
    let bundle = secret ? generateBundleHash( secret ) : secretOrBundle;
    let position = secret ? generateWalletPosition() : null;

    // Wallet initialization
    let wallet = new Wallet( secret, token, position, batchId, characters );
    wallet.bundle = bundle;
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
   * @return bool
   */
  isShadow() {
    return (
      ( typeof this.position === 'undefined' || null === this.position ) &&
      ( typeof this.address === 'undefined' || null === this.address )
    )
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
        generateBatchId() :
        // Has no remainder? use batch ID from the source wallet
        senderWallet.batchId;
    }
  }

  /**
   * Prepares wallet for signing by generating all required keys
   *
   * @param {string} secret
   */
  prepareKeys ( secret ) {
    if ( this.key === null && this.address === null ) {
      this.key = Wallet.generatePrivateKey( secret, this.token, this.position );
      this.address = Wallet.generatePublicKey( this.key );
      this.getMyEncPrivateKey();
      this.getMyEncPublicKey();
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

    if ( !this.pubkey && privateKey ) {
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
   * Encrypts a string for the given public keys
   *
   * @param {string} data
   * @param {string|array} publicKeys
   * @returns {string}
   */
  encryptString ( data, publicKeys ) {

    if ( data ) {

      // Retrieving sender's encryption public key
      const publicKey = this.getMyEncPublicKey();

      // If the additional public keys is supplied as a string, convert to array
      if ( typeof publicKeys === 'string' ) {
        publicKeys = new Array( publicKeys );
      }

      // Encrypting message
      const encryptedData = this.encryptMyMessage( data, publicKey, ...publicKeys );
      return btoa( JSON.stringify( encryptedData ) );

    }
  };

  /**
   * Attempts to decrypt the given string
   *
   * @param {string} data
   * @param {string|null} fallbackValue
   * @returns {Array|Object}
   */
  decryptString ( data, fallbackValue = null ) {

    if ( data ) {
      try {

        const decrypted = JSON.parse( atob( data ) );
        return this.decryptMyMessage( decrypted ) || fallbackValue;

      } catch ( e ) {

        // Probably not actually encrypted
        console.error( e );
        return fallbackValue || data;

      }
    }

  };

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
