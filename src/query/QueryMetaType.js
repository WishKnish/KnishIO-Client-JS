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
import Query from "./Query";
import ResponseMetaType from "../response/ResponseMetaType";

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryMetaType extends Query {

  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );
    this.$__query = `query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $latestMetas: Boolean, $limit: Int, $offset: Int ) { MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, filter: $filter, latestMetas: $latestMetas, limit: $limit, offset: $offset ) @fields }`;
    this.$__fields = {
      'metaType': null,
      'instanceCount': {
        'key': null,
        'value': null,
      },
      'instances': {
        'metaType': null,
        'metaId': null,
        'createdAt': null,
        'metas(latest:$latest)': {
          'molecularHash': null,
          'position': null,
          'key': null,
          'value': null,
          'createdAt': null,
        },
      },
      'paginatorInfo': {
        'currentPage': null,
        'lastPage': null,
      }
    };
  }

  /**
   * Returns a Response object
   *
   * @param {string} response
   * @return {ResponseMetaType}
   */
  createResponse ( response ) {
    return new ResponseMetaType( this, response );
  }

  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @param {object|null} filter
   * @param latestMetas
   * @param {int} limit
   * @param {int} offset
   * @param {string} count
   * @returns {{}}
   */
  static createVariables ( metaType = null, metaId = null, key = null, value = null, latest = null, filter = null, latestMetas = true, limit= 15, offset = null, count= null ) {

    const variables = {};

    if ( metaType ) {
      variables[ typeof metaType === "string" ? 'metaType' : 'metaTypes' ] = metaType;
    }

    if ( metaId ) {
      variables[ typeof metaId === "string" ? 'metaId' : 'metaIds' ] = metaId;
    }

    if ( key ) {
      variables[ typeof key === "string" ? 'key' : 'keys' ] = key;
    }

    if ( value ) {
      variables[ typeof value === "string" ? 'value' : 'values' ] = value;
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

    if ( limit ) {
      variables[ 'limit' ] = limit;
    }

    if ( offset ) {
      variables[ 'offset' ] = offset;
    }

    if ( count ) {
      variables[ 'count' ] = count;
    }

    return variables;

  }
}
