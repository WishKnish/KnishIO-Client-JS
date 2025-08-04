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

import Query from './Query'
import QueryBatch from './QueryBatch'
import Response from '../response/Response'
import { gql } from '@urql/core'
import type { UrqlClientWrapper } from '@/types'

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryBatchHistory extends Query {
  /**
   * @param graphQLClient - The GraphQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor (graphQLClient: UrqlClientWrapper, knishIOClient: any) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${ QueryBatch.getFields() }
      }
    }`
  }

  /**
   * Returns a Response object
   *
   * @param json - The JSON response data
   * @return Response object
   */
  createResponse (json: any): Response {
    const responseObject = new Response({
      query: this,
      json,
      dataKey: 'data.BatchHistory'
    })
    return responseObject
  }
}