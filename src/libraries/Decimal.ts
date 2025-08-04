/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/

// Value determined by min SQL decimal precision
const MULTIPLIER = 10 ** 18;

/**
 * Utility class for high-precision decimal operations
 * Used to handle floating-point precision issues in financial calculations
 */
export default class Decimal {
  /**
   * Normalize a value by checking if it's significant enough to be non-zero
   * @param value - The numeric value to normalize
   * @returns The normalized value (0.0 if below precision threshold)
   */
  static val(value: number): number {
    if (Math.abs(value * MULTIPLIER) < 1) {
      return 0.0;
    }

    return value;
  }

  /**
   * Compare two decimal values with high precision
   * @param value1 - First value to compare
   * @param value2 - Second value to compare
   * @param debug - Enable debug mode (currently unused)
   * @returns -1 if value1 < value2, 0 if equal, 1 if value1 > value2
   */
  static cmp(value1: number, value2: number, _debug = false): -1 | 0 | 1 {
    const val1 = Decimal.val(value1) * MULTIPLIER;
    const val2 = Decimal.val(value2) * MULTIPLIER;

    // Equal (within precision threshold)
    if (Math.abs(val1 - val2) < 1) {
      return 0;
    }

    // Greater or smaller
    return (val1 > val2) ? 1 : -1;
  }

  /**
   * Check if two decimal values are equal within precision threshold
   * @param value1 - First value to compare
   * @param value2 - Second value to compare
   * @returns True if values are equal within precision threshold
   */
  static equal(value1: number, value2: number): boolean {
    return (Decimal.cmp(value1, value2) === 0);
  }
}
