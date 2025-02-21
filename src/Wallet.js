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
  constructor ({
    secret = null,
    bundle = null,
    token = 'USER',
    address = null,
    position = null,
    batchId = null,
    characters = null
  }) {
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

    if (secret) {
      // Set bundle from the secret
      this.bundle = this.bundle || generateBundleHash(secret, 'Wallet::constructor')

      // Generate a position for non-shadow wallet if not initialized
      this.position = this.position || Wallet.generatePosition()

      // Key & address initialization
      this.key = Wallet.generateKey({
        secret,
        token: this.token,
        position: this.position
      })
      this.address = this.address || Wallet.generateAddress(this.key)

      // Set characters
      this.characters = this.characters || 'BASE64'

      // Initialize ML-KEM keys
      this.initializeMLKEM()
    }
  }

  /**
   * Creates a new Wallet instance
   *
   * @param {string|null} secret
   * @param {string|null} bundle
   * @param {string} token
   * @param {string|null} batchId
   * @param {string|null} characters
   * @return {Wallet}
   */
  static create ({
    secret = null,
    bundle = null,
    token,
    batchId = null,
    characters = null
  }) {
    let position = null

    // No credentials parameters provided?
    if (!secret && !bundle) {
      throw new WalletCredentialException()
    }

    // Secret, but no bundle?
    if (secret && !bundle) {
      position = Wallet.generatePosition()
      bundle = generateBundleHash(secret, 'Wallet::create')
    }

    // Wallet initialization
    return new Wallet({
      secret,
      bundle,
      token,
      position,
      batchId,
      characters
    })
  }

  /**
   * Determines if the provided string is a bundle hash
   *
   * @param {string} maybeBundleHash
   * @return {boolean}
   */
  static isBundleHash (maybeBundleHash) {
    if (typeof maybeBundleHash !== 'string') {
      return false
    }

    return maybeBundleHash.length === 64 && isHex(maybeBundleHash)
  }

  /**
   * Get formatted token units from the raw data
   *
   * @param unitsData
   * @return {[]}
   */
  static getTokenUnits (unitsData) {
    const result = []
    unitsData.forEach(unitData => {
      result.push(TokenUnit.createFromDB(unitData))
    })
    return result
  }

  /**
   * Generates a private key for the given parameters
   *
   * @param {string} secret
   * @param {string} token
   * @param {string} position
   * @return {string}
   */
  static generateKey ({
    secret,
    token,
    position
  }) {
    // Converting secret to bigInt
    const bigIntSecret = BigInt(`0x${ secret }`)

    // Adding new position to the user secret to produce the indexed key
    const indexedKey = bigIntSecret + BigInt(`0x${ position }`)

    // Hashing the indexed key to produce the intermediate key
    const intermediateKeySponge = new JsSHA('SHAKE256', 'TEXT')

    intermediateKeySponge.update(indexedKey.toString(16))

    if (token) {
      intermediateKeySponge.update(token)
    }

    // Hashing the intermediate key to produce the private key
    const privateKeySponge = new JsSHA('SHAKE256', 'TEXT')
    privateKeySponge.update(intermediateKeySponge.getHash('HEX', { outputLen: 8192 }))
    return privateKeySponge.getHash('HEX', { outputLen: 8192 })
  }

  /**
   * Generates a wallet address
   *
   * @param {string} key
   * @return {string}
   */
  static generateAddress (key) {
    // Subdivide private key into 16 fragments of 128 characters each
    const keyFragments = chunkSubstr(key, 128)
    // Generating wallet digest
    const digestSponge = new JsSHA('SHAKE256', 'TEXT')

    for (const index in keyFragments) {
      let workingFragment = keyFragments[index]
      for (let fragmentCount = 1; fragmentCount <= 16; fragmentCount++) {
        const workingSponge = new JsSHA('SHAKE256', 'TEXT')
        workingSponge.update(workingFragment)
        workingFragment = workingSponge.getHash('HEX', { outputLen: 512 })
      }

      digestSponge.update(workingFragment)
    }

    // Producing wallet address
    const outputSponge = new JsSHA('SHAKE256', 'TEXT')
    outputSponge.update(digestSponge.getHash('HEX', { outputLen: 8192 }))
    return outputSponge.getHash('HEX', { outputLen: 256 })
  }

  /**
   *
   * @param saltLength
   * @returns {string}
   */
  static generatePosition (saltLength = 64) {
    return randomString(saltLength, 'abcdef0123456789')
  }

  /**
   * Initializes the ML-KEM key pair
   */
  initializeMLKEM () {
    // Generate a 64-byte (512-bit) seed from the Knish.IO private key
    const seedHex = generateSecret(this.key, 64)

    // Convert the hex string to a Uint8Array
    const seed = new Uint8Array(64)
    for (let i = 0; i < 64; i++) {
      seed[i] = parseInt(seedHex.substr(i * 2, 2), 16)
    }

    const { publicKey, secretKey } = MlKEM768.keygen(seed)
    this.pubkey = this.serializeKey(publicKey)
    this.privkey = secretKey // Note: We're keeping privkey as UInt8Array for security
  }

  serializeKey (key) {
    return btoa(String.fromCharCode.apply(null, key))
  }

  deserializeKey (serializedKey) {
    const binaryString = atob(serializedKey)
    return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i))
  }

  /**
   *
   * @returns {*[]}
   */
  getTokenUnitsData () {
    const result = []
    this.tokenUnits.forEach(tokenUnit => {
      result.push(tokenUnit.toData())
    })
    return result
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
    if (units.length === 0) {
      return
    }

    // Init recipient & remainder token units
    const recipientTokenUnits = []
    const remainderTokenUnits = []
    this.tokenUnits.forEach(tokenUnit => {
      if (units.includes(tokenUnit.id)) {
        recipientTokenUnits.push(tokenUnit)
      } else {
        remainderTokenUnits.push(tokenUnit)
      }
    })

    // Reset token units to the sending value
    this.tokenUnits = recipientTokenUnits

    // Set token units to recipient & remainder
    if (recipientWallet !== null) {
      recipientWallet.tokenUnits = recipientTokenUnits
    }
    remainderWallet.tokenUnits = remainderTokenUnits
  }

  /**
   * Create a remainder wallet from the source one
   *
   * @param secret
   */
  createRemainder (secret) {
    const remainderWallet = Wallet.create({
      secret,
      token: this.token,
      characters: this.characters
    })
    remainderWallet.initBatchId({
      sourceWallet: this,
      isRemainder: true
    })
    return remainderWallet
  }

  /**
   * @return boolean
   */
  isShadow () {
    return (
      (typeof this.position === 'undefined' || this.position === null) &&
      (typeof this.address === 'undefined' || this.address === null)
    )
  }

  /**
   * Sets up a batch ID - either using the sender's, or a new one
   *
   * @param {Wallet} sourceWallet
   * @param {boolean} isRemainder
   */
  initBatchId ({
    sourceWallet,
    isRemainder = false
  }) {
    if (sourceWallet.batchId) {
      this.batchId = isRemainder ? sourceWallet.batchId : generateBatchId({})
    }
  }

  async encryptMessage (message, recipientPubkey) {
    const messageString = JSON.stringify(message)
    const messageUint8 = new TextEncoder().encode(messageString)
    const deserializedPubkey = this.deserializeKey(recipientPubkey)
    const { cipherText, sharedSecret } = MlKEM768.encapsulate(deserializedPubkey)
    const encryptedMessage = await this.encryptWithSharedSecret(messageUint8, sharedSecret)
    return {
      cipherText: this.serializeKey(cipherText),
      encryptedMessage: this.serializeKey(encryptedMessage)
    }
  }

  async decryptMessage (encryptedData) {
    const { cipherText, encryptedMessage } = encryptedData

    let sharedSecret
    try {
      sharedSecret = MlKEM768.decapsulate(this.deserializeKey(cipherText), this.privkey)
    } catch (e) {
      console.error('Wallet::decryptMessage() - Decapsulation failed', e)
      console.info('Wallet::decryptMessage() - my public key', this.pubkey)
      return null
    }

    let deserializedEncryptedMessage
    try {
      deserializedEncryptedMessage = this.deserializeKey(encryptedMessage)
    } catch (e) {
      console.warn('Wallet::decryptMessage() - Deserialization failed', e)
      console.info('Wallet::decryptMessage() - my public key', this.pubkey)
      console.info('Wallet::decryptMessage() - our shared secret', sharedSecret)
      return null
    }

    let decryptedUint8
    try {
      decryptedUint8 = await this.decryptWithSharedSecret(deserializedEncryptedMessage, sharedSecret)
    } catch (e) {
      console.warn('Wallet::decryptMessage() - Decryption failed', e)
      console.info('Wallet::decryptMessage() - my public key', this.pubkey)
      console.info('Wallet::decryptMessage() - our shared secret', sharedSecret)
      console.info('Wallet::decryptMessage() - deserialized encrypted message', deserializedEncryptedMessage)
      return null
    }

    let decryptedString
    try {
      decryptedString = new TextDecoder().decode(decryptedUint8)
    } catch (e) {
      console.warn('Wallet::decryptMessage() - Decoding failed', e)
      console.info('Wallet::decryptMessage() - my public key', this.pubkey)
      console.info('Wallet::decryptMessage() - our shared secret', sharedSecret)
      console.info('Wallet::decryptMessage() - deserialized encrypted message', deserializedEncryptedMessage)
      console.info('Wallet::decryptMessage() - decrypted Uint8Array', decryptedUint8)
      return null
    }

    return JSON.parse(decryptedString)
  }

  async encryptWithSharedSecret (message, sharedSecret) {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const algorithm = { name: 'AES-GCM', iv }

    // Convert the shared secret to a CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    // Encrypt the message
    const encryptedContent = await crypto.subtle.encrypt(
      algorithm,
      key,
      message
    )

    // Combine IV and encrypted content
    const result = new Uint8Array(iv.length + encryptedContent.byteLength)
    result.set(iv)
    result.set(new Uint8Array(encryptedContent), iv.length)

    return result
  }

  /**
   * Decrypts the given message using the shared secret
   * @param encryptedMessage
   * @param sharedSecret
   * @returns {Promise<Uint8Array>}
   */
  async decryptWithSharedSecret (encryptedMessage, sharedSecret) {
    // Extract IV from the encrypted message
    const iv = encryptedMessage.slice(0, 12)
    const algorithm = { name: 'AES-GCM', iv }

    // Convert the shared secret to a CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      sharedSecret,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    // Decrypt the message
    const decryptedContent = await crypto.subtle.decrypt(
      algorithm,
      key,
      encryptedMessage.slice(12)
    )

    return new Uint8Array(decryptedContent)
  }
}
