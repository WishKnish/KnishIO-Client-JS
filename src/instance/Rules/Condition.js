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

import RuleArgumentException from './exception/RuleArgumentException';

export default class Condition {

  /**
   *
   * @param key
   * @param value
   * @param comparison
   */
  constructor ( {
    key,
    value,
    comparison
  } ) {

    if ( [ key, value, comparison ].some( item => !item ) ) {
      throw new RuleArgumentException( 'Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!' );
    }

    this.__key = key;
    this.__value = value;
    this.__comparison = comparison;
  }

  /**
   * @param object
   * @return {Condition}
   */
  static toObject ( object ) {
    return new this( {
      key: object.key,
      value: object.value,
      comparison: object.comparison
    } );
  }

  /**
   * @return {{comparison, value, key}}
   */
  toJSON () {
    return {
      key: this.__key,
      value: this.__value,
      comparison: this.__comparison
    };
  }
}
