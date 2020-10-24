/**
 *
 */
export default class Dot {

  /**
   * @param {Object|Array} obj
   * @param {string} keys
   * @private
   */
  static __init ( obj, keys ) {

    this.arr = [];
    this.key = null;

    this.arr = String( keys ).split( '.' );
    this.key = this.arr.shift();

    const numberKey = Number( this.key );

    if ( Number.isInteger( numberKey ) ) {
      this.key = numberKey;
    }

    this.__nextKey = this.arr.length;
    this.__next = this.__tic( obj );
  }

  /**
   * @param {Object|Array} obj
   * @return {boolean}
   * @private
   */
  static __tic ( obj ) {

    if ( !Array.isArray( obj ) && !( obj instanceof Object ) ) {
      return false;
    }

    return typeof obj[ this.key ] !== 'undefined';
  }

  /**
   * @param {Object|Array} obj
   * @param {string} keys
   * @return {boolean}
   */
  static has ( obj, keys ) {

    this.__init( obj, keys );

    if ( !this.__next ) {
      return false;
    }
    if ( this.__nextKey === 0 ) {
      return true;
    }

    return this.has( obj[ this.key ], this.arr.join( '.' ) );
  }

  /**
   * @param {Object|Array} obj
   * @param {string} keys
   * @param {*} def
   * @return {*}
   */
  static get ( obj, keys, def = null ) {

    this.__init( obj, keys );

    if ( !this.__next ) {
      return def;
    }
    if ( this.__nextKey === 0 ) {
      return obj[ this.key ];
    }

    return this.get( obj[ this.key ], this.arr.join( '.' ), def );
  }
}
