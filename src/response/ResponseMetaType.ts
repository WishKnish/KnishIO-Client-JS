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
 * MetaType response payload interface
 */
interface MetaTypePayload {
  instances: Record<string, unknown>;
  instanceCount: Record<string, number>;
  paginatorInfo: Record<string, unknown>;
}

/**
 * MetaType data interface as returned from GraphQL
 */
interface MetaTypeData {
  instances?: Record<string, unknown>;
  instanceCount?: Record<string, number>;
  paginatorInfo?: Record<string, unknown>;
}

/**
 * Response handler for MetaType queries
 * 
 * This class processes responses from MetaType queries, which retrieve
 * metadata type information including instances, counts, and pagination data
 * from the Knish.IO network.
 */
export default class ResponseMetaType extends Response {
  /**
   * Creates a new ResponseMetaType instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.MetaType'
    })
  }

  /**
   * Returns structured meta type data including instances and pagination info
   * 
   * Processes the raw MetaType response data to extract instances, counts,
   * and pagination information in a structured format.
   * 
   * @returns Structured meta type data or null if no data available
   */
  payload(): MetaTypePayload | null {
    const metaTypeData = this.data() as MetaTypeData[] | null

    if (!metaTypeData || metaTypeData.length === 0) {
      return null
    }

    const response: MetaTypePayload = {
      instances: {},
      instanceCount: {},
      paginatorInfo: {}
    }

    // Get the last item from the array (following JS implementation)
    const metaData = metaTypeData.pop() as MetaTypeData

    if (metaData.instances) {
      response.instances = metaData.instances
    }

    if (metaData.instanceCount) {
      response.instanceCount = metaData.instanceCount
    }

    if (metaData.paginatorInfo) {
      response.paginatorInfo = metaData.paginatorInfo
    }

    return response
  }
}
