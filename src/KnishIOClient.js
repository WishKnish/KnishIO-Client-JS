import QueryContinueId from "./query/QueryContinueId";
import { generateBundleHash, } from "./libraries/crypto";
import { Wallet, WalletShadow, Meta } from "./index";
import QueryAuthentication from "./query/QueryAuthentication";
import QueryBalance from "./query/QueryBalance";
import QueryTokenCreate from "./query/QueryTokenCreate";
import Dot from "./libraries/Dot";
import QueryTokenReceive from "./query/QueryTokenReceive";
import WalletShadowException from "./exception/WalletShadowException";
import QueryWalletClaim from "./query/QueryWalletClaim";
import Decimal from "./libraries/Decimal";
import TransferBalanceException from "./exception/TransferBalanceException";
import QueryTokenTransfer from "./query/QueryTokenTransfer";

const axios = require( 'axios' ).default;

/**
 *
 */
export default class KnishIOClient
{
  /**
   * @param {string} url
   * @param client
   */
  constructor ( url, client = null ) {
    const self = this;

    this.url = url;
    this.replay = 1;
    this.pendingRequest = null;
    this.__secret = '';
    this.client = client || axios.create( {
      baseURL: this.url,
      headers: {
        'Accept': 'application/json',
      }
    } );

    this.client.interceptors.response.use(
      response => response,
      error => {
        const status = error.response ? error.response.status : null;

        if ( status === 401 ) {

          return this.authentication( this.getSecret() )
            .then( response => {
              const authToken = response.payload();

              self.setAuthToken( authToken );
              error.config.headers[ 'X-Auth-Token' ] = authToken || '';
              error.config.baseURL = undefined;

              return self.pendingRequest !== null ? self.pendingRequest() : axios.request( error.config );
            } )
            .catch( error => Promise.reject( error ) );
        }

        return Promise.reject( error );
      },
    );
  }

  /**
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.client.defaults.headers.common[ 'X-Auth-Token' ] = authToken || '';
  }

  /**
   * @return {string}
   */
  getAuthToken () {
    return this.client.defaults.headers.common[ 'X-Auth-Token' ];
  }

  /**
   * @param {string} url
   */
  setUrl ( url ) {
    this.url = url;
  }

  /**
   * @return {string}
   */
  getSecret () {
    return this.__secret;
  }

  /**
   * @param cls
   * @return {*}
   */
  createQuery ( cls ) {
    return new cls( this.client, this.url )
  }

  /**
   * @param {string} name
   * @param {Array} variables
   * @returns {boolean}
   */
  addPending( name, variables = [] ) {

    if ( this.pendingRequest !== null ) {
      this.pendingRequest = null;
      return true;
    }

    this.pending( name, variables );

    return false;
  }

  /**
   * @param {string} name
   * @param {Array} variables
   */
  pending ( name, variables ) {
    const self = this;
    this.pendingRequest = function () { return self[ name ]( ...variables ); };
  }

  /**
   * @param {string} bundleOrSecret
   * @return {Promise<Response>}
   */
  async getContinueId ( bundleOrSecret ) {

    this.__secret = bundleOrSecret;

    return await ( this.createQuery( QueryContinueId ) ).execute( {
      'bundle': Wallet.isBundleHash( bundleOrSecret ) ? bundleOrSecret : generateBundleHash( bundleOrSecret ),
    } );
  }

  /**
   * @param {string} secret
   * @return {Promise<Response>}
   */
  async authentication ( secret ) {

    this.__secret = secret;

    const query = this.createQuery( QueryAuthentication ),
      continueId = await this.getContinueId( secret ),
      wallet = continueId.payload();

    query.initMolecule( secret, wallet );

    return query.execute();
  }

  /**
   * @param {string} code
   * @param {string} token
   * @return {Promise<Response>}
   */
  async getBalance ( code, token ) {

    this.__secret = code;

    const query = this.createQuery( QueryBalance );

    return query.execute( {
      'bundleHash': Wallet.isBundleHash( code ) ? code : generateBundleHash( code ),
      'token': token,
    }, this.addPending( 'getBalance', arguments ) );
  }

  /**
   * @param {string} secret
   * @param {string} token
   * @param {number} amount
   * @param {Array|Object} metas
   * @return {Promise<Response>}
   */
  async createToken ( secret, token, amount, metas ) {

    this.__secret = secret;

    const sourceWallet = ( await this.getContinueId( secret ) ).payload() || new Wallet( secret ),
      recipientWallet = new Wallet( secret, token ),
      query = this.createQuery( QueryTokenCreate ),
      aggregateMeta = Meta.aggregateMeta( metas || {} );

    if ( Dot.get( aggregateMeta, 'fungibility' ) === 'stackable' ) {
      recipientWallet.batchId = Wallet.generateBatchId();
    }

    query.initMolecule( secret, sourceWallet, recipientWallet, amount, aggregateMeta );

    return query.execute( null, this.addPending( 'createToken', arguments ) );
  }

  /**
   * @param {string} secret
   * @param {string} type
   * @param {string} contact
   * @param {string} code
   * @return {Promise<Response>}
   */
  async createIdentifier ( secret, type, contact, code ) {

    this.__secret = secret;

    const sourceWallet = ( await this.getContinueId( secret ) ).payload() || new Wallet( secret ),
      query = this.createQuery( QueryIdentifierCreate );

    query.initMolecule( secret, sourceWallet, type, contact, code );

    return query.execute( null, this.addPending( 'createIdentifier', arguments ) );
  }

  /**
   * @param secret
   * @param token
   * @param value
   * @param to
   * @param metas
   * @return {Promise<Response>}
   */
  async receiveToken ( secret, token, value, to, metas ) {

    this.__secret = secret;

    const sourceWallet = ( await this.getContinueId( secret ) ).payload() || new Wallet( secret ),
      metaType = Wallet.isBundleHash( to ) ? 'walletbundle' : 'wallet',
      query = this.createQuery( QueryTokenReceive );

    query.initMolecule( secret, sourceWallet, token, value, metaType, to, metas || {} );

    return query.execute( null, this.addPending( 'receiveToken', arguments ) );
  }

  /**
   * @param {string} secret
   * @param {string} token
   * @param {Wallet} sourceWallet
   * @param {Wallet} shadowWallet
   * @param {Wallet|null} recipientWallet
   * @return {Promise<Response>}
   */
  async claimShadowWallet ( secret, token, sourceWallet, shadowWallet, recipientWallet ) {
    this.__secret = secret;

    const wallet = sourceWallet || ( await this.getContinueId( secret ) ).payload() || new Wallet( secret ),
      hiddenWallet = shadowWallet || ( await this.getBalance( secret ) ).payload(),
      query = this.createQuery( QueryWalletClaim );

    if ( hiddenWallet === null || !( hiddenWallet instanceof WalletShadow ) ) {
      throw new WalletShadowException();
    }

    query.initMolecule( secret, wallet, hiddenWallet, token, recipientWallet );

    return query.execute( null, this.addPending( 'claimShadowWallet', arguments ) );
  }

  /**
   * @param {string} fromSecret
   * @param {Wallet|string} to
   * @param {string} token
   * @param {number} amount
   * @param {Wallet|null} remainderWallet
   * @return {Promise<Response>}
   */
  async transferToken ( fromSecret, to, token, amount, remainderWallet ) {
    this.__secret = fromSecret;

    const fromWallet = ( await this.getBalance( fromSecret ) ).payload(),
      query = this.createQuery( QueryTokenTransfer );

    if ( fromWallet === null || Decimal.cmp( fromWallet.balance, amount ) < 0 ) {
      throw new TransferBalanceException( 'The transfer amount cannot be greater than the sender\'s balance' );
    }

    let toWallet = to instanceof Wallet ? to : ( await this.getBalance( to, token ) ).payload();

    if ( toWallet === null ) {
      toWallet = Wallet.create( to, token );
    }

    toWallet.initBatchId( fromWallet, amount );
    query.initMolecule( fromSecret, fromWallet, toWallet, amount, remainderWallet );

    return query.execute( null, this.addPending( 'transferToken', arguments ) );
  }
}
