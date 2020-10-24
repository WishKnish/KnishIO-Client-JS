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
import QueryContinueId from "./query/QueryContinueId";
import { generateBundleHash, } from "./libraries/crypto";
import Wallet from "./Wallet";
import WalletShadow from "./WalletShadow";
import QueryAuthentication from "./query/QueryAuthentication";
import QueryBalance from "./query/QueryBalance";
import QueryTokenCreate from "./query/QueryTokenCreate";
import Dot from "./libraries/Dot";
import QueryTokenRequest from "./query/QueryTokenRequest";
import WalletShadowException from "./exception/WalletShadowException";
import Decimal from "./libraries/Decimal";
import TransferBalanceException from "./exception/TransferBalanceException";
import QueryTokenTransfer from "./query/QueryTokenTransfer";
import HttpClient from '../src/httpClient/HttpClient';
import Molecule from "./Molecule";
import QueryMoleculePropose from "./query/QueryMoleculePropose";
import CodeException from "./exception/CodeException";
import QueryIdentifierCreate from "./query/QueryIdentifierCreate";
import QueryWalletList from "./query/QueryWalletList";
import QueryShadowWalletClaim from "./query/QueryShadowWalletClaim";
import UnauthenticatedException from "./exception/UnauthenticatedException";

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
   */
  constructor ( url, client = null ) {
    this.$__url = url;
    this.$__secret = '';
    this.$__client = client || new HttpClient( this.$__url );
    this.remainderWallet = null;
  }

  /**
   * Returns the currently defined Cell identifier for this instance
   *
   * @returns {string|*|null}
   */
  cellSlug () {
    return this.$__cellSlug || null;
  }

  /**
   * Sets the Cell identifier for this instance
   *
   * @param cellSlug
   */
  setCellSlug ( cellSlug ) {
    this.$__cellSlug = cellSlug;
  }

  /**
   * Sets the authorization token for this instance
   *
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.client().setAuthToken( authToken );
  }

  /**
   * Retrieves the authorization token for this instance
   *
   * @return {string}
   */
  getAuthToken () {
    return this.client().getAuthToken();
  }

  /**
   * Retrieves the endpoint URL for this instance
   *
   * @returns {string}
   */
  getUrl () {
    return this.client().getUrl();
  }

  /**
   * Returns the HTTP client class instance
   *
   * @returns {HttpClient}
   */
  client () {
    return this.$__client;
  }

  /**
   * Instantiates a new Molecule and prepares this client instance to operate on it
   *
   * @param secret
   * @param sourceWallet
   * @param remainderWallet
   * @returns {Promise<Molecule>}
   */
  async createMolecule ( secret = null, sourceWallet = null, remainderWallet = null ) {

    const _secret = secret || this.secret();
    let _sourceWallet = sourceWallet;

    // Sets the source wallet as the last remainder wallet (to maintain ContinuID)
    if ( !sourceWallet && this.lastMoleculeQuery && this.getRemainderWallet().token !== 'AUTH' && this.lastMoleculeQuery.response().success() ) {
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
   * Uses the supplied Query class to build a new tailored Molecule
   *
   * @param queryClass
   * @param molecule
   */
  async createMoleculeQuery ( queryClass, molecule = null ) {
    let _molecule = molecule;

    // If you don't supply the molecule, we'll generate one for you
    if ( _molecule === null ) {
      _molecule = ( queryClass.name === QueryAuthentication.name ) ? await this.createMolecule( this.secret(), new Wallet( this.secret(), 'AUTH' ) ) : await this.createMolecule();
    }

    const query = new queryClass( this, _molecule );

    if ( !( query instanceof QueryMoleculePropose ) ) {
      throw new CodeException( `${ this.constructor.name }::createMoleculeQuery - required class instance of QueryMoleculePropose.` );
    }

    this.lastMoleculeQuery = query;

    return query;
  }

  /**
   * Obtains an authentication token from the node endpoint
   *
   * @param {string|null} secret
   * @param {string|null} cell_slug
   * @return {Promise<Response>}
   */
  async authentication ( secret = null, cell_slug = null ) {

    this.$__secret = secret || this.secret();
    this.$__cellSlug = cell_slug || this.cellSlug();

    const query = await this.createMoleculeQuery( QueryAuthentication );

    query.fillMolecule();

    const response = await query.execute();

    if ( response.success() ) {
      this.client().setAuthToken( response.token() )
    } else {
      throw new UnauthenticatedException( response.reason() );
    }

    return response;
  }

  /**
   * Retrieves the balance wallet for a specified Knish.IO identity and token slug
   *
   * @param {string} bundleOrSecret
   * @param {string} tokenSlug
   * @return {Promise<Response>}
   */
  async getBalance ( bundleOrSecret, tokenSlug ) {

    const query = this.createQuery( QueryBalance );

    // Execute query with either the bundle hash or secret (depending on which one you provide)
    return await query.execute( {
      'bundleHash': Wallet.isBundleHash( bundleOrSecret ) ? bundleOrSecret : generateBundleHash( bundleOrSecret ),
      'token': tokenSlug,
    } );
  }

  /**
   * Retrieves the stored secret for this instance
   *
   * @returns {string}
   */
  secret () {
    if ( !this.$__secret ) {
      throw new UnauthenticatedException( `Expected ${ this.constructor.name }::authentication call before.` );
    }
    return this.$__secret;
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

    const query = await this.createMoleculeQuery( QueryTokenCreate );

    query.fillMolecule( recipientWallet, initialAmount, tokenMetadata || {} );

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

    const query = await this.createMoleculeQuery( QueryIdentifierCreate );

    query.fillMolecule( type, contact, code );

    return await query.execute();
  }

  /**
   * Retrieves a list of your shadow wallets (balance, but no keys)
   *
   * @param {string} tokenSlug
   * @returns {Promise<*>}
   */
  async getShadowWallets ( tokenSlug ) {

    const query = this.createQuery( QueryWalletList ),
      response = await query.execute( {
        'bundleHash': generateBundleHash( this.secret() ),
        'token': tokenSlug,
      } ),
      shadowWallets = response.payload();

    if ( !shadowWallets ) {
      throw new WalletShadowException();
    }

    for ( let shadowWallet of shadowWallets ) {
      if ( !shadowWallet instanceof WalletShadow ) {
        throw new WalletShadowException();
      }
    }

    return shadowWallets;
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

    const query = await this.createMoleculeQuery( QueryTokenRequest );

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

    const shadowWallets = this.getShadowWallets( tokenSlug ),
      query = await this.createMoleculeQuery( QueryShadowWalletClaim, molecule );
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

    const fromWallet = ( await this.getBalance( this.secret(), tokenSlug ) ).payload();

    // Do you have enough tokens?
    if ( fromWallet === null || Decimal.cmp( fromWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException();
    }

    // Attempt to get the recipient's wallet, if not provided
    let toWallet = walletObjectOrBundleHash instanceof Wallet ? walletObjectOrBundleHash : ( await this.getBalance( walletObjectOrBundleHash, tokenSlug ) ).payload();

    // If no wallet was found, prepare to send to bundle
    // This will typically result in a shadow wallet
    if ( toWallet === null ) {
      toWallet = Wallet.create( walletObjectOrBundleHash, tokenSlug );
    }

    // Compute the batch ID for the recipient
    // (typically used by stackable tokens)
    toWallet.initBatchId( fromWallet, amount );

    // Generate a remainder wallet to receive the signing wallet's tokens
    this.remainderWallet = Wallet.create( this.secret(), tokenSlug, toWallet.batchId, fromWallet.characters );

    // Build the molecule itself
    const molecule = await this.createMolecule( null, fromWallet, this.getRemainderWallet() ),
      query = await this.createMoleculeQuery( QueryTokenTransfer, molecule );

    query.fillMolecule( toWallet, amount );

    return await query.execute();
  }

  /**
   * Retrieves this instance's wallet used for signing the next Molecule
   *
   * @returns {Promise<*|Wallet|null>}
   */
  async getSourceWallet () {
    let sourceWallet = ( await this.getContinuId( generateBundleHash( this.secret() ) ) ).payload();

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
  async getContinuId ( bundleHash ) {
    return await this.createQuery( QueryContinueId ).execute( { 'bundle': bundleHash } );
  }

  /**
   * Retrieves this instance's remainder wallet
   *
   * @returns {null}
   */
  getRemainderWallet () {
    return this.remainderWallet;
  }

}
