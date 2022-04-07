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

import Callback from './Callback';
import RuleArgumentException from './exception/RuleArgumentException';


export default class Rule {

  /**
   *
   * @param {string} key
   * @param {string} value
   * @param {string} comparison
   * @param {Callback[]} callback
   */
  constructor ( {
    key,
    value,
    comparison = '===',
    callback = []
  } ) {
    if ( !key ) {
      throw new RuleArgumentException( 'Rule structure violated, missing mandatory "key" parameter!' );
    }

    if ( !value ) {
      throw new RuleArgumentException( 'Rule structure violated, missing mandatory "value" parameter' );
    }

    for ( const element of callback ) {
      if ( ! ( element instanceof Callback ) ) {
        throw new RuleArgumentException();
      }
    }

    this._key = key;
    this._value = value;
    this._comparison = comparison;
    this._callback = callback;
  }

  /**
   *
   * @param {string} comparison
   */
  set comparison ( comparison ) {
    this._comparison = comparison;
  }

  set callback ( callback ) {
    this._callback.push( callback );
  }

  toJSON () {
    return {
      key: this._key,
      value: this._value,
      comparison: this._comparison,
      callback: this._callback
    };
  }

  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject ( object ) {

    const rule = new Rule( {
      key: object.key,
      value: object.value
    } );

    if ( object.comparison ) {
      rule.comparison = object.comparison;
    }

    if ( object.callback ) {
      for ( const callback of object.callback ) {
        rule.callback = callback instanceof Callback ? callback : Callback.toObject( callback );
      }
    }

    return rule;
  }
}
