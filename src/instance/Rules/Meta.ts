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
                      (((((((((((((((((((              ((((((((((((((
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
 * Dynamic metadata container for rule systems
 * 
 * This class provides a flexible container for arbitrary metadata
 * used within the Rules system. It allows dynamic property assignment
 * and retrieval while maintaining type safety and serialization capabilities.
 */
export default class Meta {
  [key: string]: unknown

  /**
   * Creates a new Meta instance with dynamic properties
   * 
   * @param properties - Object containing properties to assign to this Meta instance
   */
  constructor(properties: Record<string, unknown> = {}) {
    // Assign all properties with the internal prefix
    for (const key in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        this[`__${key}`] = properties[key]
      }
    }
  }

  /**
   * Creates a Meta instance from an object
   * 
   * @param object - Object containing properties to convert to Meta
   * @returns A new Meta instance with the object's properties
   */
  static toObject(object: Record<string, unknown>): Meta {
    return new this(object)
  }

  /**
   * Converts this Meta instance to a plain JSON object
   * 
   * Extracts all internal properties (prefixed with '__') and returns
   * them as a plain object with the original property names.
   * 
   * @returns Plain object representation of this Meta instance
   */
  toJSON(): Record<string, unknown> {
    const object: Record<string, unknown> = {}

    for (const item of Object.keys(this)) {
      if (item.substring(0, 2) === '__') {
        object[item.substring(2, item.length)] = this[item]
      }
    }

    return object
  }
}
