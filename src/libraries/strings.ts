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

import Hex from './Hex'
import { createScopedLogger } from './Logger'

const logger = createScopedLogger('Strings')

// Extend String prototype with additional methods
declare global {
  interface String {
    toCamelCase(): string
    toSnakeCase(): string
  }
}

// Polyfills for String methods
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (!String.prototype.toCamelCase) {
  String.prototype.toCamelCase = function () {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
  }
}

if (!String.prototype.toSnakeCase) {
  String.prototype.toSnakeCase = function () {
    return this.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  }
}

/**
 * Chunks a string into array segments of equal size
 * @param str - String to chunk
 * @param size - Size of each chunk
 * @returns Array of string chunks
 */
export function chunkSubstr (str: string, size: number): string[] {
  const numChunks = Math.ceil(str.length / size)
  const chunks: string[] = []

  for (let chunkIndex = 0, o = 0; chunkIndex < numChunks; ++chunkIndex, o += size) {
    chunks[chunkIndex] = str.substr(o, size)
  }

  return chunks
}

/**
 * Generates a cryptographically-secure pseudo-random string of the given length out of the given alphabet
 * @param length - Length of the generated string (default: 256)
 * @param alphabet - Character set to use (default: hex characters)
 * @returns Random string
 */
export function randomString (length: number = 256, alphabet: string = 'abcdef0123456789'): string {
  let array = new Uint8Array(length)

  array = crypto.getRandomValues(array)

  const mappedArray = array.map(x => alphabet.charCodeAt(x % alphabet.length))

  return String.fromCharCode.apply(null, Array.from(mappedArray))
}

/**
 * Convert charset between bases and alphabets
 * @param src - Source string to convert
 * @param fromBase - Source base
 * @param toBase - Destination base
 * @param srcSymbolTable - Source symbol table (optional)
 * @param destSymbolTable - Destination symbol table (optional)
 * @returns Converted string or false if conversion fails
 */
export function charsetBaseConvert (
  src: string,
  fromBase: number,
  toBase: number,
  srcSymbolTable?: string,
  destSymbolTable?: string
): string | false {
  const baseSymbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?¿¡'
  srcSymbolTable = srcSymbolTable || baseSymbols
  destSymbolTable = destSymbolTable || srcSymbolTable

  if (fromBase > srcSymbolTable.length || toBase > destSymbolTable.length) {
    logger.warn(`charsetBaseConvert() - Can't convert ${src} to base ${toBase} greater than symbol table length. src-table: ${srcSymbolTable.length}, dest-table: ${destSymbolTable.length}`)
    return false
  }

  // Convert from source base to BigInt in base 10
  let val = BigInt(0)
  for (let charIndex = 0; charIndex < src.length; charIndex++) {
    val = val * BigInt(fromBase) + BigInt(srcSymbolTable.indexOf(src.charAt(charIndex)))
  }

  // Convert from BigInt in base 10 to destination base
  let res = ''
  while (val > 0) {
    const r = val % BigInt(toBase)
    res = destSymbolTable.charAt(Number(r)) + res
    val /= BigInt(toBase)
  }

  // If the result is empty, it means the source was 0
  return res || '0'
}

/**
 * Converts a buffer into a hexadecimal string
 * @param byteArray - Byte array to convert
 * @returns Hexadecimal string representation
 */
export function bufferToHexString (byteArray: Uint8Array | ArrayBuffer | number[]): string {
  return Hex.toHex(byteArray as any, {})
}

/**
 * Converts a hexadecimal string into a buffer
 * @param hexString - Hexadecimal string to convert
 * @returns Uint8Array buffer
 */
export function hexStringToBuffer (hexString: string): Uint8Array {
  return Hex.toUint8Array(hexString)
}

/**
 * Compresses a given string for web sharing
 * @param string - Hexadecimal string to compress
 * @returns Base64 encoded string
 */
export function hexToBase64 (string: string): string {
  const bytes = hexStringToBuffer(string)
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
}

/**
 * Decompresses a compressed string
 * @param string - Base64 string to decompress
 * @returns Hexadecimal string
 */
export function base64ToHex (string: string): string {
  const bytes = new Uint8Array(atob(string).split('').map(char => char.charCodeAt(0)))
  return bufferToHexString(bytes)
}

/**
 * Tests if a string is a valid hexadecimal string
 * @param str - String to test
 * @returns True if string is valid hex
 */
export function isHex (str: string): boolean {
  return /^[A-F0-9]+$/i.test(str)
}

/**
 * Tests if a string or number is numeric
 * @param str - Value to test
 * @returns True if value is numeric
 */
export function isNumeric (str: string | number): boolean {
  return (typeof (str) === 'number' || (typeof (str) === 'string' && str.trim() !== '')) && !isNaN(str as number)
}