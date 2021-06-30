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
 * Response for guest auth mutation
 */
export default class ResponseRequestAuthorizationGuest extends Response {
  /**
   * Class constructor
   *
   * @param {MutationRequestAuthorizationGuest} query
   * @param json
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
   * @returns {string}
   */
  reason () {
    return 'Invalid response from server';
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @returns {boolean}
   */
  success () {
    return this.payload() !== null;
  }

  /**
   * Returns a wallet with balance
   *
   * @returns {null|Wallet}
   */
  payload () {
    return this.data();
  }

  /**
   * Returns the authorization key
   *
   * @param key
   * @returns {*}
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
   * @returns {*}
   */
  token () {
    return this.payloadKey( 'token' );
  }

  /**
   * Returns timestamp
   *
   * @returns {*}
   */
  time () {
    return this.payloadKey( 'time' );
  }

  /**
   * Returns timestamp
   *
   * @returns {string}
   */
  pubKey () {
    return this.payloadKey( 'key' );
  }

  /**
   * @return {Wallet|null}
   */
  wallet () {
    return this.$__query.wallet;
  }

  /**
   *
   * @returns {string}
   */
  encrypt () {
    return this.payloadKey( 'encrypt' );
  }

}
