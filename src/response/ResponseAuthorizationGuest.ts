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

import Response from './Response'
import Dot from '../libraries/Dot'
import InvalidResponseException from '../exception/InvalidResponseException'
import type { ResponseOptions } from '../types/response/interfaces'

/**
 * Guest authorization token interface
 */
interface AuthorizationToken {
  token: string;
  time: number;
  [key: string]: unknown;
}

/**
 * Response handler for Guest Authorization requests
 * 
 * This class processes responses from guest authorization mutations,
 * providing access to temporary access tokens for unauthenticated operations.
 */
export default class ResponseAuthorizationGuest extends Response {
  /**
   * Creates a new ResponseAuthorizationGuest instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.AccessToken'
    })
  }

  /**
   * Returns the reason for rejection if authorization failed
   * 
   * @returns The rejection reason
   */
  reason(): string {
    return 'Invalid response from server'
  }

  /**
   * Determines if the authorization request was successful
   * 
   * @returns True if authorization was granted, false otherwise
   */
  success(): boolean {
    return this.payload() !== null
  }

  /**
   * Returns the authorization data payload
   * 
   * @returns The authorization token data or null if unavailable
   */
  payload(): AuthorizationToken | null {
    const data = this.data()
    return data as AuthorizationToken | null
  }

  /**
   * Retrieves a specific key from the authorization payload
   * 
   * @param key - The key to retrieve from the payload
   * @returns The value associated with the key
   * @throws InvalidResponseException if the key is not found
   */
  payloadKey(key: string): unknown {
    const payload = this.payload()
    if (!payload || !Dot.has(payload, key)) {
      throw new InvalidResponseException(`ResponseAuthorizationGuest::payloadKey() - '${key}' key is not found in the payload!`)
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
  time(): number {
    return this.payloadKey('time') as number
  }
}
