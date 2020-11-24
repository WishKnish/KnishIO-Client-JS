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
import Response from "../response/Response";
import { Request } from 'servie';

/**
 * Base class used to construct various GraphQL queries and mutations
 */
export default class Query {

  /**
   * Class constructor
   *
   * @param {httpClient} httpClient
   */
  constructor ( httpClient ) {
    this.client = httpClient;
    this.$__fields = null;
    this.$__variables = null;
    this.$__request = null;
    this.$__response = null;
    this.$__query = null;
  }

  /**
   * Returns request object
   *
   * @returns {null}
   */
  request () {
    return this.$__request;
  }

  /**
   * Returns response object
   *
   * @returns {null}
   */
  response () {
    return this.$__response;
  }

  /**
   * Creates a new Request for the given parameters
   *
   * @param variables
   * @param fields
   * @returns {any}
   */
  createRequest ( variables = null, fields = null ) {
    this.$__variables = this.compiledVariables( variables );

    return new Request(
      this.url(),
      { body: JSON.stringify( { query: this.compiledQuery( fields ), variables: this.variables() } ) }
    );
  }

  /**
   * Returns a variables object for the Query
   *
   * @param variables
   * @returns {{}}
   */
  compiledVariables ( variables = null ) {
    return variables || {}
  }

  /**
   * Returns the compiled Query
   *
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
   * Returns a JSON string of compiled fields
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
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {Object} variables
   * @param {Array|Object|null} fields
   * @return {Promise<Response>}
   */
  async execute ( variables = null, fields = null ) {

    this.$__request = this.createRequest( variables, fields );

    let response = await this.client.send( this.$__request );

    this.$__response = await this.createResponseRaw( response );

    return this.$__response;
  }

  /**
   * Builds a Response based on JSON input
   *
   * @param response
   * @returns {Promise<Response>}
   */
  async createResponseRaw ( response ) {
    return this.createResponse( JSON.parse( await response.text() ) );
  }

  /**
   * Returns a Response object
   *
   * @param response
   * @return {Response}
   */
  createResponse ( response ) {
    return new Response( this, response );
  }

  /**
   * Returns the Knish.IO endpoint URL
   *
   * @return {string}
   */
  url () {
    return this.client.getUrl();
  }

  /**
   * Returns the query variables object
   *
   * @return {Object|null}
   */
  variables () {
    return this.$__variables;
  }

}
