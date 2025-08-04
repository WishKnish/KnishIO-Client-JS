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
import type { ResponseOptions } from '../types/response/interfaces'

/**
 * Policy data interface as returned from GraphQL
 */
interface PolicyData {
  callback?: string;
  [key: string]: unknown;
}

/**
 * Response handler for Policy queries
 * 
 * This class processes responses from Policy queries, which retrieve
 * policy information including callback data from the Knish.IO network.
 * Policies define rules and conditions for various blockchain operations.
 */
export default class ResponsePolicy extends Response {
  /**
   * Creates a new ResponsePolicy instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json
    })
    this.dataKey = 'data.Policy'
    this.init()
  }

  /**
   * Returns the parsed policy callback data
   * 
   * Extracts and parses the callback JSON from the policy data,
   * returning the structured policy configuration.
   * 
   * @returns Parsed policy callback data or null if unavailable
   */
  payload(): unknown | null {
    const policy = this.data() as PolicyData | null

    if (!policy) {
      return null
    }

    if (policy.callback) {
      try {
        return JSON.parse(policy.callback)
      } catch (error) {
        // If JSON parsing fails, return null
        return null
      }
    }

    return null
  }
}
