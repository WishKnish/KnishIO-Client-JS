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
  // which metadata field are we targeting? (if we're dealing with a ledger object like a Wallet,
  // this could be internal fields like 'amount', etc.)
  #key
  // what is the target value that will trigger the rule? (meta value OR token amount)
  #value
  // same list of possible options as when querying
  #comparison
  #callback

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

    this.#key = key;
    this.#value = value;
    this.#comparison = comparison;
    this.#callback = callback;
  }

  /**
   *
   * @param {string} comparison
   */
  set comparison ( comparison ) {
    this.#comparison = comparison;
  }

  set callback ( callback ) {
    this.#callback.push( callback );
  }

  toJSON () {
    return {
      key: this.#key,
      value: this.#value,
      comparison: this.#comparison,
      callback: this.#callback
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
