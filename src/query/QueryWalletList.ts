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
import type { UrqlClientWrapper } from '../types/client'
import type KnishIOClient from '../KnishIOClient'
import type Response from '../response/Response'
import ResponseWalletList from '../response/ResponseWalletList'

/**
 * Variables for wallet list query
 */
export interface QueryWalletListVariables {
  bundleHash?: string;
  token?: string;
  position?: string;
  limit?: number;
  offset?: number;
  order?: string;
}

/**
 * Query for retrieving a list of wallets
 */
export default class QueryWalletList extends Query {
  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor (graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query( $bundleHash: String, $token: String, $position: String, $limit: Int, $offset: Int, $order: String ) {
      WalletList( bundleHash: $bundleHash, token: $token, position: $position, limit: $limit, offset: $offset, order: $order ) {
        bundleHash,
        token,
        position,
        amount,
        address,
        createdAt
      }
    }`
  }

  /**
   * Creates a response instance for this query
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): Response {
    return new ResponseWalletList({
      query: this,
      json
    })
  }
}