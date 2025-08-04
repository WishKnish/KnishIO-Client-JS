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
 * Create Uint8Array buffers from hexadecimal strings, and vice versa.
 */

// Ensure global self reference for cross-environment compatibility
if (typeof self === 'undefined') {
  (global as any).self = global;
}

import type { HexToStringOptions, HexCharset } from '../types';

/**
 * Utility class for hexadecimal string and Uint8Array conversions
 */
export default class Hex {
  /**
   * Converts the given buffer to a string containing its hexadecimal representation.
   * 
   * @param arr - A Uint8Array buffer to convert
   * @param options - Optional formatting options:
   *   - grouping: Number of hex bytes grouped together with spaces between groups (0 = no grouping)
   *   - rowlength: Number of groups which make up a row (0 = no splitting into rows)
   *   - uppercase: If true, output will be in uppercase (false by default)
   * @returns A hexadecimal string representing the buffer
   */
  static toHex(
    arr: Uint8Array | ArrayBuffer | number[],
    options?: HexToStringOptions
  ): string {
    /**
     * Convert a single byte value to its hexadecimal representation
     */
    const numberToHex = (val: number, uppercase: boolean): string => {
      const set: HexCharset = uppercase
        ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

      const highNibble = set[Math.floor(val / 16)];
      const lowNibble = set[val % 16];
      return (highNibble ?? '0') + (lowNibble ?? '0');
    };

    const opts: Required<HexToStringOptions> = {
      grouping: 0,
      rowlength: 0,
      uppercase: false,
      ...options
    };

    // Convert input to Uint8Array if needed
    const buffer = arr instanceof Uint8Array 
      ? arr 
      : arr instanceof ArrayBuffer 
        ? new Uint8Array(arr)
        : new Uint8Array(arr);

    let str = '';
    let group = 0;
    let column = 0;

    for (let i = 0; i < buffer.length; ++i) {
      const byte = buffer[i];
      if (byte !== undefined) {
        str += numberToHex(byte, opts.uppercase);
      }

      if (i === buffer.length - 1) {
        break;
      }

      if (opts.grouping > 0 && ++group === opts.grouping) {
        group = 0;

        if (opts.rowlength > 0 && ++column === opts.rowlength) {
          column = 0;
          str += '\n';
        } else {
          str += ' ';
        }
      }
    }

    return str;
  }

  /**
   * Takes a string containing hexadecimal and returns the equivalent as a Uint8Array buffer.
   * 
   * @param str - The string to convert. Whitespace is ignored. If an odd number of characters 
   *              are specified, it will act as if preceded with a leading 0; that is, "FFF" 
   *              is equivalent to "0FFF".
   * @returns A Uint8Array array
   * @throws Error if an unexpected character is encountered
   */
  static toUint8Array(str: string): Uint8Array {
    let target = str.toLowerCase().replace(/\s/g, '');

    if (target.length % 2 === 1) {
      target = `0${target}`;
    }

    const buffer = new Uint8Array(Math.floor(target.length / 2));
    let curr = -1;

    const hexChars: HexCharset = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let i = 0; i < target.length; ++i) {
      const c = target[i];
      if (!c) continue;
      const val = hexChars.indexOf(c);

      if (val === -1) {
        throw new Error(`Unexpected character '${c}' in hexadecimal string`);
      }

      if (curr === -1) {
        curr = 16 * val;
      } else {
        const bufferIndex = Math.floor(i / 2);
        if (bufferIndex < buffer.length && curr !== -1) {
          buffer[bufferIndex] = curr + val;
        }
        curr = -1;
      }
    }

    return buffer;
  }
}
