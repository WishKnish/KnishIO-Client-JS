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
import type { ResponseOptions } from '../types/response/interfaces'

/**
 * LinkIdentifier response data interface
 */
interface LinkIdentifierData extends Record<string, unknown> {
  type: string;
  bundle: string;
  content: string;
  set: boolean;
  message: string;
}

/**
 * Response handler for LinkIdentifier mutations
 * 
 * This class processes responses from identifier linking mutations,
 * which create or link identifiers to wallet bundles on the Knish.IO network.
 * It provides methods to check success status and retrieve operation messages.
 */
export default class ResponseLinkIdentifier extends Response {
  /**
   * Creates a new ResponseLinkIdentifier instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.LinkIdentifier'
    })
  }

  /**
   * Returns the success status of the identifier linking operation
   * 
   * @returns True if the identifier was successfully linked, false otherwise
   */
  success(): boolean {
    const data = this.data() as LinkIdentifierData
    return Dot.get(data, 'set') as boolean
  }

  /**
   * Returns the message from the identifier linking operation
   * 
   * @returns The operation message providing details about the result
   */
  message(): string {
    const data = this.data() as LinkIdentifierData
    return Dot.get(data, 'message') as string
  }
}
