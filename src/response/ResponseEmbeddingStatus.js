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

import Response from './Response.js'

/**
 * Response for EmbeddingStatus Query
 *
 * Payload is an array of EmbeddingStatusItem objects:
 *   { metaType, metaId, state, totalMetas, embeddedCount, embeddedAt, model }
 *
 * state is one of: 'PENDING' | 'STALE' | 'COMPLETE'
 */
export default class ResponseEmbeddingStatus extends Response {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ({
    query,
    json
  }) {
    super({
      query,
      json,
      dataKey: 'data.embeddingStatus'
    })
  }

  /**
   * Returns the array of embedding status items, or null if empty.
   *
   * Each item contains:
   * - metaType {string} - Metadata type (echoed from input)
   * - metaId {string} - Instance identifier (echoed from input)
   * - state {string} - PENDING | STALE | COMPLETE
   * - totalMetas {number} - Total meta rows for this instance
   * - embeddedCount {number} - Rows with current-model embeddings
   * - embeddedAt {number|null} - Unix epoch of most recent embedding
   * - model {string|null} - Model name used for embeddings
   *
   * @return {Array<object>|null}
   */
  payload () {
    const items = this.data()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return null
    }

    return items
  }
}
