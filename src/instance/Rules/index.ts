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

/**
 * Rules System - Business Logic Engine for Knish.IO
 * 
 * This module exports the complete Rules system for the Knish.IO blockchain SDK.
 * The Rules system provides a flexible framework for defining and executing
 * business logic, validation rules, and automated actions within blockchain operations.
 * 
 * Components:
 * - Rule: Complete rule definitions with conditions and callbacks
 * - Condition: Evaluation criteria for rule triggers
 * - Callback: Actions executed when conditions are met
 * - Meta: Dynamic metadata container for flexible data handling
 * - RuleArgumentException: Error handling for invalid rule arguments
 * 
 * Usage:
 * ```typescript
 * import { Rule, Condition, Callback } from './Rules'
 * 
 * const condition = new Condition({
 *   key: 'tokenAmount',
 *   value: 100,
 *   comparison: 'gte'
 * })
 * 
 * const callback = new Callback({
 *   action: 'reject'
 * })
 * 
 * const rule = new Rule({
 *   condition: [condition],
 *   callback: [callback]
 * })
 * ```
 */

// Core rule components
export { default as Rule } from './Rule'
export { default as Condition } from './Condition'
export { default as Callback } from './Callback'
export { default as Meta } from './Meta'

// Exception handling
export { default as RuleArgumentException } from './exception/RuleArgumentException'

// Type exports for better TypeScript integration
import type RuleClass from './Rule'
import type ConditionClass from './Condition'  
import type CallbackClass from './Callback'
import type MetaClass from './Meta'

export type {
  RuleClass as RuleType,
  ConditionClass as ConditionType,
  CallbackClass as CallbackType,
  MetaClass as MetaType
}
