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
import Dot from './libraries/Dot.js'
import Decimal from './libraries/Decimal.js'
import {
  generateBatchId,
  generateBundleHash,
  generateSecret
} from './libraries/crypto.js'
import Molecule from './Molecule.js'
import Wallet from './Wallet.js'
import TokenUnit from './TokenUnit.js'
import AuthToken from './AuthToken.js'
import QueryContinuId from './query/QueryContinuId.js'
import QueryWalletBundle from './query/QueryWalletBundle.js'
import QueryWalletList from './query/QueryWalletList.js'
import QueryBalance from './query/QueryBalance.js'
import QueryMetaType from './query/QueryMetaType.js'
import QueryBatch from './query/QueryBatch.js'
import QueryBatchHistory from './query/QueryBatchHistory.js'
import MutationRequestAuthorization from './mutation/MutationRequestAuthorization.js'
import MutationCreateToken from './mutation/MutationCreateToken.js'
import MutationRequestTokens from './mutation/MutationRequestTokens.js'
import MutationTransferTokens from './mutation/MutationTransferTokens.js'
import MutationProposeMolecule from './mutation/MutationProposeMolecule.js'
import MutationCreateIdentifier from './mutation/MutationCreateIdentifier.js'
import MutationClaimShadowWallet from './mutation/MutationClaimShadowWallet.js'
import MutationCreateMeta from './mutation/MutationCreateMeta.js'
import MutationPeering from './mutation/MutationPeering.js'
import MutationAppendRequest from './mutation/MutationAppendRequest.js'
import MutationLinkIdentifier from './mutation/MutationLinkIdentifier.js'
import MutationCreateWallet from './mutation/MutationCreateWallet.js'
import MutationRequestAuthorizationGuest from './mutation/MutationRequestAuthorizationGuest.js'
import TransferBalanceException from './exception/TransferBalanceException.js'
import CodeException from './exception/CodeException.js'
import UnauthenticatedException from './exception/UnauthenticatedException.js'
import WalletShadowException from './exception/WalletShadowException.js'
import StackableUnitDecimalsException from './exception/StackableUnitDecimalsException.js'
import StackableUnitAmountException from './exception/StackableUnitAmountException.js'
import CreateMoleculeSubscribe from './subscribe/CreateMoleculeSubscribe.js'
import WalletStatusSubscribe from './subscribe/WalletStatusSubscribe.js'
import ActiveWalletSubscribe from './subscribe/ActiveWalletSubscribe.js'
import ActiveSessionSubscribe from './subscribe/ActiveSessionSubscribe.js'
import MutationActiveSession from './mutation/MutationActiveSession.js'
import QueryActiveSession from './query/QueryActiveSession.js'
import QueryUserActivity from './query/QueryUserActivity.js'
import QueryToken from './query/QueryToken.js'
import BatchIdException from './exception/BatchIdException.js'
import AuthorizationRejectedException from './exception/AuthorizationRejectedException.js'
import QueryAtom from './query/QueryAtom.js'
import QueryPolicy from './query/QueryPolicy.js'
import QueryMetaTypeViaAtom from './query/QueryMetaTypeViaAtom.js'
import QueryMetaTypeViaMolecule from './query/QueryMetaTypeViaMolecule.js'
import MutationCreateRule from './mutation/MutationCreateRule.js'
import MutationDepositBufferToken from './mutation/MutationDepositBufferToken.js'
import MutationWithdrawBufferToken from './mutation/MutationWithdrawBufferToken.js'
import {
  getFingerprint,
  getFingerprintData
} from '@thumbmarkjs/thumbmarkjs'
import UrqlClientWrapper from './libraries/urql/UrqlClientWrapper.js'

/**
 * Base client class providing a powerful but user-friendly wrapper
 * around complex Knish.IO ledger transactions.
 */
export default class KnishIOClient {
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
  }) {
    this.initialize({
      uri,
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
  }) {
    this.reset()

    this.$__logging = logging
    this.$__authTokenObjects = {}
    this.$__authInProcess = false
    this.abortControllers = new Map()

    this.setUri(uri)

    if (cellSlug) {
      this.setCellSlug(cellSlug)
    }

    for (const uriKey in this.$__uris) {
      const url = this.$__uris[uriKey]
      this.$__authTokenObjects[url] = null
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
   *
   * @return {string}
   */
  getRandomUri () {
    const rand = Math.floor(Math.random() * (this.$__uris.length))
    return this.$__uris[rand]
  }

  /**
   *
   * @param encrypt
   * @return {boolean}
   */
  switchEncryption (encrypt) {
    if (this.$__encrypt === encrypt) {
      return false
    }
    this.log('info', `KnishIOClient::switchEncryption() - Forcing encryption ${ encrypt ? 'on' : 'off' } to match node...`)

    // Set encryption
    this.$__encrypt = encrypt
    this.$__client.setEncryption(encrypt)
    return true
  }

  /**
   * De-initializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize () {
    this.log('info', 'KnishIOClient::deinitialize() - Clearing the Knish.IO client session...')
    this.reset()
  }

  /**
   * Subscribes the client to the node's broadcast socket
   *
   * @return {UrqlClientWrapper}
   */
  subscribe () {
    if (!this.client().getSocketUri()) {
      throw new CodeException('KnishIOClient::subscribe() - Socket client not initialized!')
    }
    return this.client()
  }

  /**
   * Gets the client's SDK version
   *
   * @return {number}
   */
  getServerSdkVersion () {
    return this.$__serverSdkVersion
  }

  /**
   * Reset common properties
   */
  reset () {
    this.$__secret = ''
    this.$__bundle = ''
    this.remainderWallet = null
  }

  /**
   * Returns the currently defined Cell identifier for this session
   *
   * @return {string|null}
   */
  getCellSlug () {
    return this.$__cellSlug || null
  }

  /**
   * Sets the Cell identifier for this session
   *
   * @param {string} cellSlug
   */
  setCellSlug (cellSlug) {
    this.$__cellSlug = cellSlug
  }

  /**
   * Sets the endpoint URI for this session
   *
   * @param {string|object} uri
   */
  setUri (uri) {
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
  getUri () {
    return this.$__client.getUri()
  }

  /**
   * Returns the GraphQL client class session
   *
   * @return {UrqlClientWrapper}
   */
  client () {
    if (!this.$__authInProcess) {
      const randomUri = this.getRandomUri()
      this.$__client.setUri(randomUri)

      // Try to get stored auth token object
      const authTokenObject = this.$__authTokenObjects[randomUri]

      // Not authorized - try to do it
      if (!authTokenObject) {
        this.requestAuthToken({
          secret: this.$__secret,
          cellSlug: this.$__cellSlug,
          encrypt: this.$__encrypt
        }).catch(err => {
          this.log('warn', `KnishIOClient::client() - Background authorization failed: ${ err.message }`)
        })
      } else {
        // Use stored authorization data
        this.$__client.setAuthData(authTokenObject.getAuthData())
      }
    }
    return this.$__client
  }

  /**
   * Returns whether a secret is being stored for this session
   *
   * @return {boolean}
   */
  hasSecret () {
    return !!this.$__secret
  }

  /**
   * Set the client's secret
   *
   * @param secret
   */
  setSecret (secret) {
    this.$__secret = secret
    this.$__bundle = this.hashSecret(secret, 'setSecret')
  }

  /**
   * Hashes the user secret to produce a bundle hash
   * @param {string} secret
   * @param {string|null} source
   * @returns {string}
   */
  hashSecret (secret, source = null) {
    this.log('info', `KnishIOClient::hashSecret(${ source ? `source: ${ source }` : '' }) - Computing wallet bundle from secret...`)
    return generateBundleHash(secret)
  }

  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret () {
    if (!this.hasSecret()) {
      throw new UnauthenticatedException('KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?')
    }
    return this.$__secret
  }

  /**
   * Returns whether a bundle hash is being stored for this session
   *
   * @return {boolean}
   */
  hasBundle () {
    return !!this.$__bundle
  }

  /**
   * Returns the bundle hash for this session
   *
   * @return {string}
   */
  getBundle () {
    if (!this.hasBundle()) {
      throw new UnauthenticatedException('KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?')
    }
    return this.$__bundle
  }

  /**
   * Retrieves the device fingerprint.
   *
   * @returns {Promise<string>} A promise that resolves to the device fingerprint as a string.
   */
  getFingerprint () {
    return getFingerprint()
  }

  getFingerprintData () {
    return getFingerprintData()
  }

  /**
   * Retrieves this session's wallet used for signing the next Molecule
   *
   * @return {Promise<*|Wallet|null>}
   */
  async getSourceWallet () {
    let sourceWallet = (await this.queryContinuId({
      bundle: this.getBundle()
    })).payload()

    if (!sourceWallet) {
      sourceWallet = new Wallet({
        secret: this.getSecret()
      })
    } else {
      sourceWallet.key = Wallet.generateKey({
        secret: this.getSecret(),
        token: sourceWallet.token,
        position: sourceWallet.position
      })
    }

    return sourceWallet
  }

  /**
   * Retrieves this session's remainder wallet
   *
   * @return {null}
   */
  getRemainderWallet () {
    return this.remainderWallet
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
  async createMolecule ({
    secret = null,
    bundle = null,
    sourceWallet = null,
    remainderWallet = null
  }) {
    this.log('info', 'KnishIOClient::createMolecule() - Creating a new molecule...')

    secret = secret || this.getSecret()
    bundle = bundle || this.getBundle()

    // Sets the source wallet as the last remainder wallet (to maintain ContinuID)
    if (!sourceWallet &&
      this.lastMoleculeQuery &&
      this.getRemainderWallet().token === 'USER' &&
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
      batchId: sourceWallet.batchId,
      characters: sourceWallet.characters
    })

    return new Molecule({
      secret,
      sourceWallet,
      remainderWallet: this.getRemainderWallet(),
      cellSlug: this.getCellSlug(),
      version: this.getServerSdkVersion()
    })
  }

  /**
   * Builds a new instance of the provided Query class
   *
   * @param QueryClass
   * @return {*}
   */
  createQuery (QueryClass) {
    return new QueryClass(this.client(), this)
  }

  /**
   * Builds a new instance of the provided Subscription class
   *
   * @param SubscribeClass
   * @return {*}
   */
  createSubscribe (SubscribeClass) {
    return new SubscribeClass(this.subscribe())
  }

  /**
   * Uses the supplied Mutation class to build a new tailored Molecule
   *
   * @param mutationClass
   * @param molecule
   */
  async createMoleculeMutation ({
    mutationClass,
    molecule = null
  }) {
    this.log('info', `KnishIOClient::createMoleculeQuery() - Creating a new ${ mutationClass.name } query...`)

    // If you don't supply the molecule, we'll generate one for you
    const _molecule = molecule || await this.createMolecule({})

    const mutation = new mutationClass(this.client(), this, _molecule)

    if (!(mutation instanceof MutationProposeMolecule)) {
      throw new CodeException(`${ this.constructor.name }::createMoleculeMutation() - This method only accepts MutationProposeMolecule!`)
    }

    this.lastMoleculeQuery = mutation

    return mutation
  }

  /**
   *
   * @param query
   * @param variables
   * @returns {Promise<*>}
   */
  async executeQuery (query, variables = null) {
    // Check and refresh authorization token if needed
    // Guard with $__authInProcess to prevent concurrent auth requests
    if (this.$__authToken && this.$__authToken.isExpired() && !this.$__authInProcess) {
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
    } catch (error) {
      if (error.name === 'AbortError') {
        this.log('warn', 'Query was cancelled')
      } else {
        throw error
      }
    }
  }

  cancelQuery (query, variables = null) {
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

  cancelAllQueries () {
    for (const controller of this.abortControllers.values()) {
      controller.abort()
    }
    this.abortControllers.clear()
  }

  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} token
   * @param {string|null} bundle
   * @param {string} type
   * @returns {Promise<*>}
   */
  async queryBalance ({
    token,
    bundle = null,
    type = 'regular'
  }) {
    /**
     * @type {QueryBalance}
     */
    const query = this.createQuery(QueryBalance)

    // Execute query with either the provided bundle hash or the active client's bundle
    return this.executeQuery(query, {
      bundleHash: bundle || this.getBundle(),
      token,
      type
    })
  }

  /**
   *
   * @param {string} token
   * @param {number} amount
   * @param {string} type
   * @returns {Promise<{address}|{position}|*>}
   */
  async querySourceWallet ({
    token,
    amount,
    type = 'regular'
  }) {
    const sourceWallet = (await this.queryBalance({
      token,
      type
    })).payload()

    // Do you have enough tokens?
    if (sourceWallet === null || Decimal.cmp(sourceWallet.balance, amount) < 0) {
      throw new TransferBalanceException()
    }

    // Check shadow wallet
    if (!sourceWallet.position || !sourceWallet.address) {
      throw new TransferBalanceException('Source wallet can not be a shadow wallet.')
    }

    return sourceWallet
  }

  /**
   * @param {string|null} bundle
   * @param {function} closure
   * @return {Promise<string>}
   */
  async subscribeCreateMolecule ({
    bundle,
    closure
  }) {
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
   *
   * @param {string|null} bundle
   * @param {string} token
   * @param {function} closure
   * @return {string}
   */
  subscribeWalletStatus ({
    bundle,
    token,
    closure
  }) {
    if (!token) {
      throw new CodeException(`${ this.constructor.name }::subscribeWalletStatus() - Token parameter is required!`)
    }

    const subscribe = this.createSubscribe(WalletStatusSubscribe)

    return subscribe.execute({
      variables: {
        bundle: bundle || this.getBundle(),
        token
      },
      closure
    })
  }

  /**
   *  Creates a subscription for updating active Wallet
   *
   * @param {string|null} bundle
   * @param {function} closure
   * @return {string}
   */
  subscribeActiveWallet ({
    bundle,
    closure
  }) {
    const subscribe = this.createSubscribe(ActiveWalletSubscribe)

    return subscribe.execute({
      variables: {
        bundle: bundle || this.getBundle()
      },
      closure
    })
  }

  /**
   * Creates a subscription for updating list of active sessions for a given MetaType
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {function} closure
   * @return {*}
   */
  subscribeActiveSession ({
    metaType,
    metaId,
    closure
  }) {
    const subscribe = this.createSubscribe(ActiveSessionSubscribe)

    return subscribe.execute({
      variables: {
        metaType,
        metaId
      },
      closure
    })
  }

  /**
   * Unsubscribes from a given subscription name
   *
   * @param {string} operationName
   */
  unsubscribe (operationName) {
    this.subscribe().unsubscribe(operationName)
  }

  unsubscribeAll () {
    this.subscribe().unsubscribeAll()
  }

  /**
   * Retrieves metadata for the given metaType and provided parameters
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @param {object|null} fields
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @param {boolean} throughAtom
   * @param {boolean} throughMolecule
   * @param {array|null} values
   * @param {array|null} keys
   * @param {array|null} atomValues
   * @return {Promise<ResponseMetaType|ResponseMetaTypeViaAtom|ResponseMetaTypeViaMolecule>}
   */
  queryMeta ({
    metaType,
    metaId = null,
    key = null,
    value = null,
    latest = true,
    fields = null,
    filter = null,
    queryArgs = null,
    count = null,
    countBy = null,
    throughAtom = true,
    throughMolecule = false,
    values = null,
    keys = null,
    atomValues = null
  }) {
    this.log('info', `KnishIOClient::queryMeta() - Querying metaType: ${ metaType }, metaId: ${ metaId }...`)

    let query
    let variables

    if (throughMolecule) {
      /**
       * @type {QueryMetaTypeViaMolecule}
       */
      query = this.createQuery(QueryMetaTypeViaMolecule)
      variables = QueryMetaTypeViaMolecule.createVariables({
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
        atomValues,
        cellSlug: this.getCellSlug()
      })
    } else if (throughAtom) {
      /**
       * @type {QueryMetaTypeViaAtom}
       */
      query = this.createQuery(QueryMetaTypeViaAtom)
      variables = QueryMetaTypeViaAtom.createVariables({
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
        atomValues,
        cellSlug: this.getCellSlug()
      })
    } else {
      /**
       * @type {QueryMetaType}
       */
      query = this.createQuery(QueryMetaType)
      variables = QueryMetaType.createVariables({
        metaType,
        metaId,
        key,
        value,
        latest,
        filter,
        queryArgs,
        count,
        countBy,
        cellSlug: this.getCellSlug()
      })
    }

    return this.executeQuery(query, variables)
  }

  /**
   * Queries meta assets and verifies cryptographic integrity of associated molecules.
   * Returns the same response as queryMeta(), with an additional `integrity` field on the payload
   * containing verification results for each molecule.
   *
   * @param {object} params - Same parameters as queryMeta()
   * @return {Promise<ResponseMetaType|ResponseMetaTypeViaAtom|ResponseMetaTypeViaMolecule>}
   */
  async queryMetaVerified (params) {
    const response = await this.queryMeta(params)
    const payload = response.payload()
    if (payload) {
      payload.integrity = response.verifyIntegrity()
    }
    return response
  }

  /**
   * Query batch to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatch ({
    batchId
  }) {
    this.log('info', `KnishIOClient::queryBatch() - Querying cascading meta instances for batchId: ${ batchId }...`)
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
  async queryBatchHistory ({
    batchId
  }) {
    this.log('info', `KnishIOClient::queryBatchHistory() - Querying cascading meta instances for batchId: ${ batchId }...`)

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
   * @returns {Promise<ResponseAtom>} - A promise that resolves with the queried atom instances.
   */
  async queryAtom ({
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
  }) {
    this.log('info', 'KnishIOClient::queryAtom() - Querying atom instances')

    /** @type QueryAtom */
    const query = this.createQuery(QueryAtom)

    return await this.executeQuery(query, QueryAtom.createVariables({
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
   * Builds and executes a molecule to issue a new Wallet on the ledger
   *
   * @param {string} token - The token slug for the new wallet
   * @returns {Promise<ResponseCreateWallet>} - A Promise that resolves with the result of the execution.
   */
  async createWallet ({
    token
  }) {
    const newWallet = new Wallet({
      secret: this.getSecret(),
      token
    })

    /**
     * @type {MutationCreateWallet}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationCreateWallet
    })

    query.fillMolecule(newWallet)

    return await this.executeQuery(query)
  }

  /**
   * Queries the ledger to retrieve a list of active sessions for the given MetaType
   *
   * @param {string} bundleHash - The hash of the session bundle.
   * @param {string} metaType - The type of metadata associated with the session.
   * @param {string} metaId - The ID of the metadata associated with the session.
   * @returns {Promise<ResponseQueryActiveSession>} - Returns a promise containing the result of the query.
   */
  async queryActiveSession ({
    bundleHash,
    metaType,
    metaId
  }) {
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
   * @returns {Promise<ResponseQueryUserActivity>} The result of the query.
   */
  async queryUserActivity ({
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
  }) {
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
   * Builds and executes a molecule to declare an active session for the given MetaType
   *
   * @param {Object} options - The options for activating a session.
   * @param {string} options.bundle - The bundle hash.
   * @param {string} options.metaType - The meta type.
   * @param {string} options.metaId - The meta ID.
   * @param {string} options.ipAddress - The client's IP address.
   * @param {string} options.browser - The client's browser.
   * @param {string} options.osCpu - The client's operating system and CPU.
   * @param {string} options.resolution - The client's screen resolution.
   * @param {string} options.timeZone - The client's time zone.
   * @param {Object} [options.json={}] - Additional JSON data.
   * @returns {Promise<ResponseActiveSession>} A promise that resolves with the result of the activation.
   */
  async activeSession ({
    bundle,
    metaType,
    metaId,
    ipAddress,
    browser,
    osCpu,
    resolution,
    timeZone,
    json = {}
  }) {
    const query = this.createQuery(MutationActiveSession)

    return await this.executeQuery(query, {
      bundleHash: bundle,
      metaType,
      metaId,
      ipAddress,
      browser,
      osCpu,
      resolution,
      timeZone,
      json: JSON.stringify(json)
    })
  }

  /**
   * Creates a new token with the given parameters.
   *
   * @param {object} options - The options for creating the token.
   * @param {string} options.token - The token identifier.
   * @param {number} [options.amount] - The amount of tokens to create.
   * @param {object} [options.meta] - Additional metadata for the token.
   * @param {string} [options.batchId] - The batch identifier for stackable tokens.
   * @param {array} [options.units] - The unit IDs for the token.
   *
   * @throws {StackableUnitDecimalsException} If a stackable token has decimals.
   * @throws {StackableUnitAmountException} If stackable units are provided with an amount.
   *
   * @returns {Promise<ResponseCreateToken>} A Promise that resolves to the result of creating the token.
   */
  async createToken ({
    token,
    amount = null,
    meta = null,
    batchId = null,
    units = []
  }) {
    // What is the fungibility mode for this token?
    const fungibility = Dot.get(meta || {}, 'fungibility')

    // For stackable token - create a batch ID
    if (fungibility === 'stackable') {
      meta.batchId = batchId || generateBatchId({})
    }

    // Special logic for token unit initialization (nonfungible || stackable)
    if (['nonfungible', 'stackable'].includes(fungibility) && units.length > 0) {
      // Stackable tokens with Unit IDs must not use decimals
      if (Dot.get(meta || {}, 'decimals') > 0) {
        throw new StackableUnitDecimalsException()
      }

      // Can't create stackable units AND provide amount
      if (amount > 0) {
        throw new StackableUnitAmountException()
      }

      // Calculating amount based on Unit IDs
      amount = units.length
      meta.splittable = 1
      meta.decimals = 0
      meta.tokenUnits = JSON.stringify(units)
    }

    // Creating the wallet that will receive the new tokens
    const recipientWallet = new Wallet({
      secret: this.getSecret(),
      bundle: this.getBundle(),
      token,
      batchId
    })

    /**
     * @type {MutationCreateToken}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationCreateToken
    })

    query.fillMolecule({
      recipientWallet,
      amount,
      meta: meta || {}
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
   * @returns {Promise<ResponseCreateRule>} - A promise that resolves to the created rule.
   */
  async createRule ({
    metaType,
    metaId,
    rule,
    policy = {}
  }) {
    /**
     * @type {MutationCreateRule}
     */
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
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType - The type of the metadata entry.
   * @param {string} metaId - The ID of the metadata entry.
   * @param {object|array} meta - The metadata object.
   * @param {object} [policy={}] - The policy object.
   * @returns {Promise<ResponseCreateMeta>} - A Promise that resolves with the created metadata entry.
   */
  async createMeta ({
    metaType,
    metaId,
    meta = null,
    policy = {}
  }) {
    /**
     * @type {MutationCreateMeta}
     */
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
   * Builds and executes a molecule to register a peer node via P-isotope
   *
   * @param {string} host - The peer host URL to register
   * @returns {Promise<ResponsePeering>} - A Promise that resolves with the peering response.
   */
  async registerPeer ({
    host
  }) {
    /**
     * @type {MutationPeering}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationPeering,
      molecule: await this.createMolecule({
        secret: this.getSecret(),
        sourceWallet: await this.getSourceWallet()
      })
    })

    query.fillMolecule({
      host
    })

    return await this.executeQuery(query)
  }

  /**
   * Builds and executes a molecule to submit an append request via A-isotope
   *
   * @param {string} metaType - The target MetaType to append to
   * @param {string} metaId - The target MetaId to append to
   * @param {string} action - The action to perform
   * @param {object} [meta={}] - Additional metadata
   * @returns {Promise<ResponseAppendRequest>} - A Promise that resolves with the append request response.
   */
  async appendRequest ({
    metaType,
    metaId,
    action,
    meta = {}
  }) {
    /**
     * @type {MutationAppendRequest}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationAppendRequest,
      molecule: await this.createMolecule({
        secret: this.getSecret(),
        sourceWallet: await this.getSourceWallet()
      })
    })

    query.fillMolecule({
      metaType,
      metaId,
      action,
      meta
    })

    return await this.executeQuery(query)
  }

  /**
   * Builds and executes a molecule to create a new identifier on the ledger
   *
   * @param {string} type - The type of the identifier.
   * @param {string} contact - The contact associated with the identifier.
   * @param {string} code - The code for the identifier.
   * @returns {Promise<ResponseCreateIdentifier>} - A promise that resolves to the created identifier.
   */
  async createIdentifier ({
    type,
    contact,
    code
  }) {
    /**
     * @type {MutationCreateIdentifier}
     */
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
   * Links an identifier to the current wallet bundle
   *
   * @param {string} type - The type of the identifier.
   * @param {string} contact - The contact associated with the identifier.
   * @returns {Promise<ResponseLinkIdentifier>} - A promise that resolves to the link result.
   */
  async linkIdentifier ({
    type,
    contact
  }) {
    const query = this.createQuery(MutationLinkIdentifier)
    return await this.executeQuery(query, {
      bundle: this.getBundle(),
      type,
      content: contact
    })
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
  async createPolicy ({
    metaType,
    metaId,
    policy = {}
  }) {
    // Create a molecule
    const molecule = await this.createMolecule({})
    molecule.addPolicyAtom({
      metaType,
      metaId,
      meta: {},
      policy
    })
    molecule.addContinuIdAtom()
    molecule.sign({
      bundle: this.getBundle()
    })
    molecule.check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return await this.executeQuery(query)
  }

  /**
   * Queries the policy based on the provided metaType and metaId.
   *
   * @param {string} metaType - The type of the meta.
   * @param {string} metaId - The ID of the meta.
   * @returns {Promise<ResponsePolicy>} - A Promise that resolves to the query result.
   */
  async queryPolicy ({
    metaType,
    metaId
  }) {
    const query = this.createQuery(QueryPolicy)
    return await this.executeQuery(query, {
      metaType,
      metaId
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
   * @returns {Promise<ResponseWalletList>} - A promise that resolves to the response payload of the query.
   */
  queryWallets ({
    bundle = null,
    token = null,
    unspent = true
  }) {
    this.log('info', `KnishIOClient::queryWallets() - Querying wallets${ bundle ? ` for ${ bundle }` : '' }...`)

    /**
     * @type {QueryWalletList}
     */
    const walletQuery = this.createQuery(QueryWalletList)

    return this.executeQuery(walletQuery, {
      bundleHash: bundle || this.getBundle(),
      token,
      unspent
    })
      .then((response) => {
        return response.payload()
      })
  }

  /**
   * Queries wallet bundle metadata.
   *
   * @param {Object} options - The options for the query.
   * @param {string|null} options.bundle - The bundle to query. Default is null.
   * @param {string|null} options.fields - The fields to retrieve. Default is null.
   * @param {boolean} options.raw - Whether to return the raw response or the payload. Default is false.
   * @returns {Promise<ResponseWalletBundle|{}|null>} - A promise that resolves to the response or payload.
   */
  queryBundle ({
    bundle = null,
    fields = null,
    raw = false
  }) {
    this.log('info', `KnishIOClient::queryBundle() - Querying wallet bundle metadata${ bundle ? ` for ${ bundle }` : '' }...`)

    // Bundle default init & to array convertion
    if (!bundle) {
      bundle = this.getBundle()
    }
    if (typeof bundle === 'string') {
      bundle = [bundle]
    }

    /**
     * @type {QueryWalletBundle}
     */
    const query = this.createQuery(QueryWalletBundle)
    return this.executeQuery(query, { bundleHashes: bundle })
      .then((/** ResponseWalletBundle */ response) => {
        return raw ? response : response.payload()
      })
  }

  /**
   * Queries the ledger for the next ContinuId wallet
   *
   * @param {String} bundle - The bundle hash used in the query.
   * @returns {Promise<ResponseContinuId>} - A promise that resolves to the result of the query.
   */
  async queryContinuId ({
    bundle
  }) {
    /**
     * @type {QueryContinuId}
     */
    const query = this.createQuery(QueryContinuId)

    return this.executeQuery(query, {
      bundle
    })
  }

  /**
   * Requests tokens for a specific recipient or for the current wallet bundle.
   *
   * @param {Object} options - The options for the token request.
   * @param {string} options.token - The token slug.
   * @param {string|Wallet} [options.to] - The recipient of the tokens. If not provided, tokens will be requested for the current wallet bundle.
   * @param {number|null} [options.amount=null] - The amount of tokens to request. If not provided and `options.units` are provided, the amount will be calculated based on the number of
   * units.
   * @param {Array} [options.units=[]] - The array of unit IDs. If provided, the amount will be calculated based on the length of `options.units`.
   * @param {Object|null} [options.meta=null] - Additional metadata for the token request.
   * @param {string|null} [options.batchId=null] - The batch ID for the token request. If not provided and the token is stackable, a new batch ID will be generated.
   *
   * @returns {Promise<ResponseRequestTokens>} - A promise that resolves with the response from the token request.
   *
   * @throws {BatchIdException} - When a non-stackable token is used and `options.batchId` is not null.
   * @throws {StackableUnitAmountException} - When both `options.units` and `options.amount` are provided for stackable tokens.
   */
  async requestTokens ({
    token,
    to,
    amount = null,
    units = [],
    meta = null,
    batchId = null
  }) {
    let metaType,
      metaId

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
      if (amount > 0) {
        throw new StackableUnitAmountException()
      }

      // Calculating amount based on Unit IDs
      amount = units.length
      meta.tokenUnits = JSON.stringify(units)
    }

    // Are we specifying a specific recipient?
    if (to) {
      // If the recipient is provided as an object, try to figure out the actual recipient
      if (Object.prototype.toString.call(to) === '[object String]') {
        if (Wallet.isBundleHash(to)) {
          metaType = 'walletBundle'
          metaId = to
        } else {
          to = Wallet.create({
            secret: to,
            token
          })
        }
      }

      // If recipient is a Wallet, we need to help the node triangulate
      // the transfer by providing position and bundle hash
      if (to instanceof Wallet) {
        metaType = 'wallet'
        meta.position = to.position
        meta.bundle = to.bundle
        metaId = to.address
      }
    } else {
      // No recipient, so request tokens for ourselves
      metaType = 'walletBundle'
      metaId = this.getBundle()
    }

    /**
     * @type {MutationRequestTokens}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationRequestTokens
    })

    query.fillMolecule({
      token,
      amount,
      metaType,
      metaId,
      meta,
      batchId
    })

    return await this.executeQuery(query)
  }

  /**
   * Claims a shadow wallet for a given token.
   *
   * @param {string} token - The token for which to claim the shadow wallet.
   * @param {string|null} batchId - The batch ID of the shadow wallet (optional).
   * @param {string|null} molecule - The molecule associated with the shadow wallet (optional).
   *
   * @returns {Promise<ResponseClaimShadowWallet>} - A promise that resolves to the result of the claim operation.
   */
  async claimShadowWallet ({
    token,
    batchId = null,
    molecule = null
  }) {
    /**
     * @type {MutationClaimShadowWallet}
     */
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
  async claimShadowWallets ({
    token
  }) {
    // --- Get & check a shadow wallet list
    const shadowWallets = await this.queryWallets({ token })
    if (!shadowWallets || !Array.isArray(shadowWallets)) {
      throw new WalletShadowException()
    }

    shadowWallets.forEach(shadowWallet => {
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
   * Transfers tokens from one wallet to another.
   *
   * @param {Object} options - The transfer options.
   * @param {string} options.bundleHash - The bundle hash of the source wallet.
   * @param {string} options.token - The token to transfer.
   * @param {number} [options.amount=null] - The amount of tokens to transfer. Not required if units are provided.
   * @param {Array} [options.units=[]] - An array of units to transfer. Overrides the amount if provided.
   * @param {string} [options.batchId=null] - The batch ID for the recipient wallet.
   * @param {Object} [options.sourceWallet=null] - The source wallet object. If not provided, it will be queried.
   *
   * @returns {Promise} - A Promise that resolves to the transaction result.
   *
   * @throws {StackableUnitAmountException} - If both amount and units are provided.
   * @throws {TransferBalanceException} - If the source wallet does not have enough balance.
   */
  async transferToken ({
    bundleHash,
    token,
    amount = null,
    units = [],
    batchId = null,
    sourceWallet = null
  }) {
    // Calculate amount & set meta key
    if (units.length > 0) {
      // Can't move stackable units AND provide amount
      if (amount > 0) {
        throw new StackableUnitAmountException()
      }

      amount = units.length
    }

    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token,
        amount
      })
    }

    // Do you have enough tokens?
    if (sourceWallet === null || Decimal.cmp(sourceWallet.balance, amount) < 0) {
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
      recipientWallet.batchId = batchId
    } else {
      recipientWallet.initBatchId({
        sourceWallet
      })
    }

    // Create a remainder from the source wallet
    const remainderWallet = sourceWallet.createRemainder(this.getSecret())

    // --- Token units splitting
    sourceWallet.splitUnits(
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
    /**
     * @type {MutationTransferTokens}
     */
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
   * Deposits buffer token into the source wallet.
   *
   * @param {Object} options - The options for depositing buffer token.
   * @param {string} options.tokenSlug - The slug of the token to deposit.
   * @param {number} options.amount - The amount of token to deposit.
   * @param {Object} options.tradeRates - The trade rates for the deposit.
   * @param {Wallet|null} options.sourceWallet - The source wallet for the deposit. If not provided, a source wallet will be queried.
   *
   * @returns {Promise<*>} - A promise that resolves with the result of the deposit.
   */
  async depositBufferToken ({
    tokenSlug,
    amount,
    tradeRates,
    sourceWallet = null
  }) {
    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token: tokenSlug,
        amount
      })
    }

    // Remainder wallet
    const remainderWallet = sourceWallet.createRemainder(this.getSecret())

    // Build the molecule itself
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    /**
     * @type {MutationDepositBufferToken}
     */
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
   *
   * @param {Object} options - The options for withdrawing buffer tokens.
   * @param {string} options.tokenSlug - The token slug.
   * @param {number} options.amount - The amount of tokens to withdraw.
   * @param {Object} [options.sourceWallet=null] - The source wallet to withdraw tokens from. If not provided, a source wallet will be queried.
   * @param {Object} [options.signingWallet=null] - The signing wallet to use for the transaction.
   * @returns {Promise<Object>} A promise that resolves to the result of the withdrawal transaction.
   */
  async withdrawBufferToken ({
    tokenSlug,
    amount,
    sourceWallet = null,
    signingWallet = null
  }) {
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
    /**
     * @type {MutationWithdrawBufferToken}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationWithdrawBufferToken,
      molecule
    })
    const recipients = {}
    recipients[this.getBundle()] = amount
    query.fillMolecule({
      recipients,
      signingWallet
    })
    return await this.executeQuery(query)
  }

  /**
   * Builds and executes a molecule to destroy the specified Token units
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {array|null} units
   * @param {Wallet|null} sourceWallet
   * @return {Promise<unknown>}
   */
  async burnTokens ({
    token,
    amount = null,
    units = [],
    sourceWallet = null
  }) {
    // Get a source wallet
    if (sourceWallet === null) {
      sourceWallet = await this.querySourceWallet({
        token,
        amount
      })
    }

    // Remainder wallet
    const remainderWallet = sourceWallet.createRemainder(this.getSecret())

    // Calculate amount & set meta key
    if (units.length > 0) {
      // Can't burn stackable units AND provide amount
      if (amount > 0) {
        throw new StackableUnitAmountException()
      }

      // Calculating amount based on Unit IDs
      amount = units.length

      // --- Token units splitting
      sourceWallet.splitUnits(
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
    molecule.burnToken({ amount })
    molecule.sign({
      bundle: this.getBundle()
    })
    molecule.check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return this.executeQuery(query)
  }

  /**
   * Builds and executes a molecule to destroy the specified Token units
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {array|null} units
   * @param {Wallet|null} sourceWallet
   * @return {Promise<unknown>}
   */
  async replenishToken ({
    token,
    amount = null,
    units = [],
    sourceWallet = null
  }) {
    if (sourceWallet === null) {
      sourceWallet = (await this.queryBalance({ token })).payload()
    }
    if (!sourceWallet) {
      throw new TransferBalanceException('Source wallet is missing or invalid.')
    }

    // Remainder wallet
    const remainderWallet = sourceWallet.createRemainder(this.getSecret())

    // Create a molecule
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    molecule.replenishToken({
      amount,
      units
    })
    molecule.sign({
      bundle: this.getBundle()
    })
    molecule.check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return this.executeQuery(query)
  }

  /**
   *
   * @param bundleHash
   * @param tokenSlug
   * @param newTokenUnit
   * @param fusedTokenUnitIds
   * @param sourceWallet
   * @returns {Promise<*>}
   */
  async fuseToken ({
    bundleHash,
    tokenSlug,
    newTokenUnit,
    fusedTokenUnitIds,
    sourceWallet = null
  }) {
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
    const sourceTokenUnitIds = []
    sourceWallet.tokenUnits.forEach((tokenUnit) => {
      sourceTokenUnitIds.push(tokenUnit.id)
    })
    fusedTokenUnitIds.forEach((tokenUnitId) => {
      if (!sourceTokenUnitIds.includes(tokenUnitId)) {
        throw new TransferBalanceException(`Fused token unit ID = ${ tokenUnitId } does not found in the source wallet.`)
      }
    })

    // Generate new recipient wallet if only recipient secret has been passed
    const recipientWallet = Wallet.create({
      bundle: bundleHash,
      token: tokenSlug
    })

    // Set batch ID
    recipientWallet.initBatchId({ sourceWallet })

    // Remainder wallet
    const remainderWallet = sourceWallet.createRemainder(this.getSecret())

    // Split token units (fused)
    sourceWallet.splitUnits(fusedTokenUnitIds, remainderWallet)

    // Coerce string newTokenUnit to TokenUnit object
    if (typeof newTokenUnit === 'string') {
      newTokenUnit = new TokenUnit(newTokenUnit, newTokenUnit, {})
    }

    // Set recipient new fused token unit
    newTokenUnit.metas.fusedTokenUnits = sourceWallet.getTokenUnitsData()
    recipientWallet.tokenUnits = [newTokenUnit]

    // Create a molecule
    const molecule = await this.createMolecule({
      sourceWallet,
      remainderWallet
    })
    molecule.fuseToken(sourceWallet.tokenUnits, recipientWallet)
    molecule.sign({
      bundle: this.getBundle()
    })
    molecule.check()

    // Create & execute a mutation
    const query = await this.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule
    })
    return this.executeQuery(query)
  }

  /**
   * Requests a guest authentication token using the fingerprint of the user.
   * @param {Object} options - The options for the guest authentication token request.
   * @param {string} options.cellSlug - The slug of the cell to request the token for.
   * @param {boolean} options.encrypt - Indicates whether the session should be encrypted.
   * @returns {Promise<ResponseRequestAuthorizationGuest>} - A promise that resolves to the response of the guest authentication token request.
   */
  async requestGuestAuthToken ({
    cellSlug,
    encrypt
  }) {
    this.setCellSlug(cellSlug)

    // Create a wallet for encryption
    const wallet = new Wallet({
      secret: generateSecret(await this.getFingerprint()),
      token: 'AUTH'
    })

    /**
     * @type {MutationRequestAuthorizationGuest}
     */
    const query = await this.createQuery(MutationRequestAuthorizationGuest)

    const variables = {
      cellSlug,
      pubkey: wallet.pubkey,
      encrypt
    }

    /**
     * @type {ResponseRequestAuthorizationGuest}
     */
    const response = await query.execute({ variables })

    // Did the authorization molecule get accepted?
    if (response.success()) {
      // Create & set an auth token from the response data
      // Map server payload field names (time/key) to AuthToken constructor names (expiresAt/pubkey)
      const authToken = AuthToken.create({
        token: response.token(),
        expiresAt: response.expiresAt(),
        pubkey: response.pubKey(),
        encrypt: response.encrypt()
      }, wallet)
      this.setAuthToken(authToken)
    } else {
      throw new AuthorizationRejectedException(`KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${ response.reason() }`)
    }

    return response
  }

  /**
   * Request a profile auth token
   *
   * @param secret
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorization>}
   */
  async requestProfileAuthToken ({
    secret,
    encrypt
  }) {
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

    /**
     * @type {MutationRequestAuthorization}
     */
    const query = await this.createMoleculeMutation({
      mutationClass: MutationRequestAuthorization,
      molecule
    })

    query.fillMolecule({ meta: { encrypt: (encrypt ? 'true' : 'false') } })
    /**
     * @type {ResponseRequestAuthorization}
     */
    const response = await query.execute({})

    // Did the authorization molecule get accepted?
    if (response.success()) {
      // Create & set an auth token from the response data
      // Map server payload field names (time/key) to AuthToken constructor names (expiresAt/pubkey)
      const authToken = AuthToken.create({
        token: response.token(),
        expiresAt: response.expiresAt(),
        pubkey: response.pubKey(),
        encrypt: response.encrypt()
      }, wallet)
      this.setAuthToken(authToken)
    } else {
      throw new AuthorizationRejectedException(`KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${ response.reason() }`)
    }

    return response
  }

  /**
   * Request an auth token (guest or profile)
   *
   * @param secret
   * @param seed
   * @param cellSlug
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorizationGuest|ResponseRequestAuthorization|null>}
   */
  async requestAuthToken ({
    secret = null,
    seed = null,
    cellSlug = null,
    encrypt = false
  }) {
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
    let response

    // Authorized user
    if (secret) {
      response = await this.requestProfileAuthToken({
        secret,
        encrypt
      })
    } else {
      // Guest
      response = await this.requestGuestAuthToken({
        cellSlug,
        encrypt
      })
    }

    // Set auth token
    this.log('info', `KnishIOClient::authorize() - Successfully retrieved auth token ${ this.$__authToken.getToken() }...`)

    // Switch encryption mode if it has been changed
    this.switchEncryption(encrypt)

    // Auth process is stopped
    this.$__authInProcess = false

    // Return full response
    return response
  }

  /**
   * Sets the auth token
   *
   * @param {AuthToken} authToken
   */
  setAuthToken (authToken) {
    // An empty auth token
    if (!authToken) {
      this.log('info', 'KnishIOClient::setAuthToken() - authToken object is empty.')
      return
    }

    // Save auth token object to global list
    this.$__authTokenObjects[this.getUri()] = authToken

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
  getAuthToken () {
    return this.$__authToken
  }

  /**
   * Writes the specified message to the console.
   * @param {string} level
   * @param {string} message
   */
  log (level, message) {
    if (this.$__logging) {
      switch (level) {
        case 'info':
          console.info(message)
          break
        case 'warn':
          console.warn(message)
          break
        case 'error':
          console.error(message)
          break
        default:
          console.log(message)
      }
    }
  }
}
