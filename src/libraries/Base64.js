import {
  decode as decodeBase64,
  encode as encodeBase64
} from '@stablelib/base64';
import { Buffer } from 'buffer';


export default class Base64 {
  /**
   * @param {Buffer|ArrayBuffer|Uint8Array} data
   * @return {string}
   */
  static encode ( data ) {
    return encodeBase64( data );
  }

  /**
   * @param {string} data
   * @return {Buffer|ArrayBuffer|Uint8Array}
   */
  static decode ( data ) {
    return Buffer.from( decodeBase64( data ) );
  }

  /**
   * @param {Buffer|ArrayBuffer|Uint8Array} data
   * @return {string}
   */
  encode ( data ) {
    return Base64.encode( data );
  }

  /**
   * @param {string} data
   * @return {Buffer|ArrayBuffer|Uint8Array}
   */
  decode ( data ) {
    return Base64.decode( data );
  }
}
