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
import { Operation, } from 'apollo-link';
import { operationName, } from '../libraries/ApolloLink/handler';
import Client from '../libraries/ApolloLink/Client';


export default class ApolloClient {

  /**
   * @param {string} serverUri
   * @param {string|null} socketUri
   */
  constructor ( { serverUri, socketUri = null, } ) {

    this.$__subscribers = {};
    this.$__authorization = null;
    this.$__uri = serverUri;
    this.$__socketUri = socketUri;
    this.$__client = null;

    this.restartTransport();
  }

  restartTransport () {
    this.$__client = new Client( { serverUri: this.$__uri, socketUri: this.$__socketUri, } );
  }

  /**
   *
   * @param {string} operationName
   */
  unsubscribe ( operationName ) {
    if ( this.$__subscribers[ operationName ] ) {
      this.$__subscribers[ operationName ].unsubscribe();
    }
  }

  unsubscribeAll () {
    for ( let subscribe in this.$__subscribers ) {
      if ( this.$__subscribers.hasOwnProperty( subscribe ) ) {
        this.unsubscribe( subscribe );
      }
    }
  }

  /**
   * @param {Operation} request
   * @param {function} closure
   *
   * @return {string}
   */
  subscribe ( request, closure ) {
    const operation = operationName( request );

    this.unsubscribe( operation );

    this.$__subscribers[ operation ] = this.$__client
      .subscribe( request )
      .subscribe( data => closure( data ) );

    return operation;
  }

  async query ( request ) {
    return await this.$__client.query( request );
  }

  async mutate ( request ) {
    return await this.$__client.mutate( request );
  }

  /**
   * Sets the authorization token for this session
   *
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.$__authorization = authToken;
    this.$__client.setAuthToken( authToken );
  }

  /**
   * Gets the current auth token
   *
   * @return {string}
   */
  getAuthToken () {
    return this.$__authorization || '';
  }

  /**
   * Gets the endpoint URI
   *
   * @returns {string}
   */
  getUri () {
    return this.$__uri;
  }

  /**
   * Sets the endpoint URI
   *
   * @param {string} uri
   */
  setUri ( uri ) {
    this.$__uri = uri;
  }

  /**
   * @return {string}
   */
  getSocketUri () {
    return this.$__socketUri;
  }

  /**
   * @param {string} socketUri
   */
  setSocketUri ( socketUri ) {
    this.$__socketUri = socketUri;
  }

}
