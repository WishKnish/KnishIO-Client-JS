import QueryContinueId from "./query/QueryContinueId";
import { generateBundleHash, } from "./libraries/crypto";
import { Wallet, WalletShadow } from "./index";
import QueryAuthentication from "./query/QueryAuthentication";
import QueryBalance from "./query/QueryBalance";
import QueryTokenCreate from "./query/QueryTokenCreate";
import Dot from "./libraries/Dot";
import QueryTokenReceive from "./query/QueryTokenReceive";
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
 *
 */
export default class KnishIOClient
{
  /**
   * @param {string} url
   * @param {HttpClient} client
   */
  constructor ( url, client = null ) {
    this.$__url = url;
    this.$__secret = '';
    this.$__client = client || new HttpClient( this.$__url );
    this.remainderWallet = null;
  }

  cellSlug () {
    return this.$__cellSlug || null;
  }

  setCellSlug ( cellSlug ) {
    this.$__cellSlug = cellSlug;
  }

  /**
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.client().setAuthToken( authToken );
  }

  /**
   * @return {string}
   */
  getAuthToken () {
    return this.client().getAuthToken();
  }

  url () {
    return this.client().getUrl();
  }

  /**
   * @returns {HttpClient}
   */
  client () {
    return this.$__client;
  }

  async createMolecule ( secret = null, sourceWallet = null, remainderWallet = null ) {

    const _secret = secret || this.secret();
    let _sourceWallet = sourceWallet;

    if ( !sourceWallet && this.lastMoleculeQuery && this.getRemainderWallet().token !== 'AUTH' && this.lastMoleculeQuery.response().success() ) {
      _sourceWallet = this.getRemainderWallet();
    }

    if ( _sourceWallet === null ) {
      _sourceWallet = await this.getSourceWallet();
    }

    this.remainderWallet = remainderWallet || Wallet.create( _secret, _sourceWallet.token, _sourceWallet.batchId, _sourceWallet.characters );

    return new Molecule( _secret, _sourceWallet, this.getRemainderWallet(), this.cellSlug() );
  }

  /**
   * @param cls
   * @return {*}
   */
  createQuery ( cls ) {
    return new cls( this )
  }

  /**
   *
   * @param cls
   * @param molecule
   */
  async createMoleculeQuery ( cls, molecule = null ) {
    let _molecule = molecule;

    if ( _molecule === null ) {
      _molecule = ( cls.name === QueryAuthentication.name ) ? await this.createMolecule( this.secret(), new Wallet( this.secret(), 'AUTH' ) ): await this.createMolecule();
    }

    const query = new cls( this, _molecule );

    if ( !( query instanceof QueryMoleculePropose ) ) {
      throw new CodeException( `${ this.constructor.name }::createMoleculeQuery - required class instance of QueryMoleculePropose.` );
    }

    this.lastMoleculeQuery = query;

    return query;
  }

  /**
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
    }
    else {
      throw new UnauthenticatedException( response.reason() );
    }

    return response;
  }

  /**
   * @param {string} code
   * @param {string} token
   * @return {Promise<Response>}
   */
  async getBalance ( code, token ) {

    const query = this.createQuery( QueryBalance );

    return await query.execute( {
      'bundleHash': Wallet.isBundleHash( code ) ? code : generateBundleHash( code ),
      'token': token,
    } );
  }

  secret () {
    if ( !this.$__secret ) {
      throw new UnauthenticatedException( `Expected ${ this.constructor.name }::authentication call before.` );
    }
    return this.$__secret;
  }

  /**
   * @param {string} token
   * @param {number} amount
   * @param {Array|Object} metas
   * @return {Promise<Response>}
   */
  async createToken ( token, amount, metas= null ) {

    const recipientWallet = new Wallet( this.secret(), token );

    if ( Dot.get( metas || {}, 'fungibility' ) === 'stackable' ) {
      recipientWallet.batchId = Wallet.generateBatchId();
    }

    const query = await this.createMoleculeQuery( QueryTokenCreate );

    query.fillMolecule( recipientWallet, amount, metas || {} );

    return await query.execute ();
  }

  /**
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

  async getShadowWallets ( token ) {

    const query = this.createQuery( QueryWalletList ),
      response = await query.execute( {
        'bundleHash': generateBundleHash( this.secret() ),
        'token': token,
      } ),
      shadowWallets = response.payload();

    if ( !shadowWallets ) {
      throw new WalletShadowException();
    }

    for ( let shadowWallet of shadowWallets ) {
      if (!shadowWallet instanceof WalletShadow ) {
        throw new WalletShadowException();
      }
    }

    return shadowWallets;
  }

  /**
   * @param token
   * @param value
   * @param to
   * @param metas
   * @return {Promise<Response>}
   */
  async receiveToken ( token, value, to, metas = null ) {

    let metaType,
      metaId;

    if ( Object.prototype.toString.call( to ) === '[object String]' ) {
      if ( Wallet.isBundleHash( to ) ) {
        metaType = 'walletbundle';
        metaId = to;
      }
      else {
        to = Wallet.create( to, token );
      }
    }

    if ( to instanceof Wallet ) {
      metaType = 'wallet';
      metas = Molecule.mergeMetas( metas || {}, {
        'position': to.position,
        'bundle': to.bundle,
      } );
      metaId = to.address;
    }

    const query = await this.createMoleculeQuery( QueryTokenReceive );

    query.fillMolecule( token, value, metaType, metaId, metas );

    return await query.execute();
  }

  /**
   *
   * @param token
   * @param molecule
   * @returns {Promise<Response>}
   */
  async claimShadowWallet ( token, molecule = null ) {

    const shadowWallets = this.getShadowWallets( token ),
      query = await this.createMoleculeQuery( QueryShadowWalletClaim, molecule );
    query.fillMolecule( token, shadowWallets );

    return await query.execute( );
  }

  /**
   * @param {Wallet|string} to
   * @param {string} token
   * @param {number} amount
   * @return {Promise<Response>}
   */
  async transferToken ( to, token, amount ) {

    const fromWallet = ( await this.getBalance( this.secret(), token ) ).payload();

    if ( fromWallet === null || Decimal.cmp( fromWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException( 'The transfer amount cannot be greater than the sender\'s balance' );
    }

    let toWallet = to instanceof Wallet ? to : ( await this.getBalance( to, token ) ).payload();

    if ( toWallet === null ) {
      toWallet = Wallet.create( to, token );
    }

    toWallet.initBatchId( fromWallet, amount );

    this.remainderWallet = Wallet.create( this.secret(), token, toWallet.batchId, fromWallet.characters );

    const molecule = await this.createMolecule( null, fromWallet, this.getRemainderWallet()  ),
      query = await this.createMoleculeQuery( QueryTokenTransfer, molecule );

    query.fillMolecule( toWallet, amount );

    return await query.execute();
  }

  async getSourceWallet () {
    let sourceWallet = ( await this.getContinuId( generateBundleHash( this.secret() ) ) ).payload();

    if ( !sourceWallet ) {
      sourceWallet = new Wallet( this.secret() );
    }

    return sourceWallet;
  }

  async getContinuId ( bundleHash ) {
    return await this.createQuery( QueryContinueId ).execute( { 'bundle': bundleHash } );
  }

  getRemainderWallet () {
    return this.remainderWallet;
  }

}
