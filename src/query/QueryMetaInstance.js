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
import Response from '../response/Response';
import gql from 'graphql-tag';

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryMetaInstance extends Query {

  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`query( $metaType: String!, $metaIds: [ String! ], $keys: [ String! ], $values: [ String! ], $filter: [ MetaFilter! ], $countBy: String, $queryArgs: QueryArgs, $latestMetas: Boolean) {
        MetaInstance( metaType: $metaType, metaIds: $metaIds, keys: $keys, values: $values, filter: $filter, countBy: $countBy, queryArgs: $queryArgs, latestMetas: $latestMetas ) {
            nodes {
                metaType,
                metaId,
                createdAt,
                metas(latest:$latest) {
                    molecularHash,
                    position,
                    key,
                    value,
                    createdAt
                }
            }
            counts {
                key,
                value
            },
            paginator {
                offset,
                total
            }
        }
    }`;
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
   */
  createResponse ( json ) {
    return new Response( {
      query: this,
      json,
      dataKey: 'MetaInstance'
    } );
  }

}
