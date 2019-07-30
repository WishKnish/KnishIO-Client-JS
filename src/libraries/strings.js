import bigInt from 'big-integer';

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
