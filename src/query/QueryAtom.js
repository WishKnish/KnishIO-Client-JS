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
import Query from './Query';
import { gql } from '@apollo/client/core';
import Response from "../response/Response";

/**
 * Query for getting the balance of a given wallet or token slug
 */
export default class QueryAtom extends Query {
  /**
   * Class constructor
   *
   * @param apolloClient
   */
  constructor ( apolloClient ) {
    super( apolloClient );

    this.$__query = gql`query(
        $molecularHashes: [String!],
        $bundleHashs: [String!],
        $positions:[String!],
        $walletAddress: [String!],
        $isotopes: [String!],
        $tokenSlugs: [String!],
        $cellSlugs: [String!],
        $batchIds: [String!],
        $values: [String!],
        $metaTypes: [String!],
        $metaIds: [String!],
        $indexes: [String!],
        $limit: Int,
        $order: String
     ) {
      Atom(
        molecularHashes: $molecularHashes,
        bundleHashs: $bundleHashs,
        positions: $positions,
        walletAddress: $walletAddress,
        isotopes: $isotopes,
        tokenSlugs: $tokenSlugs,
        cellSlugs: $cellSlugs,
        batchIds: $batchIds,
        values: $values,
        metaTypes: $metaTypes,
        metaIds: $metaIds,
        indexes: $indexes,
        limit: $limit,
        order: $order
      ) {
        position,
        walletAddress,
        tokenSlug,
        isotope,
        index,
        molecularHash,
        metaId,
        metaType,
        batchId,
        value,
        bundleHashs,
        cellSlugs,
        createdAt,
        otsFragment
      }
    }`;
  }

  /**
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse ( json ) {
    return new Response( {
      query: this,
      json,
      dataKey: 'data.Atom'
    } ).data();
  }
}
