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
import JsSHA from 'jssha'
import {
  chunkSubstr,
  isHex,
  randomString
} from './libraries/strings'
import {
  generateBatchId,
  generateBundleHash,
  generateSecret
} from './libraries/crypto'
import TokenUnit from './TokenUnit'
import WalletCredentialException from './exception/WalletCredentialException'
import { ml_kem768 as MlKEM768 } from '@noble/post-quantum/ml-kem'
import { IWallet, WalletConstructorParams, WalletGenerateKeyParams } from "./types";

/**
 * Wallet class represents the set of public and private
 * keys to sign Molecules
 */
export default class Wallet implements IWallet {

  token: string;
  balance: number;
  address: string | null;
  position: string | null;
  bundle: string | null;
  batchId: string | null;
  pubkey: string | null;
  characters: string | null;
  key: string | null;
  privkey: Uint8Array | null;
  molecules: Record<string, any>;
  tokenUnits: TokenUnit[];
  tradeRates: Record<string, any>;

  /**
   * Class constructor
   */
  constructor( {
                 secret = null, // typically a 2048-character biometric hash
                 bundle = null, // 64-character hexadecimal user identifier
                 token = 'USER', // slug for the token this wallet is intended for
                 address = null, // hexadecimal public key for the signature of this wallet
                 position = null, // hexadecimal string used to salt the secret and produce one-time signatures
                 batchId = null,
                 characters = null
               }: WalletConstructorParams ) {
    this.token = token
    this.balance = 0
    this.molecules = {}

    // Empty values
    this.key = null
    this.privkey = null
    this.pubkey = null
    this.tokenUnits = []
    this.tradeRates = {}

    this.address = address
    this.position = position
    this.bundle = bundle
    this.batchId = batchId
    this.characters = characters

    if ( secret ) {
      // Set bundle from the secret
      this.bundle = this.bundle || generateBundleHash( secret )

      // Generate a position for non-shadow wallet if not initialized
      this.position = this.position || Wallet.generatePosition()

      // Key & address initialization
      this.key = Wallet.generateKey( {
        secret,
        token: this.token,
        position: this.position
      } )
      this.address = this.address || Wallet.generateAddress( this.key )

      // Set characters
      this.characters = this.characters || 'BASE64'

      // Initialize ML-KEM keys
      this.initializeMLKEM()
    }
  }

  /**
   * Creates a new Wallet instance
   */
  static create( {
                   secret = null,
                   bundle = null,
                   token,
                   batchId = null,
                   characters = null
                 }: WalletConstructorParams ): Wallet {
    let position = null

    // No credentials parameters provided?
    if ( !secret && !bundle ) {
      throw new WalletCredentialException()
    }

    // Secret, but no bundle?
    if ( secret && !bundle ) {
      position = Wallet.generatePosition()
      bundle = generateBundleHash( secret )
    }

    // Wallet initialization
    return new Wallet( {
      secret,
      bundle,
      token,
      position,
      batchId,
      characters,
      address: null
    } )
  }

  /**
   * Determines if the provided string is a bundle hash
   */
  static isBundleHash( maybeBundleHash: string ): boolean {
    if ( typeof maybeBundleHash !== 'string' ) {
      return false
    }

    return maybeBundleHash.length === 64 && isHex( maybeBundleHash )
  }

  /**
   * Get formatted token units from the raw data
   */
  static getTokenUnits( unitsData: [string, string, {}][] ): TokenUnit[] {
    const result = []
    unitsData.forEach( ( unitData: [string, string, {}]) => {
      result.push( TokenUnit.createFromDB( unitData ) )
    } )
    return result
  }

  /**
   * Generates a private key for the given parameters
   */
  static generateKey( {
                        secret,
                        token,
                        position
                      }: WalletGenerateKeyParams ): string {
    // Converting secret to bigInt
    const bigIntSecret = BigInt( `0x${ secret }` )

    // Adding new position to the user secret to produce the indexed key
    const indexedKey = bigIntSecret + BigInt( `0x${ position }` )

    // Hashing the indexed key to produce the intermediate key
    const intermediateKeySponge = new JsSHA( 'SHAKE256', 'TEXT' )

    intermediateKeySponge.update( indexedKey.toString( 16 ) )

    if ( token ) {
      intermediateKeySponge.update( token )
    }

    // Hashing the intermediate key to produce the private key
    const privateKeySponge = new JsSHA( 'SHAKE256', 'TEXT' )
    privateKeySponge.update( intermediateKeySponge.getHash( 'HEX', { outputLen: 8192 } ) )
    return privateKeySponge.getHash( 'HEX', { outputLen: 8192 } )
  }

  /**
   * Generates a wallet address
   */
  static generateAddress( key: string ): string {
    // Subdivide private key into 16 fragments of 128 characters each
    const keyFragments = chunkSubstr( key, 128 )
    // Generating wallet digest
    const digestSponge = new JsSHA( 'SHAKE256', 'TEXT' )

    for ( const index in keyFragments ) {
      let workingFragment = keyFragments[ index ]
      for ( let fragmentCount = 1; fragmentCount <= 16; fragmentCount++ ) {
        const workingSponge = new JsSHA( 'SHAKE256', 'TEXT' )
        workingSponge.update( workingFragment )
        workingFragment = workingSponge.getHash( 'HEX', { outputLen: 512 } )
      }

      digestSponge.update( workingFragment )
    }

    // Producing wallet address
    const outputSponge = new JsSHA( 'SHAKE256', 'TEXT' )
    outputSponge.update( digestSponge.getHash( 'HEX', { outputLen: 8192 } ) )
    return outputSponge.getHash( 'HEX', { outputLen: 256 } )
  }

  /**
   * Generates a random position
   */
  static generatePosition( saltLength: number = 64 ): string {
    return randomString( saltLength, 'abcdef0123456789' )
  }

  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM() {
    // Generate a 64-byte (512-bit) seed from the Knish.IO private key
    const seedHex = generateSecret( this.key, 64 )

    // Convert the hex string to a Uint8Array
    const seed = new Uint8Array( 64 )
    for ( let i = 0; i < 64; i++ ) {
      seed[ i ] = parseInt( seedHex.substr( i * 2, 2 ), 16 )
    }

    const { publicKey, secretKey } = MlKEM768.keygen( seed )
    this.pubkey = this.serializeKey( publicKey )
    this.privkey = secretKey // Note: We're keeping privkey as UInt8Array for security
  }

  /**
   * Serializes a key to a base64 string
   */
  serializeKey( key: Uint8Array ): string {
    return btoa( String.fromCharCode.apply( null, key ) )
  }

  /**
   * Deserializes a base64 string to a key
   */
  deserializeKey( serializedKey: string ): Uint8Array {
    const binaryString = atob( serializedKey )
    return new Uint8Array( binaryString.length ).map( ( _, i ) => binaryString.charCodeAt( i ) )
  }

  getTokenUnitsData(): {}[] {
    const result = []
    this.tokenUnits.forEach( tokenUnit => {
      result.push( tokenUnit.toData() )
    } )
    return result
  }

  /**
   * Split token units
   */
  splitUnits(
    units: string[], // array of token unit IDs
    remainderWallet: Wallet,
    recipientWallet: Wallet = null
  ): void {
    // No units supplied, nothing to split
    if ( units.length === 0 ) {
      return
    }

    // Init recipient & remainder token units
    const recipientTokenUnits = []
    const remainderTokenUnits = []
    this.tokenUnits.forEach( tokenUnit => {
      if ( units.includes( tokenUnit.id ) ) {
        recipientTokenUnits.push( tokenUnit )
      } else {
        remainderTokenUnits.push( tokenUnit )
      }
    } )

    // Reset token units to the sending value
    this.tokenUnits = recipientTokenUnits

    // Set token units to recipient & remainder
    if ( recipientWallet !== null ) {
      recipientWallet.tokenUnits = recipientTokenUnits
    }
    remainderWallet.tokenUnits = remainderTokenUnits
  }

  /**
   * Create a remainder wallet from the source one
   *
   * @param {string} secret
   */
  createRemainder( secret: string ) {
    const remainderWallet = Wallet.create( {
      secret,
      token: this.token,
      characters: this.characters,
      bundle: null,
      address: null,
      position: null,
      batchId: null
    } )
    remainderWallet.initBatchId( {
      sourceWallet: this,
      isRemainder: true
    } )
    return remainderWallet
  }

  /**
   * @return boolean
   */
  isShadow() {
    return (
      (typeof this.position === 'undefined' || this.position === null) &&
      (typeof this.address === 'undefined' || this.address === null)
    )
  }

  /**
   * Sets up a batch ID - either using the sender's, or a new one
   */
  initBatchId( {
                 sourceWallet = null as Wallet | null,
                 isRemainder = false as boolean
               } ) {
    if ( sourceWallet.batchId ) {
      this.batchId = isRemainder ? sourceWallet.batchId : generateBatchId( {} )
    }
  }

  /**
   * Encrypts the given message using the recipient's public key
   */
  async encryptMessage( message: any, recipientPubkey: string ): Promise<{ cipherText: string, encryptedMessage: string }> {
    const messageString = JSON.stringify( message )
    const messageUint8 = new TextEncoder().encode( messageString )
    const deserializedPubkey = this.deserializeKey( recipientPubkey )
    const { cipherText, sharedSecret } = MlKEM768.encapsulate( deserializedPubkey )
    const encryptedMessage = await this.encryptWithSharedSecret( messageUint8, sharedSecret )
    return {
      cipherText: this.serializeKey( cipherText ),
      encryptedMessage: this.serializeKey( encryptedMessage )
    }
  }

  /**
   * Decrypts the given message using the private key
   */
  async decryptMessage( encryptedData: { cipherText: string, encryptedMessage: string } ): Promise<any> {
    const { cipherText, encryptedMessage } = encryptedData

    const sharedSecret = MlKEM768.decapsulate( this.deserializeKey( cipherText ), this.privkey )
    const decryptedUint8 = await this.decryptWithSharedSecret( this.deserializeKey( encryptedMessage ), sharedSecret )

    const decryptedString = new TextDecoder().decode( decryptedUint8 )
    return JSON.parse( decryptedString )
  }

  /**
   * Encrypts the given message using the shared secret
   */
  async encryptWithSharedSecret( message: any, sharedSecret: BufferSource ): Promise<Uint8Array> {
    const iv = crypto.getRandomValues( new Uint8Array( 12 ) )
    const algorithm = { name: 'AES-GCM', iv }

    // Convert the shared secret to a CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'AES-GCM' },
      false,
      [ 'encrypt' ]
    )

    // Encrypt the message
    const encryptedContent = await crypto.subtle.encrypt(
      algorithm,
      key,
      message
    )

    // Combine IV and encrypted content
    const result = new Uint8Array( iv.length + encryptedContent.byteLength )
    result.set( iv )
    result.set( new Uint8Array( encryptedContent ), iv.length )

    return result
  }

  /**
   * Decrypts the given message using the shared secret
   */
  async decryptWithSharedSecret( encryptedMessage: Uint8Array<ArrayBufferLike>, sharedSecret: BufferSource ): Promise<Uint8Array> {
    // Extract IV from the encrypted message
    const iv = encryptedMessage.slice( 0, 12 )
    const algorithm = { name: 'AES-GCM', iv }

    // Convert the shared secret to a CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'AES-GCM' },
      false,
      [ 'decrypt' ]
    )

    // Decrypt the message
    const decryptedContent = await crypto.subtle.decrypt(
      algorithm,
      key,
      encryptedMessage.slice( 12 )
    )

    return new Uint8Array( decryptedContent )
  }
}
