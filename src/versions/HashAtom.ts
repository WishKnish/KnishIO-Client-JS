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

import type { AtomOptions } from '../types/atom'

/**
 * HashAtom class provides the base functionality for creating structured representations
 * of atom data and computing their hash values for blockchain operations.
 * 
 * This class serves as the foundation for version-specific atom implementations,
 * providing methods to:
 * - Create instances from atom data
 * - Structure complex objects and arrays for consistent hashing
 * - Generate views of atom data for hash computation
 */
export default class HashAtom {
  /**
   * Creates a new HashAtom instance from an existing atom
   * 
   * @param atom - The source atom to create from
   * @returns A new instance of the calling class with atom properties
   */
  static create(atom: AtomOptions): HashAtom {
    const parameters: Record<string, unknown> = {}

    for (const key of Object.keys(atom)) {
      if (Object.prototype.hasOwnProperty.call(atom, key)) {
        parameters[key] = (atom as any)[key]
      }
    }

    return new this(parameters)
  }

  /**
   * Structures an object or array into a consistent format for hashing
   * 
   * This method recursively processes objects and arrays to create a deterministic
   * structure that can be used for consistent hash generation. Objects are converted
   * to arrays of key-value pairs with sorted keys to ensure consistent ordering.
   * 
   * @param object - The object or array to structure
   * @returns The structured representation suitable for hashing
   */
  static structure(object: unknown): unknown {
    switch (Object.prototype.toString.call(object)) {
      case '[object Array]': {
        const result: unknown[] = []
        const arrayObject = object as unknown[]
        for (const key in arrayObject) {
          result.push(HashAtom.isStructure(arrayObject[key]) ? HashAtom.structure(arrayObject[key]) : arrayObject[key])
        }

        return result
      }

      case '[object Object]': {
        const result: Record<string, unknown>[] = []
        const objectData = object as Record<string, unknown>
        const keys = Object.keys(objectData).sort((first, second) => {
          if (first === second) {
            return 0
          }
          return (first < second) ? -1 : 1
        })

        for (const key of keys) {
          if (Object.prototype.hasOwnProperty.call(objectData, key)) {
            const item: Record<string, unknown> = {}
            item[key] = HashAtom.isStructure(objectData[key]) ? HashAtom.structure(objectData[key]) : objectData[key]
            result.push(item)
          }
        }

        if (result.length > 0) {
          return result
        }

        break
      }
    }

    return object
  }

  /**
   * Determines if a value is a complex structure (object or array) that needs structuring
   * 
   * @param structure - The value to check
   * @returns True if the value is an object or array, false otherwise
   */
  static isStructure(structure: unknown): boolean {
    return ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(structure))
  }

  /**
   * Constructor for HashAtom instances
   * 
   * @param parameters - Optional parameters to initialize the instance with
   */
  constructor(parameters?: Record<string, unknown>) {
    if (parameters) {
      Object.assign(this, parameters)
    }
  }

  /**
   * Returns a structured view of this atom suitable for hashing
   * 
   * @returns The structured representation of this atom
   */
  view(): unknown {
    return HashAtom.structure(this)
  }
}
