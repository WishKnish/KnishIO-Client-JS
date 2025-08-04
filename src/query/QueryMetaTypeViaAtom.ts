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
import type { UrqlClientWrapper } from '@/types'

interface MetaTypeViaAtomVariables {
  metaType?: string | string[] | null
  metaId?: string | string[] | null
  key?: string | null
  value?: string | null
  keys?: string[] | null
  values?: string[] | null
  atomValues?: string[] | null
  latest?: boolean | null
  filter?: any[] | null
  queryArgs?: any | null
  countBy?: string | null
}

export default class QueryMetaTypeViaAtom extends Query {
  /**
   * @param graphQLClient - The GraphQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor (graphQLClient: UrqlClientWrapper, knishIOClient: any) {
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
  }: MetaTypeViaAtomVariables): Record<string, any> {
    const variables: Record<string, any> = {}

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
   * @param json - The JSON response data
   * @return ResponseMetaTypeViaAtom object
   */
  createResponse (json: any): any {
    return new ResponseMetaTypeViaAtom({
      query: this,
      json
    })
  }
}