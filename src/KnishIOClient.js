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
import Dot from './libraries/Dot';
import Decimal from './libraries/Decimal';
import {
  generateBundleHash,
  generateBatchId,
  generateSecret
} from './libraries/crypto';
import Molecule from './Molecule';
import Wallet from './Wallet';
import AuthToken from './AuthToken';
import QueryContinuId from './query/QueryContinuId';
import QueryWalletBundle from './query/QueryWalletBundle';
import QueryWalletList from './query/QueryWalletList';
import QueryBalance from './query/QueryBalance';
import QueryMetaType from './query/QueryMetaType';
import QueryBatch from './query/QueryBatch';
import QueryBatchHistory from './query/QueryBatchHistory';
import MutationRequestAuthorization from './mutation/MutationRequestAuthorization';
import MutationCreateToken from './mutation/MutationCreateToken';
import MutationRequestTokens from './mutation/MutationRequestTokens';
import MutationTransferTokens from './mutation/MutationTransferTokens';
import MutationProposeMolecule from './mutation/MutationProposeMolecule';
import MutationCreateIdentifier from './mutation/MutationCreateIdentifier';
import MutationClaimShadowWallet from './mutation/MutationClaimShadowWallet';
import MutationCreateMeta from './mutation/MutationCreateMeta';
import MutationCreateWallet from './mutation/MutationCreateWallet';
import MutationRequestAuthorizationGuest from './mutation/MutationRequestAuthorizationGuest';
import TransferBalanceException from './exception/TransferBalanceException';
import CodeException from './exception/CodeException';
import UnauthenticatedException from './exception/UnauthenticatedException';
import WalletShadowException from './exception/WalletShadowException';
import StackableUnitDecimalsException from './exception/StackableUnitDecimalsException';
import StackableUnitAmountException from './exception/StackableUnitAmountException';
import ApolloClient from './httpClient/ApolloClient';
import CreateMoleculeSubscribe from './subscribe/CreateMoleculeSubscribe';
import WalletStatusSubscribe from './subscribe/WalletStatusSubscribe';
import ActiveWalletSubscribe from './subscribe/ActiveWalletSubscribe';
import ActiveSessionSubscribe from './subscribe/ActiveSessionSubscribe';
import MutationActiveSession from './mutation/MutationActiveSession';
import QueryActiveSession from './query/QueryActiveSession';
import QueryUserActivity from './query/QueryUserActivity';
import QueryToken from './query/QueryToken';
import BatchIdException from './exception/BatchIdException';
import AuthorizationRejectedException from './exception/AuthorizationRejectedException';
import QueryAtom from './query/QueryAtom';
import QueryPolicy from './query/QueryPolicy';
import MutationCreatePolicy from './mutation/MutationCreatePolicy';
import QueryMetaTypeViaAtom from './query/QueryMetaTypeViaAtom';
import MutationCreateRule from './mutation/MutationCreateRule';


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
   * @param {string|null} socketUri
   * @param {ApolloClient|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  constructor ( {
    uri,
    cellSlug = null,
    client = null,
    socketUri = null,
    serverSdkVersion = 3,
    logging = false
  } ) {
    this.initialize( {
      uri,
      cellSlug,
      socketUri,
      client,
      serverSdkVersion,
      logging
    } );
  }

  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string|[]} uri
   * @param {string|null} cellSlug
   * @param {string|null} socketUri
   * @param {ApolloClient|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  initialize ( {
    uri,
    cellSlug = null,
    socketUri = null,
    client = null,
    serverSdkVersion = 3,
    logging = false
  } ) {

    this.$__logging = logging;
    this.$__uris = typeof uri === 'object' ? uri : [ uri ];
    this.$__authTokenObjects = {};
    this.$__authInProcess = false;

    if ( cellSlug ) {
      this.setCellSlug( cellSlug );
    }

    for ( let i in this.$__uris ) {
      let url = this.$__uris [ i ];
      this.$__authTokenObjects[ url ] = null;
    }

    if ( this.$__logging ) {
      console.info( `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${ serverSdkVersion }...` );
    }

    this.reset();
    this.$__client = client || new ApolloClient( {
      socketUri: socketUri,
      serverUri: this.getRandomUri()
    } );

    this.$__serverSdkVersion = serverSdkVersion;
  }


  /**
   * Get random uri from specified this.$__uris
   *
   * @return {string}
   */
  getRandomUri () {
    let rand = Math.floor( Math.random() * ( this.$__uris.length ) );
    return this.$__uris[ rand ];
  }


  /**
   *
   * @param encrypt
   * @return {boolean}
   */
  switchEncryption ( encrypt ) {
    if ( this.hasEncryption() === encrypt ) {
      return false;
    }

    if ( this.$__logging ) {
      console.warn( 'KnishIOClient::switchEncryption() - Node not respecting requested encryption policy!' );
    }

    if ( encrypt ) {

      if ( this.$__logging ) {
        console.info( 'KnishIOClient::switchEncryption() - Forcing encryption on to match node...' );
      }
      this.enableEncryption();

    } else {

      if ( this.$__logging ) {
        console.info( 'KnishIOClient::switchEncryption() - Forcing encryption off to match node...' );
      }
      this.disableEncryption();

    }
    return true;
  }


  /**
   *  Enables end-to-end encryption protocol.
   *  Note: this will cause all active subscriptions to be unsubscribed.
   */
  enableEncryption () {
    if ( this.$__logging ) {
      console.info( 'KnishIOClient::enableEncryption() - Enabling end-to-end encryption mode...' );
    }
    this.$__encrypt = true;
    this.$__client.enableEncryption();
  }

  /**
   *  Disables end-to-end encryption protocol.
   *  Note: this will cause all active subscriptions to be unsubscribed.
   */
  disableEncryption () {
    if ( this.$__logging ) {
      console.info( 'KnishIOClient::disableEncryption() - Disabling end-to-end encryption mode...' );
    }
    this.$__encrypt = false;
    this.$__client.disableEncryption();
  }

  /**
   * Returns whether the end-to-end encryption protocol is enabled
   *
   * @return {boolean}
   */
  hasEncryption () {
    return this.$__encrypt;
  }

  /**
   * De-initializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize () {
    if ( this.$__logging ) {
      console.info( 'KnishIOClient::deinitialize() - Clearing the Knish.IO client session...' );
    }
    this.reset();
  }

  /**
   * Subscribes the client to the node's broadcast socket
   *
   * @return {ApolloClient}
   */
  subscribe () {
    if ( !this.client().getSocketUri() ) {
      throw new CodeException( 'KnishIOClient::subscribe() - Socket client not initialized!' );
    }
    return this.client();
  }


  /**
   * Gets the client's SDK version
   *
   * @return {number}
   */
  getServerSdkVersion () {
    return this.$__serverSdkVersion;
  }


  /**
   * Reset common properties
   */
  reset () {
    this.$__secret = '';
    this.$__bundle = '';
    this.remainderWallet = null;
  }

  /**
   * Returns the currently defined Cell identifier for this session
   *
   * @return {string|null}
   */
  cellSlug () {
    return this.$__cellSlug || null;
  }

  /**
   * Sets the Cell identifier for this session
   *
   * @param cellSlug
   */
  setCellSlug ( cellSlug ) {
    this.$__cellSlug = cellSlug;
  }

  /**
   * Retrieves the endpoint URI for this session
   *
   * @return {string}
   */
  uri () {
    return this.$__client.getUri();
  }

  /**
   * Returns the Apollo client class session
   *
   * @return {ApolloClient}
   */
  client () {
    if ( !this.$__authInProcess ) {
      let randomUri = this.getRandomUri();
      this.$__client.setUri( randomUri );

      // Try to get stored auth token object
      let authTokenObject = this.$__authTokenObjects[ randomUri ];

      // Not authorized - try to do it
      if ( !authTokenObject ) {
        this.requestAuthToken( {
          secret: this.$__secret,
          cellSlug: this.$__cellSlug,
          encrypt: this.$__encrypt
        } ).then( () => {
          // Success
        } );
      }
      // Use stored authorization data
      else {
        this.$__client.setAuthData( authTokenObject.getAuthData() );
      }
    }
    return this.$__client;
  }

  /**
   * Returns whether a secret is being stored for this session
   *
   * @return {boolean}
   */
  hasSecret () {
    return !!this.$__secret;
  }


  /**
   * Set the client's secret
   *
   * @param secret
   */
  setSecret ( secret ) {
    this.$__secret = secret;
    this.$__bundle = generateBundleHash( secret );
  }


  /**
   * Retrieves the stored secret for this session
   *
   * @return {string}
   */
  getSecret () {
    if ( !this.hasSecret() ) {
      throw new UnauthenticatedException( 'KnishIOClient::getSecret() - Unable to find a stored secret! Have you set a secret?' );
    }
    return this.$__secret;
  }

  /**
   * Returns whether a bundle hash is being stored for this session
   *
   * @return {boolean}
   */
  hasBundle () {
    return !!this.$__bundle;
  }


  /**
   * Returns the bundle hash for this session
   *
   * @return {string}
   */
  getBundle () {
    if ( !this.hasBundle() ) {
      throw new UnauthenticatedException( 'KnishIOClient::getBundle() - Unable to find a stored bundle! Have you set a secret?' );
    }
    return this.$__bundle;
  }

  /**
   * Retrieves this session's wallet used for signing the next Molecule
   *
   * @return {Promise<*|Wallet|null>}
   */
  async getSourceWallet () {
    let sourceWallet = ( await this.queryContinuId( {
      bundle: this.getBundle()
    } ) ).payload();

    if ( !sourceWallet ) {
      sourceWallet = new Wallet( {
        secret: this.getSecret()
      } );
    } else {
      sourceWallet.key = Wallet.generatePrivateKey( {
        secret: this.getSecret(),
        token: sourceWallet.token,
        position: sourceWallet.position
      } );
    }

    return sourceWallet;
  }

  /**
   * Retrieves this session's remainder wallet
   *
   * @return {null}
   */
  getRemainderWallet () {
    return this.remainderWallet;
  }

  /**
   * Instantiates a new Molecule and prepares this client session to operate on it
   *
   * @param secret
   * @param sourceWallet
   * @param remainderWallet
   * @return {Promise<Molecule>}
   */
  async createMolecule ( {
    secret = null,
    sourceWallet = null,
    remainderWallet = null
  } ) {

    if ( this.$__logging ) {
      console.info( 'KnishIOClient::createMolecule() - Creating a new molecule...' );
    }

    secret = secret || this.getSecret();

    // Sets the source wallet as the last remainder wallet (to maintain ContinuID)
    if ( !sourceWallet && this.lastMoleculeQuery && this.getRemainderWallet().token !== 'AUTH' && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() ) {
      sourceWallet = this.getRemainderWallet();
    }

    // Unable to use last remainder wallet; Figure out what wallet to use:
    if ( sourceWallet === null ) {
      sourceWallet = await this.getSourceWallet();
    }

    // Set the remainder wallet for the next transaction
    this.remainderWallet = remainderWallet || Wallet.create( {
      secretOrBundle: secret,
      token: 'USER',
      batchId: sourceWallet.batchId,
      characters: sourceWallet.characters
    } );

    return new Molecule( {
      secret,
      sourceWallet,
      remainderWallet: this.getRemainderWallet(),
      cellSlug: this.cellSlug()
    } );
  }

  /**
   * Builds a new instance of the provided Query class
   *
   * @param queryClass
   * @return {*}
   */
  createQuery ( queryClass ) {
    return new queryClass( this.client() );
  }

  /**
   * Builds a new instance of the provided Subscription class
   *
   * @param subscribeClass
   * @return {*}
   */
  createSubscribe ( subscribeClass ) {
    return new subscribeClass( this.subscribe() );
  }

  /**
   * Uses the supplied Mutation class to build a new tailored Molecule
   *
   * @param mutationClass
   * @param molecule
   */
  async createMoleculeMutation ( {
    mutationClass,
    molecule = null
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::createMoleculeQuery() - Creating a new ${ mutationClass.name } query...` );
    }

    // If you don't supply the molecule, we'll generate one for you
    let _molecule = molecule || await this.createMolecule( {} );

    const mutation = new mutationClass( this.client(), _molecule );

    if ( !( mutation instanceof MutationProposeMolecule ) ) {
      throw new CodeException( `${ this.constructor.name }::createMoleculeMutation() - This method only accepts MutationProposeMolecule!` );
    }

    this.lastMoleculeQuery = mutation;

    return mutation;
  }


  /**
   *
   * @param query
   * @param variables
   * @returns {Promise<*>}
   */
  async executeQuery ( query, variables = null ) {
    // console.info( `KnishIOClient::executeQuery() - Check token expiration... ${ this.$__authToken.$__expiresAt * 1000 } == ${ Date.now() } ` );
    if ( this.$__authToken && this.$__authToken.isExpired() ) {
      console.info( 'KnishIOClient::executeQuery() - Access token is expired. Getting new one...' );

      await this.requestAuthToken( {
        secret: this.$__secret,
        cellSlug: this.$__cellSlug,
        encrypt: this.$__encrypt
      } );
    }

    return query.execute( {
      variables
    } );
  }


  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} token
   * @param {string|null} bundle
   * @return {Promise<ResponseBalance>}
   */
  async queryBalance ( {
    token,
    bundle = null
  } ) {

    /**
     * @type {QueryBalance}
     */
    const query = this.createQuery( QueryBalance );

    // Execute query with either the provided bundle hash or the active client's bundle
    return this.executeQuery( query, {
      bundleHash: bundle || this.getBundle(),
      token
    } );
  }

  /**
   * @param {string|null} bundle
   * @param {function} closure
   * @return {Promise<string>}
   */
  async subscribeCreateMolecule ( {
    bundle,
    closure
  } ) {
    const subscribe = this.createSubscribe( CreateMoleculeSubscribe );

    return await subscribe.execute( {
      variables: {
        bundle: bundle || this.getBundle()
      },
      closure
    } );
  }

  /**
   * Creates a subscription for updating Wallet status
   *
   * @param {string|null} bundle
   * @param {string} token
   * @param {function} closure
   * @return {string}
   */
  subscribeWalletStatus ( {
    bundle,
    token,
    closure
  } ) {

    if ( !token ) {
      throw new CodeException( `${ this.constructor.name }::subscribeWalletStatus() - Token parameter is required!` );
    }

    const subscribe = this.createSubscribe( WalletStatusSubscribe );

    return subscribe.execute( {
      variables: {
        bundle: bundle || this.getBundle(),
        token
      },
      closure
    } );
  }

  /**
   *  Creates a subscription for updating active Wallet
   *
   * @param {string|null} bundle
   * @param {function} closure
   * @return {string}
   */
  subscribeActiveWallet ( {
    bundle,
    closure
  } ) {
    const subscribe = this.createSubscribe( ActiveWalletSubscribe );

    return subscribe.execute( {
      variables: {
        bundle: bundle || this.getBundle()
      },
      closure
    } );
  }

  /**
   * Creates a subscription for updating list of active sessions for a given MetaType
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {function} closure
   * @return {*}
   */
  subscribeActiveSession ( {
    metaType,
    metaId,
    closure
  } ) {
    const subscribe = this.createSubscribe( ActiveSessionSubscribe );

    return subscribe.execute( {
      variables: {
        metaType,
        metaId
      },
      closure
    } );
  }

  /**
   * Unsubscribes from a given subscription name
   *
   * @param {string} operationName
   */
  unsubscribe ( operationName ) {
    this.subscribe().unsubscribe( operationName );
  }

  unsubscribeAll () {
    this.subscribe().unsubscribeAll();
  }

  /**
   * Retrieves metadata for the given metaType and provided parameters
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @param {boolean|null} latestMetas
   * @param {object|null} fields
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @param {boolean} throughAtom
   * @param {array|null} values
   * @param {array|null} keys
   * @param {array|null} atomValues
   * @return {Promise<ResponseMetaType>}
   */
  queryMeta ( {
    metaType,
    metaId = null,
    key = null,
    value = null,
    latest = null,
    latestMetas = null,
    fields = null,
    filter = null,
    queryArgs = null,
    count = null,
    countBy = null,
    throughAtom = false,
    values = null,
    keys = null,
    atomValues = null
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryMeta() - Querying metaType: ${ metaType }, metaId: ${ metaId }...` );
    }

    let query;
    let variables;

    if ( throughAtom ) {
      /**
       * @type {QueryMetaTypeViaAtom}
       */
      query = this.createQuery( QueryMetaTypeViaAtom );
      variables = QueryMetaTypeViaAtom.createVariables( {
        metaType,
        metaId,
        key,
        value,
        latest,
        latestMetas,
        filter,
        queryArgs,
        countBy,
        values,
        keys,
        atomValues
      } );
    } else {
      /**
       * @type {QueryMetaType}
       */
      query = this.createQuery( QueryMetaType );
      variables = QueryMetaType.createVariables( {
        metaType,
        metaId,
        key,
        value,
        latest,
        latestMetas,
        filter,
        queryArgs,
        count,
        countBy
      } );
    }


    return this.executeQuery( query, variables )
      .then( ( response ) => {
        return response.payload();
      } );
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
   * @return {Promise<ResponseMetaType>}
   */
  queryMetaInstance ( {
    metaType,
    metaId = null,
    key = null,
    value = null,
    latest = null,
    filter = null,
    fields = null
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryMetaInstance() - Querying metaType: ${ metaType }, metaId: ${ metaId }...` );
    }

    /**
     * @type {QueryMetaType}
     */
    const query = this.createQuery( QueryMetaType );
    const variables = {
      metaType: metaType,
      metaIds: [ metaId ],
      keys: [ key ],
      values: [ value ],
      latest: latest,
      filter: filter
    };

    return this.executeQuery( query, variables )
      .then( ( response ) => {
        return response.data();
      } );
  }

  /**
   * Query batch to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatch ( {
    batchId
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryBatch() - Querying cascading meta instances for batchId: ${ batchId }...` );
    }

    const query = this.createQuery( QueryBatch );

    return await this.executeQuery( query, {
      batchId
    } );
  }

  /**
   * Query batch history to get cascading meta instances by batchID
   *
   * @param batchId
   * @return {Promise<*>}
   */
  async queryBatchHistory ( {
    batchId
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryBatchHistory() - Querying cascading meta instances for batchId: ${ batchId }...` );
    }

    const query = this.createQuery( QueryBatchHistory );

    return await this.executeQuery( query, {
      batchId
    } );
  }

  /**
   * Queries Knish.IO Atoms
   *
   * @param {string[]} molecularHashes
   * @param {string} molecularHash
   * @param {string[]} bundleHashes
   * @param {string} bundleHash
   * @param {string[]} positions
   * @param {string} position
   * @param {string[]} walletAddresses
   * @param {string} walletAddress
   * @param {string[]} isotopes
   * @param {string} isotope
   * @param {string[]} tokenSlugs
   * @param {string} tokenSlug
   * @param {string[]} cellSlugs
   * @param {string} cellSlug
   * @param {string[]} batchIds
   * @param {string} batchId
   * @param {string[]} values
   * @param {string|number} value
   * @param {string[]} metaTypes
   * @param {string} metaType
   * @param {string[]} metaIds
   * @param {string} metaId
   * @param {string[]} indexes
   * @param {number} index
   * @param {object[]} filter,
   * @param {boolean} latest
   * @param {object} queryArgs
   * @return {Promise<Response>}
   */
  async queryAtom ( {
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
  } ) {

    if ( this.$__logging ) {
      console.info( 'KnishIOClient::queryAtom() - Querying atom instances' );
    }

    /** @type QueryAtom */
    const query = this.createQuery( QueryAtom );


    return await this.executeQuery( query, QueryAtom.createVariables( {
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
    } ) );
  }

  /**
   * Builds and executes a molecule to issue a new Wallet on the ledger
   *
   * @param {string} token
   * @return {Promise<Response>}
   */
  async createWallet ( {
    token
  } ) {

    const newWallet = new Wallet( {
      secret: this.getSecret(),
      token
    } );

    /**
     * @type {MutationCreateWallet}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationCreateWallet
    } );

    query.fillMolecule( newWallet );

    return await this.executeQuery( query );
  }

  /**
   * Queries the ledger to retrieve a list of active sessions for the given MetaType
   *
   * @param {string} bundleHash
   * @param {string} metaType
   * @param {string} metaId
   * @return {Promise<*>}
   */
  async queryActiveSession ( {
    bundleHash,
    metaType,
    metaId
  } ) {

    const query = this.createQuery( QueryActiveSession );

    return await this.executeQuery( query, {
      bundleHash,
      metaType,
      metaId
    } );
  }


  /**
   *
   * @param {string} bundleHash
   * @param {string} metaType
   * @param {string} metaId
   * @param {string} ipAddress
   * @param {string} browser
   * @param {string} osCpu
   * @param {string} resolution
   * @param {string} timeZone
   * @param {Array} countBy
   * @param {string} interval
   * @return {Promise<*>}
   */
  async queryUserActivity ( {
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
  } ) {
    const query = this.createQuery( QueryUserActivity );

    return await this.executeQuery( query, {
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
    } );
  }

  /**
   * Builds and executes a molecule to declare an active session for the given MetaType
   *
   * @param {string} bundle
   * @param {string} metaType
   * @param {string} metaId
   * @param {string} ipAddress
   * @param {string} browser
   * @param {string} osCpu
   * @param {string} resolution
   * @param {string} timeZone
   * @param {object|array} json
   * @return {Promise<void>}
   */
  async activeSession ( {
    bundle,
    metaType,
    metaId,
    ipAddress,
    browser,
    osCpu,
    resolution,
    timeZone,
    json = {}
  } ) {
    const query = this.createQuery( MutationActiveSession );

    return await this.executeQuery( query, {
      bundleHash: bundle,
      metaType,
      metaId,
      ipAddress,
      browser,
      osCpu,
      resolution,
      timeZone,
      json: JSON.stringify( json )
    } );
  }

  /**
   * Builds and executes a molecule to issue a new token on the ledger
   *
   * @param {string} token
   * @param {number|null} amount
   * @param {array|object} meta
   * @param {string|null} batchId
   * @param {array} units
   * @return {Promise<ResponseCreateToken>}
   */
  async createToken ( {
    token,
    amount = null,
    meta = null,
    batchId = null,
    units = []
  } ) {

    // Stackable tokens need a new batch for every transfer
    if ( Dot.get( meta || {}, 'fungibility' ) === 'stackable' ) {

      // No batch ID specified? Create a random one
      if ( !batchId ) {
        batchId = generateBatchId( {} );
      }
      meta.batchId = batchId;

      // Adding unit IDs to the token
      if ( units.length > 0 ) {

        // Stackable tokens with Unit IDs must not use decimals
        if ( Dot.get( meta || {}, 'decimals' ) > 0 ) {
          throw new StackableUnitDecimalsException();
        }

        // Can't create stackable units AND provide amount
        if ( amount > 0 ) {
          throw new StackableUnitAmountException();
        }

        // Calculating amount based on Unit IDs
        amount = units.length;
        meta.splittable = 1;
        meta.tokenUnits = JSON.stringify( units );
      }
    }

    // Creating the wallet that will receive the new tokens
    const recipientWallet = new Wallet( {
      secret: this.getSecret(),
      token,
      batchId
    } );

    /**
     * @type {MutationCreateToken}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationCreateToken
    } );

    query.fillMolecule( {
      recipientWallet,
      amount,
      meta: meta || {}
    } );

    return await this.executeQuery( query );
  }

  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {object[]} rule
   * @param {object} policy
   * @returns {Promise<ResponseCreateRule>}
   */
  async createRule ( {
    metaType,
    metaId,
    rule,
    policy = {}
  } ) {
    /**
     * @type {MutationCreateRule}
     */
    const query = await this.createMoleculeMutation( {
        mutationClass: MutationCreateRule,
        molecule: await this.createMolecule( {
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        } )
      }
    );

    query.fillMolecule( {
      metaType,
      metaId,
      rule,
      policy
    } );

    return await this.executeQuery( query );
  }

  /**
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} metadata
   * @param {object|null} policy
   * @return {Promise<ResponseCreateMeta>}
   */
  async createMeta ( {
    metaType,
    metaId,
    meta = null,
    policy = {}
  } ) {

    /**
     * @type {MutationCreateMeta}
     */
    const query = await this.createMoleculeMutation( {
        mutationClass: MutationCreateMeta,
        molecule: await this.createMolecule( {
          secret: this.getSecret(),
          sourceWallet: await this.getSourceWallet()
        } )
      }
    );

    const metas = meta || {};

    query.fillMolecule( {
      metaType,
      metaId,
      meta: metas,
      policy
    } );

    return await this.executeQuery( query );
  }

  /**
   * Builds and executes a molecule to create a new identifier on the ledger
   *
   * @param {string} type
   * @param {string} contact
   * @param {string} code
   * @return {Promise<ResponseCreateIdentifier>}
   */
  async createIdentifier ( {
    type,
    contact,
    code
  } ) {

    /**
     * @type {MutationCreateIdentifier}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationCreateIdentifier
    } );

    query.fillMolecule( {
      type,
      contact,
      code
    } );

    return await this.executeQuery( query );
  }

  async createPolicy ( {
    metaType,
    metaId,
    policy = {}
  } ) {
    /**
     * @type {MutationCreatePolicy}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationCreatePolicy
    } );

    query.fillMolecule( {
      metaType,
      metaId,
      policy
    } );

    return await this.executeQuery( query );
  }

  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @returns {ResponsePolicy}
   */
  async queryPolicy ( {
    metaType,
    metaId
  } ) {
    const query = this.createQuery( QueryPolicy );
    return await this.executeQuery( query, {
      metaType,
      metaId
    } );
  }

  /**
   * Retrieves a list of your active wallets (unspent)
   *
   * @param {string|null} bundle
   * @param {string|null} token
   * @param {boolean|null} unspent
   * @return {Promise<Response>}
   */
  queryWallets ( {
    bundle = null,
    token = null,
    unspent = true
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryWallets() - Querying wallets${ bundle ? ` for ${ bundle }` : '' }...` );
    }

    /**
     * @type {QueryWalletList}
     */
    const walletQuery = this.createQuery( QueryWalletList );

    return this.executeQuery( walletQuery, {
      bundleHash: bundle ? bundle : this.getBundle(),
      token,
      unspent
    } )
      .then( ( response ) => {
        return response.payload();
      } );
  }

  /**
   * Retrieves a list of your shadow wallets (balance, but no keys)
   *
   * @param {string} token
   * @param {string|null} bundle
   * @return {Promise<[]>}
   */
  queryShadowWallets ( {
    token = 'KNISH',
    bundle = null
  } ) {

    bundle = bundle || this.getBundle();

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryShadowWallets() - Querying ${ token } shadow wallets for ${ bundle }...` );
    }

    /**
     * @type {QueryWalletList}
     */
    const shadowWalletQuery = this.createQuery( QueryWalletList );

    return this.executeQuery( shadowWalletQuery, {
      bundleHash: bundle,
      token
    } )
      .then( ( /** ResponseWalletList */ response ) => {
        return response.payload();
      } );
  }

  /**
   * Retrieves your wallet bundle's metadata from the ledger
   *
   * @param {string|boolean|null} bundle
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean} latest
   * @param {object|null} fields
   * @param {boolean} raw
   * @return {Promise<ResponseWalletBundle|{}>}
   */
  queryBundle ( {
    bundle = null,
    key = null,
    value = null,
    latest = true,
    fields = null,
    raw = false
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryBundle() - Querying wallet bundle metadata${ bundle ? ` for ${ bundle }` : '' }...` );
    }

    /**
     * @type {QueryWalletBundle}
     */
    const query = this.createQuery( QueryWalletBundle );
    const variables = QueryWalletBundle.createVariables( {
      bundleHash: bundle || this.getBundle(),
      key,
      value,
      latest
    } );


    return this.executeQuery( query, variables )
      .then( ( /** ResponseWalletBundle */ response ) => {
        return raw ? response : response.payload();
      } );
  }

  /**
   * Queries the ledger for the next ContinuId wallet
   *
   * @param bundle
   * @return {Promise<ResponseContinuId>}
   */
  async queryContinuId ( {
    bundle
  } ) {
    /**
     * @type {QueryContinuId}
     */
    const query = this.createQuery( QueryContinuId );

    return this.executeQuery( query, {
      bundle
    } );
  }

  /**
   * Builds and executes a Molecule that requests token payment from the node
   *
   * @param {string} token
   * @param {string|Wallet} to
   * @param {number|null} amount
   * @param {array|null} units
   * @param {array|object} meta
   * @param {string|null} batchId
   * @return {Promise<ResponseRequestTokens>}
   */
  async requestTokens ( {
    token,
    to,
    amount = null,
    units = [],
    meta = null,
    batchId = null
  } ) {

    let metaType,
      metaId;

    meta = meta || {};


    // Get a token & init is Stackable flag for batch ID initialization
    const queryToken = this.createQuery( QueryToken );
    const tokenResponse = await this.executeQuery( queryToken, {
      slug: token
    } );
    const isStackable = Dot.get( tokenResponse.data(), '0.fungibility' ) === 'stackable';

    // NON-stackable tokens & batch ID is NOT NULL - error
    if ( !isStackable && batchId !== null ) {
      throw new BatchIdException( 'Expected Batch ID = null for non-stackable tokens.' );
    }
    // Stackable tokens & batch ID is NULL - generate new one
    if ( isStackable && batchId === null ) {
      batchId = generateBatchId( {} );
    }

    // Calculate amount & set meta key
    if ( units.length > 0 ) {

      // Can't move stackable units AND provide amount
      if ( amount > 0 ) {
        throw new StackableUnitAmountException();
      }

      // Calculating amount based on Unit IDs
      amount = units.length;
      meta.tokenUnits = JSON.stringify( units );
    }

    // Are we specifying a specific recipient?
    if ( to ) {

      // If the recipient is provided as an object, try to figure out the actual recipient
      if ( Object.prototype.toString.call( to ) === '[object String]' ) {
        if ( Wallet.isBundleHash( to ) ) {
          metaType = 'walletBundle';
          metaId = to;
        } else {
          to = Wallet.create( {
            secretOrBundle: to,
            token
          } );
        }
      }

      // If recipient is a Wallet, we need to help the node triangulate
      // the transfer by providing position and bundle hash
      if ( to instanceof Wallet ) {
        metaType = 'wallet';
        meta[ 'position' ] = to.position;
        meta[ 'bundle' ] = to.bundle;
        metaId = to.address;
      }
    } else {

      // No recipient, so request tokens for ourselves
      metaType = 'walletBundle';
      metaId = this.getBundle();

    }

    /**
     * @type {MutationRequestTokens}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationRequestTokens
    } );

    query.fillMolecule( {
      token,
      amount,
      metaType,
      metaId,
      meta,
      batchId
    } );

    return await this.executeQuery( query );
  }

  /**
   * Creates and executes a Molecule that assigns keys to an unclaimed shadow wallet
   *
   * @param {string} token
   * @param {string|null} batchId
   * @param {Molecule|null} molecule
   * @return {Promise<ResponseClaimShadowWallet>}
   */
  async claimShadowWallet ( {
    token,
    batchId = null,
    molecule = null
  } ) {

    /**
     * @type {MutationClaimShadowWallet}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationClaimShadowWallet,
      molecule
    } );

    query.fillMolecule( {
      token,
      batchId
    } );

    return await this.executeQuery( query );
  }


  /**
   * Claim shadow wallets
   *
   * @param {string} token
   * @return {[]}
   */
  async claimShadowWallets ( {
    token
  } ) {

    // --- Get & check a shadow wallet list
    const shadowWallets = await this.queryShadowWallets( { token } );
    if ( !shadowWallets || !Array.isArray( shadowWallets ) ) {
      throw new WalletShadowException();
    }

    shadowWallets.forEach( shadowWallet => {
      if ( !shadowWallet.isShadow() ) {
        throw new WalletShadowException();
      }
    } );
    // ----

    let responses = [];
    for ( const shadowWallet of shadowWallets ) {
      responses.push( await this.claimShadowWallet( {
        token,
        batchId: shadowWallet.batchId
      } ) );
    }
    return responses;
  }

  /**
   * Creates and executes a Molecule that moves tokens from one user to another
   *
   * @param {Wallet|string} recipient
   * @param {string} token
   * @param {number|null} amount
   * @param {array|null} units
   * @param {string|null} batchId
   * @param {Wallet|null} sourceWallet
   * @return {Promise<Response>}
   */
  async transferToken ( {
    recipient,
    token,
    amount = null,
    units = [],
    batchId = null,
    sourceWallet = null
  } ) {

    if ( sourceWallet === null ) {
      sourceWallet = ( await this.queryBalance( { token } ) ).payload();
    }

    // Calculate amount & set meta key
    if ( units.length > 0 ) {

      // Can't move stackable units AND provide amount
      if ( amount > 0 ) {
        throw new StackableUnitAmountException();
      }

      amount = units.length;
    }

    // Do you have enough tokens?
    if ( sourceWallet === null || Decimal.cmp( sourceWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException();
    }

    // Attempt to get the recipient's wallet, if not provided
    let recipientWallet = recipient instanceof Wallet ? recipient : ( await this.queryBalance( {
      token,
      bundle: recipient
    } ) ).payload();


    // If no wallet was found, prepare to send to bundle
    // This will typically result in a shadow wallet
    if ( recipientWallet === null ) {
      recipientWallet = Wallet.create( {
        secretOrBundle: recipient,
        token
      } );
    }

    // Compute the batch ID for the recipient
    // (typically used by stackable tokens)
    if ( batchId !== null ) {
      recipientWallet.batchId = batchId;
    } else {
      recipientWallet.initBatchId( {
        sourceWallet
      } );
    }

    this.remainderWallet = Wallet.create( {
      secretOrBundle: this.getSecret(),
      token,
      characters: sourceWallet.characters
    } );
    this.remainderWallet.initBatchId( {
      sourceWallet,
      isRemainder: true
    } );

    // --- Token units splitting
    sourceWallet.splitUnits(
      units,
      this.remainderWallet,
      recipientWallet
    );
    // ---

    // Build the molecule itself
    const molecule = await this.createMolecule( {
        sourceWallet: sourceWallet,
        remainderWallet: this.remainderWallet
      } ),

      /**
       * @type {MutationTransferTokens}
       */
      query = await this.createMoleculeMutation( {
        mutationClass: MutationTransferTokens,
        molecule
      } );

    query.fillMolecule( {
      recipientWallet,
      amount
    } );

    return await this.executeQuery( query );
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
  async burnTokens ( {
    token,
    amount = null,
    units = [],
    sourceWallet = null
  } ) {

    if ( sourceWallet === null ) {
      sourceWallet = ( await this.queryBalance( { token } ) ).payload();
    }

    // Remainder wallet
    let remainderWallet = Wallet.create( {
      secretOrBundle: this.getSecret(),
      token,
      characters: sourceWallet.characters
    } );

    // Batch ID default initialization
    remainderWallet.initBatchId( {
      sourceWallet,
      isRemainder: true
    } );

    // Calculate amount & set meta key
    if ( units.length > 0 ) {

      // Can't burn stackable units AND provide amount
      if ( amount > 0 ) {
        throw new StackableUnitAmountException();
      }

      // Calculating amount based on Unit IDs
      amount = units.length;

      // --- Token units splitting
      sourceWallet.splitUnits(
        units,
        remainderWallet
      );
      // ---

    }

    // Burn tokens
    let molecule = await this.createMolecule( {
      secret: null,
      sourceWallet,
      remainderWallet
    } );
    molecule.burnToken( {
      amount
    } );
    molecule.sign( {} );
    molecule.check();

    const query = ( new MutationProposeMolecule( this.client(), molecule ) );
    return this.executeQuery( query );
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
  async replenishToken ( {
    token,
    amount = null,
    units = [],
    sourceWallet = null
  } ) {


    if ( sourceWallet === null ) {
      sourceWallet = ( await this.queryBalance( { token } ) ).payload();
    }
    if ( !sourceWallet ) {
      throw new TransferBalanceException( 'Source wallet is missing or invalid.' );
    }


    // Remainder wallet
    let remainderWallet = Wallet.create( {
      secretOrBundle: this.getSecret(),
      token,
      characters: sourceWallet.characters
    } );

    // Batch ID default initialization
    remainderWallet.initBatchId( {
      sourceWallet,
      isRemainder: true
    } );


    // Burn tokens
    let molecule = await this.createMolecule( {
      secret: null,
      sourceWallet,
      remainderWallet
    } );
    molecule.replenishToken( {
      amount,
      units
    } );
    molecule.sign( {} );
    molecule.check();


    const query = ( new MutationProposeMolecule( this.client(), molecule ) );
    return this.executeQuery( query );
  }


  /**
   *
   * @param recipient
   * @param tokenSlug
   * @param newTokenUnit
   * @param fusedTokenUnitIds
   * @param sourceWallet
   * @returns {Promise<*>}
   */
  async fuseToken( {
    recipient,
    tokenSlug,
    newTokenUnit,
    fusedTokenUnitIds,
    sourceWallet = null
  }  ) {

    if ( sourceWallet === null ) {
      sourceWallet = ( await this.queryBalance( { token: tokenSlug } ) ).payload();
    }

    console.error( sourceWallet );

    // Check source wallet
    if ( sourceWallet === null ) {
      throw new TransferBalanceException( 'Source wallet is missing or invalid.' );
    }
    if ( !sourceWallet.tokenUnits || !sourceWallet.tokenUnits.length ) {
      throw new TransferBalanceException( 'Source wallet does not have token units.' );
    }
    if ( !fusedTokenUnitIds.length ) {
      throw new TransferBalanceException( 'Fused token unit list is empty.' );
    }

    // Check fused token units
    let sourceTokenUnitIds = [];
    sourceWallet.tokenUnits.forEach( ( tokenUnit ) => {
      sourceTokenUnitIds.push( tokenUnit.id );
    } );
    fusedTokenUnitIds.forEach( ( tokenUnitId ) => {
      if ( !sourceTokenUnitIds.includes( tokenUnitId ) ) {
        throw new TransferBalanceException( `Fused token unit ID = ${ tokenUnitId } does not found in the source wallet.` );
      }
    } );


    // Generate new recipient wallet if only recipient secret has been passed
    let recipientWallet = recipient;
    if ( !( recipient instanceof Wallet ) ) {
      recipientWallet = Wallet.create( {
        secretOrBundle: recipient,
        token: tokenSlug,
      } );
    }
    // Set batch ID
    recipientWallet.initBatchId( { sourceWallet } );

    // Remainder wallet
    let remainderWallet = Wallet.create( {
      secretOrBundle: this.getSecret(),
      token: tokenSlug,
      batchId: sourceWallet.batchId,
      characters: sourceWallet.characters
    } );
    remainderWallet.initBatchId( {
      sourceWallet,
      isRemainder: true
    } )


    // Split token units (fused)
    sourceWallet.splitUnits( fusedTokenUnitIds, remainderWallet );

    // Set recipient new fused token unit
    newTokenUnit.metas[ 'fusedTokenUnits' ] = sourceWallet.tokenUnits;
    recipientWallet.tokenUnits = [ newTokenUnit ];

    // Burn tokens
    let molecule = await this.createMolecule( {
      sourceWallet,
      remainderWallet
    } );
    molecule.fuseToken( sourceWallet.tokenUnits, recipientWallet );
    molecule.sign( {} );
    molecule.check();

    console.error( molecule );

    const query = ( new MutationProposeMolecule( this.client(), molecule ) );
    return this.executeQuery( query );
  }


  /**
   * Request a guest auth token
   *
   * @param cellSlug
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorizationGuest>}
   */
  async requestGuestAuthToken ( {
    cellSlug,
    encrypt
  } ) {
    this.setCellSlug( cellSlug );

    // Create a wallet for encryption
    const wallet = new Wallet( {
      secret: generateSecret(),
      token: 'AUTH'
    } );

    /**
     * @type {MutationRequestAuthorizationGuest}
     */
    const query = await this.createQuery( MutationRequestAuthorizationGuest );

    /**
     * @type {ResponseRequestAuthorizationGuest}
     */
    const response = await query.execute( {
      cellSlug,
      pubkey: wallet.pubkey,
      encrypt
    } );

    // Did the authorization molecule get accepted?
    if ( response.success() ) {

      // Create & set an auth token from the response data
      const authToken = AuthToken.create( response.payload(), wallet );
      this.setAuthToken( authToken );

    } else {

      throw new AuthorizationRejectedException( `KnishIOClient::requestGuestAuthToken() - Authorization attempt rejected by ledger. Reason: ${ response.reason() }` );

    }

    return response;
  }


  /**
   * Request a profile auth token
   *
   * @param secret
   * @param encrypt
   * @returns {Promise<ResponseRequestAuthorization>}
   */
  async requestProfileAuthToken ( {
    secret,
    encrypt
  } ) {
    this.setSecret( secret );

    // Generate a signing wallet
    const wallet = new Wallet( {
      secret,
      token: 'AUTH'
    } );

    // Create a wallet with a signing wallet
    const molecule = await this.createMolecule( {
      secret,
      sourceWallet: wallet
    } );

    /**
     * @type {MutationRequestAuthorization}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationRequestAuthorization,
      molecule
    } );

    query.fillMolecule( { meta: { encrypt: ( encrypt ? 'true' : 'false' ) } } );

    /**
     * @type {ResponseRequestAuthorization}
     */
    const response = await query.execute( {} );


    // Did the authorization molecule get accepted?
    if ( response.success() ) {

      // Create & set an auth token from the response data
      const authToken = AuthToken.create( response.payload(), wallet );
      this.setAuthToken( authToken );

    } else {

      throw new AuthorizationRejectedException( `KnishIOClient::requestProfileAuthToken() - Authorization attempt rejected by ledger. Reason: ${ response.reason() }` );

    }

    return response;
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
  async requestAuthToken ( {
    secret = null,
    seed = null,
    cellSlug = null,
    encrypt = false
  } ) {

    // SDK versions 2 and below do not utilize an authorization token
    if ( this.$__serverSdkVersion < 3 ) {
      if ( this.$__logging ) {
        console.warn( 'KnishIOClient::authorize() - Server SDK version does not require an authorization...' );
      }
      return null;
    }

    // Generate a secret from the seed if it has been passed
    if ( secret === null && seed ) {
      secret = generateSecret( seed );
    }

    // Auth in process...
    this.$__authInProcess = true;

    // Auth token response
    let response;

    // Authorized user
    if ( secret ) {
      response = await this.requestProfileAuthToken( {
        secret,
        encrypt
      } );
    }

    // Guest
    else {
      response = await this.requestGuestAuthToken( {
        cellSlug,
        encrypt
      } );
    }

    // Set auth token
    if ( this.$__logging ) {
      console.info( `KnishIOClient::authorize() - Successfully retrieved auth token ${ this.$__authToken.getToken() }...` );
    }

    // Switch encryption mode if it has been changed
    this.switchEncryption( encrypt );

    // Auth process is stopped
    this.$__authInProcess = false;

    // Return full response
    return response;
  }


  /**
   * Sets the auth token
   *
   * @param {AuthToken} authToken
   */
  setAuthToken ( authToken ) {

    // An empty auth token
    if ( !authToken ) {
      if ( this.$__logging ) {
        console.info( 'KnishIOClient::setAuthToken() - authToken object is empty.' );
      }
      return;
    }

    // Save auth token object to global list
    this.$__authTokenObjects[ this.uri() ] = authToken;

    // Set auth data to apollo client
    this.client().setAuthData( authToken.getAuthData() );

    // Save a full auth token object with expireAt key
    this.$__authToken = authToken;
  }


  /**
   * Returns the current authorization token
   *
   * @return {AuthToken}
   */
  getAuthToken () {
    return this.$__authToken;
  }

}
