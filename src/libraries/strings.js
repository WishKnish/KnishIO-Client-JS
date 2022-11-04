import bigInt from 'big-integer';
import Hex from './Hex';
import {
  decode as decodeBase64,
  encode as encodeBase64
} from '@stablelib/base64';
import getRandomValues from 'get-random-values';

if ( !String.prototype.trim ) {
  String.prototype.trim = function () {
    return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
  };
}

if ( !String.prototype.toCamelCase ) {
  String.prototype.toCamelCase = function () {
    return this.toLowerCase().replace( /[^a-zA-Z0-9]+(.)/g, ( m, chr ) => chr.toUpperCase() );
  };
}

if ( !String.prototype.toSnakeCase ) {
  String.prototype.toSnakeCase = function () {
    return this.replace( /[A-Z]/g, letter => `_${ letter.toLowerCase() }` );
  };
}

/**
 * Chunks a string into array segments of equal size
 *
 * @param str
 * @param size
 * @return {any[]}
 */
export function chunkSubstr ( str, size ) {

  const numChunks = Math.ceil( str.length / size ),
    chunks = [];

  for ( let chunkIndex = 0, o = 0; chunkIndex < numChunks; ++chunkIndex, o += size ) {
    chunks[ chunkIndex ] = str.substr( o, size );
  }

  return chunks;
}

/**
 * Generates a cryptographically-secure pseudo-random string of the given length out of the given alphabet
 *
 * @param length
 * @param alphabet
 * @return {string}
 */
export function randomString ( length = 256, alphabet = 'abcdef0123456789' ) {

  let array = new Uint8Array( length );

  array = getRandomValues( array );

  array = array.map( x => alphabet.charCodeAt( x % alphabet.length ) );

  return String.fromCharCode.apply( null, array );
}

/**
 * Convert charset between bases and alphabets
 *
 * @param src
 * @param fromBase
 * @param toBase
 * @param srcSymbolTable
 * @param destSymbolTable
 * @return {boolean|string|number}
 */
export function charsetBaseConvert ( src, fromBase, toBase, srcSymbolTable, destSymbolTable ) {

  // From: convert.js: http://rot47.net/_js/convert.js
  //	http://rot47.net
  //	http://helloacm.com
  //	http://codingforspeed.com
  //	Dr Zhihua Lai
  //
  // Modified by MLM to work with BigInteger: https://github.com/peterolson/BigInteger.js
  // This is able to convert extremely large numbers; At any base equal to or less than the symbol table length

  // The reasoning behind capital first is because it comes first in an ASCII/Unicode character map
  // 96 symbols support up to base 96
  const baseSymbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?¿¡';

  // Default the symbol table to a nice default table that supports up to base 96
  srcSymbolTable = srcSymbolTable ? srcSymbolTable : baseSymbols;
  // Default the desttable equal to the srctable if it isn't defined
  destSymbolTable = destSymbolTable ? destSymbolTable : srcSymbolTable;

  // Make sure we are not trying to convert out of the symbol table range
  if ( fromBase > srcSymbolTable.length || toBase > destSymbolTable.length ) {

    console.warn( 'Strings::charsetBaseConvert() - Can\'t convert', src, 'to base', toBase, 'greater than symbol table length. src-table:', srcSymbolTable.length, 'dest-table:', destSymbolTable.length );
    return false;
  }

  // First convert to base 10
  let val = bigInt( 0 );

  for ( let charIndex = 0; charIndex < src.length; charIndex++ ) {
    val = val.multiply( fromBase ).add( srcSymbolTable.indexOf( src.charAt( charIndex ) ) );
  }

  if ( val.lesser( 0 ) ) {
    return 0;
  }

  // Then covert to any base
  let r = val.mod( toBase ),
    res = destSymbolTable.charAt( r ),
    q = val.divide( toBase );

  while ( !q.equals( 0 ) ) {

    r = q.mod( toBase );
    q = q.divide( toBase );
    res = destSymbolTable.charAt( r ) + res;
  }

  return res;
}

/**
 * Converts a buffer into a hexadecimal string
 *
 * @param byteArray
 * @return {string}
 */
export function bufferToHexString ( byteArray ) {
  return Hex.toHex( byteArray, {} );
}

/**
 * Converts a hexadecimal string into a buffer
 *
 * @param hexString
 * @return {Uint8Array}
 */
export function hexStringToBuffer ( hexString ) {
  return Hex.toUint8Array( hexString );
}

/**
 * Compresses a given string for web sharing
 *
 * @param string
 * @return {string}
 */
export function hexToBase64 ( string ) {
  return encodeBase64( Hex.toUint8Array( string ) );
}

/**
 * Decompresses a compressed string
 *
 * @param {string} string
 * @return {string}
 */
export function base64ToHex ( string ) {
  return Hex.toHex( decodeBase64( string ), {} );
}

/**
 * @param {string} str
 * @return {boolean}
 */
export function isHex ( str ) {
  return /^[A-F0-9]+$/i.test( str );
}

/**
 * @param {string} str
 * @return {boolean}
 */
export function isNumeric( str ) {
  return (typeof(str) === 'number' || typeof(str) === 'string' && str.trim() !== '') && !isNaN(str);
}
