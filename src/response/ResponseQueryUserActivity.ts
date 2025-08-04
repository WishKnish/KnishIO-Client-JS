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
 * User activity instance interface
 */
interface UserActivityInstance {
  jsonData: string;
  [key: string]: unknown;
}

/**
 * Processed user activity instance interface
 */
interface ProcessedUserActivityInstance {
  jsonData: unknown;
  [key: string]: unknown;
}

/**
 * User activity data interface
 */
interface UserActivityData {
  instances?: UserActivityInstance[];
  [key: string]: unknown;
}

/**
 * Processed user activity data interface
 */
interface ProcessedUserActivityData {
  instances?: ProcessedUserActivityInstance[];
  [key: string]: unknown;
}

/**
 * Response handler for QueryUserActivity operations
 * 
 * This class processes responses from user activity queries, which retrieve
 * user activity data from the Knish.IO network. It handles parsing of JSON
 * data embedded within the activity instances.
 */
export default class ResponseQueryUserActivity extends Response {
  /**
   * Creates a new ResponseQueryUserActivity instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.UserActivity'
    })
  }

  /**
   * Returns processed user activity data with parsed JSON fields
   * 
   * Creates a deep copy of the activity data and parses any JSON strings
   * found in the jsonData fields of activity instances.
   * 
   * @returns Processed user activity data with parsed JSON fields
   */
  payload(): ProcessedUserActivityData {
    // Create a deep copy of the data to avoid modifying the original
    const data = JSON.parse(JSON.stringify(this.data())) as UserActivityData

    if (data.instances) {
      for (const datum of data.instances) {
        try {
          datum.jsonData = JSON.parse(datum.jsonData)
        } catch (error) {
          // If JSON parsing fails, leave the original string value
        }
      }
    }

    return data as ProcessedUserActivityData
  }
}
