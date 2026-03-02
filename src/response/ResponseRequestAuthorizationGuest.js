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
import Response from './Response.js'
import Dot from '../libraries/Dot.js'
import InvalidResponseException from '../exception/InvalidResponseException.js'

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
  constructor ({
    query,
    json
  }) {
    super({
      query,
      json,
      dataKey: 'data.AccessToken'
    })
  }

  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason () {
    return 'Invalid response from server'
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @return {boolean}
   */
  success () {
    return this.payload() !== null
  }

  /**
   * Returns a wallet with balance
   *
   * @return {null|Wallet}
   */
  payload () {
    return this.data()
  }

  /**
   * Returns the authorization key
   *
   * @param key
   * @return {*}
   */
  payloadKey (key) {
    if (!Dot.has(this.payload(), key)) {
      throw new InvalidResponseException(`ResponseAuthorizationGuest::payloadKey() - '${ key }' key is not found in the payload!`)
    }
    return Dot.get(this.payload(), key)
  }

  /**
   * Returns the auth token
   *
   * @return {*}
   */
  token () {
    return this.payloadKey('token')
  }

  /**
   * Returns raw time value from payload
   *
   * @return {*}
   */
  time () {
    return this.payloadKey('time')
  }

  /**
   * Returns the expiration timestamp as Unix seconds.
   * Handles both server formats:
   * - PHP server: time = lifetime in ms, expiresAt = Unix timestamp in payload
   * - Rust server: time = Unix timestamp in seconds
   *
   * @return {number}
   */
  expiresAt () {
    // Try the explicit expiresAt payload key first (PHP server provides this)
    try {
      const ea = this.payloadKey('expiresAt')
      if (ea) {
        return Number(ea)
      }
    } catch (_e) {
      // Not available in payload, fall back
    }

    // Use time field with heuristic detection
    const timeValue = Number(this.time())

    // If timeValue looks like a valid Unix timestamp (>= year 2020), use directly
    if (timeValue >= 1577836800) {
      return timeValue
    }

    // Otherwise, time is a lifetime in milliseconds (PHP server format)
    return Math.floor(Date.now() / 1000) + Math.floor(timeValue / 1000)
  }

  /**
   * Returns timestamp
   *
   * @return {string}
   */
  pubKey () {
    return this.payloadKey('key')
  }

  /**
   *
   * @return {string}
   */
  encrypt () {
    return this.payloadKey('encrypt')
  }
}
