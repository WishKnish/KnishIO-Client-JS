import Hex from './Hex'

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (!String.prototype.toCamelCase) {
  String.prototype.toCamelCase = function () {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m: any, chr: string) => chr.toUpperCase())
  }
}

if (!String.prototype.toSnakeCase) {
  String.prototype.toSnakeCase = function () {
    return this.replace(/[A-Z]/g, ( letter: string) => `_${ letter.toLowerCase() }`)
  }
}

/**
 * Chunks a string into array segments of equal size
 */
export function chunkSubstr (str: string, size: number): string[] {
  const numChunks = Math.ceil(str.length / size)
  const chunks = []

  for (let chunkIndex = 0, o = 0; chunkIndex < numChunks; ++chunkIndex, o += size) {
    chunks[chunkIndex] = str.substr(o, size)
  }

  return chunks
}

/**
 * Generates a cryptographically-secure pseudo-random string of the given length out of the given alphabet
 */
export function randomString (length: number = 256, alphabet: string = 'abcdef0123456789'): string {
  let array = new Uint8Array(length)

  array = crypto.getRandomValues(array)

  array = array.map(x => alphabet.charCodeAt(x % alphabet.length))

  return String.fromCharCode.apply(null, array)
}

/**
 * Convert charset between bases and alphabets
 */
export function charsetBaseConvert (src: string, fromBase: number, toBase: number, srcSymbolTable: string, destSymbolTable: string): string | boolean {
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
 */
export function bufferToHexString (byteArray: Uint8Array): string {
  return Hex.toHex(byteArray, {})
}

/**
 * Converts a hexadecimal string into a buffer
 */
export function hexStringToBuffer (hexString: string): Uint8Array {
  return Hex.toUint8Array(hexString)
}

/**
 * Compresses a given string for web sharing
 */
export function hexToBase64 (str: string): string {
  return Buffer.from(str, 'hex').toString('base64')
}

/**
 * Decompresses a compressed string
 */
export function base64ToHex (str: string): string {
  return Buffer.from(str, 'base64').toString('hex')
}

/**
 * Checks if a string is a hexadecimal string
 */
export function isHex (str: string): boolean {
  return /^[A-F0-9]+$/i.test(str)
}

/**
 * Checks if a string is a numeric string
 */
export function isNumeric (str: unknown): boolean {
  return (typeof (str) === 'number' || (typeof (str) === 'string' && str.trim() !== '')) && !isNaN(str as number)
}
