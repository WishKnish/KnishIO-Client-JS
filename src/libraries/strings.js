import Hex from './Hex'

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (!String.prototype.toCamelCase) {
  String.prototype.toCamelCase = function () {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
  }
}

if (!String.prototype.toSnakeCase) {
  String.prototype.toSnakeCase = function () {
    return this.replace(/[A-Z]/g, letter => `_${ letter.toLowerCase() }`)
  }
}

/**
 * Chunks a string into array segments of equal size
 *
 * @param str
 * @param size
 * @return {any[]}
 */
export function chunkSubstr (str, size) {
  const numChunks = Math.ceil(str.length / size)
    const chunks = []

  for (let chunkIndex = 0, o = 0; chunkIndex < numChunks; ++chunkIndex, o += size) {
    chunks[chunkIndex] = str.substr(o, size)
  }

  return chunks
}

/**
 * Generates a cryptographically-secure pseudo-random string of the given length out of the given alphabet
 *
 * @param length
 * @param alphabet
 * @return {string}
 */
export function randomString (length = 256, alphabet = 'abcdef0123456789') {
  let array = new Uint8Array(length)

  array = crypto.getRandomValues(array)

  array = array.map(x => alphabet.charCodeAt(x % alphabet.length))

  return String.fromCharCode.apply(null, array)
}

/**
 * Convert charset between bases and alphabets
 *
 * @param src
 * @param {int} fromBase
 * @param {int} toBase
 * @param { string} srcSymbolTable
 * @param {string} destSymbolTable
 * @return {boolean|string|number}
 */
export function charsetBaseConvert (src, fromBase, toBase, srcSymbolTable, destSymbolTable) {
  const baseSymbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?¿¡'
  srcSymbolTable = srcSymbolTable || baseSymbols
  destSymbolTable = destSymbolTable || srcSymbolTable

  if (fromBase > srcSymbolTable.length || toBase > destSymbolTable.length) {
    console.warn('Strings::charsetBaseConvert() - Can\'t convert', src, 'to base', toBase, 'greater than symbol table length. src-table:', srcSymbolTable.length, 'dest-table:', destSymbolTable.length)
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
 *
 * @param byteArray
 * @return {string}
 */
export function bufferToHexString (byteArray) {
  return Hex.toHex(byteArray, {})
}

/**
 * Converts a hexadecimal string into a buffer
 *
 * @param hexString
 * @return {Uint8Array}
 */
export function hexStringToBuffer (hexString) {
  return Hex.toUint8Array(hexString)
}

/**
 * Compresses a given string for web sharing
 *
 * @param string
 * @return {string}
 */
export function hexToBase64 (string) {
  return Buffer.from(string, 'hex').toString('base64')
}

/**
 * Decompresses a compressed string
 *
 * @param {string} string
 * @return {string}
 */
export function base64ToHex (string) {
  return Buffer.from(string, 'base64').toString('hex')
}

/**
 * @param {string} str
 * @return {boolean}
 */
export function isHex (str) {
  return /^[A-F0-9]+$/i.test(str)
}

/**
 * @param {string} str
 * @return {boolean}
 */
export function isNumeric (str) {
  return (typeof (str) === 'number' || typeof (str) === 'string' && str.trim() !== '') && !isNaN(str)
}
