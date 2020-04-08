import Response from "../response/Response";
const axios = require( 'axios' ).default;

/**
 *
 */
export default class Query {

  /**
   * @param client
   * @param {string} url
   */
  constructor ( client, url ) {
    this.$__url = url;
    this.client = client;
    this.$__variables = null;
    this.$__query = null;
  }

  /**
   * @param {*} variables
   * @param {boolean} request
   * @return {Promise<Response>}
   */
  async execute ( variables = null, request = false ) {
    this.$__variables = variables;

    if ( request ) {
      return axios.request( {
        baseURL: this.url(),
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'X-Auth-Token': this.client.defaults.headers.common[ 'X-Auth-Token' ] || '',
        },
        data: {
          query: this.$__query,
          variables: this.variables()
        }
      } );
    }

    const response = await this.client.post( this.url(), {
      query: this.$__query,
      variables: this.variables()
    } );

    return this.createResponse( response );
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
    return this.$__url;
  }

  /**
   * @return {null}
   */
  variables () {
    return this.$__variables;
  }
}
