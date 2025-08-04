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

import type { DotValue, DotObject, DotKey } from '@/types';

/**
 * Utility class for accessing nested object properties using dot notation
 */
export default class Dot {
  private static arr: string[] = [];
  private static key: DotKey = '';
  private static __nextKey: number = 0;
  private static __next: boolean = false;

  /**
   * Initialize the Dot utility with the given object and key path
   */
  private static __init(obj: DotObject, keys: string): void {
    this.arr = String(keys).split('.');
    const firstKey = this.arr.shift();
    
    if (firstKey === undefined) {
      this.key = '';
    } else {
      this.key = firstKey;
    }

    // Convert to number if the key is a valid integer
    const numberKey = Number(this.key);
    if (Number.isInteger(numberKey)) {
      this.key = numberKey;
    }

    this.__nextKey = this.arr.length;
    this.__next = this.__tic(obj);
  }

  /**
   * Check if the current key exists in the object
   */
  private static __tic(obj: DotObject): boolean {
    if (!Array.isArray(obj) && !(obj instanceof Object)) {
      return false;
    }

    return typeof (obj as Record<string | number, DotValue>)[this.key] !== 'undefined';
  }

  /**
   * Check if a nested property exists in an object using dot notation
   */
  static has(obj: DotObject, keys: string): boolean {
    this.__init(obj, keys);

    if (!this.__next) {
      return false;
    }
    if (this.__nextKey === 0) {
      return true;
    }

    const nextObj = (obj as Record<string | number, DotValue>)[this.key];
    if (typeof nextObj !== 'object' || nextObj === null) {
      return false;
    }

    return this.has(nextObj as DotObject, this.arr.join('.'));
  }

  /**
   * Get a nested property from an object using dot notation
   */
  static get(obj: DotObject, keys: string, def: DotValue = null): DotValue {
    this.__init(obj, keys);

    if (!this.__next) {
      return def;
    }
    if (this.__nextKey === 0) {
      return (obj as Record<string | number, DotValue>)[this.key];
    }

    const nextObj = (obj as Record<string | number, DotValue>)[this.key];
    if (typeof nextObj !== 'object' || nextObj === null) {
      return def;
    }

    return this.get(nextObj as DotObject, this.arr.join('.'), def);
  }

  /**
   * Set a nested property in an object using dot notation
   */
  static set(obj: DotObject, keys: string, value: DotValue): DotObject {
    const parts = keys.split('.');
    let current = obj as Record<string | number, DotValue>;
    const lastIndex = parts.length - 1;

    for (let i = 0; i < lastIndex; i++) {
      const key = parts[i];
      if (!key) continue;
      
      const numberKey = Number(key);
      const useNumberKey = Number.isInteger(numberKey);
      const currentKey = useNumberKey ? numberKey : key;

      if (!(currentKey in current)) {
        const nextKey = parts[i + 1];
        current[currentKey] = nextKey && nextKey.match(/^\d+$/) ? [] : {};
      }
      
      const nextValue = current[currentKey];
      if (typeof nextValue === 'object' && nextValue !== null) {
        current = nextValue as Record<string | number, DotValue>;
      } else {
        // If we encounter a non-object value, we need to replace it
        const nextKey = parts[i + 1];
        current[currentKey] = nextKey && nextKey.match(/^\d+$/) ? [] : {};
        current = current[currentKey] as Record<string | number, DotValue>;
      }
    }

    const lastKey = parts[lastIndex];
    if (lastKey) {
      const lastNumberKey = Number(lastKey);
      current[Number.isInteger(lastNumberKey) ? lastNumberKey : lastKey] = value;
    }

    return obj;
  }
}
