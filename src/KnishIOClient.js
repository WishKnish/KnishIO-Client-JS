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
import Dot from "./libraries/Dot";
import Decimal from "./libraries/Decimal";
import {
  generateBundleHash,
  generateBatchId
} from "./libraries/crypto";
import HttpClient from '../src/httpClient/HttpClient';
import Molecule from "./Molecule";
import Wallet from "./Wallet";
import QueryContinuId from "./query/QueryContinuId";
import QueryWalletBundle from "./query/QueryWalletBundle";
import QueryWalletList from "./query/QueryWalletList";
import QueryBalance from "./query/QueryBalance";
import QueryMetaType from "./query/QueryMetaType";
import MutationRequestAuthorization from "./mutation/MutationRequestAuthorization";
import MutationCreateToken from "./mutation/MutationCreateToken";
import MutationRequestTokens from "./mutation/MutationRequestTokens";
import MutationTransferTokens from "./mutation/MutationTransferTokens";
import MutationProposeMolecule from "./mutation/MutationProposeMolecule";
import MutationCreateIdentifier from "./mutation/MutationCreateIdentifier";
import MutationClaimShadowWallet from "./mutation/MutationClaimShadowWallet";
import TransferBalanceException from "./exception/TransferBalanceException";
import CodeException from "./exception/CodeException";
import UnauthenticatedException from "./exception/UnauthenticatedException";
import WalletShadowException from "./exception/WalletShadowException";
import MutationCreateMeta from "./mutation/MutationCreateMeta";
import MutationCreateWallet from "./mutation/MutationCreateWallet";

/**
 * Base client class providing a powerful but user-friendly wrapper
 * around complex Knish.IO ledger transactions.
 */
export default class KnishIOClient {
  /**
   * Class constructor
   *
   * @param {string} url
   * @param {HttpClient} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  constructor ( {
    url,
    client = null,
    serverSdkVersion = 3,
    logging = false,
  } ) {
    this.initialize( {
      url,
      client,
      serverSdkVersion,
      logging,
    } );
  }

  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string} url
   * @param {HttpClient} client
   * @param {number} serverSdkVersion
   * @param {boolean} logging
   */
  initialize ( {
    url,
    client = null,
    serverSdkVersion = 3,
    logging = false,
  } ) {

    this.$__logging = logging;

    if( this.$__logging ) {
      console.info( `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${ serverSdkVersion }...` );
    }

    this.reset();

    this.$__client = client || new HttpClient( url );
    this.$__serverSdkVersion = serverSdkVersion;
  }

  /**
   * Deinitializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize () {
    if( this.$__logging ) {
      console.info( 'KnishIOClient::deinitialize() - Clearing the Knish.IO client session...' );
    }
    this.reset();
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
   * @returns {string|null}
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
   * Retrieves the endpoint URL for this session
   *
   * @returns {string}
   */
  url () {
    return this.client().getUrl();
  }

  /**
   * Returns the HTTP client class session
   *
   * @returns {HttpClient}
   */
  client () {
    return this.$__client;
  }

  /**
   * Returns whether or not a secret is being stored for this session
   *
   * @returns {boolean}
   */
  hasSecret () {
    return !!this.$__secret;
  }


  /**
   * Set the client's secret
   * @param secret
   */
  setSecret ( secret ) {
    this.$__secret = secret;
    this.$__bundle = generateBundleHash( secret );
  }


  /**
   * Retrieves the stored secret for this session
   *
   * @returns {string}
   */
  secret () {
    if ( !this.$__secret ) {
      throw new UnauthenticatedException( 'KnishIOClient::secret() - Unable to find a stored secret!' );
    }
    return this.$__secret;
  }

  /**
   * Returns the bundle hash for this session
   *
   * @returns {string}
   */
  bundle () {
    if ( !this.$__bundle ) {
      throw new UnauthenticatedException( 'KnishIOClient::bundle() - Unable to find a stored bundle!' );
    }
    return this.$__bundle;
  }

  /**
   * Retrieves this session's wallet used for signing the next Molecule
   *
   * @returns {Promise<*|Wallet|null>}
   */
  async getSourceWallet () {
    let sourceWallet = ( await this.queryContinuId( this.bundle() ) ).payload();

    if ( !sourceWallet ) {
      sourceWallet = new Wallet( {
        secret: this.secret(),
      } );
    }

    return sourceWallet;
  }

  /**
   * Retrieves this session's remainder wallet
   *
   * @returns {null}
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
   * @returns {Promise<Molecule>}
   */
  async createMolecule ( {
    secret = null,
    sourceWallet = null,
    remainderWallet = null,
  } ) {

    if( this.$__logging ) {
      console.info( 'KnishIOClient::createMolecule() - Creating a new molecule...' );
    }

    const _secret = secret || this.secret();
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
      characters: _sourceWallet.characters,
    } );

    return new Molecule( {
      secret: _secret,
      sourceWallet: _sourceWallet,
      remainderWallet: this.getRemainderWallet(),
      cellSlug: this.cellSlug(),
    } );
  }

  /**
   * Builds a new instance of the provided Query class
   *
   * @param queryClass
   * @return {*}
   */
  createQuery ( queryClass ) {
    return new queryClass( this.client() )
  }

  /**
   * Uses the supplied Mutation class to build a new tailored Molecule
   *
   * @param mutationClass
   * @param molecule
   */
  async createMoleculeMutation ( {
    mutationClass,
    molecule = null,
  } ) {

    if( this.$__logging ) {
      console.info( `KnishIOClient::createMoleculeQuery() - Creating a new ${ mutationClass.name } query...` );
    }

    // If you don't supply the molecule, we'll generate one for you
    let _molecule = molecule || await this.createMolecule( {} );

    const mutation = new mutationClass( this.client(), _molecule );

    if ( !( mutation instanceof MutationProposeMolecule ) ) {
      throw new CodeException( `${ this.constructor.name }::createMoleculeMutation - required class instance of MutationProposeMolecule.` );
    }

    this.lastMoleculeQuery = mutation;

    return mutation;
  }

  /**
   * Requests an authorization token from the node endpoint
   *
   * @param {string} secret
   * @param {string|null} cellSlug
   * @return {Promise<Response>}
   */
  async requestAuthToken ( {
    secret,
    cellSlug = null,
  } ) {

    if( this.$__logging ) {
      console.info( 'KnishIOClient::requestAuthToken() - Requesting authorization token...' );
    }

    this.setSecret( secret );
    this.$__cellSlug = cellSlug || this.cellSlug();

    // SDK versions 2 and below do not utilize an authorization token
    if ( this.$__serverSdkVersion > 2 ) {

      let molecule = await this.createMolecule( {
        secret: this.secret(),
        sourceWallet: new Wallet( {
          secret: this.secret(),
          token: 'AUTH',
        } ),
      } );

      /**
       * @type {MutationRequestAuthorization}
       */
      const query = await this.createMoleculeMutation( {
        mutationClass: MutationRequestAuthorization,
        molecule,
      } );
      query.fillMolecule();

      /**
       * @type {ResponseRequestAuthorization}
       */
      const response = await query.execute( {} );

      if ( response.success() ) {

        const token = response.token();
        this.client().setAuthToken( token )

        if( this.$__logging ) {
          console.info( `KnishIOClient::requestAuthToken() - Successfully retrieved auth token ${ response.token() }...` );
        }

      } else {

        if( this.$__logging ) {
          console.warn( 'KnishIOClient::requestAuthToken() - Unable to retrieve auth token...' );
        }

        throw new UnauthenticatedException( response.reason() );

      }

      return response;
    } else {

      if( this.$__logging ) {
        console.warn( 'KnishIOClient::requestAuthToken() - Server SDK version does not require an auth token...' );
      }

    }
  }

  /**
   * Returns the current authorization token
   *
   * @returns {string|null}
   */
  getAuthToken() {
    return this.client().getAuthToken();
  }

  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} token
   * @param {string|null} bundleHash
   * @return {Promise<ResponseBalance>}
   */
  async queryBalance ( {
    token,
    bundleHash = null,
  } ) {

    /**
     * @type {QueryBalance}
     */
    const query = this.createQuery( QueryBalance );

    // Execute query with either the provided bundle hash or the active client's bundle
    return await query.execute( {
      variables: {
        bundleHash: bundleHash ? bundleHash : this.bundle(),
        token,
      }
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
   * @returns {Promise<ResponseMetaType>}
   */
  queryMeta ( {
    metaType,
    metaId = null,
    key = null,
    value = null,
    latest = null,
    fields = null,
    filter = null
  } ) {

    if( this.$__logging ) {
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
      filter,
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
   * Builds and executes a molecule to issue a new Wallet on the ledger
   *
   * @param {string} token
   * @return {Promise<Response>}
   */
  async createWallet ( token ) {

    const newWallet = new Wallet( {
      secret: this.secret(),
      token,
    } );

    /**
     * @type {MutationCreateWallet}
     */
    const query = await this.createMoleculeMutation( MutationCreateWallet );

    query.fillMolecule( newWallet );

    return await query.execute( {} );
  }

  /**
   * Builds and executes a molecule to issue a new token on the ledger
   *
   * @param {string} token
   * @param {number} amount
   * @param {array|object} meta
   * @return {Promise<ResponseCreateToken>}
   */
  async createToken ( {
    token,
    amount,
    meta = null,
  } ) {

    const recipientWallet = new Wallet( {
      secret: this.secret(),
      token,
    } );

    // Stackable tokens need a new batch for every transfer
    if ( Dot.get( meta || {}, 'fungibility' ) === 'stackable' ) {
      recipientWallet.batchId = generateBatchId();
    }

    /**
     * @type {MutationCreateToken}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationCreateToken,
    } );

    query.fillMolecule( {
      recipientWallet,
      amount,
      meta: meta || {},
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
    meta = null,
  } ) {

    /**
     * @type {MutationCreateMeta}
     */
    const query = await this.createMoleculeMutation( {
        mutationClass: MutationCreateMeta,
        molecule: await this.createMolecule( {
          secret: this.secret(),
          sourceWallet: await this.getSourceWallet(),
        } ),
      }
    );

    query.fillMolecule( {
      metaType,
      metaId,
      meta,
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
    code,
  } ) {

    /**
     * @type {MutationCreateIdentifier}
     */
    const query = await this.createMoleculeMutation( MutationCreateIdentifier );

    query.fillMolecule( {
      type,
      contact,
      code,
    } );

    return await query.execute( {} );
  }

  /**
   * Retrieves a list of your active wallets (unspent)
   *
   * @param {string|null} bundleHash
   * @param {boolean|null} unspent
   * @return {Promise<[]>}
   */
  queryWallets ( {
    bundleHash = null,
    unspent = true,
  } ) {

    if( this.$__logging ) {
      console.info( `KnishIOClient::queryWallets() - Querying wallets${ bundleHash ? ` for ${ bundleHash }` : '' }...` );
    }

    /**
     * @type {QueryWalletList}
     */
    const walletQuery = this.createQuery( QueryWalletList );
    return walletQuery.execute( {
      variables: {
        bundleHash: bundleHash ? bundleHash : this.bundle(),
        unspent: unspent,
      },
    } ).then( ( response ) => {
      return response.getWallets();
    } )
  }

  /**
   * Retrieves a list of your shadow wallets (balance, but no keys)
   *
   * @param {string} tokenSlug
   * @param {string|null} bundleHash
   * @return {Promise<[]>}
   */
  queryShadowWallets ( {
    tokenSlug = 'KNISH',
    bundleHash = null,
  } ) {

    bundleHash = bundleHash ? bundleHash : this.bundle();

    if( this.$__logging ) {
      console.info( `KnishIOClient::queryShadowWallets() - Querying ${ tokenSlug } shadow wallets for ${ bundleHash }...` );
    }

    /**
     * @type {QueryWalletList}
     */
    const shadowWalletQuery = this.createQuery( QueryWalletList );
    return shadowWalletQuery.execute( {
      variables: {
        bundleHash: bundleHash,
        token: tokenSlug,
      }
    } )
      .then( ( /** ResponseWalletList */ response ) => {
        return response.payload();
      } );
  }

  /**
   * Retrieves your wallet bundle's metadata from the ledger
   *
   * @param {string|boolean|null} bundleHash
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean} latest
   * @param {object|null} fields
   * @returns {Promise<{}>}
   */
  queryBundle ( {
    bundleHash = null,
    key = null,
    value = null,
    latest = true,
    fields = null
  } ) {

    if( this.$__logging ) {
      console.info( `KnishIOClient::queryBundle() - Querying wallet bundle metadata${ bundleHash ? ` for ${ bundleHash }` : '' }...` );
    }

    /**
     * @type {QueryWalletBundle}
     */
    const query = this.createQuery( QueryWalletBundle );
    const variables = QueryWalletBundle.createVariables( {
      bundleHash: bundleHash !== null ? bundleHash : this.bundle(),
      key,
      value,
      latest,
    } );

    return query.execute( {
      variables,
      fields
    } )
      .then( ( /** ResponseWalletBundle */ response ) => {
        return response.payload();
      } )
  }

  /**
   * Queries the ledger for the next ContinuId wallet
   *
   * @param bundleHash
   * @returns {Promise<ResponseContinuId>}
   */
  async queryContinuId ( bundleHash ) {
    /**
     * @type {QueryContinuId}
     */
    const query = this.createQuery( QueryContinuId );
    return await query.execute( {
      variables: {
        bundle: bundleHash,
      }
    } );
  }

  /**
   * Builds and executes a Molecule that requests token payment from the node
   *
   * @param tokenSlug
   * @param requestedAmount
   * @param to
   * @param meta
   * @return {Promise<ResponseRequestTokens>}
   */
  async requestTokens ( {
    token,
    requestedAmount,
    to,
    meta = null,
  } ) {

    let metaType,
      metaId;

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
            token,
          } );
        }
      }

      // If recipient is a Wallet, we need to help the node triangulate
      // the transfer by providing position and bundle hash
      if ( to instanceof Wallet ) {
        metaType = 'wallet';
        meta = Molecule.mergeMetas( meta || {}, {
          position: to.position,
          bundle: to.bundle,
        } );
        metaId = to.address;
      }
    } else {

      // No recipient, so request tokens for ourselves
      metaType = 'walletBundle';
      metaId = this.bundle();

    }

    /**
     * @type {MutationRequestTokens}
     */
    const query = await this.createMoleculeMutation( MutationRequestTokens );

    query.fillMolecule( {
      token,
      requestedAmount,
      metaType,
      metaId,
      meta,
    } );

    return await query.execute( {} );
  }

  /**
   * Creates and executes a Molecule that assigns keys to an unclaimed shadow wallet
   *
   * @param {string} token
   * @param {string|null} batchId
   * @param {Molecule|null} molecule
   * @returns {Promise<ResponseClaimShadowWallet>}
   */
  async claimShadowWallet ( {
    token,
    batchId = null,
    molecule = null,
  } ) {

    /**
     * @type {MutationClaimShadowWallet}
     */
    const query = await this.createMoleculeMutation( {
      mutationClass: MutationClaimShadowWallet,
      molecule,
    } );

    query.fillMolecule( {
      token,
      batchId,
    } );

    return await query.execute( {} );
  }


  /**
   * Claim shadow wallets
   *
   * @param token
   * @returns {[]}
   */
  async claimShadowWallets ( token ) {

    // --- Get & check a shadow wallet list
    const shadowWallets = await this.queryShadowWallets( token );
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
        batchId: shadowWallet.batchId,
      } ) );
    }
    return responses;
  }

  /**
   * Creates and executes a Molecule that moves tokens from one user to another
   *
   * @param {Wallet|string} recipient
   * @param {string} token
   * @param {number} amount
   * @return {Promise<Response>}
   */
  async transferToken ( {
    recipient,
    token,
    amount,
  } ) {

    const fromWallet = ( await this.queryBalance( {
      token,
    } ) ).payload();

    // Do you have enough tokens?
    if ( fromWallet === null || Decimal.cmp( fromWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException();
    }

    // Attempt to get the recipient's wallet, if not provided
    let toWallet = recipient instanceof Wallet ?
      recipient : ( await this.queryBalance( {
        token,
        bundleHash: recipient,
      } ) ).payload();

    // If no wallet was found, prepare to send to bundle
    // This will typically result in a shadow wallet
    if ( toWallet === null ) {
      toWallet = Wallet.create( {
        secretOrBundle: recipient,
        token
      } );
    }

    // Compute the batch ID for the recipient
    // (typically used by stackable tokens)
    toWallet.initBatchId( {
      senderWallet: fromWallet,
      amount,
    } );

    this.remainderWallet = Wallet.create( {
      secretOrBundle: this.secret(),
      token,
      batchId: toWallet.batchId,
      characters: fromWallet.characters,
    } );

    // Build the molecule itself
    const molecule = await this.createMolecule( {
        sourceWallet: fromWallet,
        remainderWallet: Wallet.create( {
          secretOrBundle: this.secret(),
          token,
          batchId: toWallet.batchId,
          characters: fromWallet.characters,
        } ),
      } ),

      /**
       * @type {MutationTransferTokens}
       */
      query = await this.createMoleculeMutation( {
        mutationClass: MutationTransferTokens,
        molecule,
      } );

    query.fillMolecule( {
      toWallet,
      value: amount,
    } );

    return await query.execute( {} );
  }

}
