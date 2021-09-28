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

import Response from './Response';
import Dot from '../libraries/Dot';
import InvalidResponseException from '../exception/InvalidResponseException';

/**
 * Response for Guest Authorization Request
 */
export default class ResponseAuthorizationGuest extends Response {

  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ( {
    query,
    json
  } ) {
    super( {
      query,
      json
    } );
    this.dataKey = 'data.AccessToken';
    this.init();
  }

  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason () {
    return 'Invalid response from server';
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @return {boolean}
   */
  success () {
    return this.payload() !== null;
  }

  /**
   * Returns a wallet with balance
   *
   * @return {null|Wallet}
   */
  payload () {
    return this.data();
  }

  /**
   * Returns the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey ( key ) {
    if ( !Dot.has( this.payload(), key ) ) {
      throw new InvalidResponseException( `ResponseAuthorizationGuest::payloadKey() - '${ key }' key is not found in the payload!` );
    }
    return Dot.get( this.payload(), key );
  }

  /**
   * Returns the auth token
   *
   * @return {*}
   */
  token () {
    return this.payloadKey( 'token' );
  }

  /**
   * Returns timestamp
   *
   * @return {*}
   */
  time () {
    return this.payloadKey( 'time' );
  }
}
