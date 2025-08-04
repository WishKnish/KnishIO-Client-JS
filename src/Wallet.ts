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
  isHex,
  randomString,
  chunkSubstr
} from './libraries/strings'
import {
  generateBundleHash
} from './libraries/crypto'
import WalletCredentialException from './exception/WalletCredentialException'
import { ml_kem768 as MlKEM768 } from '@noble/post-quantum/ml-kem'
import type {
  WalletOptions,
  WalletCredentials,
  WalletLike,
  Logger,
  TokenUnit as TokenUnitType,
  MLKEMKeys
} from './types'

// Import JavaScript modules (canonical versions)
import TokenUnit from './TokenUnit'
import { createScopedLogger } from './libraries/Logger'
import { generateBatchId } from './libraries/crypto'


/**
 * Wallet constants with TypeScript 5.x const assertions
 */
const WALLET_CONSTANTS = {
  DEFAULT_TOKEN: 'USER',
  DEFAULT_CHARACTERS: 'BASE64',
  KEY_FRAGMENT_SIZE: 128,
  KEY_FRAGMENT_COUNT: 16,
  HASH_ROUNDS_PER_FRAGMENT: 16,
  MLKEM_SEED_SIZE: 32,
  DEFAULT_SALT_LENGTH: 64,
  SUPPORTED_TOKENS: ['USER', 'STAKE', 'SHADOW', 'AUTH']
} as const

/**
 * Wallet class represents the set of public and private
 * keys to sign Molecules
 */
export default class Wallet {
  public readonly token: string
  public balance: number
  public molecules: Record<string, unknown>
  public readonly logger: Logger
  
  public key: string | null
  public privkey: string | null
  public pubkey: string | null
  public tokenUnits: TokenUnitType[]
  public tradeRates: Record<string, unknown>
  
  public address: string | null
  public position: string | null
  public bundle: string | null
  public batchId: string | null
  public characters: string | null
  
  // ML-KEM (post-quantum) keys
  private mlkemKeys: MLKEMKeys | null = null

  /**
   * Class constructor
   */
  constructor ({
    secret = null,
    bundle = null,
    token = WALLET_CONSTANTS.DEFAULT_TOKEN,
    address = null,
    position = null,
    batchId = null,
    characters = null
  }: WalletOptions) {
    this.token = token ?? WALLET_CONSTANTS.DEFAULT_TOKEN
    this.balance = 0
    this.molecules = {}

    // Initialize scoped logger
    this.logger = createScopedLogger('Wallet')

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
      this.bundle = this.bundle || generateBundleHash(secret)

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
      this.characters = this.characters || WALLET_CONSTANTS.DEFAULT_CHARACTERS

      // Initialize ML-KEM keys
      this.initializeMLKEM()
    }
  }

  /**
   * Creates a new Wallet instance
   */
  static create ({
    secret = null,
    bundle = null,
    token,
    batchId = null,
    characters = null
  }: {
    secret?: string | null;
    bundle?: string | null;
    token: string;
    batchId?: string | null;
    characters?: string | null;
  }): Wallet {
    let position: string | null = null

    // No credentials parameters provided?
    if (!secret && !bundle) {
      throw new WalletCredentialException()
    }

    // Secret, but no bundle?
    if (secret && !bundle) {
      position = Wallet.generatePosition()
      bundle = generateBundleHash(secret)
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
   */
  static isBundleHash (maybeBundleHash: unknown): maybeBundleHash is string {
    if (typeof maybeBundleHash !== 'string') {
      return false
    }

    return maybeBundleHash.length === 64 && isHex(maybeBundleHash)
  }

  /**
   * Get formatted token units from the raw data
   */
  static getTokenUnits (unitsData: unknown[]): TokenUnitType[] {
    const result: TokenUnitType[] = []
    unitsData.forEach(unitData => {
      result.push(TokenUnit.createFromDB(unitData as any))
    })
    return result
  }

  /**
   * Generates a position string
   */
  static generatePosition (saltLength: number = WALLET_CONSTANTS.DEFAULT_SALT_LENGTH): string {
    return randomString(saltLength, 'abcdef0123456789')
  }

  /**
   * Generates a private key for the given parameters
   */
  static generateKey ({
    secret,
    token,
    position
  }: {
    secret: string;
    token: string;
    position: string;
  }): string {
    try {
      // Converting secret to bigInt
      const bigIntSecret = BigInt(`0x${secret}`)

      // Adding new position to the user secret to produce the indexed key
      const indexedKey = bigIntSecret + BigInt(`0x${position}`)

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
    } catch (error) {
      // Fallback to simpler key generation if BigInt fails
      const fallbackSponge = new JsSHA('SHAKE256', 'TEXT')
      fallbackSponge.update(secret)
      fallbackSponge.update(token)
      fallbackSponge.update(position)
      return fallbackSponge.getHash('HEX', { outputLen: 8192 })
    }
  }

  /**
   * Generates a wallet address
   */
  static generateAddress (key: string): string {
    // Subdivide private key into fragments using constants
    const keyFragments = chunkSubstr(key, WALLET_CONSTANTS.KEY_FRAGMENT_SIZE)
    // Generating wallet digest
    const digestSponge = new JsSHA('SHAKE256', 'TEXT')

    for (const index in keyFragments) {
      let workingFragment = keyFragments[index] ?? ''
      for (let fragmentCount = 1; fragmentCount <= WALLET_CONSTANTS.HASH_ROUNDS_PER_FRAGMENT; fragmentCount++) {
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
   * Initialize ML-KEM (post-quantum) key pair
   */
  private initializeMLKEM (): void {
    try {
      if (this.key) {
        // Use a deterministic seed from the private key
        const keyHash = new JsSHA('SHAKE256', 'TEXT')
        keyHash.update(this.key)
        const seedHex = keyHash.getHash('HEX', { outputLen: 64 })
        
        // Convert hex to Uint8Array seed
        const seed = new Uint8Array(WALLET_CONSTANTS.MLKEM_SEED_SIZE)
        for (let i = 0; i < WALLET_CONSTANTS.MLKEM_SEED_SIZE; i++) {
          seed[i] = parseInt(seedHex.substr(i * 2, 2) ?? '00', 16)
        }
        
        const keyPair = MlKEM768.keygen(seed)
        this.mlkemKeys = {
          publicKey: keyPair.publicKey,
          secretKey: keyPair.secretKey
        }
        this.pubkey = this.serializeKey(this.mlkemKeys.publicKey)
      }
    } catch (error) {
      this.logger.warn('Failed to initialize ML-KEM keys:', error)
    }
  }

  /**
   * Get wallet credentials
   */
  getCredentials (): WalletCredentials | null {
    if (!this.address || !this.position || !this.bundle || !this.pubkey) {
      return null
    }

    const credentials: WalletCredentials = {
      address: this.address,
      token: this.token,
      position: this.position,
      bundle: this.bundle,
      publicKey: this.pubkey || ''
    }

    if (this.key) {
      credentials.privateKey = this.key
    }

    if (this.characters) {
      credentials.characters = this.characters
    }

    return credentials
  }

  /**
   * Check if wallet is properly initialized
   */
  isValid (): boolean {
    return !!(
      this.address &&
      this.position &&
      this.bundle &&
      this.key
    )
  }

  /**
   * Add a token unit to this wallet
   */
  addTokenUnit (tokenUnit: TokenUnitType): void {
    this.tokenUnits.push(tokenUnit)
  }

  /**
   * Get token units for a specific token
   */
  getTokenUnits (token?: string): TokenUnitType[] {
    if (!token) {
      return this.tokenUnits
    }
    return this.tokenUnits.filter(unit => (unit as any).name === token)
  }

  /**
   * Update wallet balance
   */
  updateBalance (newBalance: number): void {
    this.balance = newBalance
  }

  /**
   * Convert to WalletLike interface for compatibility
   */
  toWalletLike (): WalletLike {
    return {
      position: this.position || '',
      address: this.address || '',
      token: this.token,
      batchId: this.batchId || '',
      pubkey: this.pubkey || '',
      characters: this.characters || '',
      bundle: this.bundle || '',
      balance: this.balance
    }
  }

  /**
   * Get formatted token units from the raw data
   */
  getTokenUnitsData (): unknown[] {
    const result: unknown[] = []
    this.tokenUnits.forEach(tokenUnit => {
      result.push((tokenUnit as any).toData())
    })
    return result
  }

  /**
   * Split token units
   */
  splitUnits (
    units: string[], // Array: token unit IDs
    remainderWallet: Wallet,
    recipientWallet: Wallet | null = null
  ): void {
    // No units supplied, nothing to split
    if (units.length === 0) {
      return
    }

    // Init recipient & remainder token units
    const recipientTokenUnits: TokenUnitType[] = []
    const remainderTokenUnits: TokenUnitType[] = []
    this.tokenUnits.forEach(tokenUnit => {
      if (units.includes((tokenUnit as any).id)) {
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
   */
  createRemainder (secret: string): Wallet {
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
   * Check if this is a shadow wallet
   */
  isShadow (): boolean {
    return (
      (typeof this.position === 'undefined' || this.position === null) &&
      (typeof this.address === 'undefined' || this.address === null)
    )
  }

  /**
   * Sets up a batch ID - either using the sender's, or a new one
   */
  initBatchId ({
    sourceWallet,
    isRemainder = false
  }: {
    sourceWallet: Wallet;
    isRemainder?: boolean;
  }): void {
    if (sourceWallet.batchId) {
      this.batchId = isRemainder ? sourceWallet.batchId : generateBatchId({})
    }
  }

  /**
   * Encrypt a message using ML-KEM
   */
  async encryptMessage (message: unknown, recipientPubkey: string): Promise<{
    cipherText: string;
    encryptedMessage: string;
  }> {
    const messageString = JSON.stringify(message)
    const messageUint8 = new TextEncoder().encode(messageString)
    const deserializedPubkey = this.deserializeKey(recipientPubkey)
    
    // Import ML-KEM for encryption
    const { ml_kem768: MlKEM768 } = await import('@noble/post-quantum/ml-kem')
    const { cipherText, sharedSecret } = MlKEM768.encapsulate(deserializedPubkey)
    const encryptedMessage = await this.encryptWithSharedSecret(messageUint8, sharedSecret)
    
    return {
      cipherText: this.serializeKey(cipherText),
      encryptedMessage: this.serializeKey(encryptedMessage)
    }
  }

  /**
   * Decrypt a message using ML-KEM
   */
  async decryptMessage (encryptedData: {
    cipherText: string;
    encryptedMessage: string;
  }): Promise<unknown | null> {
    const { cipherText, encryptedMessage } = encryptedData

    let sharedSecret: Uint8Array
    try {
      // Import ML-KEM for decryption
      const { ml_kem768: MlKEM768 } = await import('@noble/post-quantum/ml-kem')
      
      if (!this.mlkemKeys?.secretKey) {
        this.logger.error('decryptMessage() - No ML-KEM secret key available')
        return null
      }
      
      sharedSecret = MlKEM768.decapsulate(this.deserializeKey(cipherText), this.mlkemKeys.secretKey)
    } catch (e) {
      this.logger.error('decryptMessage() - Decapsulation failed', (e as Error).message)
      this.logger.debug('decryptMessage() - Debug info available in development mode')
      return null
    }

    let deserializedEncryptedMessage: Uint8Array
    try {
      deserializedEncryptedMessage = this.deserializeKey(encryptedMessage)
    } catch (e) {
      this.logger.warn('decryptMessage() - Deserialization failed', (e as Error).message)
      this.logger.debug('decryptMessage() - Debug info available in development mode')
      return null
    }

    let decryptedUint8: Uint8Array
    try {
      decryptedUint8 = await this.decryptWithSharedSecret(deserializedEncryptedMessage, sharedSecret)
    } catch (e) {
      this.logger.warn('decryptMessage() - Decryption failed', (e as Error).message)
      this.logger.debug('decryptMessage() - Debug info available in development mode')
      return null
    }

    let decryptedString: string
    try {
      decryptedString = new TextDecoder().decode(decryptedUint8)
    } catch (e) {
      this.logger.warn('decryptMessage() - Decoding failed', (e as Error).message)
      this.logger.debug('decryptMessage() - Debug info available in development mode')
      return null
    }

    return JSON.parse(decryptedString)
  }

  /**
   * Encrypt data with shared secret using AES-GCM
   */
  async encryptWithSharedSecret (message: Uint8Array, sharedSecret: Uint8Array): Promise<Uint8Array> {
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
   */
  async decryptWithSharedSecret (encryptedMessage: Uint8Array, sharedSecret: Uint8Array): Promise<Uint8Array> {
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

  /**
   * Serialize key to base64 string
   */
  private serializeKey (key: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, Array.from(key)))
  }

  /**
   * Deserialize key from base64 string
   */
  private deserializeKey (serializedKey: string): Uint8Array {
    try {
      const binaryString = atob(serializedKey)
      return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i))
    } catch (error) {
      // If base64 decoding fails, try hex decoding
      try {
        const bytes = new Uint8Array(serializedKey.length / 2)
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = parseInt(serializedKey.substr(i * 2, 2) ?? '00', 16)
        }
        return bytes
      } catch (hexError) {
        throw new Error(`Failed to deserialize key: ${error}`)
      }
    }
  }

  /**
   * Get a JSON representation of this wallet
   */
  toJSON (): Record<string, unknown> {
    return {
      token: this.token,
      balance: this.balance,
      address: this.address,
      position: this.position,
      bundle: this.bundle,
      batchId: this.batchId,
      characters: this.characters,
      publicKey: this.pubkey,
      tokenUnits: this.tokenUnits
    }
  }
}