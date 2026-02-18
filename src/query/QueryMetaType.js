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
import Query from './Query.js'
import ResponseMetaType from '../response/ResponseMetaType.js'
import { gql } from '@urql/core'

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryMetaType extends Query {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor (graphQLClient, knishIOClient) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $latest: Boolean, $filter: [ MetaFilter! ], $queryArgs: QueryArgs, $countBy: String, $cellSlug: String ) {
      MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, filter: $filter, queryArgs: $queryArgs, countBy: $countBy, cellSlug: $cellSlug ) {
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
    }`
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
   * @param {object|null} queryArgs
   * @param {string|null} count
   * @param {string|null} countBy
   * @param {string|null} cellSlug
   * @return {{}}
   */
  static createVariables ({
    metaType = null,
    metaId = null,
    key = null,
    value = null,
    latest = null,
    filter = null,
    queryArgs = null,
    count = null,
    countBy = null,
    cellSlug = null
  }) {
    const variables = {}

    if (metaType) {
      variables[typeof metaType === 'string' ? 'metaType' : 'metaTypes'] = metaType
    }

    if (metaId) {
      variables[typeof metaId === 'string' ? 'metaId' : 'metaIds'] = metaId
    }

    if (key) {
      variables[typeof key === 'string' ? 'key' : 'keys'] = key
    }

    if (value) {
      variables[typeof value === 'string' ? 'value' : 'values'] = value
    }

    variables.latest = latest === true

    if (filter) {
      variables.filter = filter
    }

    if (queryArgs) {
      if (typeof queryArgs.limit === 'undefined' || queryArgs.limit === 0) {
        queryArgs.limit = '*'
      }

      variables.queryArgs = queryArgs
    }

    if (count) {
      variables.count = count
    }

    if (countBy) {
      variables.countBy = countBy
    }

    if (cellSlug) {
      variables.cellSlug = cellSlug
    }

    return variables
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse (json) {
    return new ResponseMetaType({
      query: this,
      json
    })
  }
}
