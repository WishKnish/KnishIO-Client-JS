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
                      (((((((((((((((((((              ((((((((((((((
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

import Dot from '../libraries/Dot'
import InvalidResponseException from '../exception/InvalidResponseException'
import ResponseProposeMolecule from './ResponseProposeMolecule'

/**
 * Authorization payload interface
 */
interface AuthorizationPayload {
  token: string;
  time: string | number;
  encrypt: string;
  key: string;
  [key: string]: unknown;
}

/**
 * Response handler for RequestAuthorization mutations
 * 
 * This class extends ResponseProposeMolecule to handle authorization token
 * responses from the Knish.IO network. It provides methods to extract
 * authorization credentials including tokens, timestamps, and encryption keys.
 */
export default class ResponseRequestAuthorization extends ResponseProposeMolecule {
  /**
   * Retrieves a specific key from the authorization payload
   * 
   * @param key - The key to retrieve from the payload
   * @returns The value associated with the key
   * @throws InvalidResponseException if the key is not found
   */
  payloadKey(key: string): unknown {
    const payload = this.payload() as AuthorizationPayload
    if (!Dot.has(payload, key)) {
      throw new InvalidResponseException(`ResponseRequestAuthorization::payloadKey() - '${key}' key was not found in the payload!`)
    }
    return Dot.get(payload, key)
  }

  /**
   * Returns the authorization token
   * 
   * @returns The access token string
   */
  token(): string {
    return this.payloadKey('token') as string
  }

  /**
   * Returns the token creation timestamp
   * 
   * @returns The timestamp when the token was created
   */
  time(): string | number {
    return this.payloadKey('time') as string | number
  }

  /**
   * Returns the encryption method or encrypted data
   * 
   * @returns The encryption information
   */
  encrypt(): string {
    return this.payloadKey('encrypt') as string
  }

  /**
   * Returns the public key associated with the authorization
   * 
   * @returns The public key string
   */
  pubKey(): string {
    return this.payloadKey('key') as string
  }
}
