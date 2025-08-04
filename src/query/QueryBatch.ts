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
import ResponseMetaBatch from '../response/ResponseMetaBatch'

/**
 * Variables for batch query
 */
export interface QueryBatchVariables {
  batchId?: string;
}

/**
 * Query for retrieving a batch by batchId
 */
export default class QueryBatch extends Query {
  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor (graphQLClient: any, knishIOClient: any) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query( $batchId: String ) {
      Batch( batchId: $batchId ) {
        ${ QueryBatch.getFields() },
        children {
          ${ QueryBatch.getFields() }
        }
      }
    }`
  }

  /**
   * Returns the fields to query for batches
   */
  static getFields (): string {
    return `batchId,
              molecularHash,
              type,
              status,
              createdAt,
              wallet {
                  address,
                  bundleHash,
                  amount,
                  tokenSlug,
                  token {
                      name,
                      amount
                  },
                  tokenUnits {
                      id,
                      name,
                      metas
                  }
              },
              fromWallet {
                  address,
                  bundleHash,
                  amount,
                  batchId
              },
              toWallet {
                  address,
                  bundleHash,
                  amount,
                  batchId
              },
              sourceTokenUnits {
                  id,
                  name,
                  metas
              },
              transferTokenUnits {
                  id,
                  name,
                  metas
              },
              metas {
                  key,
                  value,
              },
              throughMetas {
                  key,
                  value
              }`
  }

  /**
   * Creates a response instance for this query
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): any {
    return new ResponseMetaBatch({
      query: this,
      json
    })
  }
}