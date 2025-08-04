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

// Import utility libraries from TypeScript versions (canon-equivalent)
import Dot from './libraries/Dot'
import Decimal from './libraries/Decimal'
import {
  generateBatchId,
  generateBundleHash,
  generateSecret
} from './libraries/crypto'
import { configureLogger } from './libraries/Logger'

// Import core classes from TypeScript versions (canon-equivalent)
import Molecule from './Molecule'
import Wallet from './Wallet'
import AuthToken from './AuthToken'

// Import GraphQL query operations from TypeScript versions (canon-equivalent)
import QueryWalletBundle from './query/QueryWalletBundle'
import QueryWalletList from './query/QueryWalletList'
import QueryBalance from './query/QueryBalance'
import QueryBatchHistory from './query/QueryBatchHistory'
import QueryActiveSession from './query/QueryActiveSession'
import QueryToken from './query/QueryToken'
import QueryMetaTypeViaAtom from './query/QueryMetaTypeViaAtom'
import QueryMetaType from './query/QueryMetaType'
import QueryBatch from './query/QueryBatch'
import QueryAtom from './query/QueryAtom'
import QueryPolicy from './query/QueryPolicy'
import QueryUserActivity from './query/QueryUserActivity'
import QueryContinuId from './query/QueryContinuId'

// Import GraphQL mutation operations from TypeScript versions (canon-equivalent)
import MutationRequestAuthorization from './mutation/MutationRequestAuthorization'
import MutationCreateToken from './mutation/MutationCreateToken'
import MutationRequestTokens from './mutation/MutationRequestTokens'
import MutationTransferTokens from './mutation/MutationTransferTokens'
import MutationCreateIdentifier from './mutation/MutationCreateIdentifier'
import MutationCreateWallet from './mutation/MutationCreateWallet'
import MutationProposeMolecule from './mutation/MutationProposeMolecule'
// import MutationActiveSession from './mutation/MutationActiveSession'  // TODO: Used in commented out activeSession method
import MutationCreateRule from './mutation/MutationCreateRule'
import MutationClaimShadowWallet from './mutation/MutationClaimShadowWallet'
// TODO: Missing TS versions - temporarily commented out
import MutationCreateMeta from './mutation/MutationCreateMeta'
// import MutationRequestAuthorizationGuest from './mutation/MutationRequestAuthorizationGuest.js'
import MutationDepositBufferToken from './mutation/MutationDepositBufferToken'
import MutationWithdrawBufferToken from './mutation/MutationWithdrawBufferToken'

// Import exceptions from TypeScript (migrated versions)
import TransferBalanceException from './exception/TransferBalanceException'
import CodeException from './exception/CodeException'
import UnauthenticatedException from './exception/UnauthenticatedException'
import StackableUnitDecimalsException from './exception/StackableUnitDecimalsException'
import StackableUnitAmountException from './exception/StackableUnitAmountException'
import BatchIdException from './exception/BatchIdException'
import AuthorizationRejectedException from './exception/AuthorizationRejectedException'
import WalletShadowException from './exception/WalletShadowException'

// Import subscription operations
import CreateMoleculeSubscribe from './subscribe/CreateMoleculeSubscribe'
import WalletStatusSubscribe from './subscribe/WalletStatusSubscribe'
import ActiveWalletSubscribe from './subscribe/ActiveWalletSubscribe'
import ActiveSessionSubscribe from './subscribe/ActiveSessionSubscribe'

// Import external dependencies
import {
  getFingerprint,
  getFingerprintData
} from '@thumbmarkjs/thumbmarkjs'
// Import UrqlClientWrapper from JS version for now
import UrqlClientWrapper from './libraries/urql/UrqlClientWrapper'

// Use UrqlClientWrapper type from types - actual implementation from JS version
// type UrqlClientWrapper = any

import type {
  WalletLike,
  UrqlClientWrapper as UrqlClientWrapperType
} from './types'

/**
 * Base client class providing a powerful but user-friendly wrapper
 * around complex Knish.IO ledger transactions.
 */
export default class KnishIOClient {
  // Instance properties (matching JavaScript canonical version)
  $__logging: boolean = false
  $__authTokenObjects: Record<string, AuthToken | null> = {}
  $__authInProcess: boolean = false
  $__uris: string[] = []
  $__cellSlug: string | null = null
  $__client: UrqlClientWrapperType | null = null
  $__serverSdkVersion: number = 3
  $__encrypt: boolean = false
  $__secret: string = ''
  $__bundle: string = ''
  $__authToken: AuthToken | null = null
  remainderWallet: WalletLike | null = null
  abortControllers: Map<string, AbortController> = new Map()
  $__logging_level: 'error' | 'warn' | 'info' | 'debug' = 'info'
  lastMoleculeQuery: any = null

  /**
   * Class constructor
   *
   * @param {string} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {UrqlClientWrapper|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  constructor ({
    uri,
    cellSlug = null,
    client = null,
    socket = null,
    serverSdkVersion = 3,
    logging = false
  }: {
    uri?: string | string[]
    cellSlug?: string | null
    client?: UrqlClientWrapperType | null
    socket?: object | null
    serverSdkVersion?: number
    logging?: boolean
  } = {}) {
    this.initialize({
      uri: uri || '',
      cellSlug,
      socket,
      client,
      serverSdkVersion,
      logging
    })
  }

  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string|[]} uri
   * @param {string|null} cellSlug
   * @param {object|null} socket
   * @param {UrqlClientWrapper|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  initialize ({
    uri,
    cellSlug = null,
    socket = null,
    client = null,
    serverSdkVersion = 3,
    logging = false
  }: {
    uri: string | string[]
    cellSlug?: string | null
    socket?: object | null
    client?: UrqlClientWrapperType | null
    serverSdkVersion?: number
    logging?: boolean
  }): void {
    this.reset()

    this.$__logging = logging
    this.$__authTokenObjects = {}
    this.$__authInProcess = false
    this.abortControllers = new Map()

    // Configure global logger to match client logging setting
    configureLogger({ enabled: logging, level: 'info' })

    this.setUri(uri)

    if (cellSlug) {
      this.setCellSlug(cellSlug)
    }

    for (const uriKey in this.$__uris) {
      const url = this.$__uris[uriKey]
      if (url) {
        this.$__authTokenObjects[url] = null
      }
    }

    this.log('info', `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${ serverSdkVersion }...`)

    this.$__client = client || new UrqlClientWrapper({
      socket: {
        ...{
          socketUri: null,
          appKey: 'knishio'
        },
        ...socket || {}
      },
      serverUri: this.getRandomUri()
    })

    this.$__serverSdkVersion = serverSdkVersion
  }

  /**
   * Get random uri from specified this.$__uris
   */
  getRandomUri(): string {
    const rand = Math.floor(Math.random() * (this.$__uris.length))
    return this.$__uris[rand] || ''
  }

  /**
   * Switch encryption on/off
   */
  switchEncryption(encrypt: boolean): boolean {
    if (this.$__encrypt === encrypt) {
      return false
    }
    this.log('info', `KnishIOClient::switchEncryption() - Forcing encryption ${encrypt ? 'on' : 'off'} to match node...`)

    // Set encryption
    this.$__encrypt = encrypt
    this.$__client?.setEncryption(encrypt)
    return true
  }

  /**
   * De-initializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize(): void {
    this.log('info', 'KnishIOClient::deinitialize() - Clearing the Knish.IO client session...')
    this.reset()
  }

  /**
   * Subscribes the client to the node's broadcast socket
   */
  subscribe(): any {
    if (!this.client().getSocketUri()) {
      throw new CodeException('KnishIOClient::subscribe() - Socket client not initialized!')
    }
    return this.client()
  }

  /**
   * Gets the client's SDK version
   */
  getServerSdkVersion(): number {
    return this.$__serverSdkVersion
  }

  /**
   * Sets the endpoint URI for this session
   *
   * @param {string|object} uri
   */
  setUri (uri: string | string[]): void {
    this.$__uris = typeof uri === 'object' ? uri : [uri]

    // If client exists, update its URI with a random one from the new array
    if (this.$__client) {
      const randomUri = this.getRandomUri()
      this.$__client.setUri(randomUri)
    }
  }

  /**
   * Retrieves the endpoint URI for this session
   *
   * @return {string}
   */
  getUri(): string {
    return this.$__client?.getUri() || ''
  }

  /**
   * Retrieves the endpoint URI for this session
   *
   * @deprecated Please use getUri() instead
   * @returns {string}
   */
  uri (): string {
    return this.getUri()
  }

  /**
   * Returns the currently defined Cell identifier for this session
   *
   * @deprecated Please use getCellSlug() instead
   * @return {string|null}
   */
  cellSlug (): string | null {
    return this.getCellSlug()
  }

  /**
   * Returns the currently defined Cell identifier for this session
   *
   * @return {string|null}
   */
  getCellSlug (): string | null {
    return this.$__cellSlug || null
  }

  /**
   * Sets the Cell identifier for this session
   *
   * @param {string} cellSlug
   */
  setCellSlug (cellSlug: string): void {
    this.$__cellSlug = cellSlug
  }


  /**
   * Sets the bundle hash for this session
   *
   * @param {string} bundle
   */
  setBundle (bundle: string): void {
    this.$__bundle = bundle
  }



  /**
   * Returns an auth token for the specified endpoint, or null if none exists
   *
   * @param {string|null} uri
   * @return {AuthToken|null}
   */
  authToken (uri: string | null = null): AuthToken | null {
    const targetUri = uri || this.getRandomUri()
    return this.$__authTokenObjects[targetUri] || null
  }


  /**
   * Gets the client instance
   */
  client(): UrqlClientWrapperType {
    if (!this.$__client) {
      throw new CodeException('KnishIOClient::client() - Client not initialized!')
    }

    if (!this.$__authInProcess) {
      const randomUri = this.getRandomUri()
      this.$__client.setUri(randomUri)

      // Try to get stored auth token object
      const authTokenObject = this.$__authTokenObjects[randomUri]

      // Not authorized - try to do it
      if (!authTokenObject) {
        // Note: requestAuthToken implementation needed
        // this.requestAuthToken({
        //   secret: this.$__secret,
        //   cellSlug: this.$__cellSlug,
        //   encrypt: this.$__encrypt
        // }).then(() => {
        //   // Success
        // })
      } else {
        // Use stored authorization data
        this.$__client.setAuthData(authTokenObject.getAuthData())
      }
    }
    return this.$__client
  }

  /**
   * Returns whether a secret is being stored for this session
   */
  hasSecret(): boolean {
    return !!this.$__secret
  }

  /**
   * Set the client's secret
   */
  setSecret(secret: string): void {
    this.$__secret = secret
    this.$__bundle = this.hashSecret(secret, 'setSecret')
  }

  /**
   * Hashes the user secret to produce a bundle hash
   */
  hashSecret(secret: string, source: string | null = null): string {
    this.log('info', `KnishIOClient::hashSecret(${source ? `source: ${source}` : ''}) - Computing wallet bundle from secret...`)
    return generateBundleHash(secret)
  }

  /**
   * Retrieves the stored secret for this session
   */
  getSecret(): string {
    if (!this.hasSecret()) {
      throw new UnauthenticatedException('KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?')
    }
    return this.$__secret
  }

  /**
   * Returns whether a bundle hash is being stored for this session
   */
  hasBundle(): boolean {
    return !!this.$__bundle
  }

  /**
   * Returns the bundle hash for this session
   */
  getBundle(): string {
    if (!this.hasBundle()) {
      throw new UnauthenticatedException('KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?')
    }
    return this.$__bundle
  }

  /**
   * Retrieves the device fingerprint
   */
  getFingerprint(): Promise<string> {
    return getFingerprint()
  }

  /**
   * Gets device fingerprint data
   */
  async getFingerprintData(): Promise<Record<string, unknown>> {
    return await getFingerprintData()
  }

  /**
   * Retrieves this session's wallet used for signing the next Molecule
   *
   * @return {Promise<Wallet>}
   */
  async getSourceWallet(): Promise<Wallet> {
    let sourceWallet = (await this.queryContinuId({
      bundle: this.getBundle()
    })).payload()

    if (!sourceWallet) {
      sourceWallet = new Wallet({
        secret: this.getSecret()
      })
    } else {
      ;(sourceWallet as any).key = Wallet.generateKey({
        secret: this.getSecret(),
        token: sourceWallet.token,
        position: sourceWallet.position
      })
    }

    return sourceWallet
  }

  /**
   * Queries the ledger for the next ContinuId wallet
   *
   * @param {string} bundle - The bundle hash used in the query.
   * @returns {Promise<any>} - A promise that resolves to the result of the query.
   */
  async queryContinuId({
    bundle
  }: {
    bundle: string
  }): Promise<any> {
    const query = this.createQuery(QueryContinuId)

    return this.executeQuery(query, {
      bundle
    })
  }

  /**
   * Instantiates a new Molecule and prepares this client session to operate on it
   *
   * @param secret
   * @param bundle
   * @param sourceWallet
   * @param remainderWallet
   * @return {Promise<Molecule>}
   */
  async createMolecule({
    secret = null,
    bundle = null,
    sourceWallet = null,
    remainderWallet = null,
    version = null
  }: {
    secret?: string | null
    bundle?: string | null
    sourceWallet?: WalletLike | null
    remainderWallet?: WalletLike | null
    version?: number | null
  } = {}): Promise<any> {
    this.log('info', 'KnishIOClient::createMolecule() - Creating a new molecule...')

    secret = secret || this.getSecret()
    bundle = bundle || this.getBundle()

    // Sets the source wallet as the last remainder wallet (to maintain ContinuID)
    if (!sourceWallet &&
      this.lastMoleculeQuery &&
      this.getRemainderWallet()?.token === 'USER' &&
      this.lastMoleculeQuery.response() &&
      this.lastMoleculeQuery.response().success()
    ) {
      sourceWallet = this.getRemainderWallet()
    }

    // Unable to use last remainder wallet; Figure out what wallet to use:
    if (sourceWallet === null) {
      sourceWallet = await this.getSourceWallet()
    }

    // Set the remainder wallet for the next transaction
    this.remainderWallet = remainderWallet || Wallet.create({
      secret,
      bundle,
      token: 'USER',
      batchId: (sourceWallet as any)?.batchId,
      characters: (sourceWallet as any)?.characters
    })

    return new Molecule({
      secret,
      sourceWallet,
      remainderWallet: this.getRemainderWallet(),
      cellSlug: this.getCellSlug(),
      version: version !== null ? String(version) : String(this.getServerSdkVersion())
    })
  }

  /**
   * Returns the remainder wallet for this session
   */
  getRemainderWallet (): WalletLike {
    if (!this.remainderWallet) {
      throw new UnauthenticatedException('KnishIOClient::getRemainderWallet() - Unable to locate remainder wallet!')
    }
    return this.remainderWallet
  }

  /**
   * Transfers tokens to another wallet
   *
   * @param {object} options
   */
  async transferToken ({
    bundleHash,
    token,
    amount = null,
    units = [],
    batchId = null,
    sourceWallet = null
  }: {
    bundleHash: string
    token: string
    amount?: number | string | null
    units?: any[]
    batchId?: string | null
    sourceWallet?: WalletLike | null
  }): Promise<any> {
    // Calculate amount & set meta key
    if (units.length > 0) {
      // Can't move stackable units AND provide amount
      if (amount && Number(amount) > 0) {
        throw new StackableUnitAmountException()
      }

      amount = units.length
    }

    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token,
        amount: amount ? Number(amount) : 0
      })
    }

    // Do you have enough tokens?
    if (sourceWallet === null || Decimal.cmp(sourceWallet.balance, Number(amount || 0)) < 0) {
      throw new TransferBalanceException()
    }

    // Attempt to get the recipient's wallet, if not provided
    const recipientWallet = Wallet.create({
      bundle: bundleHash,
      token
    })

    // Compute the batch ID for the recipient
    // (typically used by stackable tokens)
    if (batchId !== null) {
      ;(recipientWallet as any).batchId = batchId
    } else {
      ;(recipientWallet as any).initBatchId({
        sourceWallet
      })
    }

    // Create a remainder from the source wallet
    const remainderWallet = (sourceWallet as any).createRemainder(this.getSecret())

    // --- Token units splitting
    ;(sourceWallet as any).splitUnits(
      units,
      remainderWallet,
      recipientWallet
    )
    // ---

    // Build the molecule itself
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })

    const query = await this.createMoleculeMutation({
      mutationClass: MutationTransferTokens,
      molecule
    })

    query.fillMolecule({
      recipientWallet,
      amount
    })

    return await this.executeQuery(query)
  }

  /**
   * Queries for a source wallet with sufficient balance
   */
  async querySourceWallet ({
    token,
    amount,
    type = 'regular'
  }: {
    token: string
    amount: number
    type?: string
  }): Promise<WalletLike | null> {
    // TODO: Implement proper source wallet query
    this.log('info', `KnishIOClient::querySourceWallet() - Finding wallet for ${amount} ${token} (type: ${type})`)
    
    // For now, return the current wallet
    return await this.getSourceWallet()
  }

  /**
   * Creates a new wallet for a specific token
   */
  async createWallet ({
    token
  }: {
    token: string
  }): Promise<any> {
    const newWallet = new Wallet({
      secret: this.getSecret(),
      token
    })

    const query = await this.createMoleculeMutation({
      mutationClass: MutationCreateWallet
    })

    query.fillMolecule(newWallet)

    return await this.executeQuery(query)
  }

  /**
   * Creates a new token
   */
  async createToken ({
    token,
    amount = null,
    meta = null,
    batchId = null,
    units = []
  }: {
    token: string
    amount?: number | string | null
    meta?: Record<string, any> | null
    batchId?: string | null
    units?: any[]
  }): Promise<any> {
    // What is the fungibility mode for this token?
    const fungibility = Dot.get(meta || {}, 'fungibility')

    // For stackable token - create a batch ID
    if (fungibility === 'stackable') {
      if (!meta) meta = {}
      meta.batchId = batchId || generateBatchId({})
    }

    // Special logic for token unit initialization (nonfungible || stackable)
    if (['nonfungible', 'stackable'].includes(fungibility as string) && units.length > 0) {
      // Stackable tokens with Unit IDs must not use decimals
      if ((Dot.get((meta as Record<string, any>) || {}, 'decimals') as number) > 0) {
        throw new StackableUnitDecimalsException()
      }

      // Can't create stackable units AND provide amount
      if (amount && Number(amount) > 0) {
        throw new StackableUnitAmountException()
      }

      // Calculating amount based on Unit IDs
      amount = units.length
      if (!meta) meta = {} as Record<string, any>
      ;(meta as Record<string, any>).splittable = 1
    }

    const query = await this.createMoleculeMutation({
      mutationClass: MutationCreateToken
    })

    query.fillMolecule({
      token,
      amount: amount ? String(amount) : '0',
      meta: meta || {},
      units
    })

    return await this.executeQuery(query)
  }

  /**
   * Requests tokens from the network
   */
  async requestTokens ({
    token,
    to,
    amount = null,
    units = [],
    meta = null,
    batchId = null
  }: {
    token: string
    to: string
    amount?: number | string | null
    units?: any[]
    meta?: Record<string, any> | null
    batchId?: string | null
  }): Promise<any> {
    let metaType: string | undefined,
        metaId: string | undefined

    meta = meta || {}

    // Get a token & init is Stackable flag for batch ID initialization
    const queryToken = this.createQuery(QueryToken)
    const tokenResponse = await this.executeQuery(queryToken, {
      slug: token
    })
    const isStackable = Dot.get(tokenResponse.data(), '0.fungibility') === 'stackable'

    // NON-stackable tokens & batch ID is NOT NULL - error
    if (!isStackable && batchId !== null) {
      throw new BatchIdException('Expected Batch ID = null for non-stackable tokens.')
    }
    // Stackable tokens & batch ID is NULL - generate new one
    if (isStackable && batchId === null) {
      batchId = generateBatchId({})
    }

    // Calculate amount & set meta key
    if (units.length > 0) {
      // Can't move stackable units AND provide amount
      if (amount && Number(amount) > 0) {
        throw new StackableUnitAmountException()
      }

      amount = units.length
      metaType = 'walletBundle'
      metaId = to
    }

    const query = await this.createMoleculeMutation({
      mutationClass: MutationRequestTokens
    })

    query.fillMolecule({
      token,
      to,
      amount: amount ? String(amount) : '0',
      meta,
      batchId,
      units,
      metaType,
      metaId
    })

    return await this.executeQuery(query)
  }

  /**
   * Request an auth token (guest or profile)
   *
   * @param secret
   * @param seed
   * @param cellSlug
   * @param encrypt
   * @returns {Promise<any|null>}
   */
  async requestAuthToken({
    secret = null,
    seed = null,
    cellSlug = null,
    encrypt = false
  }: {
    secret?: string | null
    seed?: string | null
    cellSlug?: string | null
    encrypt?: boolean
  } = {}): Promise<any | null> {
    // SDK versions 2 and below do not utilize an authorization token
    if (this.$__serverSdkVersion < 3) {
      this.log('warn', 'KnishIOClient::authorize() - Server SDK version does not require an authorization...')
      return null
    }

    // Generate a secret from the seed if it has been passed
    if (secret === null && seed) {
      secret = generateSecret(seed)
    }

    // Set cell slug if it has been passed
    if (cellSlug) {
      this.setCellSlug(cellSlug)
    }

    // Auth in process...
    this.$__authInProcess = true

    // Auth token response
    let response: any

    // Authorized user
    if (secret) {
      response = await this.requestProfileAuthToken({
        secret,
        encrypt
      })
    } else {
      // Guest
      // TODO: Implement guest auth when MutationRequestAuthorizationGuest TS version is available
      /*
      response = await this.requestGuestAuthToken({
        cellSlug,
        encrypt
      })
      */
      throw new UnauthenticatedException('KnishIOClient::requestAuthToken() - Guest authentication not yet implemented in TypeScript version')
    }

    // Set auth token
    this.log('info', `KnishIOClient::authorize() - Successfully retrieved auth token ${this.getAuthToken()?.getToken()}...`)

    // Switch encryption mode if it has been changed
    this.switchEncryption(encrypt)

    // Auth process is stopped
    this.$__authInProcess = false

    // Return full response
    return response
  }

  /**
   * Creates a query instance
   */
  createQuery (queryClass: any): any {
    return new queryClass()
  }

  /**
   * Uses the supplied Mutation class to build a new tailored Molecule
   *
   * @param mutationClass
   * @param molecule
   */
  async createMoleculeMutation({
    mutationClass,
    molecule = null
  }: {
    mutationClass: any
    molecule?: any | null
  }): Promise<any> {
    this.log('info', `KnishIOClient::createMoleculeMutation() - Creating a new ${mutationClass.name} query...`)

    // If you don't supply the molecule, we'll generate one for you
    const _molecule = molecule || await this.createMolecule({})

    const mutation = new mutationClass(this.client(), this, _molecule)

    // TODO: Add proper type checking when MutationProposeMolecule is available
    // if (!(mutation instanceof MutationProposeMolecule)) {
    //   throw new CodeException(`${this.constructor.name}::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`)
    // }

    this.lastMoleculeQuery = mutation

    return mutation
  }

  /**
   * Executes a query or mutation with enhanced functionality
   *
   * @param query
   * @param variables
   * @returns {Promise<*>}
   */
  async executeQuery(query: any, variables: any = null): Promise<any> {
    // Check and refresh authorization token if needed
    if (this.$__authToken && this.$__authToken.isExpired()) {
      this.log('info', 'KnishIOClient::executeQuery() - Access token is expired. Getting new one...')
      await this.requestAuthToken({
        secret: this.$__secret,
        cellSlug: this.$__cellSlug,
        encrypt: this.$__encrypt
      })
    }

    // Create a new AbortController for this query
    const abortController = new AbortController()
    const queryKey = JSON.stringify({
      query: query.$__query,
      variables
    })
    this.abortControllers.set(queryKey, abortController)

    try {
      // Use the existing query execution method, but add the abort signal
      const result = await query.execute({
        variables,
        context: {
          fetchOptions: {
            signal: abortController.signal
          }
        }
      })

      // Remove the AbortController after the query is complete
      this.abortControllers.delete(queryKey)

      return result
    } catch (error: any) {
      if (error.name === 'AbortError') {
        this.log('warn', 'Query was cancelled')
      } else {
        throw error
      }
    }
  }

  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} token
   * @param {string|null} bundle
   * @param {string} type
   * @returns {Promise<*>}
   */
  async queryBalance({
    token,
    bundle = null,
    type = 'regular'
  }: {
    token: string
    bundle?: string | null
    type?: string
  }): Promise<any> {
    const query = this.createQuery(QueryBalance)

    // Execute query with either the provided bundle hash or the active client's bundle
    return this.executeQuery(query, {
      bundleHash: bundle || this.getBundle(),
      token,
      type
    })
  }

  /**
   * Queries wallet bundle metadata.
   *
   * @param {Object} options - The options for the query.
   * @param {string|string[]|null} options.bundle - The bundle to query. Default is null.
   * @param {string|null} options.fields - The fields to retrieve. Default is null.
   * @param {boolean} options.raw - Whether to return the raw response or the payload. Default is false.
   * @returns {Promise<any>} - A promise that resolves to the response or payload.
   */
  queryBundle({
    bundle = null,
    raw = false
  }: {
    bundle?: string | string[] | null
    raw?: boolean
  }): Promise<any> {
    this.log('info', `KnishIOClient::queryBundle() - Querying wallet bundle metadata${bundle ? ` for ${bundle}` : ''}...`)

    // Bundle default init & to array conversion
    let bundleArray: string[]
    if (!bundle) {
      bundleArray = [this.getBundle()]
    } else if (typeof bundle === 'string') {
      bundleArray = [bundle]
    } else {
      bundleArray = bundle
    }

    const query = this.createQuery(QueryWalletBundle)
    return this.executeQuery(query, { bundleHashes: bundleArray })
      .then((response: any) => {
        return raw ? response : response.payload()
      })
  }

  /**
   * Queries wallets based on the provided parameters.
   *
   * @param {object} options - The options for querying wallets.
   * @param {string|null} options.bundle - The bundle to query wallets for.
   * @param {string|null} options.token - The token to query wallets for.
   * @param {boolean} [options.unspent=true] - Whether to include unspent wallets or not.
   *
   * @returns {Promise<any>} - A promise that resolves to the response payload of the query.
   */
  queryWallets({
    bundle = null,
    token = null,
    unspent = true
  }: {
    bundle?: string | null
    token?: string | null
    unspent?: boolean
  }): Promise<any> {
    this.log('info', `KnishIOClient::queryWallets() - Querying wallets${bundle ? ` for ${bundle}` : ''}...`)

    const walletQuery = this.createQuery(QueryWalletList)

    return this.executeQuery(walletQuery, {
      bundleHash: bundle || this.getBundle(),
      tokenSlug: token,
      unspent
    })
      .then((response: any) => {
        return response.payload()
      })
  }

  /**
   * Queries the ledger to retrieve a list of active sessions for the given MetaType
   *
   * @param {string} bundleHash - The hash of the session bundle.
   * @param {string} metaType - The type of metadata associated with the session.
   * @param {string} metaId - The ID of the metadata associated with the session.
   * @returns {Promise<any>} - Returns a promise containing the result of the query.
   */
  async queryActiveSession({
    bundleHash,
    metaType,
    metaId
  }: {
    bundleHash: string
    metaType: string
    metaId: string
  }): Promise<any> {
    const query = this.createQuery(QueryActiveSession)

    return await this.executeQuery(query, {
      bundleHash,
      metaType,
      metaId
    })
  }

  /**
   * Queries user activity based on the provided parameters.
   *
   * @param {string} bundleHash - The bundle hash.
   * @param {string} metaType - The meta type.
   * @param {string} metaId - The meta ID.
   * @param {string} ipAddress - The IP address.
   * @param {string} browser - The browser.
   * @param {string} osCpu - The operating system and CPU.
   * @param {string} resolution - The screen resolution.
   * @param {string} timeZone - The time zone.
   * @param {string} countBy - The count by parameter.
   * @param {string} interval - The interval parameter.
   *
   * @returns {Promise<any>} The result of the query.
   */
  async queryUserActivity({
    bundleHash,
    metaType,
    metaId,
    ipAddress,
    browser,
    osCpu,
    resolution,
    timeZone,
    countBy,
    interval
  }: {
    bundleHash: string
    metaType: string
    metaId: string
    ipAddress: string
    browser: string
    osCpu: string
    resolution: string
    timeZone: string
    countBy: string
    interval: string
  }): Promise<any> {
    const query = this.createQuery(QueryUserActivity)

    return await this.executeQuery(query, {
      bundleHash,
      metaType,
      metaId,
      ipAddress,
      browser,
      osCpu,
      resolution,
      timeZone,
      countBy,
      interval
    })
  }

  /**
   * Retrieves metadata for the given metaType and provided parameters
   *
   * @param {string|string[]|null} metaType
   * @param {string|string[]|null} metaId
   * @param {string|string[]|null} key
   * @param {string|string[]|null} value
   * @param {boolean|null} latest
   * @param {object|null} fields
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @param {boolean} throughAtom
   * @param {any[]|null} values
   * @param {any[]|null} keys
   * @param {any[]|null} atomValues
   * @return {Promise<any>}
   */
  queryMeta({
    metaType,
    metaId = null,
    key = null,
    value = null,
    latest = true,
    filter = null,
    queryArgs = null,
    count = null,
    countBy = null,
    throughAtom = true,
    values = null,
    keys = null,
    atomValues = null
  }: {
    metaType: string | string[] | null
    metaId?: string | string[] | null
    key?: string | string[] | null
    value?: string | string[] | null
    latest?: boolean | null
    filter?: object | null
    queryArgs?: object | null
    count?: string | null
    countBy?: string | null
    throughAtom?: boolean
    values?: any[] | null
    keys?: any[] | null
    atomValues?: any[] | null
  }): Promise<any> {
    this.log('info', `KnishIOClient::queryMeta() - Querying metaType: ${metaType}, metaId: ${metaId}...`)

    let query: any
    let variables: any

    if (throughAtom) {
      query = this.createQuery(QueryMetaTypeViaAtom)
      variables = (QueryMetaTypeViaAtom as any).createVariables({
        metaType,
        metaId,
        key,
        value,
        latest,
        filter,
        queryArgs,
        countBy,
        values,
        keys,
        atomValues
      })
    } else {
      query = this.createQuery(QueryMetaType)
      variables = (QueryMetaType as any).createVariables({
        metaType,
        metaId,
        key,
        value,
        latest,
        filter,
        queryArgs,
        count,
        countBy
      })
    }

    return this.executeQuery(query, variables)
      .then((response: any) => {
        return response.payload()
      })
  }

  /**
   * Query batch to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatch({
    batchId
  }: {
    batchId: string
  }): Promise<any> {
    this.log('info', `KnishIOClient::queryBatch() - Querying cascading meta instances for batchId: ${batchId}...`)
    const query = this.createQuery(QueryBatch)
    return await this.executeQuery(query, {
      batchId
    })
  }

  /**
   * Query batch history to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatchHistory({
    batchId
  }: {
    batchId: string
  }): Promise<any> {
    this.log('info', `KnishIOClient::queryBatchHistory() - Querying cascading meta instances for batchId: ${batchId}...`)

    const query = this.createQuery(QueryBatchHistory)

    return await this.executeQuery(query, {
      batchId
    })
  }

  /**
   * Queries atom instances based on the provided parameters.
   *
   * @param {string[]} molecularHashes - Array of multiple molecular hashes.
   * @param {string} molecularHash - Single molecular hash.
   * @param {string[]} bundleHashes - Array of multiple bundle hashes.
   * @param {string} bundleHash - Single bundle hash.
   * @param {number[]} positions - Array of multiple positions.
   * @param {number} position - Single position.
   * @param {string[]} walletAddresses - Array of multiple wallet addresses.
   * @param {string} walletAddress - Single wallet address.
   * @param {string[]} isotopes - Array of multiple isotopes.
   * @param {string} isotope - Single isotope.
   * @param {string[]} tokenSlugs - Array of multiple token slugs.
   * @param {string} tokenSlug - Single token slug.
   * @param {string[]} cellSlugs - Array of multiple cell slugs.
   * @param {string} cellSlug - Single cell slug.
   * @param {string[]} batchIds - Array of multiple batch IDs.
   * @param {string} batchId - Single batch ID.
   * @param {any[]} values - Array of multiple values.
   * @param {any} value - Single value.
   * @param {string[]} metaTypes - Array of multiple meta types.
   * @param {string} metaType - Single meta type.
   * @param {string[]} metaIds - Array of multiple meta IDs.
   * @param {string} metaId - Single meta ID.
   * @param {string[]} indexes - Array of multiple atom indices.
   * @param {string} index - Single atom index.
   * @param {object} filter - The filter object.
   * @param {boolean} latest - The latest flag.
   * @param {object} [queryArgs] - The query arguments (limit, offset).
   * @param {number} [queryArgs.limit=15] - The limit.
   * @param {number} [queryArgs.offset=1] - The offset.
   *
   * @returns {Promise<any>} - A promise that resolves with the queried atom instances.
   */
  async queryAtom({
    molecularHashes,
    molecularHash,
    bundleHashes,
    bundleHash,
    positions,
    position,
    walletAddresses,
    walletAddress,
    isotopes,
    isotope,
    tokenSlugs,
    tokenSlug,
    cellSlugs,
    cellSlug,
    batchIds,
    batchId,
    values,
    value,
    metaTypes,
    metaType,
    metaIds,
    metaId,
    indexes,
    index,
    filter,
    latest,
    queryArgs = {
      limit: 15,
      offset: 1
    }
  }: {
    molecularHashes?: string[]
    molecularHash?: string
    bundleHashes?: string[]
    bundleHash?: string
    positions?: number[]
    position?: number
    walletAddresses?: string[]
    walletAddress?: string
    isotopes?: string[]
    isotope?: string
    tokenSlugs?: string[]
    tokenSlug?: string
    cellSlugs?: string[]
    cellSlug?: string
    batchIds?: string[]
    batchId?: string
    values?: any[]
    value?: any
    metaTypes?: string[]
    metaType?: string
    metaIds?: string[]
    metaId?: string
    indexes?: string[]
    index?: string
    filter?: object
    latest?: boolean
    queryArgs?: {
      limit?: number
      offset?: number
    }
  }): Promise<any> {
    this.log('info', 'KnishIOClient::queryAtom() - Querying atom instances')

    const query = this.createQuery(QueryAtom)

    return await this.executeQuery(query, (QueryAtom as any).createVariables({
      molecularHashes,
      molecularHash,
      bundleHashes,
      bundleHash,
      positions,
      position,
      walletAddresses,
      walletAddress,
      isotopes,
      isotope,
      tokenSlugs,
      tokenSlug,
      cellSlugs,
      cellSlug,
      batchIds,
      batchId,
      values,
      value,
      metaTypes,
      metaType,
      metaIds,
      metaId,
      indexes,
      index,
      filter,
      latest,
      queryArgs
    }))
  }

  /**
   * Queries the policy based on the provided metaType and metaId.
   *
   * @param {string} metaType - The type of the meta.
   * @param {string} metaId - The ID of the meta.
   * @returns {Promise<any>} - A Promise that resolves to the query result.
   */
  async queryPolicy({
    metaType,
    metaId
  }: {
    metaType: string
    metaId: string
  }): Promise<any> {
    const query = this.createQuery(QueryPolicy)
    return await this.executeQuery(query, {
      metaType,
      metaId
    })
  }

  /**
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType - The type of the metadata entry.
   * @param {string} metaId - The ID of the metadata entry.
   * @param {object|array} meta - The metadata object.
   * @param {object} [policy={}] - The policy object.
   * @returns {Promise<any>} - A Promise that resolves with the created metadata entry.
   */
  async createMeta({
    metaType,
    metaId,
    meta = null,
    policy = {}
  }: {
    metaType: string
    metaId: string
    meta?: object | any[] | null
    policy?: object
  }): Promise<any> {
    const query = await this.createMoleculeMutation({
        mutationClass: MutationCreateMeta,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    )

    const metas = meta || {}

    query.fillMolecule({
      metaType,
      metaId,
      meta: metas,
      policy
    })

    return await this.executeQuery(query)
  }

  /**
   * Creates a new rule with the specified parameters.
   *
   * @param {string} metaType - The type of the metadata associated with the rule.
   * @param {string} metaId - The ID of the metadata associated with the rule.
   * @param {object} rule - The rule object.
   * @param {object} [policy={}] - The policy object. (optional)
   * @returns {Promise<any>} - A promise that resolves to the created rule.
   */
  async createRule({
    metaType,
    metaId,
    rule,
    policy = {}
  }: {
    metaType: string
    metaId: string
    rule: object
    policy?: object
  }): Promise<any> {
    const query = await this.createMoleculeMutation({
        mutationClass: MutationCreateRule,
        molecule: await this.createMolecule({
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        })
      }
    )

    query.fillMolecule({
      metaType,
      metaId,
      rule,
      policy
    })

    return await this.executeQuery(query)
  }

  /**
   * Creates a policy for a given metaType and metaId.
   *
   * @param {Object} options - The options for creating the policy.
   * @param {string} options.metaType - The type of the meta.
   * @param {string} options.metaId - The ID of the meta.
   * @param {Object} [options.policy={}] - The policy object.
   * @returns {Promise<*>} - A promise that resolves with the result of the execution.
   */
  async createPolicy({
    metaType,
    metaId,
    policy = {}
  }: {
    metaType: string
    metaId: string
    policy?: object
  }): Promise<any> {
    // Create a molecule
    const molecule = await this.createMolecule({})
    ;(molecule as any).addPolicyAtom({
      metaType,
      metaId,
      meta: {},
      policy
    })
    ;(molecule as any).addContinuIdAtom()
    ;(molecule as any).sign({
      bundle: this.getBundle()
    })
    ;(molecule as any).check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return await this.executeQuery(query)
  }

  /**
   * Builds and executes a molecule to create a new identifier on the ledger
   *
   * @param {string} type - The type of the identifier.
   * @param {string} contact - The contact associated with the identifier.
   * @param {string} code - The code for the identifier.
   * @returns {Promise<any>} - A promise that resolves to the created identifier.
   */
  async createIdentifier({
    type,
    contact,
    code
  }: {
    type: string
    contact: string
    code: string
  }): Promise<any> {
    const query = await this.createMoleculeMutation({
      mutationClass: MutationCreateIdentifier
    })

    query.fillMolecule({
      type,
      contact,
      code
    })

    return await this.executeQuery(query)
  }

  /**
   * Claims a shadow wallet for a given token.
   *
   * @param {string} token - The token for which to claim the shadow wallet.
   * @param {string|null} batchId - The batch ID of the shadow wallet (optional).
   * @param {any|null} molecule - The molecule associated with the shadow wallet (optional).
   *
   * @returns {Promise<any>} - A promise that resolves to the result of the claim operation.
   */
  async claimShadowWallet({
    token,
    batchId = null,
    molecule = null
  }: {
    token: string
    batchId?: string | null
    molecule?: any | null
  }): Promise<any> {
    const query = await this.createMoleculeMutation({
      mutationClass: MutationClaimShadowWallet,
      molecule
    })

    query.fillMolecule({
      token,
      batchId
    })

    return await this.executeQuery(query)
  }

  /**
   * Claims all shadow wallets for a given token.
   *
   * @param {Object} options - The options for claiming shadow wallets.
   * @param {string} options.token - The token to claim shadow wallets for.
   * @returns {Promise<*>} - A promise that resolves to an array of responses from claiming shadow wallets.
   * @throws {WalletShadowException} - If the shadow wallet list is invalid or if a non-shadow wallet is found.
   */
  async claimShadowWallets({
    token
  }: {
    token: string
  }): Promise<any[]> {
    // --- Get & check a shadow wallet list
    const shadowWallets = await this.queryWallets({ token })
    if (!shadowWallets || !Array.isArray(shadowWallets)) {
      throw new WalletShadowException()
    }

    shadowWallets.forEach((shadowWallet: any) => {
      if (!shadowWallet.isShadow()) {
        throw new WalletShadowException()
      }
    })
    // ----

    const responses = []
    for (const shadowWallet of shadowWallets) {
      responses.push(await this.claimShadowWallet({
        token,
        batchId: shadowWallet.batchId
      }))
    }
    return responses
  }

  /**
   * Builds and executes a molecule to destroy the specified Token units
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {any[]|null} units
   * @param {any|null} sourceWallet
   * @return {Promise<any>}
   */
  async burnTokens({
    token,
    amount = null,
    units = [],
    sourceWallet = null
  }: {
    token: string
    amount?: number | null
    units?: any[]
    sourceWallet?: any | null
  }): Promise<any> {
    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token,
        amount: amount || 0
      })
    }

    // Remainder wallet
    const remainderWallet = (sourceWallet as any).createRemainder(this.getSecret())

    // Calculate amount & set meta key
    if (units.length > 0) {
      // Can't burn stackable units AND provide amount
      if (amount && amount > 0) {
        throw new StackableUnitAmountException()
      }

      // Calculating amount based on Unit IDs
      amount = units.length

      // --- Token units splitting
      ;(sourceWallet as any).splitUnits(
        units,
        remainderWallet
      )
      // ---
    }

    // Create a molecule
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    ;(molecule as any).burnToken({ amount })
    ;(molecule as any).sign({
      bundle: this.getBundle()
    })
    ;(molecule as any).check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return this.executeQuery(query)
  }

  /**
   * Builds and executes a molecule to replenish the specified Token units
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {any[]|null} units
   * @param {any|null} sourceWallet
   * @return {Promise<any>}
   */
  async replenishToken({
    token,
    amount = null,
    units = [],
    sourceWallet = null
  }: {
    token: string
    amount?: number | null
    units?: any[]
    sourceWallet?: any | null
  }): Promise<any> {
    if (sourceWallet === null) {
      sourceWallet = (await this.queryBalance({ token })).payload()
    }
    if (!sourceWallet) {
      throw new TransferBalanceException('Source wallet is missing or invalid.')
    }

    // Remainder wallet
    const remainderWallet = (sourceWallet as any).createRemainder(this.getSecret())

    // Create a molecule
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    ;(molecule as any).replenishToken({
      amount,
      units
    })
    ;(molecule as any).sign({
      bundle: this.getBundle()
    })
    ;(molecule as any).check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return this.executeQuery(query)
  }

  /**
   * Fuses token units into a new unit
   *
   * @param bundleHash
   * @param tokenSlug
   * @param newTokenUnit
   * @param fusedTokenUnitIds
   * @param sourceWallet
   * @returns {Promise<*>}
   */
  async fuseToken({
    bundleHash,
    tokenSlug,
    newTokenUnit,
    fusedTokenUnitIds,
    sourceWallet = null
  }: {
    bundleHash: string
    tokenSlug: string
    newTokenUnit: any
    fusedTokenUnitIds: any[]
    sourceWallet?: any | null
  }): Promise<any> {
    if (sourceWallet === null) {
      sourceWallet = (await this.queryBalance({ token: tokenSlug })).payload()
    }

    // Check source wallet
    if (sourceWallet === null) {
      throw new TransferBalanceException('Source wallet is missing or invalid.')
    }
    if (!sourceWallet.tokenUnits || !sourceWallet.tokenUnits.length) {
      throw new TransferBalanceException('Source wallet does not have token units.')
    }
    if (!fusedTokenUnitIds.length) {
      throw new TransferBalanceException('Fused token unit list is empty.')
    }

    // Check fused token units
    const sourceTokenUnitIds: any[] = []
    sourceWallet.tokenUnits.forEach((tokenUnit: any) => {
      sourceTokenUnitIds.push(tokenUnit.id)
    })
    fusedTokenUnitIds.forEach((tokenUnitId: any) => {
      if (!sourceTokenUnitIds.includes(tokenUnitId)) {
        throw new TransferBalanceException(`Fused token unit ID = ${tokenUnitId} does not found in the source wallet.`)
      }
    })

    // Generate new recipient wallet if only recipient secret has been passed
    const recipientWallet = Wallet.create({
      bundle: bundleHash,
      token: tokenSlug
    })

    // Set batch ID
    ;(recipientWallet as any).initBatchId({ sourceWallet })

    // Remainder wallet
    const remainderWallet = (sourceWallet as any).createRemainder(this.getSecret())

    // Split token units (fused)
    ;(sourceWallet as any).splitUnits(fusedTokenUnitIds, remainderWallet)

    // Set recipient new fused token unit
    newTokenUnit.metas.fusedTokenUnits = (sourceWallet as any).getTokenUnitsData()
    ;(recipientWallet as any).tokenUnits = [newTokenUnit]

    // Create a molecule
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    ;(molecule as any).fuseToken((sourceWallet as any).tokenUnits, recipientWallet)
    ;(molecule as any).sign({
      bundle: this.getBundle()
    })
    ;(molecule as any).check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return this.executeQuery(query)
  }

  /**
   * Deposits buffer token into the source wallet.
   */
  async depositBufferToken({
    tokenSlug,
    amount,
    tradeRates,
    sourceWallet = null
  }: {
    tokenSlug: string
    amount: number
    tradeRates: object
    sourceWallet?: any | null
  }): Promise<any> {
    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token: tokenSlug,
        amount
      })
    }

    // Remainder wallet
    const remainderWallet = (sourceWallet as any).createRemainder(this.getSecret())

    // Build the molecule itself
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    
    const query = await this.createMoleculeMutation({
      mutationClass: MutationDepositBufferToken,
      molecule
    })
    query.fillMolecule({
      amount,
      tradeRates
    })
    return await this.executeQuery(query)
  }

  /**
   * Withdraws buffer tokens.
   */
  async withdrawBufferToken({
    tokenSlug,
    amount,
    sourceWallet = null,
    signingWallet = null
  }: {
    tokenSlug: string
    amount: number
    sourceWallet?: any | null
    signingWallet?: any | null
  }): Promise<any> {
    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token: tokenSlug,
        amount,
        type: 'buffer'
      })
    }

    // Remainder wallet
    const remainderWallet = sourceWallet

    // Build the molecule itself
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    
    const query = await this.createMoleculeMutation({
      mutationClass: MutationWithdrawBufferToken,
      molecule
    })
    const recipients: Record<string, number> = {}
    recipients[this.getBundle()] = amount
    query.fillMolecule({
      recipients,
      signingWallet
    })
    return await this.executeQuery(query)
  }

  /**
   * Creates a subscription for updating Molecule status
   */
  async subscribeCreateMolecule({
    bundle,
    closure
  }: {
    bundle: string | null
    closure: Function
  }): Promise<string> {
    const subscribe = this.createSubscribe(CreateMoleculeSubscribe)

    return await subscribe.execute({
      variables: {
        bundle: bundle || this.getBundle()
      },
      closure
    })
  }

  /**
   * Creates a subscription for updating Wallet status
   */
  async subscribeWalletStatus({
    bundle,
    token,
    closure
  }: {
    bundle: string | null
    token: string
    closure: Function
  }): Promise<string> {
    if (!token) {
      throw new CodeException(`${this.constructor.name}::subscribeWalletStatus() - Token parameter is required!`)
    }

    const subscribe = this.createSubscribe(WalletStatusSubscribe)

    return await subscribe.execute({
      variables: {
        bundle: bundle || this.getBundle(),
        token
      },
      closure
    })
  }

  /**
   * Creates a subscription for updating active Wallet
   */
  async subscribeActiveWallet({
    bundle,
    closure
  }: {
    bundle: string | null
    closure: Function
  }): Promise<string> {
    const subscribe = this.createSubscribe(ActiveWalletSubscribe)

    return await subscribe.execute({
      variables: {
        bundle: bundle || this.getBundle()
      },
      closure
    })
  }

  /**
   * Creates a subscription for updating list of active sessions for a given MetaType
   */
  async subscribeActiveSession({
    metaType,
    metaId,
    closure
  }: {
    metaType: string
    metaId: string
    closure: Function
  }): Promise<string> {
    const subscribe = this.createSubscribe(ActiveSessionSubscribe)

    return await subscribe.execute({
      variables: {
        metaType,
        metaId
      },
      closure
    })
  }

  /**
   * Unsubscribes from a given subscription name
   */
  unsubscribe(operationName: string): void {
    this.subscribe().unsubscribe(operationName)
  }

  /**
   * Unsubscribes from all subscriptions
   */
  unsubscribeAll(): void {
    this.subscribe().unsubscribeAll()
  }

  /**
   * Builds a new instance of the provided Subscription class
   */
  createSubscribe(SubscribeClass: any): any {
    return new SubscribeClass(this.subscribe())
  }

  /**
   * Requests a guest authentication token using the fingerprint of the user.
   * TODO: Temporarily commented out until MutationRequestAuthorizationGuest TS version is created
   */
  /*
  async requestGuestAuthToken({
    cellSlug,
    encrypt
  }: {
    cellSlug: string
    encrypt: boolean
  }): Promise<any> {
    this.setCellSlug(cellSlug)

    // Create a wallet for encryption
    const wallet = new Wallet({
      secret: generateSecret(await this.getFingerprint()),
      token: 'AUTH'
    })

    const query = await this.createQuery(MutationRequestAuthorizationGuest)

    const variables = {
      cellSlug,
      pubkey: wallet.pubkey,
      encrypt
    }

    const response = await query.execute({ variables })

    // Did the authorization molecule get accepted?
    if (response.success()) {
      // Create & set an auth token from the response data
      const authToken = AuthToken.create(response.payload(), wallet)
      this.setAuthToken(authToken)
    } else {
      throw new AuthorizationRejectedException(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${response.reason()}`)
    }

    return response
  }
  */

  /**
   * Request a profile auth token
   *
   * @param secret
   * @param encrypt
   * @returns {Promise<any>}
   */
  async requestProfileAuthToken({
    secret,
    encrypt
  }: {
    secret: string
    encrypt: boolean
  }): Promise<any> {
    this.setSecret(secret)

    // Generate a signing wallet
    const wallet = new Wallet({
      secret,
      token: 'AUTH'
    })

    // Create a wallet with a signing wallet
    const molecule = await this.createMolecule({
      secret,
      sourceWallet: wallet
    })

    const query = await this.createMoleculeMutation({
      mutationClass: MutationRequestAuthorization,
      molecule
    })

    query.fillMolecule({ meta: { encrypt: (encrypt ? 'true' : 'false') } })
    
    const response = await query.execute({})

    // Did the authorization molecule get accepted?
    if (response.success()) {
      // Create & set an auth token from the response data
      const authToken = AuthToken.create(response.payload(), wallet)
      this.setAuthToken(authToken)
    } else {
      throw new AuthorizationRejectedException(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${response.reason()}`)
    }

    return response
  }

  /**
   * Sets the auth token
   *
   * @param {AuthToken} authToken
   */
  setAuthToken(authToken: AuthToken): void {
    // An empty auth token
    if (!authToken) {
      this.log('info', 'KnishIOClient::setAuthToken() - authToken object is empty.')
      return
    }

    // Save auth token object to global list
    this.$__authTokenObjects[this.getRandomUri()] = authToken

    // Set auth data to GraphQL client
    this.client().setAuthData(authToken.getAuthData())

    // Save a full auth token object with expireAt key
    this.$__authToken = authToken
  }

  /**
   * Returns the current authorization token
   *
   * @return {AuthToken}
   */
  getAuthToken(): AuthToken | null {
    return this.$__authToken
  }

  /**
   * Cancels a specific query
   */
  cancelQuery(query: any, variables: any = null): void {
    const queryKey = JSON.stringify({
      query: query.$__query,
      variables
    })
    const controller = this.abortControllers.get(queryKey)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(queryKey)
    }
  }

  /**
   * Cancels all pending queries
   */
  cancelAllQueries(): void {
    for (const controller of this.abortControllers.values()) {
      controller.abort()
    }
    this.abortControllers.clear()
  }

  /**
   * Resets client state
   */
  reset (): void {
    this.$__secret = ''
    this.$__bundle = ''
    this.remainderWallet = null
  }

  /**
   * Logging method with level-based filtering
   */
  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, ...args: unknown[]): void {
    if (!this.$__logging) {
      return
    }
    
    const levels = ['error', 'warn', 'info', 'debug']
    const currentLevelIndex = levels.indexOf(this.$__logging_level)
    const messageLevelIndex = levels.indexOf(level)
    
    if (messageLevelIndex <= currentLevelIndex) {
      console[level](message, ...args)
    }
  }
}