import base from 'base-x';
import { Buffer } from 'buffer';


export default class Base58 {

  /**
   * @param {object} options
   */
  constructor ( options = {} ) {
    this.$options = Object.assign( { "characters": 'GMP', }, options );
    this.$encoder = base( this[ this.$options[ 'characters' ] ] || this[ 'GMP' ] );
  }

  /**
   * @param {Buffer} data
   * @returns {string}
   */
  encode ( data ) {

    return this.$encoder.encode( Buffer.from( data ) );

  }

  /**
   * @param {string} data
   * @returns {Buffer}
   */
  decode ( data ) {

    return this.$encoder.decode( data );

  }

  /**
   * @returns {string}
   * @constructor
   */
  get GMP () {
    return "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv";
  }

  /**
   * @returns {string}
   * @constructor
   */
  get BITCOIN () {
    return "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  }

  /**
   * @returns {string}
   * @constructor
   */
  get FLICKR () {
    return "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  }

  /**
   * @returns {string}
   * @constructor
   */
  get RIPPLE () {
    return "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz";
  }

  /**
   * @returns {string}
   * @constructor
   */
  get IPFS () {
    return "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  }

}
