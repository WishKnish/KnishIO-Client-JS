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
import ResponseEmbeddingStatus from '../response/ResponseEmbeddingStatus.js'
import { gql } from '@urql/core'

/**
 * Query for retrieving DataBraid embedding status for meta instances.
 *
 * Supports both single-instance and bulk modes:
 * - Single: { metaType: 'product', metaId: 'SKU-001' }
 * - Bulk:   { instances: [{ metaType: 'product', metaId: 'SKU-001' }, ...] }
 *
 * Returns embedding state (PENDING, STALE, COMPLETE) for each instance,
 * allowing apps to render spinner badges and completion indicators.
 *
 * NOTE: Only available on servers with EMBEDDING_ENABLED=true.
 * Use KnishIOClient.queryEmbeddingStatus() which handles capability
 * detection and returns null for unsupported servers.
 */
export default class QueryEmbeddingStatus extends Query {
  /**
   * @param {UrqlClientWrapper} graphQLClient
   * @param {KnishIOClient} knishIOClient
   */
  constructor (graphQLClient, knishIOClient) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`query( $metaType: String, $metaId: String, $instances: [EmbeddingStatusInput!] ) {
      embeddingStatus( metaType: $metaType, metaId: $metaId, instances: $instances ) {
        metaType,
        metaId,
        state,
        totalMetas,
        embeddedCount,
        embeddedAt,
        model
      }
    }`
  }

  /**
   * Builds a GraphQL-friendly variables object for embedding status queries.
   *
   * Single mode: createVariables({ metaType: 'product', metaId: 'SKU-001' })
   * Bulk mode:   createVariables({ instances: [{ metaType: 'product', metaId: 'SKU-001' }, ...] })
   *
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {Array<{metaType: string, metaId: string}>|null} instances
   * @return {{}}
   */
  static createVariables ({
    metaType = null,
    metaId = null,
    instances = null
  }) {
    const variables = {}

    if (instances && instances.length > 0) {
      variables.instances = instances
    }

    if (metaType) {
      variables.metaType = metaType
    }

    if (metaId) {
      variables.metaId = metaId
    }

    return variables
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseEmbeddingStatus}
   */
  createResponse (json) {
    return new ResponseEmbeddingStatus({
      query: this,
      json
    })
  }
}
