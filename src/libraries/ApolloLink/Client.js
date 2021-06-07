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
import CipherLink from './CipherLink';


class Client extends ApolloClient {

  /**
   * @param {string} serverUri
   * @param {string} socketUri
   * @param {boolean} encrypt
   */
  constructor ( {
    serverUri,
    socketUri,
    encrypt= false
  } ) {

    const links = [];
    const http = new HttpLink( {
      uri: serverUri,
      fetch: fetch,
      transportBatching: true
    } );
    const error = new ErrorLink( errorHandler );
    const auth = new AuthLink();

    let cipher = null;
    let echo = null;

    links.push( auth );

    if ( encrypt ) {
      cipher = new CipherLink();
      links.push( cipher );
    }

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
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        },
        subscribe: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        }
      }
    } );

    this.__serverUri = serverUri;
    this.__socketUri = socketUri;
    this.__authLink = auth;
    this.__echoLink = echo;
    this.__cipherLink = cipher;

    this.__pubkey = null;
    this.__wallet = null;
  }

  /**
   * @return {string}
   */
  getAuthToken () {
    return this.__authLink.getAuthToken();
  }

  /**
   *
   * @return {string|null}
   */
  getPubKey () {
    return this.__pubkey;
  }

  /**
   * @return {Wallet|null}
   */
  getWallet () {
    return this.__wallet;
  }

  /**
   * @param {string} token
   * @param {string|null} pubkey
   * @param {Wallet|null} wallet
   */
  setAuthData ( { token, pubkey = null, wallet = null } ) {

    this.__wallet = wallet;
    this.__pubkey = pubkey;
    this.__authLink.setAuthToken( token );

    if ( this.__echoLink ) {
      this.__echoLink.setAuthToken( token );
    }

    if ( this.__cipherLink ) {
      this.__cipherLink.setWallet( this.__wallet );
      this.__cipherLink.setPubKey( this.__pubkey );
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
