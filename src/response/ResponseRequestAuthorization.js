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
import AuthToken from "../AuthToken";

/**
 * Response for auth token mutation
 */
export default class ResponseRequestAuthorization extends ResponseProposeMolecule {

  /**
   * @type {AuthToken}
   */
  $__authToken = null

  /**
   * return the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey ( key ) {
    if ( !Dot.has( this.payload(), key ) ) {
      throw new InvalidResponseException( `ResponseRequestAuthorization::payloadKey() - '${ key }' key was not found in the payload!` );
    }
    return Dot.get( this.payload(), key );
  }


  /**
   * Returns the auth token
   *
   * @return {string}
   */
  token () {
    return this.payloadKey( 'token' );
  }

  /**
   * Returns timestamp
   *
   * @return {string}
   */
  time () {
    return this.payloadKey( 'time' );
  }

  /**
   *
   * @return {string}
   */
  encrypt () {
    return this.payloadKey( 'encrypt' );
  }

  /**
   *
   * @return {string}
   */
  pubKey () {
    return this.payloadKey( 'key' );
  }

  /**
   * @param {Wallet} wallet
   * @param {boolean} encrypt
   */
  setAuthToken ( { wallet, encrypt} ) {
    if ( this.payload() !== null ) {
      this.$__authToken = AuthToken.create( this.payload(), wallet, encrypt );
    }
  }

  /**
   * @return {AuthToken}
   */
  getAuthToken() {
    return this.$__authToken
  }

}
