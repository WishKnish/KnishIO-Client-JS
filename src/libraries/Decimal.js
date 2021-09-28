// Value determines by min sql decimal precision
const multiplier = 10 ** 18;

export default class Decimal {

  /**
   * @param {number} value
   * @return {number}
   */
  static val ( value ) {
    if ( Math.abs( value * multiplier ) < 1 ) {
      return 0.0;
    }

    return value;
  }

  /**
   * @param {number} value1
   * @param {number} value2
   * @param {boolean} debug
   * @return {number}
   */
  static cmp ( value1, value2, debug = false ) {

    const val1 = Decimal.val( value1 ) * multiplier,
      val2 = Decimal.val( value2 ) * multiplier;

    // Equal
    if ( Math.abs( val1 - val2 ) < 1 ) {
      return 0;
    }

    // Greater or smaller
    return ( val1 > val2 ) ? 1 : -1;

  }

  /**
   * @param {number} value1
   * @param {number} value2
   * @return {boolean}
   */
  static equal ( value1, value2 ) {
    return ( Decimal.cmp( value1, value2 ) === 0 );
  }

}
