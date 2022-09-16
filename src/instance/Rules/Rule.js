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
import Condition from './Condition';
import RuleArgumentException from './exception/RuleArgumentException';
import MetaMissingException from '../../exception/MetaMissingException';


export default class Rule {

  /**
   *
   * @param {Condition[]} comparison
   * @param {Callback[]} callback
   */
  constructor ( {
    condition = [],
    callback = []
  } ) {

    for ( const element of condition ) {
      if ( !( element instanceof Condition ) ) {
        throw new RuleArgumentException();
      }
    }

    for ( const element of callback ) {
      if ( !( element instanceof Callback ) ) {
        throw new RuleArgumentException();
      }
    }

    this.__condition = condition;
    this.__callback = callback;
  }

  /**
   *
   * @param {Condition[]|{}} condition
   */
  set comparison ( condition ) {
    this.__condition.push( condition instanceof Condition ? condition : Condition.toObject( condition ) );
  }

  /**
   * @param {Callback[]|{}} callback
   */
  set callback ( callback ) {
    this.__callback.push( callback instanceof Callback ? callback : Callback.toObject( callback ) );
  }

  /**
   * @returns {{condition: *, callback: Callback[]}}
   */
  toJSON () {
    return {
      condition: this.__condition,
      callback: this.__callback
    };
  }

  /**
   *
   * @param {object} object
   *
   * @return {Rule}
   */
  static toObject ( object ) {
    if ( !object.condition ) {
      throw new MetaMissingException( 'Rule::toObject() - Incorrect rule format! There is no condition field.' );
    }
    if ( !object.callback ) {
      throw new MetaMissingException( 'Rule::toObject() - Incorrect rule format! There is no callback field.' );
    }

    const rule = new Rule( {} );

    for ( const condition of object.condition ) {
      rule.comparison = condition;
    }

    for ( const callback of object.callback ) {
      rule.callback = callback;
    }

    return rule;
  }
}
