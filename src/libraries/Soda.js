import BaseX from './BaseX';
import { shake256 } from 'js-sha3';
import { box } from 'tweetnacl';
import { Buffer } from 'buffer';
import {
  open,
  seal
} from 'tweetnacl-sealedbox-js';
import {
  decode as decodeUTF8,
  encode as encodeUTF8
} from '@stablelib/utf8';


export default class Soda {

  /**
   * @param {string|null} characters
   */
  constructor ( characters = null ) {
    this.base = new BaseX( { characters: characters || 'BASE64' } );
  }

  /**
   * @param {array|object} message
   * @param {string} key
   * @return {string}
   */
  encrypt ( message, key ) {
    return this.encode( seal( encodeUTF8( JSON.stringify( message ) ), this.decode( key ) ) );
  }

  /**
   * @param {string} decrypted
   * @param {string} privateKey
   * @param {string} publicKey
   * @return {null|array|object}
   */
  decrypt ( decrypted, privateKey, publicKey ) {
    try {
      return JSON.parse( decodeUTF8( open( this.decode( decrypted ), this.decode( publicKey ), this.decode( privateKey ) ) ) );
    } catch ( e ) {
      return null;
    }
  }

  /**
   *
   * @param {string} key
   * @return {string}
   */
  generatePrivateKey ( key ) {
    const sponge = shake256.create( box.secretKeyLength * 8 );
    sponge.update( key );
    return this.base.encode( Buffer.from( sponge.digest() ) );
  }

  /**
   * @param {string} key
   * @return {string}
   */
  generatePublicKey ( key ) {
    const boxKey = box.keyPair.fromSecretKey( this.decode( key ) );
    return this.encode( boxKey.publicKey );
  }

  /**
   * @param {string} key
   * @return {string}
   */
  shortHash ( key ) {
    const sponge = shake256.create( 64 );
    sponge.update( key );
    return this.base.encode( Buffer.from( sponge.digest() ) );
  }

  /**
   * @param {string} data
   * @return {string|Buffer}
   */
  decode ( data ) {
    return this.base.decode( data );
  }

  /**
   * @param {string|Buffer|Uint8Array} data
   * @return {string}
   */
  encode ( data ) {
    return this.base.encode( data );
  }

}
