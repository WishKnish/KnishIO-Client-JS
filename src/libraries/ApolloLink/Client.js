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
import { ApolloClient } from 'apollo-client';
import fetch from 'isomorphic-fetch';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import HttpLink from './HttpLink';
import ErrorLink from './ErrorLink';
import EchoLink from './EchoLink';
import AuthLink from './AuthLink';
import { errorHandler } from './handler';


class Client extends ApolloClient {

  /**
   * @param {string} serverUri
   * @param {string} socketUri
   */
  constructor ( {
    serverUri,
    socketUri
  } ) {

    const links = [];
    const http = new HttpLink( {
      uri: serverUri,
      fetch: fetch,
      transportBatching: true
    } );
    const error = new ErrorLink( errorHandler );
    const auth = new AuthLink();

    let echo = null;

    links.push( auth );

    if ( socketUri ) {
      echo = new EchoLink( { socketUri: socketUri } );
      links.push( echo );
    }

    links.push( error.concat( http ) );

    super( {
      link: ApolloLink.from( links ),
      cache: new InMemoryCache(),
      connectToDevTools: true,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        subscribe: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        }
      }
    } );

    this.__serverUri = serverUri;
    this.__socketUri = socketUri;
    this.__httpLink = http;
    this.__errorLink = error;
    this.__authLink = auth;
    this.__echoLink = echo;
    this.auth = '';
  }

  /**
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
    this.__authLink.setAuthToken( this.getAuthToken() );
    if ( this.__echoLink ) {
      this.__echoLink.setAuthToken( this.getAuthToken() );
    }
  }

  /**
   * @return {string}
   */
  getServerUri () {
    return this.__serverUri;
  }

  /**
   * @return {string}
   */
  getSocketUri () {
    return this.__socketUri;
  }

}

export default Client;
