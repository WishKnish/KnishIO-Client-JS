// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import bigInt from 'big-integer';
import {
  decodeBase64,
  encodeBase64,
} from 'tweetnacl-util';

if ( !String.prototype.trim ) {

  String.prototype.trim = function () {

    return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );

  };

}

/**
 * Chunks a string into array segments of equal size
 *
 * @param str
 * @param size
 * @returns {any[]}
 */
export function chunkSubstr ( str, size ) {

  const numChunks = Math.ceil( str.length / size ),
    chunks = new Array( numChunks );

  for ( let i = 0, o = 0; i < numChunks; ++i, o += size ) {

    chunks[ i ] = str.substr( o, size );

  }

  return chunks;

}

/**
 * Generates a cryptographically-secure pseudo-random string of the given length out of the given alphabet
 *
 * @param length
 * @param alphabet
 * @returns {string}
 */
export function randomString ( length = 256, alphabet = 'abcdef0123456789' ) {

  let array = new Uint8Array( length );

  window.crypto.getRandomValues( array );
  array = array.map( x => alphabet.charCodeAt( x % alphabet.length ) );

  return String.fromCharCode.apply( null, array );

}

/**
 * Convert charset between bases and alphabets
 *
 * @param src
 * @param from_base
 * @param to_base
 * @param src_symbol_table
 * @param dest_symbol_table
 * @returns {boolean|string|number}
 */
export function charsetBaseConvert ( src, from_base, to_base, src_symbol_table, dest_symbol_table ) {

  // From: convert.js: http://rot47.net/_js/convert.js
  //	http://rot47.net
  //	http://helloacm.com
  //	http://codingforspeed.com
  //	Dr Zhihua Lai
  //
  // Modified by MLM to work with BigInteger: https://github.com/peterolson/BigInteger.js
  // This is able to convert extremely large numbers; At any base equal to or less than the symbol table length

  // The reasoning behind capital first is because it comes first in a ASCII/Unicode character map
  // 96 symbols support up to base 96
  const base_symbols = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?¿¡';

  // Default the symbol table to a nice default table that supports up to base 96
  src_symbol_table = src_symbol_table ? src_symbol_table : base_symbols;
  // Default the desttable equal to the srctable if it isn't defined
  dest_symbol_table = dest_symbol_table ? dest_symbol_table : src_symbol_table;

  // Make sure we are not trying to convert out of the symbol table range
  if ( from_base > src_symbol_table.length || to_base > dest_symbol_table.length ) {

    console.warn( 'Can\'t convert', src, 'to base', to_base, 'greater than symbol table length. src-table:', src_symbol_table.length, 'dest-table:', dest_symbol_table.length );
    return false;

  }

  // First convert to base 10
  let val = bigInt( 0 );

  for ( let i = 0; i < src.length; i++ ) {

    val = val.multiply( from_base ).add( src_symbol_table.indexOf( src.charAt( i ) ) );

  }

  if ( val.lesser( 0 ) ) {

    return 0;

  }

  // Then covert to any base
  let r = val.mod( to_base ),
    res = dest_symbol_table.charAt( r ),
    q = val.divide( to_base );

  while ( !q.equals( 0 ) ) {

    r = q.mod( to_base );
    q = q.divide( to_base );
    res = dest_symbol_table.charAt( r ) + res;

  }

  return res;

}

/**
 * Converts a buffer into a hexadecimal string
 *
 * @param byteArray
 * @returns {string}
 */
export function bufferToHexString ( byteArray ) {

  return Hex.toHex( byteArray );

}

/**
 * Converts a hexadecimal string into a buffer
 *
 * @param hexString
 * @returns {Uint8Array}
 */
export function hexStringToBuffer ( hexString ) {

  return Hex.toUint8Array( hexString );

}

/**
 * Compresses a given string for web sharing
 *
 * @param string
 * @returns {string}
 */
export function compress ( string ) {

  return encodeBase64( Hex.toUint8Array( string ) );

}

/**
 * Decompresses a compressed string
 *
 * @param {string} string
 * @returns {string}
 */
export function decompress ( string ) {

  return Hex.toHex( decodeBase64( string ) );

}

/**
 * Create Uint8Array buffers from hexadecimal strings, and vice versa.
 */
export class Hex {

  /**
   * Converts the given buffer to a string containing its hexadecimal representation.
   *
   * arr a Uint8Array buffer to convert.
   *
   * options an optional object with the following members:
   *     grouping this number of hex bytes are grouped together with spaces between groups. 0 means no grouping is applied. 0 if unspecified.
   *     rowlength the number of groups which make up a row. When 0, no splitting into rows occurs. 0 if unspecified.
   *     uppercase if true, the output will be in uppercase. true by default.
   *
   * return a hexadecimal string representing the buffer.
   *
   * @param {Array|ArrayBuffer|Uint8Array} arr
   * @param {Object} options
   * @returns {string}
   */
  static toHex ( arr, options ) {

    /**
     * @param {number} val
     * @param {boolean} uppercase
     * @returns {*}
     */
    const numberToHex = ( val, uppercase ) => {

      const set = uppercase ?
        [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ] :
        [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ];

      return set[ Math.floor( val / 16 ) ] + set[ val % 16 ];

    },
      opts = Object.assign(
        {
          grouping: 0,
          rowlength: 0,
          uppercase: false,
        },
        options || {}
      );

    let str = "",
      group = 0,
      column = 0;

    for ( let i = 0; i < arr.length; ++i ) {

      str += numberToHex( arr[i], opts.uppercase );

      if ( i === arr.length - 1 ) {

        break;

      }

      if ( opts.grouping > 0 && ++group === opts.grouping ) {

        group = 0;

        if ( opts.rowlength > 0 && ++column === opts.rowlength ) {

          column = 0;
          str += "\n";

        }
        else {

          str += " ";

        }

      }

    }

    return str;

  }

  /**
   * Takes a string containing hexadecimal and returns the equivalent as a Uint8Array buffer.
   *
   * str The string to convert. Whitespace is ignored. If an odd number of characters are specified,
   * it will act as if preceeded with a leading 0; that is, "FFF" is equivalent to "0FFF".
   *
   * return a Uint8Array array.
   *
   * @param {string} str
   * @returns {Uint8Array}
   */
  static toUint8Array ( str ) {

    let target = str.toLowerCase().replace( /\s/g, "" );

    if ( target.length % 2 === 1 ) {

      target = "0" + target;

    }

    let buffer = new Uint8Array( Math.floor( target.length / 2 ) ),
      curr = -1;

    for ( let i = 0; i < target.length; ++i ) {

      let c = target[ i ],
        val = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f" ].indexOf( c );

      if ( val === -1 ) {

        throw Error( "unexpected character" );

      }

      if ( curr === -1 ) {

        curr = 16 * val;

      }
      else {

        buffer[ Math.floor( i / 2 ) ] = curr + val;
        curr = -1;

      }

    }

    return buffer;

  }

}
