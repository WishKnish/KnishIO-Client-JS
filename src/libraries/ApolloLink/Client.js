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
  ApolloClient,
  from,
  concat
} from '@apollo/client/core';
import fetch from 'isomorphic-fetch';
import { InMemoryCache } from '@apollo/client/cache';
import { onError } from '@apollo/client/link/error';

import HttpLink from './HttpLink';
import PusherLink from './PusherLink';
import { parse } from 'uri-js';
import AuthLink from './AuthLink';
import { errorHandler } from './handler';
import CipherLink from './CipherLink';

class Client extends ApolloClient {

  /**
   * @param {string} serverUri
   * @param {object|null} soketi
   * @param {boolean} encrypt
   */
  constructor ( {
    serverUri,
    soketi = null,
    encrypt = false
  } ) {
    const _socket = {
      ...{ socketUri: null, appKey: 'knishio' },
      ...soketi || {}
    };
    const links = [];
    const http = new HttpLink( {
      uri: serverUri,
      fetch: fetch,
      transportBatching: true
    } );
    const auth = new AuthLink();

    let cipher = null;
    let socket = null;

    links.push( auth );

    if ( encrypt ) {
      cipher = new CipherLink();
      links.push( cipher );
    }

    if ( _socket && _socket.socketUri ) {
      const path = parse( serverUri );
      socket = new PusherLink( {
        socketUri: _socket.socketUri,
        authEndpoint: `${ path.scheme }://${ path.host }/graphql/subscriptions/auth`,
        appKey: _socket.appKey
      } );
      links.push( socket );
    }

    links.push( concat( onError( errorHandler ), http ) );

    super( {
      link: from( links ),
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
    this.__soketi = _socket;
    this.__authLink = auth;
    /**
     *
     * @type {PusherLink}
     * @private
     */
    this.__socket = socket;
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
  setAuthData ( {
    token,
    pubkey = null,
    wallet = null
  } ) {

    this.__wallet = wallet;
    this.__pubkey = pubkey;
    this.__authLink.setAuthToken( token );

    if ( this.__socket ) {
      this.__socket.setAuthToken( token );
    }

    if ( this.__cipherLink ) {
      this.__cipherLink.setWallet( this.__wallet );
      this.__cipherLink.setPubKey( this.__pubkey );
    }
  }

  socketDisconnect () {
    if ( this.__socket ) {
      this.__socket.disconnect();
    }
  }

  /**
   *
   * @param {string} channel
   */
  unsubscribeFromChannel ( channel ) {
    if ( this.__socket ) {
      this.__socket.unsubscribeFromChannel( channel );
    }
  }

  /**
   * @return {string}
   */
  getServerUri () {
    return this.__serverUri;
  }

  /**
   * @return {string|null}
   */
  getSocketUri () {
    return this.__soketi.socketUri;
  }

}

export default Client;
