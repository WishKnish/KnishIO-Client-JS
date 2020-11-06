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
import { generateBundleHash, } from "./libraries/crypto";
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
import MutationCreateMeta from "./mutation/MutationCreateMeta";

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

    this.$__url = url;
    this.$__secret = '';
    this.$__bundle = '';
    this.$__client = client || new HttpClient( this.$__url );
    this.$__serverSdkVersion = serverSdkVersion;
    this.remainderWallet = null;
  }

  /**
   * Deinitializes the Knish.IO client session so that a new session can replace it
   */
  deinitialize () {
    console.info( 'KnishIOClient::deinitialize() - Clearing the Knish.IO client session...' );

    this.$__secret = '';
    this.$__bundle = '';
    this.remainderWallet = null;
  }

  /**
   * Returns the currently defined Cell identifier for this session
   *
   * @returns {string|*|null}
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
   * Sets the authorization token for this session
   *
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.client().setAuthToken( authToken );
  }

  /**
   * Retrieves the authorization token for this session
   *
   * @return {string}
   */
  getAuthToken () {
    return this.client().getAuthToken();
  }

  /**
   * Retrieves the endpoint URL for this session
   *
   * @returns {string}
   */
  getUrl () {
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
    if ( !sourceWallet && this.lastMoleculeQuery && this.getRemainderWallet().token !== 'AUTH' && this.lastMoleculeQuery.response() && this.lastMoleculeQuery.response().success() ) {
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
    return new queryClass( this )
  }

  /**
   * Uses the supplied Mutation class to build a new tailored Molecule
   *
   * @param mutationClass
   * @param molecule
   */
  async createMoleculeMutation ( mutationClass, molecule = null ) {

    console.info( `KnishIOClient::createMoleculeQuery() - Creating a new ${ mutationClass.name } query...` );

    let _molecule = molecule;

    // If you don't supply the molecule, we'll generate one for you
    if ( _molecule === null ) {
      _molecule = ( mutationClass.name === MutationRequestAuthorization.name ) ? await this.createMolecule( this.secret(), new Wallet( this.secret(), 'AUTH' ) ) : await this.createMolecule();
    }

    const mutation = new mutationClass( this, _molecule );

    if ( !( mutation instanceof MutationProposeMolecule ) ) {
      throw new CodeException( `${ this.constructor.name }::createMoleculeMutation - required class instance of MutationProposeMolecule.` );
    }

    this.lastMoleculeQuery = mutation;

    return mutation;
  }

  /**
   * Requests an authorization token from the node endpoint
   *
   * @param {string|null} secret
   * @param {string|null} cell_slug
   * @return {Promise<Response>}
   */
  async requestAuthToken ( secret = null, cell_slug = null ) {

    console.info( 'KnishIOClient::requestAuthToken() - Requesting authorization token...' );

    this.$__secret = secret || this.secret();
    this.$__bundle = generateBundleHash( this.$__secret );
    this.$__cellSlug = cell_slug || this.cellSlug();

    // SDK versions 2 and below do not utilize an authorization token
    if ( this.$__serverSdkVersion > 2 ) {

      const query = await this.createMoleculeMutation( MutationRequestAuthorization );
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
   * @returns {Promise<Response|*>}
   */
  queryMeta ( metaType, metaId = null, key = null, value = null, latest = null, fields = null ) {

    console.info( `KnishIOClient::queryMeta() - Querying meta type data for metaType: ${ metaType }, metaId: ${ metaId }, key: ${ key }, value: ${ value }...` );

    const query = this.createQuery( QueryMetaType );
    const variables = QueryMetaType.createVariables( metaType, metaId, key, value, latest );

    return query.execute( variables, fields )
      .then( ( response ) => {
        return response.payload();
      });
  }

  /**
   * Returns whether or not a secret is being stored for this session
   *
   * @returns {boolean}
   */
  hasSecret() {
    return !!this.$__secret;
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
      recipientWallet.batchId = Wallet.generateBatchId();
    }

    const query = await this.createMoleculeMutation( MutationCreateToken );

    query.fillMolecule( recipientWallet, initialAmount, tokenMetadata || {} );

    return await query.execute();
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

    const query = await this.createMoleculeMutation( MutationCreateMeta );

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
   * @returns {Promise<Response>}
   */
  queryWallets ( bundleHash = null ) {

    console.info( `KnishIOClient::queryWallets() - Querying wallets${ bundleHash ? ` for ${ bundleHash }` : '' }...` );

    const walletQuery = this.createQuery( QueryWalletList );
    return walletQuery.execute( {
      bundleHash: bundleHash ? bundleHash : this.bundle(),
      unspent: true,
    } ).then( ( response ) => {
      const walletData = response.payload();
      const wallets = [];

      console.info( `KnishIOClient::getWallets() - Discovered ${ walletData.length } remote wallets...` );

      walletData.forEach( wallet => {

        const tokenSlug = wallet.tokenSlug;
        let walletObj = null;

        // If we have an address, it's a regular wallet; otherwise, it's a show wallet
        if ( wallet.address ) {

          console.info( `KnishIOClient::getWallets() - Restoring ${ wallet.token } wallet with balance of ${ wallet.balance }...` );

          walletObj = new Wallet( this.$__secret, wallet.token, wallet.position );
          walletObj.balance = Number( wallet.balance );
          walletObj.molecules = wallet.molecules;
          walletObj.createdAt = wallet.createdAt;
          walletObj.tokenName = wallet.tokenName;
          walletObj.tokenIcon = wallet.tokenIcon;

        } else {

          console.info( `Wallet::import() - Restoring ${ tokenSlug } shadow wallet...` );
          walletObj = new Wallet( this.$__secret, tokenSlug, '' );
          walletObj.balance = wallet.balance;
          walletObj.createdAt = wallet.createdAt;

        }

        // Flagging wallet as remote
        wallet.remote = true;
        wallets.push( walletObj );

      } )

      return wallets;
    } )
  }

  /**
   * Retrieves a list of your shadow wallets (balance, but no keys)
   *
   * @param {string} tokenSlug
   * @param {string|null} bundleHash
   * @returns {Promise<*>}
   */
  queryShadowWallets ( tokenSlug = 'KNISH', bundleHash = null ) {

    console.info( `KnishIOClient::queryShadowWallets() - Querying shadow wallets${ bundleHash ? ` for ${ bundleHash }` : '' }...` );

    const shadowWalletQuery = this.createQuery( QueryWalletList );
    return shadowWalletQuery.execute( {
      bundleHash: bundleHash ? bundleHash : this.bundle(),
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
   * Builds and executes a Molecule that requests token payment from the node
   *
   * @param token
   * @param value
   * @param to
   * @param metas
   * @return {Promise<Response>}
   */
  async requestTokens ( token, value, to, metas = null ) {

    let metaType,
      metaId;

    // If the recipient is provided as an object, try to figure out the actual recipient
    if ( Object.prototype.toString.call( to ) === '[object String]' ) {
      if ( Wallet.isBundleHash( to ) ) {
        metaType = 'walletbundle';
        metaId = to;
      } else {
        to = Wallet.create( to, token );
      }
    }

    // If recipient is a Wallet, we need to help the node triangulate
    // the transfer by providing position and bundle hash
    if ( to instanceof Wallet ) {
      metaType = 'wallet';
      metas = Molecule.mergeMetas( metas || {}, {
        'position': to.position,
        'bundle': to.bundle,
      } );
      metaId = to.address;
    }

    const query = await this.createMoleculeMutation( MutationRequestTokens );

    query.fillMolecule( token, value, metaType, metaId, metas );

    return await query.execute();
  }

  /**
   * Creates and executes a Molecule that assigns keys to an unclaimed shadow wallet
   *
   * @param {string} tokenSlug
   * @param molecule
   * @returns {Promise<Response>}
   */
  async claimShadowWallet ( tokenSlug, molecule = null ) {

    const shadowWallets = this.queryShadowWallets( tokenSlug ),
      query = await this.createMoleculeMutation( MutationClaimShadowWallet, molecule );
    query.fillMolecule( tokenSlug, shadowWallets );

    return await query.execute();
  }

  /**
   * Creates and executes a Molecule that moves tokens from one user to another
   *
   * @param {Wallet|string} walletObjectOrBundleHash
   * @param {string} tokenSlug
   * @param {number} amount
   * @return {Promise<Response>}
   */
  async transferToken ( walletObjectOrBundleHash, tokenSlug, amount ) {

    const fromWallet = ( await this.queryBalance( tokenSlug ) ).payload();

    // Do you have enough tokens?
    if ( fromWallet === null || Decimal.cmp( fromWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException();
    }

    // Attempt to get the recipient's wallet, if not provided
    let toWallet = walletObjectOrBundleHash instanceof Wallet ? walletObjectOrBundleHash : ( await this.queryBalance( tokenSlug, walletObjectOrBundleHash ) ).payload();

    // If no wallet was found, prepare to send to bundle
    // This will typically result in a shadow wallet
    if ( toWallet === null ) {
      toWallet = Wallet.create( walletObjectOrBundleHash, tokenSlug );
    }

    // Compute the batch ID for the recipient
    // (typically used by stackable tokens)
    if(typeof toWallet.initBatchId === 'function') {
      toWallet.initBatchId( fromWallet, amount );
    }

    // Generate a remainder wallet to receive the signing wallet's tokens
    this.remainderWallet = Wallet.create( this.secret(), tokenSlug, toWallet.batchId, fromWallet.characters );

    // Build the molecule itself
    const molecule = await this.createMolecule( null, fromWallet, this.getRemainderWallet() ),
      query = await this.createMoleculeMutation( MutationTransferTokens, molecule );

    query.fillMolecule( toWallet, amount );

    return await query.execute();
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
   * Queries the ledger for the next ContinuID wallet
   *
   * @param bundleHash
   * @returns {Promise<Response>}
   */
  async queryContinuId ( bundleHash ) {
    return await this.createQuery( QueryContinuId ).execute( { 'bundle': bundleHash } );
  }

  /**
   * Retrieves this session's remainder wallet
   *
   * @returns {null}
   */
  getRemainderWallet () {
    return this.remainderWallet;
  }

}
