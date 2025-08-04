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

import Meta from './Meta'
import RuleArgumentException from './exception/RuleArgumentException'
import { isNumeric } from '../../libraries/strings'
import { intersect } from '../../libraries/array'
import CodeException from '../../exception/CodeException'

/**
 * Parameters for creating a Callback
 */
interface CallbackParams {
  action: string;
  metaType?: string | null;
  metaId?: string | null;
  meta?: Meta | Record<string, unknown> | null;
  address?: string | null;
  token?: string | null;
  amount?: string | null;
  comparison?: string | null;
}

/**
 * JSON representation of a callback
 */
interface CallbackJSON {
  action: string;
  metaType?: string;
  metaId?: string;
  meta?: Meta | Record<string, unknown>;
  address?: string;
  token?: string;
  amount?: string;
  comparison?: string;
}

/**
 * Callback class for rule actions
 * 
 * This class represents an action to be executed when rule conditions are met.
 * Callbacks define what happens when a rule is triggered, supporting various
 * action types like reject, meta operations, collect, buffer, remit, and burn.
 */
export default class Callback {
  private __action: string
  private __metaType?: string | null
  private __metaId?: string | null
  private __meta?: Meta | null
  private __address?: string | null
  private __token?: string | null
  private __amount?: string | null
  private __comparison?: string | null

  /**
   * Creates a new Callback instance
   * 
   * @param params - Callback parameters
   * @param params.action - The action to execute (e.g., 'reject', 'meta', 'collect', 'buffer', 'remit', 'burn')
   * @param params.metaType - Optional metadata type for meta actions
   * @param params.metaId - Optional metadata ID for meta actions
   * @param params.meta - Optional metadata object for meta actions
   * @param params.address - Optional wallet address for transfer actions
   * @param params.token - Optional token slug for token operations
   * @param params.amount - Optional amount for value operations
   * @param params.comparison - Optional comparison operator
   * @throws RuleArgumentException if action is not provided
   */
  constructor({
    action,
    metaType = null,
    metaId = null,
    meta = null,
    address = null,
    token = null,
    amount = null,
    comparison = null
  }: CallbackParams) {
    if (!action) {
      throw new RuleArgumentException('Callback structure violated, missing mandatory "action" parameter.')
    }

    this.__action = action
    this.__metaType = metaType
    this.__metaId = metaId
    this.__address = address
    this.__token = token
    this.__amount = amount
    this.__comparison = comparison

    if (meta) {
      this.meta = meta
    }
  }

  /**
   * Sets the comparison operator
   */
  set comparison(comparison: string) {
    this.__comparison = comparison
  }

  /**
   * Sets the amount with validation
   * @throws CodeException if amount is not numeric
   */
  set amount(amount: string) {
    if (!isNumeric(amount)) {
      throw new CodeException('Parameter amount should be a string containing numbers')
    }
    this.__amount = amount
  }

  /**
   * Sets the token slug
   */
  set token(token: string) {
    this.__token = token
  }

  /**
   * Sets the wallet address
   */
  set address(address: string) {
    this.__address = address
  }

  /**
   * Sets the metadata, converting objects to Meta instances
   */
  set meta(meta: Meta | Record<string, unknown>) {
    this.__meta = meta instanceof Meta ? meta : Meta.toObject(meta)
  }

  /**
   * Sets the metadata type
   */
  set metaType(metaType: string) {
    this.__metaType = metaType
  }

  /**
   * Sets the metadata ID
   */
  set metaId(metaId: string) {
    this.__metaId = metaId
  }

  /**
   * Creates a Callback instance from a plain object
   * 
   * @param object - Object containing callback properties
   * @returns A new Callback instance
   */
  static toObject(object: CallbackParams): Callback {
    const callback = new Callback({
      action: object.action
    })

    if (object.metaType) {
      callback.metaType = object.metaType
    }

    if (object.metaId) {
      callback.metaId = object.metaId
    }

    if (object.meta) {
      callback.meta = object.meta
    }

    if (object.address) {
      callback.address = object.address
    }

    if (object.token) {
      callback.token = object.token
    }

    if (object.amount) {
      callback.amount = object.amount
    }

    if (object.comparison) {
      callback.comparison = object.comparison
    }

    return callback
  }

  /**
   * Converts this Callback to a plain JSON object
   * 
   * @returns Plain object representation of this callback
   */
  toJSON(): CallbackJSON {
    const meta: CallbackJSON = {
      action: this.__action
    }

    if (this.__metaType) {
      meta.metaType = this.__metaType
    }
    if (this.__metaId) {
      meta.metaId = this.__metaId
    }
    if (this.__meta) {
      meta.meta = this.__meta
    }
    if (this.__address) {
      meta.address = this.__address
    }
    if (this.__token) {
      meta.token = this.__token
    }
    if (this.__amount) {
      meta.amount = this.__amount
    }
    if (this.__comparison) {
      meta.comparison = this.__comparison
    }

    return meta
  }

  /**
   * Checks if this callback is a reject action
   */
  isReject(): boolean {
    return this._is('reject')
  }

  /**
   * Checks if this callback is a meta action with required properties
   */
  isMeta(): boolean {
    const prop = intersect(Object.keys(this.toJSON()), ['action', 'metaId', 'metaType', 'meta'])
    return prop.length === 4 && this._is('meta')
  }

  /**
   * Checks if this callback is a collect action with required properties
   */
  isCollect(): boolean {
    const prop = intersect(Object.keys(this.toJSON()), ['action', 'address', 'token', 'amount', 'comparison'])
    return prop.length === 5 && this._is('collect')
  }

  /**
   * Checks if this callback is a buffer action with required properties
   */
  isBuffer(): boolean {
    const prop = intersect(Object.keys(this.toJSON()), ['action', 'address', 'token', 'amount', 'comparison'])
    return prop.length === 5 && this._is('buffer')
  }

  /**
   * Checks if this callback is a remit action with required properties
   */
  isRemit(): boolean {
    const prop = intersect(Object.keys(this.toJSON()), ['action', 'token', 'amount'])
    return prop.length === 3 && this._is('remit')
  }

  /**
   * Checks if this callback is a burn action with required properties
   */
  isBurn(): boolean {
    const prop = intersect(Object.keys(this.toJSON()), ['action', 'token', 'amount', 'comparison'])
    return prop.length === 4 && this._is('burn')
  }

  /**
   * Helper method to check if action matches a specific type (case-insensitive)
   * 
   * @param type - The action type to check against
   * @returns True if the action matches the specified type
   */
  private _is(type: string): boolean {
    return this.__action.toLowerCase() === type.toLowerCase()
  }
}
