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
                 ################# ####
                ################# ######
               ################# #######
              ################# #########
             ################# ###########
            ################# #############
           ################# ###############
          ################# #################
         ################# ###################
        ################# #####################
       ################# #######################
      ################# #########################
     ################# ###########################
    ################# #############################
   ################# ###############################
  ################# #################################
 ################# ###################################
################# #####################################

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import Query from './Query'
import { gql } from '@urql/core'
import type { GraphQLResponse } from '../types/graphql'
import ResponseAtom from '../response/ResponseAtom'

/**
 * Variables for atom query
 */

/**
 * Query for retrieving atoms by various criteria
 */
export default class QueryAtom extends Query {
  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor (graphQLClient: any, knishIOClient: any) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query ($bundleHash: String, $bundleHashHex: String, $position: String, $isotope: String, $token: String, $walletAddress: String, $value: String, $metaType: String, $metaId: String, $status: String, $batchId: String, $createdAt: String, $index: Int, $limit: Int) {
      Atom (bundleHash: $bundleHash, bundleHashHex: $bundleHashHex, position: $position, isotope: $isotope, token: $token, walletAddress: $walletAddress, value: $value, metaType: $metaType, metaId: $metaId, status: $status, batchId: $batchId, createdAt: $createdAt, index: $index, limit: $limit) {
        isotope,
        position,
        walletAddress,
        token,
        value,
        batchId,
        metaType,
        metaId,
        meta,
        index,
        bundleHash,
        bundleHashHex,
        otsFragment,
        createdAt,
        status
      }
    }`
  }

  /**
   * Creates a response instance for this query
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): any {
    return new ResponseAtom({
      query: this,
      json
    })
  }
}