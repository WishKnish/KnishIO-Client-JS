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
import { generateBundleHash, generateBatchId } from "./libraries/crypto";
import HttpClient from '../src/httpClient/HttpClient';
import Molecule from "./Molecule";
import Wallet from "./Wallet";
import QueryContinuId from "./query/QueryContinuId";
import QueryWalletBundle from "./query/QueryWalletBundle";
import QueryWalletList from "./query/QueryWalletList";
import QueryBalance from "./query/QueryBalance";
import QueryMetaType from "./query/QueryMetaType";
import QueryBatch from "./query/QueryBatch";
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
   * @param $amount
   *
   * @return array
   */
  static splitTokenUnits( sourceWallet, amount ) {

    // Token units initialization
    let sendTokenUnits;
    [ amount, sendTokenUnits ] =  KnishIOClient.splitUnitAmount( amount );

    // Init recipient & remainder token units
    let recipientTokenUnits = []; let remainderTokenUnits = [];
    sourceWallet.tokenUnits.forEach( tokenUnit => {
      if ( sendTokenUnits.includes( tokenUnit.id ) ) {
        recipientTokenUnits.push( tokenUnit );
      }
      else {
        remainderTokenUnits.push( tokenUnit );
      }
    } );

    return [ amount, recipientTokenUnits, remainderTokenUnits, ];
  }


  static splitUnitAmount( amount ) {
    let tokenUnits = [];
    if ( Array.isArray( amount ) ) {
      tokenUnits = amount;
      amount = amount.length;
    }
    return [ amount, tokenUnits, ];
  }


  /**
   * Class constructor
   *
   * @param {string} url
   * @param {HttpClient} client
   * @param {number} serverSdkVersion
   */
  constructor ( url, client = null, serverSdkVersion = 3 ) {
    this.initialize( url, client, serverSdkVersion );
  }

  /**
   * Initializes a new Knish.IO client session
   *
   * @param {string} url
   * @param {HttpClient} client
   * @param {number} serverSdkVersion
   */
  initialize ( url, client = null, serverSdkVersion = 3 ) {

    console.info( `KnishIOClient::initialize() - Initializing new Knish.IO client session for SDK version ${ serverSdkVersion }...` );

    this.reset();

    this.$__client = client || new HttpClient( url );
    this.$__serverSdkVersion = serverSdkVersion;
  }

  /**
   * Deinitializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize () {
    console.info( 'KnishIOClient::deinitialize() - Clearing the Knish.IO client session...' );

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
      sourceWallet = new Wallet( this.secret() );
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
  async createMolecule ( secret = null, sourceWallet = null, remainderWallet = null ) {

    console.info( 'KnishIOClient::createMolecule() - Creating a new molecule...' );

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
    this.remainderWallet = remainderWallet || Wallet.create( _secret, _sourceWallet.token, _sourceWallet.batchId, _sourceWallet.characters );

    return new Molecule( _secret, _sourceWallet, this.getRemainderWallet(), this.cellSlug() );
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
  async createMoleculeMutation ( mutationClass, molecule = null ) {

    console.info( `KnishIOClient::createMoleculeQuery() - Creating a new ${ mutationClass.name } query...` );

    // If you don't supply the molecule, we'll generate one for you
    let _molecule = molecule || await this.createMolecule();

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
   * @param {string|null} cell_slug
   * @return {Promise<Response>}
   */
  async requestAuthToken ( secret, cell_slug = null ) {

    console.info( 'KnishIOClient::requestAuthToken() - Requesting authorization token...' );

    this.setSecret( secret );
    this.$__cellSlug = cell_slug || this.cellSlug();

    // SDK versions 2 and below do not utilize an authorization token
    if ( this.$__serverSdkVersion > 2 ) {

      let molecule = await this.createMolecule( this.secret(), new Wallet( this.secret(), 'AUTH' ) );

      const query = await this.createMoleculeMutation( MutationRequestAuthorization, molecule );
      query.fillMolecule();
      const response = await query.execute();

      if ( response.success() ) {

        const token = response.token();
        this.client().setAuthToken( token )

        console.info( `KnishIOClient::requestAuthToken() - Successfully retrieved auth token ${ response.token() }...` );

      } else {

        console.warn( 'KnishIOClient::requestAuthToken() - Unable to retrieve auth token...' );
        throw new UnauthenticatedException( response.reason() );

      }

      return response;
    } else {

      console.warn( 'KnishIOClient::requestAuthToken() - Server SDK version does not require an auth token...' );

    }
  }

  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} tokenSlug
   * @param {string|null} bundleHash
   * @return {Promise<Response>}
   */
  async queryBalance ( tokenSlug, bundleHash = null ) {

    const query = this.createQuery( QueryBalance );

    // Execute query with either the provided bundle hash or the active client's bundle
    return await query.execute( {
      'bundleHash': bundleHash ? bundleHash : this.bundle(),
      'token': tokenSlug,
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
   * @returns {Promise<Response|*>}
   */
  queryMeta ( metaType, metaId = null, key = null, value = null, latest = null, fields = null, filter = null ) {

    console.info( `KnishIOClient::queryMeta() - Querying meta type data for metaType: ${ metaType }, metaId: ${ metaId }, key: ${ key }, value: ${ value }, latest: ${ latest }...` );

    const query = this.createQuery( QueryMetaType );
    const variables = QueryMetaType.createVariables( metaType, metaId, key, value, latest, filter );

    return query.execute( variables, fields )
      .then( ( response ) => {
        return response.payload();
      } );
  }

  /**
   * Query batch to get cascade meta instances by batchID
   *
   * @param batchId
   * @returns {Promise<*>}
   */
  async queryBatch ( batchId ) {

    console.info( `KnishIOClient::queryBatch() - Querying cascade meta instance data for batchId: ${ batchId }...` );

    const query = this.createQuery( QueryBatch );

    return await query.execute( { batchId: batchId, } );
  }

  /**
   * Builds and executes a molecule to issue a new Wallet on the ledger
   *
   * @param {string} tokenSlug
   * @return {Promise<Response>}
   */
  async createWallet ( tokenSlug ) {

    const newWallet = new Wallet( this.secret(), tokenSlug );

    const query = await this.createMoleculeMutation( MutationCreateWallet );

    query.fillMolecule( newWallet );

    return await query.execute();
  }

  /**
   * Builds and executes a molecule to issue a new token on the ledger
   *
   * @param {string} tokenSlug
   * @param {number} initialAmount
   * @param {Array|Object} tokenMetadata
   * @return {Promise<Response>}
   */
  async createToken ( tokenSlug, initialAmount, tokenMetadata = null ) {

    const recipientWallet = new Wallet( this.secret(), tokenSlug );

    // Stackable tokens need a new batch for every transfer
    if ( Dot.get( tokenMetadata || {}, 'fungibility' ) === 'stackable' ) {
      recipientWallet.batchId = generateBatchId();
    }

    const query = await this.createMoleculeMutation( MutationCreateToken );

    query.fillMolecule( recipientWallet, initialAmount, tokenMetadata || {} );

    return await query.execute();
  }

  /**
   * Create a token with units
   * @param slug
   * @param units
   * @param metadata
   * @param batchId
   * @returns {Promise<Response>}
   */
  async createUnitableToken ( slug, units, metadata = null, batchId = null ) {
    metadata = metadata || {};
    batchId = batchId || Wallet.generateBatchId();

    // Set custom default metadata
    metadata[ 'tokenUnits' ] = JSON.stringify( units );
    metadata[ 'fungibility' ] = 'stackable';
    metadata[ 'splittable' ] = 1;
    metadata[ 'decimals' ] = 0;

    return await this.createToken( slug, units.length, metadata, batchId );
  }

  /**
   * Builds and executes a molecule to convey new metadata to the ledger
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {Array|Object} metadata
   * @return {Promise<Response>}
   */
  async createMeta ( metaType, metaId, metadata = null ) {

    const query = await this.createMoleculeMutation(
      MutationCreateMeta,
      await this.createMolecule( this.secret(), await this.getSourceWallet() )
    );

    query.fillMolecule( metaType, metaId, metadata );

    return await query.execute();
  }

  /**
   * Builds and executes a molecule to create a new identifier on the ledger
   *
   * @param {string} type
   * @param {string} contact
   * @param {string} code
   * @return {Promise<Response>}
   */
  async createIdentifier ( type, contact, code ) {

    const query = await this.createMoleculeMutation( MutationCreateIdentifier );

    query.fillMolecule( type, contact, code );

    return await query.execute();
  }

  /**
   * Retrieves a list of your active wallets (unspent)
   *
   * @param {string|null} bundleHash
   * @param {boolean|null} unspent
   * @return {Promise<[]>}
   */
  queryWallets ( bundleHash = null, unspent = true ) {

    console.info( `KnishIOClient::queryWallets() - Querying wallets${ bundleHash ? ` for ${ bundleHash }` : '' }...` );

    const walletQuery = this.createQuery( QueryWalletList );
    return walletQuery.execute( {
      bundleHash: bundleHash ? bundleHash : this.bundle(),
      unspent: unspent,
    } ).then( ( response ) => {
      return response.getWallets();
    } )
  }

  /**
   * Retrieves a list of your shadow wallets (balance, but no keys)
   *
   * @param {string} tokenSlug
   * @param {string|null} bundleHash
   * @return {Promise<Response>}
   */
  queryShadowWallets ( tokenSlug = 'KNISH', bundleHash = null ) {

    bundleHash = bundleHash ? bundleHash : this.bundle();
    console.info( `KnishIOClient::queryShadowWallets() - Querying ${ tokenSlug } shadow wallets for ${ bundleHash }...` );

    const shadowWalletQuery = this.createQuery( QueryWalletList );
    return shadowWalletQuery.execute( {
      bundleHash: bundleHash,
      token: tokenSlug,
    } ).then( ( response ) => {
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
   * @returns {Promise<Response>}
   */
  queryBundle ( bundleHash = null, key = null, value = null, latest = true, fields = null ) {

    console.info( `KnishIOClient::queryBundle() - Querying wallet bundle metadata${ bundleHash ? ` for ${ bundleHash }` : '' }...` );

    const query = this.createQuery( QueryWalletBundle );
    const variables = QueryWalletBundle.createVariables( bundleHash !== null ? bundleHash : this.bundle(), key, value, latest );

    return query.execute( variables, fields )
      .then( ( response ) => {
        return response.payload();
      } )
  }

  /**
   * Queries the ledger for the next ContinuID wallet
   *
   * @param bundleHash
   * @returns {Promise<Response>}
   */
  async queryContinuId ( bundleHash ) {
    return await this.createQuery( QueryContinuId ).execute( { 'bundle': bundleHash } );
  }

  /**
   * Builds and executes a Molecule that requests token payment from the node
   *
   * @param tokenSlug
   * @param value
   * @param to
   * @param metas
   * @return {Promise<Response>}
   */
  async requestTokens ( tokenSlug, requestedAmount, to, metas = null, batchId = null ) {

    let metaType,
      metaId;

    metas = metas || {};

    // Are we specifying a specific recipient?
    if ( to ) {

      // If the recipient is provided as an object, try to figure out the actual recipient
      if ( Object.prototype.toString.call( to ) === '[object String]' ) {
        if ( Wallet.isBundleHash( to ) ) {
          metaType = 'walletBundle';
          metaId = to;
        } else {
          to = Wallet.create( to, tokenSlug );
        }
      }

      // If recipient is a Wallet, we need to help the node triangulate
      // the transfer by providing position and bundle hash
      if ( to instanceof Wallet ) {
        metaType = 'wallet';
        metas[ 'position' ] = to.position;
        metas[ 'bundle' ] = to.bundle;
        metaId = to.address;
      }
    } else {

      // No recipient, so request tokens for ourselves
      metaType = 'walletBundle';
      metaId = this.bundle();

    }

    // --- Token units initialization
    let tokenUnits;
    [ requestedAmount, tokenUnits ] = KnishIOClient.splitUnitAmount( requestedAmount );
    if ( tokenUnits ) {
      metas[ 'tokenUnits' ] = JSON.stringify( tokenUnits );
    }
    // ---

    const query = await this.createMoleculeMutation( MutationRequestTokens );

    query.fillMolecule( tokenSlug, requestedAmount, metaType, metaId, metas );

    return await query.execute();
  }

  /**
   * Creates and executes a Molecule that assigns keys to an unclaimed shadow wallet
   *
   * @param {string} tokenSlug
   * @param {string} batchId
   * @param {Molecule} molecule
   * @returns {Promise<Response>}
   */
  async claimShadowWallet ( tokenSlug, batchId, molecule = null ) {

    const query = await this.createMoleculeMutation( MutationClaimShadowWallet, molecule );
    query.fillMolecule( tokenSlug, batchId );

    return await query.execute();
  }


  /**
   * Claim shadow wallets
   *
   * @param tokenSlug
   * @returns {Promise<Response|*|[]>}
   */
  async claimShadowWallets ( tokenSlug ) {

    // --- Get & check a shadow wallet list
    const shadowWallets = await this.queryShadowWallets( tokenSlug );
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
      responses.push( await this.claimShadowWallet( tokenSlug, shadowWallet.batchId ) );
    }
    return responses;
  }

  /**
   * Creates and executes a Molecule that moves tokens from one user to another
   *
   * @param {Wallet|string} walletObjectOrBundleHash
   * @param {string} tokenSlug
   * @param {number} amount
   * @return {Promise<Response>}
   */
  async transferToken ( walletObjectOrBundleHash, tokenSlug, amount, batchId = null ) {

    const fromWallet = ( await this.queryBalance( tokenSlug ) ).payload();
    
    // --- Token units splitting
    let recipientTokenUnits, remainderTokenUnits;
    [ amount, recipientTokenUnits, remainderTokenUnits ] = KnishIOClient.splitTokenUnits( fromWallet, amount );
    // ---

    // Do you have enough tokens?
    if ( fromWallet === null || Decimal.cmp( fromWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException();
    }

    // Attempt to get the recipient's wallet, if not provided
    let toWallet = walletObjectOrBundleHash instanceof Wallet ?
      walletObjectOrBundleHash : ( await this.queryBalance( tokenSlug, walletObjectOrBundleHash ) ).payload();

    // If no wallet was found, prepare to send to bundle
    // This will typically result in a shadow wallet
    if ( toWallet === null ) {
      toWallet = Wallet.create( walletObjectOrBundleHash, tokenSlug );
    }

    // Compute the batch ID for the recipient
    // (typically used by stackable tokens)
    if ( batchId !== null ) {
      toWallet.batchId = batchId;
    }
    else {
      toWallet.initBatchId( fromWallet, amount );
    }
    toWallet.tokenUnits = recipientTokenUnits;

    this.remainderWallet = Wallet.create( this.secret(), tokenSlug, toWallet.batchId, fromWallet.characters );
    this.remainderWallet.tokenUnits = remainderTokenUnits;

    // Build the molecule itself
    const molecule = await this.createMolecule(
      null,
      fromWallet,
      this.remainderWallet
      ),
      query = await this.createMoleculeMutation( MutationTransferTokens, molecule );

    query.fillMolecule( toWallet, amount );

    return await query.execute();
  }





}
