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
  ApolloLink
} from '@apollo/client/core';
import Echo from 'laravel-echo';
import createRequestHandler from './handler';
import io from 'socket.io-client';

/**
 *
 */
class EchoLink extends ApolloLink {
  /**
   * @param {string} socketUri
   */
  constructor ( { socketUri } ) {
    super();

    console.log( 'EchoLink::constructor()...' );

    this.echo = null;
    this.socketUri = null;
    this.auth = '';

    this.setEcho( socketUri );
  }

  /**
   *
   * @return {string}
   */
  getAuthToken () {
    return this.auth;
  }

  /**
   * @param {string} auth
   */
  setAuthToken ( auth ) {
    this.auth = auth;
  }

  /**
   * @return {string|null}
   */
  getSocketUri () {
    return this.socketUri;
  }

  /**
   * @param {string} socketUri
   */
  setEcho ( socketUri ) {

    console.log( `Connecting to socket endpoint ${ socketUri }...` );

    this.socketUri = socketUri;
    this.echo = new Echo( {
      broadcaster: 'socket.io',
      client: io,
      authEndpoint: 'graphql/subscriptions/auth',
      host: this.getSocketUri(),
      transports: [ 'websocket' ],
      auth: {
        headers: {
          'X-Auth-Token': this.getAuthToken(),
          Accept: 'application/json'
        }
      }
    } );
  }

  /**
   *
   * @param {Operation} operation
   * @param {NextLink} forward
   * @return {*}
   */
  request ( operation, forward ) {

    this.echo.options.auth.headers[ 'X-Auth-Token' ] = this.getAuthToken();

    return createRequestHandler( this.echo )( operation, forward );
  }

}

export default EchoLink;
