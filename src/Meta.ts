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

import type { MetaData, MetaObject, NormalizedMeta, MetaValue } from '@/types'

/**
 * Meta class to represent metadata conveyed by Atoms
 */
export default class Meta {
  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param meta - Metadata to normalize
   * @returns Normalized metadata array
   */
  static normalizeMeta (meta: MetaData): NormalizedMeta[] {
    // Ensuring that only object-based meta gets normalized
    if (Array.isArray(meta)) {
      // Array is already in normalized format
      return meta
    }

    // Handle primitive values
    if (typeof meta !== 'object' || meta === null) {
      return []
    }

    // Converting object-based meta into array-based notation
    const target: NormalizedMeta[] = []
    for (const property in meta) {
      if (Object.prototype.hasOwnProperty.call(meta, property)) {
        const value = (meta as Record<string, unknown>)[property]
        if (value !== undefined) {
          target.push({ key: property, value: value as MetaValue })
        }
      }
    }

    return target
  }

  /**
   * Condenses metadata array into object-based key: value notation
   *
   * @param meta - Metadata to aggregate
   * @returns Aggregated metadata object
   */
  static aggregateMeta (meta: MetaData): MetaObject {
    let aggregate: MetaObject = {}

    // Ensuring that only array-based meta gets aggregated
    if (Array.isArray(meta)) {
      for (const metaEntry of meta) {
        if (typeof metaEntry === 'object' && metaEntry !== null && 'key' in metaEntry && 'value' in metaEntry) {
          const key = String(metaEntry.key)
          aggregate[key] = metaEntry.value
        }
      }
    } else if (typeof meta === 'object' && meta !== null) {
      aggregate = meta as MetaObject
    }

    return aggregate
  }
}
