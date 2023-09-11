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
import jsSHA from 'jssha';
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
   * @param {string|null} bundle - 64-character hexadecimal user identifier
   * @param {string} token - slug for the token this wallet is intended for
   * @param {string|null} address - hexadecimal public key for the signature of this wallet
   * @param {string|null} position - hexadecimal string used to salt the secret and produce one-time signatures
   * @param {string|null} batchId
   * @param {string|null} characters
   */
  constructor ( {
    secret = null,
    bundle = null,
    token = 'USER',
    address = null,
    position = null,
    batchId = null,
    characters = null
  } ) {

    this.token = token;
    this.balance = 0;
    this.molecules = {};

    // Empty values
    this.key = null;
    this.privkey = null;
    this.pubkey = null;
    this.tokenUnits = [];
    this.tradeRates = {};

    this.address = address;
    this.position = position;
    this.bundle = bundle;
    this.batchId = batchId;
    this.characters = characters;

    if ( secret ) {

      // Set bundle from the secret
      this.bundle = this.bundle || generateBundleHash( secret );

      // Generate a position for non-shadow wallet if not initialized
      this.position = this.position || Wallet.generatePosition();

      // Key & address initialization
      this.key = Wallet.generateKey( {
        secret,
        token: this.token,
        position: this.position
      } );
      this.address = this.address || Wallet.generateAddress( this.key );

      // Soda object initialization
      this.soda = new Soda( characters );

      // Private & pubkey initialization
      this.privkey = this.soda.generatePrivateKey( this.key );
      this.pubkey = this.soda.generatePublicKey( this.privkey );

      // Set characters
      this.characters = this.characters || 'BASE64';
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

    let secret = null;
    let position = null;
    let bundle = null;

    if ( Wallet.isBundleHash( secretOrBundle ) ) {
      bundle = secretOrBundle;
    } else {
      secret = secretOrBundle;
      position = Wallet.generatePosition();
      bundle = generateBundleHash( secret );
    }

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
   * Create a remainder wallet from the source one
   *
   * @param secret
   */
  createRemainder ( secret ) {
    let remainderWallet = Wallet.create( {
      secretOrBundle: secret,
      token: this.token,
      characters: this.characters
    } );
    remainderWallet.initBatchId( {
      sourceWallet: this,
      isRemainder: true
    } );
    return remainderWallet;
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
    const bigIntSecret = BigInt( `0x${secret}` );

    // Adding new position to the user secret to produce the indexed key
    const indexedKey = bigIntSecret + BigInt( `0x${position}` );

    // Hashing the indexed key to produce the intermediate key
    const intermediateKeySponge = new jsSHA( 'SHAKE256', 'TEXT' );

    intermediateKeySponge.update( indexedKey.toString(16) );

    if ( token ) {
      intermediateKeySponge.update( token );
    }

    // Hashing the intermediate key to produce the private key
    const privateKeySponge = new jsSHA( 'SHAKE256', 'TEXT' );
    privateKeySponge.update( intermediateKeySponge.getHash( 'HEX', { outputLen: 8192 } ) );
    return privateKeySponge.getHash( 'HEX', { outputLen: 8192 } );
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
      digestSponge = new jsSHA( 'SHAKE256', 'TEXT' );

    for ( const index in keyFragments ) {
      let workingFragment = keyFragments[ index ];
      for ( let fragmentCount = 1; fragmentCount <= 16; fragmentCount++ ) {
        const workingSponge = new jsSHA( 'SHAKE256', 'TEXT' );
        workingSponge.update( workingFragment );
        workingFragment = workingSponge.getHash( 'HEX', { outputLen: 512 } );
      }

      digestSponge.update( workingFragment );
    }

    // Producing wallet address
    const outputSponge = new jsSHA( 'SHAKE256', 'TEXT' );
    outputSponge.update( digestSponge.getHash( 'HEX', { outputLen: 8192 } ) );
    return outputSponge.getHash( 'HEX', { outputLen: 256 } );
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
