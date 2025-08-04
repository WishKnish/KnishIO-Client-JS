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
                      (((((((((((((((((((              ((((((((((((((
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

import Callback from './Callback'
import Condition from './Condition'
import RuleArgumentException from './exception/RuleArgumentException'
import MetaMissingException from '../../exception/MetaMissingException'

/**
 * Parameters for creating a Rule
 */
interface RuleParams {
  condition?: Condition[];
  callback?: Callback[];
}

/**
 * Rule object structure for conversion
 */
interface RuleObject {
  condition: Array<Condition | Record<string, unknown>>;
  callback: Array<Callback | Record<string, unknown>>;
}

/**
 * JSON representation of a rule
 */
interface RuleJSON {
  condition: Condition[];
  callback: Callback[];
}

/**
 * Rule class for business logic enforcement
 * 
 * This class represents a complete rule consisting of conditions that must be met
 * and callbacks that are executed when those conditions are satisfied. Rules are
 * used throughout the Knish.IO system to enforce business logic, validate
 * transactions, and trigger automated actions.
 */
export default class Rule {
  private __condition: Condition[]
  private __callback: Callback[]

  /**
   * Creates a new Rule instance
   * 
   * @param params - Rule parameters
   * @param params.condition - Array of conditions that must be met
   * @param params.callback - Array of callbacks to execute when conditions are met
   * @throws RuleArgumentException if any condition or callback is invalid
   */
  constructor({ condition = [], callback = [] }: RuleParams = {}) {
    // Validate all conditions are Condition instances
    for (const element of condition) {
      if (!(element instanceof Condition)) {
        throw new RuleArgumentException('All condition elements must be instances of Condition')
      }
    }

    // Validate all callbacks are Callback instances
    for (const element of callback) {
      if (!(element instanceof Callback)) {
        throw new RuleArgumentException('All callback elements must be instances of Callback')
      }
    }

    this.__condition = condition
    this.__callback = callback
  }

  /**
   * Adds a condition to this rule
   * 
   * @param condition - Condition instance or object to add
   */
  set comparison(condition: Condition | Record<string, unknown>) {
    this.__condition.push(
      condition instanceof Condition ? condition : Condition.toObject(condition as any)
    )
  }

  /**
   * Adds a callback to this rule
   * 
   * @param callback - Callback instance or object to add
   */
  set callback(callback: Callback | Record<string, unknown>) {
    this.__callback.push(
      callback instanceof Callback ? callback : Callback.toObject(callback as any)
    )
  }

  /**
   * Creates a Rule instance from a plain object
   * 
   * @param object - Object containing rule properties
   * @returns A new Rule instance
   * @throws MetaMissingException if required fields are missing
   */
  static toObject(object: RuleObject): Rule {
    if (!object.condition) {
      throw new MetaMissingException('Rule::toObject() - Incorrect rule format! There is no condition field.')
    }
    if (!object.callback) {
      throw new MetaMissingException('Rule::toObject() - Incorrect rule format! There is no callback field.')
    }

    const rule = new Rule({})

    // Add all conditions
    for (const condition of object.condition) {
      rule.comparison = condition
    }

    // Add all callbacks
    for (const callback of object.callback) {
      rule.callback = callback
    }

    return rule
  }

  /**
   * Converts this Rule to a plain JSON object
   * 
   * @returns Plain object representation of this rule
   */
  toJSON(): RuleJSON {
    return {
      condition: this.__condition,
      callback: this.__callback
    }
  }
}
