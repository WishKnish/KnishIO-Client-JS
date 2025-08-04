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

import RuleArgumentException from './exception/RuleArgumentException'

/**
 * Parameters for creating a Condition
 */
interface ConditionParams {
  key: string;
  value: string | number | boolean;
  comparison: string;
}

/**
 * Condition class for rule evaluation
 * 
 * This class represents a condition that can be evaluated as part of a rule.
 * Conditions define criteria that must be met for rule execution, consisting
 * of a key-value comparison using a specified comparison operator.
 */
export default class Condition {
  private readonly __key: string
  private readonly __value: string | number | boolean
  private readonly __comparison: string

  /**
   * Creates a new Condition instance
   * 
   * @param params - Condition parameters
   * @param params.key - The key/field to evaluate
   * @param params.value - The value to compare against
   * @param params.comparison - The comparison operator (e.g., 'eq', 'gt', 'lt', 'contains')
   * @throws RuleArgumentException if any required parameter is missing
   */
  constructor({ key, value, comparison }: ConditionParams) {
    // Validate that all required parameters are provided
    if ([key, value, comparison].some(item => !item && item !== 0 && item !== false)) {
      throw new RuleArgumentException(
        'Condition::constructor( { key, value, comparison } ) - not all class parameters are initialised!'
      )
    }

    this.__key = key
    this.__value = value
    this.__comparison = comparison
  }

  /**
   * Creates a Condition instance from a plain object
   * 
   * @param object - Object containing condition properties
   * @returns A new Condition instance
   */
  static toObject(object: ConditionParams): Condition {
    return new this({
      key: object.key,
      value: object.value,
      comparison: object.comparison
    })
  }

  /**
   * Converts this Condition to a plain JSON object
   * 
   * @returns Plain object representation of this condition
   */
  toJSON(): ConditionParams {
    return {
      key: this.__key,
      value: this.__value,
      comparison: this.__comparison
    }
  }
}
