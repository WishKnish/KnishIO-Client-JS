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
 * Raw active session data interface from GraphQL
 */
interface RawActiveSessionData {
  jsonData?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

/**
 * Processed active session data interface
 */
interface ProcessedActiveSessionData {
  jsonData?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

/**
 * Response handler for QueryActiveSession operations
 * 
 * This class processes responses from active session queries, which retrieve
 * information about currently active user sessions on the Knish.IO network.
 * It handles data transformation including JSON parsing and date conversion.
 */
export default class ResponseQueryActiveSession extends Response {
  /**
   * Creates a new ResponseQueryActiveSession instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.ActiveUser'
    })
  }

  /**
   * Returns processed active session data
   * 
   * Transforms the raw session data by:
   * - Parsing JSON data fields
   * - Converting timestamp strings to Date objects
   * - Cleaning up the data structure
   * 
   * @returns Array of processed active session data or null if unavailable
   */
  payload(): ProcessedActiveSessionData[] | null {
    const list = this.data() as RawActiveSessionData[] | null

    if (!list) {
      return null
    }

    const activeUsers: ProcessedActiveSessionData[] = []

    for (const item of list) {
      // Extract date fields to handle them separately
      const { createdAt, updatedAt, ...itemWithoutDates } = item as RawActiveSessionData
      const activeSession: ProcessedActiveSessionData = itemWithoutDates

      // Parse JSON data if present
      if (activeSession.jsonData && typeof activeSession.jsonData === 'string') {
        try {
          activeSession.jsonData = JSON.parse(activeSession.jsonData)
        } catch (error) {
          // If parsing fails, leave as string
        }
      }

      // Convert date strings to Date objects
      if (createdAt && typeof createdAt === 'string') {
        activeSession.createdAt = new Date(createdAt)
      } else if (createdAt instanceof Date) {
        activeSession.createdAt = createdAt
      }

      if (updatedAt && typeof updatedAt === 'string') {
        activeSession.updatedAt = new Date(updatedAt)
      } else if (updatedAt instanceof Date) {
        activeSession.updatedAt = updatedAt
      }

      activeUsers.push(activeSession)
    }

    return activeUsers
  }
}
