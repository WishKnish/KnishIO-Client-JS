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
import ResponseMolecule from "./ResponseMolecule";
import Dot from "../libraries/Dot";
import InvalidResponseException from "../exception/InvalidResponseException";

/**
 * Response for auth token query
 */
export default class ResponseAuthentication extends ResponseMolecule {

  /**
   * Returns the auth key
   *
   * @param key
   * @returns {*}
   */
  payloadKey ( key ) {
    if ( !Dot.has( this.payload(), key ) ) {
      throw new InvalidResponseException( `ResponseAuthentication: '${ key }' key is not found in the payload.` );
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
