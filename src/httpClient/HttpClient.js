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
import {
  Request,
  Headers
} from 'servie';
import { fetch, } from 'popsicle';

const merge = require( 'lodash.merge' );

/**
 * HTTP Client for communicating with a node
 */
export default class HttpClient {

  /**
   * Class constructor
   *
   * @param {string} url
   * @param {object} config
   */
  constructor ( url, config = {} ) {

    this.$__headers = new Headers( config.headers || {} );
    this.$__needHeaders = {
      'accept': 'application/json',
      'content-type': 'application/json; charset=UTF-8'
    };
    this.$__config = merge( config, {
      method: 'POST',
      headers: this.$__headers,
    } );

    this.setUrl( url );
  }

  /**
   * Returns configuration object
   *
   * @returns {object}
   */
  getConfig () {
    return this.$__config;
  }

  /**
   * Sets the endpoint URL
   *
   * @param {string} url
   */
  setUrl ( url ) {
    this.$__url = url;
  }

  /**
   * Gets the endpoint URL
   *
   * @returns {string}
   */
  getUrl () {
    return this.$__url;
  }

  /**
   * Sets the authorization token for this session
   *
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.$__headers.set( 'X-Auth-Token', authToken || '' );
  }

  /**
   * Gets the current auth token
   *
   * @return {string|null}
   */
  getAuthToken () {
    return this.$__headers.get( 'X-Auth-Token' ) || '';
  }

  /**
   * Sends the request
   *
   * @param {Request} request
   * @param {object} options
   * @returns {Promise<XhrResponse|HttpResponse>}
   */
  async send ( request, options = {} ) {

    request.headers.extend( options );
    this.$__headers.extend( request.headers.asObject() );

    for ( let header in this.$__needHeaders ) {
      this.$__headers.set( header, this.$__needHeaders[ header ] );
    }

    this.setAuthToken( this.getAuthToken() );

    const req = new Request( request, this.$__config );

    req.headers.delete( 'content-length' );

    return await fetch( req );
  }

}
