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
import type { ResponseOptions } from '../types';
import type { DotObject } from '../types/libraries/dot';

/**
 * Response for guest auth mutation
 */
export default class ResponseRequestAuthorizationGuest extends Response {
  /**
   * Class constructor
   *
   * @param query - The mutation that produced this response
   * @param json - The GraphQL response data
   */
  constructor ({
    query,
    json
  }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.AccessToken'
    })
  }

  /**
   * Returns the reason for rejection
   *
   * @return The rejection reason
   */
  reason (): string {
    return 'Invalid response from server'
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @return True if payload is available
   */
  success (): boolean {
    return this.payload() !== null
  }

  /**
   * Returns a wallet with balance
   *
   * @return The response payload
   */
  payload (): unknown {
    return this.data()
  }

  /**
   * Returns the authorization key
   *
   * @param key - The key to retrieve from payload
   * @return The value for the specified key
   */
  payloadKey (key: string): unknown {
    if (!Dot.has(this.payload() as DotObject, key)) {
      throw new InvalidResponseException(`ResponseAuthorizationGuest::payloadKey() - '${ key }' key is not found in the payload!`)
    }
    return Dot.get(this.payload() as DotObject, key)
  }

  /**
   * Returns the auth token
   *
   * @return The authentication token
   */
  token (): unknown {
    return this.payloadKey('token')
  }

  /**
   * Returns timestamp
   *
   * @return The timestamp value
   */
  time (): unknown {
    return this.payloadKey('time')
  }

  /**
   * Returns public key
   *
   * @return The public key
   */
  pubKey (): unknown {
    return this.payloadKey('key')
  }

  /**
   * Returns encryption flag
   *
   * @return The encryption setting
   */
  encrypt (): unknown {
    return this.payloadKey('encrypt')
  }
}