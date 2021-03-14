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
import Response from "./Response";
import Dot from "../libraries/Dot";
import InvalidResponseException from "../exception/InvalidResponseException";

/**
 * Response for auth token mutation
 */
export default class ResponseRequestAuthorization extends Response {

  /**
   * Returns the authorization key
   *
   * @param key
   * @returns {*}
   */
  payloadKey ( key ) {
    if ( !Dot.has( this.payload(), key ) ) {
      throw new InvalidResponseException( `ResponseAuthorization: '${ key }' key is not found in the payload.` );
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
}
