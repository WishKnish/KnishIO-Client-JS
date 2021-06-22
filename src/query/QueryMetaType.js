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
import ResponseMetaType from '../response/ResponseMetaType';
import gql from 'graphql-tag';

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryMetaType extends Query {
  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $latestMetas: Boolean, $queryArgs: QueryArgs, $countBy: String ) {
        MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, filter: $filter, latestMetas: $latestMetas, queryArgs: $queryArgs, countBy: $countBy ) {
            metaType,
            instanceCount {
                key,
                value
            },
            instances {
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
            },
            paginatorInfo {
                currentPage,
                total
            }
        }
    }`;
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse ( json ) {
    return new ResponseMetaType( {
      query: this,
      json
    } );
  }

  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @param {boolean|null} latestMetas
   * @param {object|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @returns {{}}
   */
  static createVariables ( {
    metaType = null,
    metaId = null,
    key = null,
    value = null,
    latest = null,
    latestMetas = true,
    filter = null,
    queryArgs = null,
    count = null,
    countBy = null
  } ) {

    const variables = {};

    if ( metaType ) {
      variables[ typeof metaType === 'string' ? 'metaType' : 'metaTypes' ] = metaType;
    }

    if ( metaId ) {
      variables[ typeof metaId === 'string' ? 'metaId' : 'metaIds' ] = metaId;
    }

    if ( key ) {
      variables[ typeof key === 'string' ? 'key' : 'keys' ] = key;
    }

    if ( value ) {
      variables[ typeof value === 'string' ? 'value' : 'values' ] = value;
    }

    if ( latest ) {
      variables[ 'latest' ] = !!latest;
    }

    if ( latestMetas ) {
      variables[ 'latestMetas' ] = !!latestMetas;
    }

    if ( filter ) {
      variables[ 'filter' ] = filter;
    }

    if ( queryArgs ) {
      variables[ 'queryArgs' ] = queryArgs;
    }

    if ( count ) {
      variables[ 'count' ] = count;
    }

    if ( countBy ) {
      variables[ 'countBy' ] = countBy;
    }

    return variables;
  }

}
