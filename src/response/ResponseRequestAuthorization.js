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
import Dot from '../libraries/Dot';
import InvalidResponseException from '../exception/InvalidResponseException';
import ResponseProposeMolecule from './ResponseProposeMolecule';

/**
 * Response for auth token mutation
 */
export default class ResponseRequestAuthorization extends ResponseProposeMolecule {

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
   * @return {Wallet|null}
   */
  wallet () {
    return this.clientMolecule().sourceWallet;
  }

  /**
   * Returns the auth token
   *
   * @returns {string}
   */
  token () {
    return this.payloadKey( 'token' );
  }

  /**
   * Returns timestamp
   *
   * @returns {string}
   */
  time () {
    return this.payloadKey( 'time' );
  }

  /**
   *
   * @return {string}
   */
  pubKey () {
    return this.payloadKey( 'key' );
  }
}
