import Response from "../response/Response";
import { Request } from 'servie';
import UnauthenticatedException from "../exception/UnauthenticatedException";

/**
 *
 */
export default class Query {

  /**
   * @param {KnishIOClient} knishIO
   */
  constructor ( knishIO ) {
    this.knishIO = knishIO;
    this.$__fields = null;
    this.$__variables = null;
    this.$__request = null;
    this.$__response = null;
    this.$__query = null;
  }

  request () {
    return this.$__request;
  }

  response () {
    return this.$__response;
  }

  /**
   * @returns {HttpClient}
   */
  client () {
    return this.knishIO.client();
  }

  createRequest ( variables = null, fields = null ) {
    this.$__variables = this.compiledVariables( variables );

    return new Request(
      this.url(),
      this.getRequestBody( fields, this.variables() )
    );
  }

  compiledVariables ( variables = null ) {
    return variables || {}
  }

  /**
   * @param {Object} fields
   * @returns {*|void|string}
   */
  compiledQuery ( fields = null ) {

    if ( fields !== null ) {
      this.$__fields = fields;
    }

    return this.$__query.replace( new RegExp( '@fields', 'g' ), this.compiledFields( this.$__fields ) );
  }

  /**
   *
   * @param {Object} fields
   * @returns {string}
   */
  compiledFields ( fields ) {

    const target = [];

    for ( let key of Object.keys( fields ) ) {
      target.push( fields[ key ] ? `${ key } ${ this.compiledFields( fields[ key ] ) }` : `${ key }` );
    }

    return `{ ${ target.join( ', ' ) } }`;
  }

  /**
   * @param {Object} variables
   * @param {Array|Object|null} fields
   * @return {Promise<Response>}
   */
  async execute ( variables = null, fields = null ) {

    this.$__request = this.createRequest( variables, fields );

    let response = await this.client().send( this.$__request );

    if ( this.constructor.name !== 'QueryAuthentication' && response.status === 401 ) {
      await this.knishIO.authentication();
      response = await this.client().send( this.$__request );
    }

    this.$__response = await this.createResponseRaw( response );

    return this.$__response;
  }

  async createResponseRaw ( response ) {
    return this.createResponse( JSON.parse( await response.text() ) );
  }

  /**
   * @param response
   * @return {Response}
   */
  createResponse ( response ) {
    return new Response( this, response );
  }

  /**
   * @return {string}
   */
  url () {
    return this.knishIO.client().getUrl();
  }

  /**
   * @return {Object|null}
   */
  variables () {
    return this.$__variables;
  }

  /**
   * @returns {KnishIOClient}
   */
  getKnishIOClient () {
    return this.knishIO;
  }

  /**
   * @param {Array} fields
   * @param {Array} variables
   * @returns {{body: string}}
   */
  getRequestBody ( fields, variables ) {
    const target = { query: this.compiledQuery( fields ), variables: variables };

    if ( this.constructor.name === 'QueryAuthentication' ) {
      return { body: JSON.stringify( target ) };
    }

    const wallet = this.knishIO.getAuthorizationWallet(),
      privkey = this.knishIO.getServerKey();

    if ( ![ wallet, privkey, ].includes( null ) ) {
      return { body: JSON.stringify( wallet.encryptMyMessage( target, privkey ) ) };
    }

    throw new UnauthenticatedException( 'Unauthorized query' );
  }

}
