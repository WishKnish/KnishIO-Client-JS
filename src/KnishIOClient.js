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

/**
 * Base client class providing a powerful but user-friendly wrapper
 * around complex Knish.IO ledger transactions.
 */
export default class KnishIOClient {

  /**
   * Class constructor
   *
   * @param {string} uri
   * @param {string|null} socketUri
   * @param {ApolloClient|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   * @param {boolean} encrypt
   */
  constructor ( {
    uri,
    client = null,
    socketUri = null,
    serverSdkVersion = 3,
    logging = false,
    encrypt = false
  } ) {
    this.initialize( {
      uri,
      socketUri,
      client,
      serverSdkVersion,
      logging,
      encrypt
    } );
  }

  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string|[]} uri
   * @param {string|null} socketUri
   * @param {ApolloClient|null} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   * @param {boolean} encrypt
   */
  initialize ( {
    uri,
    socketUri = null,
    client = null,
    serverSdkVersion = 3,
    logging = false,
    encrypt = false
  } ) {

    this.$__logging = logging;
    this.$__encrypt = false;
    this.$__uris = typeof uri === 'object' ? uri : [ uri ];
    this.$__authTokenObjects = {};
    this.$__authInProcess = false;
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

    if ( encrypt ) {
      this.enableEncryption();
    }

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
   * Returns whether or not the end-to-end encryption protocol is enabled
   *
   * @return {boolean}
   */
  hasEncryption () {
    return this.$__encrypt;
  }

  /**
   * Deinitializes the Knish.IO client session so that a new session can replace it
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
        this.authorize( {
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
   * Returns whether or not a secret is being stored for this session
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
    if ( !this.$__secret ) {
      throw new UnauthenticatedException( 'KnishIOClient::getSecret() - Unable to find a stored getSecret!' );
    }
    return this.$__secret;
  }

  /**
   * Returns the bundle hash for this session
   *
   * @return {string}
   */
  getBundle () {
    if ( !this.$__bundle ) {
      throw new UnauthenticatedException( 'KnishIOClient::getBundle() - Unable to find a stored getBundle!' );
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

    const _secret = secret || this.getSecret();
    let _sourceWallet = sourceWallet;

    // Sets the source wallet as the last remainder wallet (to maintain ContinuID)
    if ( !sourceWallet && this.lastMoleculeQuery && this.getRemainderWallet().token !== 'AUTH' && this.lastMoleculeQuery && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() ) {
      _sourceWallet = this.getRemainderWallet();
    }

    // Unable to use last remainder wallet; Figure out what wallet to use:
    if ( _sourceWallet === null ) {
      _sourceWallet = await this.getSourceWallet();
    }

    // Set the remainder wallet for the next transaction
    this.remainderWallet = remainderWallet || Wallet.create( {
      secretOrBundle: _secret,
      token: _sourceWallet.token,
      batchId: _sourceWallet.batchId,
      characters: _sourceWallet.characters
    } );

    return new Molecule( {
      secret: _secret,
      sourceWallet: _sourceWallet,
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
    return query.execute( {
      variables: {
        bundleHash: bundle || this.getBundle(),
        token
      }
    } );
  }

  /**
   * @param {string|null} bundle
   * @param {function} closure
   * @return {string}
   */
  subscribeCreateMolecule ( {
    bundle,
    closure
  } ) {
    const subscribe = this.createSubscribe( CreateMoleculeSubscribe );

    return subscribe.execute( {
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
    countBy = null
  } ) {

    if ( this.$__logging ) {
      console.info( `KnishIOClient::queryMeta() - Querying metaType: ${ metaType }, metaId: ${ metaId }...` );
    }

    /**
     * @type {QueryMetaType}
     */
    const query = this.createQuery( QueryMetaType );
    const variables = QueryMetaType.createVariables( {
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

    return query.execute( {
      variables,
      fields
    } )
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

    return query.execute( {
      variables,
      fields
    } )
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

    return await query.execute( {
      variables: { batchId: batchId }
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

    return await query.execute( {
      variables: { batchId: batchId }
    } );
  }

  /*
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

    return await query.execute( {} );
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

    return await query.execute( {
      variables: {
        bundleHash,
        metaType,
        metaId
      }
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

    return await query.execute( {
      variables: {
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
      }
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

    return await query.execute( {
      variables: {
        bundleHash: bundle,
        metaType,
        metaId,
        ipAddress,
        browser,
        osCpu,
        resolution,
        timeZone,
        json: JSON.stringify( json )
      }
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

    return await query.execute( {} );
  }

  /**
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} metadata
   * @return {Promise<ResponseCreateMeta>}
   */
  async createMeta ( {
    metaType,
    metaId,
    meta = null
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

    query.fillMolecule( {
      metaType,
      metaId,
      meta
    } );

    return await query.execute( {} );
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

    return await query.execute( {} );
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
    return walletQuery.execute( {
      variables: {
        bundleHash: bundle ? bundle : this.getBundle(),
        token: token,
        unspent: unspent
      }
    } ).then( ( response ) => {
      return response.getWallets();
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
    return shadowWalletQuery.execute( {
      variables: {
        bundleHash: bundle,
        token: token
      }
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

    return query.execute( {
      variables,
      fields
    } )
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
    return query.execute( {
      variables: {
        bundle: bundle
      }
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

    return await query.execute( {} );
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

    return await query.execute( {} );
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
      remainder: true
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


    return await query.execute( {} );
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
      remainder: true
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

    return ( new MutationProposeMolecule( this.client(), molecule ) ).execute( {} );
  }


  /**
   *
   * @param cellSlug
   * @param encrypt
   * @return {Promise<AuthToken>}
   */
  async getGuestAuthToken ( {
    cellSlug,
    encrypt
  } ) {
    this.setCellSlug( cellSlug );

    let wallet = new Wallet( {
      secret: generateSecret(),
      token: 'AUTH'
    } );

    /**
     * @type {MutationRequestAuthorizationGuest}
     */
    let query = await this.createQuery( MutationRequestAuthorizationGuest );

    /**
     * @type {ResponseRequestAuthorization}
     */
    let response = await query.execute( {
      variables: {
        cellSlug,
        pubkey: wallet.pubkey,
        encrypt
      }
    } );
    return AuthToken.create( response.payload(), wallet, encrypt );
  }


  /**
   *
   * @param secret
   * @param encrypt
   * @return {Promise<AuthToken>}
   */
  async getProfileAuthToken ( {
    secret,
    encrypt
  } ) {
    this.setSecret( secret );

    let wallet = new Wallet( {
      secret,
      token: 'AUTH'
    } );

    const molecule = await this.createMolecule( {
      secret,
      sourceWallet: wallet
    } );

    /**
     * @type {MutationRequestAuthorization}
     */
    let query = await this.createMoleculeMutation( {
      mutationClass: MutationRequestAuthorization,
      molecule
    } );

    query.fillMolecule( { meta: { encrypt: ( encrypt ? 'true' : 'false' ) } } );

    /**
     * @type {ResponseRequestAuthorization}
     */
    let response = await query.execute( {} );
    return AuthToken.create( response.payload(), wallet, encrypt );
  }

  /**
   * @todo Deprecated function, used for old version!
   *
   * @param {string|null} secret
   * @param {string|null} cellSlug
   * @param {boolean} encrypt
   * @return {Promise<{payload: (function(): {time: *, token: *})}>}
   */
  async requestAuthToken ( {
    secret = null,
    cellSlug = null,
    encrypt = false
  } ) {

    // Set default cell slug (when requestAuthToken calls from boot without args)
    cellSlug = cellSlug ? cellSlug : this.$__cellSlug;

    // Get an auth token
    let authToken = await this.authorize( {
      secret,
      cellSlug,
      encrypt
    } );

    // Create a base object with payload function (instead of Response object)
    return {
      payload: function () {
        return {
          token: authToken.getToken(),
          time: authToken.getExpireInterval()
        };
      }
    };
  }


  /**
   * Authorize with auth token
   *
   * @param {string} secret
   * @param {string|null} cellSlug
   * @param {boolean} encrypt
   * @return {Promise<AuthToken>|null}
   */
  async authorize ( {
    secret,
    cellSlug = null,
    encrypt = false
  } ) {

    // SDK versions 2 and below do not utilize an authorization token
    if ( this.$__serverSdkVersion < 3 ) {
      if ( this.$__logging ) {
        console.warn( 'KnishIOClient::authorize() - Server SDK version does not require an authorization...' );
      }
      return;
    }

    // Auth in process...
    this.$__authInProcess = true;

    let authToken;

    // Authorized user
    if ( secret ) {
      authToken = await this.getProfileAuthToken( {
        secret,
        encrypt
      } );
    }

    // Guest
    else {
      authToken = await this.getGuestAuthToken( {
        cellSlug,
        encrypt
      } );
    }

    // Set auth token
    if ( this.$__logging ) {
      console.info( `KnishIOClient::authorize() - Successfully retrieved auth token ${ authToken.token }...` );
    }

    // Set an authToken full info
    this.setAuthToken( authToken );

    // Switch encryption mode if it has been changed
    this.switchEncryption( encrypt );

    // Auth process is stopped
    this.$__authInProcess = false;

    // Return full response
    return authToken;
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
