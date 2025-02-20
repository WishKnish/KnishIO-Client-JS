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
import ResponseMetaTypeViaAtom from '../response/ResponseMetaTypeViaAtom'
import { gql } from '@urql/core'

export default class QueryMetaTypeViaAtom extends Query {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor (graphQLClient, knishIOClient) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $keys: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String, $atomValues: [String!] ) {
      MetaTypeViaAtom(
        metaTypes: $metaTypes
        metaIds: $metaIds
        atomValues: $atomValues
        filter: $filter,
        latest: $latest,
        queryArgs: $queryArgs
        countBy: $countBy
      ) {
        metaType,
        instanceCount {
          key,
          value
        },
        instances {
          metaType,
          metaId,
          createdAt,
          metas( values: $values, keys: $keys ) {
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
   * @param {string|null} key
   * @param {string|null} value
   * @param {array|null} values
   * @param {array|null} keys
   * @param {array|null} atomValues
   * @param {boolean|null} latest
   * @param {array|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} countBy
   * @return {{}}
   */
  static createVariables ({
    metaType = null,
    metaId = null,
    key = null,
    value = null,
    keys = null,
    values = null,
    atomValues = null,
    latest = null,
    filter = null,
    queryArgs = null,
    countBy = null
  }) {
    const variables = {}

    if (atomValues) {
      variables.atomValues = atomValues
    }

    if (keys) {
      variables.keys = keys
    }

    if (values) {
      variables.values = values
    }

    if (metaType) {
      variables.metaTypes = typeof metaType === 'string' ? [metaType] : metaType
    }

    if (metaId) {
      variables.metaIds = typeof metaId === 'string' ? [metaId] : metaId
    }

    if (countBy) {
      variables.countBy = countBy
    }

    if (filter) {
      variables.filter = filter
    }

    if (key && value) {
      variables.filter = variables.filter || []
      variables.filter.push({
        key,
        value,
        comparison: '='
      })
    }

    variables.latest = latest === true

    if (queryArgs) {
      if (typeof queryArgs.limit === 'undefined' || queryArgs.limit === 0) {
        queryArgs.limit = '*'
      }

      variables.queryArgs = queryArgs
    }

    return variables
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse (json) {
    return new ResponseMetaTypeViaAtom({
      query: this,
      json
    })
  }
}
