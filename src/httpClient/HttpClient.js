import { Request, Headers } from 'servie';
import { fetch, } from 'popsicle';

const merge = require( 'lodash.merge' );

/**
 *
 */
export default class HttpClient {

  /**
   * @param {string} url
   * @param {Object} config
   */
  constructor ( url, config = {} ) {

    this.$__headers = new Headers( config.headers || {} );

    this.$__config = merge( config, {
      method: 'POST',
      headers: this.$__headers,
    } );

    this.setUrl( url );
  }

  /**
   * @returns {Object}
   */
  getConfig () {
    return this.$__config;
  }

  /**
   *
   * @param {string} url
   */
  setUrl ( url ) {
    this.$__url = url;
  }

  /**
   * @returns {string}
   */
  getUrl () {
    return this.$__url;
  }

  /**
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.$__headers.set( 'X-Auth-Token',  authToken || '' );
  }

  /**
   * @return {string|null}
   */
  getAuthToken () {
    return this.$__headers.get( 'X-Auth-Token' ) || '';
  }

  /**
   *
   * @param {Request} request
   * @param {Object} options
   * @returns {Promise<XhrResponse|HttpResponse>}
   */
  async send ( request, options = {} ) {

    request.headers.extend( options );

    this.$__headers.extend( request.headers.asObject() );
    this.$__headers.delete( 'content-type' );
    this.$__headers.append( 'Accept', 'application/json' );
    this.$__headers.append( 'Content-Type', 'application/json;charset=UTF-8' );
    this.setAuthToken( this.getAuthToken() );

    const req = new Request( request, this.$__config );

    req.headers.delete( 'content-length' );

    return await fetch( req );
  }

}
