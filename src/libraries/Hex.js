/**
 * Create Uint8Array buffers from hexadecimal strings, and vice versa.
 */
export default class Hex {

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
   * @param {array|ArrayBuffer|Uint8Array} arr
   * @param {object} options
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
          [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ] :
          [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];

        return set[ Math.floor( val / 16 ) ] + set[ val % 16 ];

      },
      opts = Object.assign(
        {
          grouping: 0,
          rowlength: 0,
          uppercase: false
        },
        options || {}
      );

    let str = '',
      group = 0,
      column = 0;

    for ( let i = 0; i < arr.length; ++i ) {

      str += numberToHex( arr[ i ], opts.uppercase );

      if ( i === arr.length - 1 ) {
        break;
      }

      if ( opts.grouping > 0 && ++group === opts.grouping ) {

        group = 0;

        if ( opts.rowlength > 0 && ++column === opts.rowlength ) {

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
   * str The string to convert. Whitespace is ignored. If an odd number of characters are specified,
   * it will act as if preceeded with a leading 0; that is, "FFF" is equivalent to "0FFF".
   *
   * return a Uint8Array array.
   *
   * @param {string} str
   * @returns {Uint8Array}
   */
  static toUint8Array ( str ) {

    let target = str.toLowerCase().replace( /\s/g, '' );

    if ( target.length % 2 === 1 ) {
      target = `0${ target }`;
    }

    let buffer = new Uint8Array( Math.floor( target.length / 2 ) ),
      curr = -1;

    for ( let i = 0; i < target.length; ++i ) {

      let c = target[ i ],
        val = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ].indexOf( c );

      if ( val === -1 ) {
        throw Error( 'unexpected character' );
      }

      if ( curr === -1 ) {
        curr = 16 * val;
      } else {

        buffer[ Math.floor( i / 2 ) ] = curr + val;
        curr = -1;
      }
    }

    return buffer;
  }
}
