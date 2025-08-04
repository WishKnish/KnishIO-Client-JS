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

import type { UrqlClientWrapper, QueryBalanceResponse } from '@/types';
import Query from './Query';
import ResponseBalance from '../response/ResponseBalance';
import type KnishIOClient from '../KnishIOClient';
import { gql } from '@urql/core';

/**
 * Query for getting the balance of a given wallet or token slug
 */
export default class QueryBalance extends Query {
  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor(graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient) {
    super(graphQLClient, knishIOClient);

    this.$__query = gql`
      query(
        $address: String,
        $bundleHash: String,
        $type: String,
        $token: String,
        $position: String
      ) {
        Balance(
          address: $address,
          bundleHash: $bundleHash,
          type: $type,
          token: $token,
          position: $position
        ) {
          address
          bundleHash
          type
          tokenSlug
          batchId
          position
          amount
          characters
          pubkey
          createdAt
          tokenUnits {
            id
            name
            metas
          }
          tradeRates {
            tokenSlug
            amount
          }
        }
      }
    `;
  }

  /**
   * Create a typed response object for this query
   * @param json - The GraphQL response data
   * @returns A typed ResponseBalance instance
   */
  createResponse(json: QueryBalanceResponse): ResponseBalance {
    return new ResponseBalance({
      query: this,
      json
    });
  }
}
