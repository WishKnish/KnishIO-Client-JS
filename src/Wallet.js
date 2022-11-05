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
import {
  chunkSubstr,
  isHex,
  randomString
} from './libraries/strings';
import {
  generateBatchId,
  generateBundleHash
} from './libraries/crypto';
import BaseX from './libraries/BaseX';
import TokenUnit from './TokenUnit';
import Soda from './libraries/Soda';

/**
 * Wallet class represents the set of public and private
 * keys to sign Molecules
 */
export default class Wallet {

  /**
   * Class constructor
   *
   * @param {string|null} secret - typically a 2048-character biometric hash
   * @param {string} token - slug for the token this wallet is intended for
   * @param {string|null} position - hexadecimal string used to salt the secret and produce one-time signatures
   * @param {string|null} batchId
   * @param {string|null} characters
   */
  constructor ( {
    secret = null,
    token = 'USER',
    position = null,
    batchId = null,
    characters = null
  } ) {

    this.token = token;
    this.balance = 0;
    this.molecules = {};

    // Empty values
    this.key = null;
    this.address = null;
    this.privkey = null;
    this.pubkey = null;
    this.tokenUnits = [];
    this.tradeRates = {};

    this.bundle = null;
    this.batchId = batchId;
    this.position = position;
    this.characters = characters || 'BASE64';

    if ( secret ) {

      // Set bundle from the secret
      this.bundle = generateBundleHash( secret );

      // Generate a position for non-shadow wallet if not initialized
      this.position = this.position || Wallet.generatePosition();

      // Key & address initialization
      this.key = Wallet.generateKey( {
        secret,
        token: this.token,
        position: this.position
      } );
      this.address = Wallet.generateAddress( this.key );

      // Soda object initialization
      this.soda = new Soda( characters );

      // Private & pubkey initialization
      this.privkey = this.soda.generatePrivateKey( this.key );
      this.pubkey = this.soda.generatePublicKey( this.privkey );
    }
  }

  /**
   * Creates a new Wallet instance
   *
   * @param {string} secretOrBundle
   * @param {string} token
   * @param {string|null} batchId
   * @param {string|null} characters
   * @return {Wallet}
   */
  static create ( {
    secretOrBundle,
    token,
    batchId = null,
    characters = null
  } ) {

    let secret = Wallet.isBundleHash( secretOrBundle ) ? null : secretOrBundle;
    let bundle = secret ? generateBundleHash( secret ) : secretOrBundle;
    let position = secret ? Wallet.generatePosition() : null;

    // Wallet initialization
    let wallet = new Wallet( {
      secret,
      token,
      position,
      batchId,
      characters
    } );
    wallet.bundle = bundle;
    return wallet;
  }

  /**
   * Determines if the provided string is a bundle hash
   *
   * @param {string} maybeBundleHash
   * @return {boolean}
   */
  static isBundleHash ( maybeBundleHash ) {

    if ( typeof maybeBundleHash !== 'string' ) {
      return false;
    }

    return maybeBundleHash.length === 64 && isHex( maybeBundleHash );
  }

  /**
   * Get formatted token units from the raw data
   *
   * @param unitsData
   * @return {[]}
   */
  static getTokenUnits ( unitsData ) {
    let result = [];
    unitsData.forEach( unitData => {
      result.push( TokenUnit.createFromDB( unitData ) );
    } );
    return result;
  }

  /**
   *
   * @returns {*[]}
   */
  getTokenUnitsData () {
    const result = [];
    this.tokenUnits.forEach( tokenUnit => {
      result.push( tokenUnit.toData() );
    } );
    return result;
  }


  /**
   * Split token units
   *
   * @param {array} units
   * @param remainderWallet
   * @param recipientWallet
   */
  splitUnits (
    units, // Array: token unit IDs
    remainderWallet,
    recipientWallet = null
  ) {

    // No units supplied, nothing to split
    if ( units.length === 0 ) {
      return;
    }

    // Init recipient & remainder token units
    let recipientTokenUnits = [];
    let remainderTokenUnits = [];
    this.tokenUnits.forEach( tokenUnit => {
      if ( units.includes( tokenUnit.id ) ) {
        recipientTokenUnits.push( tokenUnit );
      } else {
        remainderTokenUnits.push( tokenUnit );
      }
    } );


    // Reset token units to the sending value
    this.tokenUnits = recipientTokenUnits;

    // Set token units to recipient & remainder
    if ( recipientWallet !== null ) {
      recipientWallet.tokenUnits = recipientTokenUnits;
    }
    remainderWallet.tokenUnits = remainderTokenUnits;
  }

  /**
   * @return boolean
   */
  isShadow () {
    return (
      ( typeof this.position === 'undefined' || null === this.position ) &&
      ( typeof this.address === 'undefined' || null === this.address )
    );
  }

  /**
   * Sets up a batch ID - either using the sender's, or a new one
   *
   * @param {Wallet} sourceWallet
   * @param {boolean} isRemainder
   */
  initBatchId ( {
    sourceWallet,
    isRemainder = false
  } ) {

    if ( sourceWallet.batchId ) {
      this.batchId = isRemainder ? sourceWallet.batchId : generateBatchId( {} );
    }
  }

  /**
   * Encrypts a message for this wallet instance
   *
   * @param {object|array} message
   * @return {object}
   */
  encryptMessage ( message ) {

    const encrypt = {};

    for ( let index = 1, length = arguments.length; index < length; index++ ) {
      encrypt[ this.soda.shortHash( arguments[ index ] ) ] = this.soda.encrypt( message, arguments[ index ] );
    }

    return encrypt;
  }

  /**
   * Uses the current wallet's private key to decrypt the given message
   *
   * @param {string|object} message
   * @return {null|any}
   */
  decryptMessage ( message ) {

    const pubKey = this.pubkey;
    let encrypt = message;

    if ( message !== null
      && typeof message === 'object'
      && Object.prototype.toString.call( message ) === '[object Object]' ) {

      encrypt = message[ this.soda.shortHash( pubKey ) ] || '';
    }

    return this.soda.decrypt( encrypt, this.privkey, pubKey );
  }

  /**
   * @param {string|object} message
   *
   * @returns {Buffer|ArrayBuffer|Uint8Array}
   */
  decryptBinary ( message ) {
    const decrypt = this.decryptMessage( message );
    return ( new BaseX( { characters: 'BASE64' } ) ).decode( decrypt );
  }

  /**
   * @param {Buffer|ArrayBuffer|Uint8Array} message
   * @returns {{string}}
   */
  encryptBinary ( message ) {
    const arg = Array.from( arguments ).slice( 1 );

    const messageBase64 = ( new BaseX( { characters: 'BASE64' } ) ).encode( message );

    return this.encryptMessage( messageBase64, ...arg );
  }

  /**
   * Encrypts a string for the given public keys
   *
   * @param {string} data
   * @param {string|array} publicKeys
   * @return {string}
   */
  encryptString ( {
    data,
    publicKeys
  } ) {

    if ( data ) {

      // Retrieving sender's encryption public key
      const publicKey = this.pubkey;

      // If the additional public keys is supplied as a string, convert to array
      if ( typeof publicKeys === 'string' ) {
        publicKeys = [ publicKeys ];
      }

      // Encrypting message
      const encryptedData = this.encryptMessage( data, publicKey, ...publicKeys );
      return btoa( JSON.stringify( encryptedData ) );

    }
  };

  /**
   * Attempts to decrypt the given string
   *
   * @param {string} data
   * @param {string|null} fallbackValue
   * @return {array|object}
   */
  decryptString ( {
    data,
    fallbackValue = null
  } ) {

    if ( data ) {
      try {

        const decrypted = JSON.parse( atob( data ) );
        return this.decryptMessage( decrypted ) || fallbackValue;

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
  static generateKey ( {
    secret,
    token,
    position
  } ) {

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
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress ( key ) {

    // Subdivide private key into 16 fragments of 128 characters each
    const keyFragments = chunkSubstr( key, 128 ),
      // Generating wallet digest
      digestSponge = shake256.create( 8192 );

    for ( const index in keyFragments ) {

      let workingFragment = keyFragments[ index ];

      for ( let fragmentCount = 1; fragmentCount <= 16; fragmentCount++ ) {

        workingFragment = shake256.create( 512 ).update( workingFragment ).hex();

      }

      digestSponge.update( workingFragment );
    }

    // Producing wallet address
    return shake256.create( 256 ).update( digestSponge.hex() ).hex();
  }

  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition ( saltLength = 64 ) {
    return randomString( saltLength, 'abcdef0123456789' );
  }
}
