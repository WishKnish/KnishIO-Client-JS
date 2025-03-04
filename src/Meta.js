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

/**
 * Meta class to represent metadata conveyed by Atoms
 */
export default class Meta {
  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {array|object} meta
   * @return {array}
   */
  static normalizeMeta (meta) {
    // Ensuring that only object-based meta gets normalized
    if (Array.isArray(meta)) {
      return meta
    }

    // Converting object-based meta into array-based notation
    const target = []
    for (const property in meta) {
      if (Object.prototype.hasOwnProperty.call(meta, property)) {
        target.push({ key: property, value: meta[property] })
      }
    }

    return target
  }

  /**
   * Condenses metadata array into object-based key: value notation
   *
   * @param {array|object} meta
   * @return {object}
   */
  static aggregateMeta (meta) {
    let aggregate = {}

    // Ensuring that only array-based meta gets aggregated
    if (Array.isArray(meta)) {
      for (const metaEntry of meta) {
        aggregate[metaEntry.key] = metaEntry.value
      }
    } else {
      aggregate = meta
    }

    return aggregate
  }
}
