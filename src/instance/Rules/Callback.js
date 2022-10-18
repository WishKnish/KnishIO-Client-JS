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

import Meta from './Meta';
import RuleArgumentException from './exception/RuleArgumentException';
import { isNumeric } from '../../libraries/strings';
import { CodeException } from '../../exception';
import { intersect } from '../../libraries/array';


export default class Callback {

  /**
   *
   * @param {string} action
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {Meta|null} meta
   * @param {string|null} address
   * @param {string|null} token
   * @param {string|null} amount
   * @param {string|null} comparison
   */
  constructor ( {
    action,
    metaType= null,
    metaId = null,
    meta = null,
    address = null,
    token = null,
    amount = null,
    comparison = null
  } ) {
    if ( meta ) {
      this.meta = meta;
    }

    if ( !action ) {
      throw new RuleArgumentException( 'Callback structure violated, missing mandatory "action" parameter.' );
    }

    this.__metaId = metaId;
    this.__metaType = metaType;
    this.__action = action;
    this.__address = address;
    this.__token = token;
    this.__amount = amount;
    this.__comparison = comparison;
  }

  /**
   *
   * @param {string} comparison
   */
  set comparison ( comparison ) {
    this.__comparison = comparison;
  }

  /**
   *
   * @param {string} amount
   */
  set amount ( amount ) {
    if ( !isNumeric( amount ) ) {
      throw new CodeException('Parameter amount should be a string containing numbers');
    }
    this.__amount = amount;
  }

  /**
   *
   * @param {string} token
   */
  set token ( token ) {
    this.__token = token;
  }

  /**
   *
   * @param {string} address
   */
  set address ( address ) {
    this.__address = address;
  }

  /**
   *
   * @param {Meta|object} meta
   */
  set meta ( meta ) {
    this.__meta = meta instanceof Meta ? meta : Meta.toObject( meta );
  }

  /**
   *
   * @param {string} metaType
   */
  set metaType ( metaType ) {
    this.__metaType = metaType;
  }

  /**
   *
   * @param {string} metaId
   */
  set metaId ( metaId ) {
    this.__metaId = metaId;
  }


  /**
   *
   * @return {{action: string}}
   */
  toJSON () {
    const meta = {
      action: this.__action
    };

    if ( this.__metaType ) {
      meta.metaType = this.__metaType;
    }
    if ( this.__metaId ) {
      meta.metaId = this.__metaId;
    }
    if ( this.__meta ) {
      meta.meta = this.__meta;
    }

    if ( this.__address ) {
      meta.address = this.__address;
    }

    if ( this.__token ) {
      meta.token = this.__token;
    }

    if ( this.__amount ) {
      meta.amount = this.__amount;
    }

    if ( this.__comparison ) {
      meta.comparison = this.__comparison;
    }

    return meta;
  }

  /**
   *
   * @param {object} object
   *
   * @return Callback
   */
  static toObject ( object ) {
    const callback = new Callback( {
      action: object.action
    } );

    if ( object.metaType ) {
      callback.metaType = object.metaType;
    }

    if ( object.metaId ) {
      callback.metaId = object.metaId;
    }

    if ( object.meta ) {
      callback.meta = object.meta;
    }

    if ( object.address ) {
      callback.address = object.address;
    }

    if ( object.token ) {
      callback.token = object.token;
    }

    if ( object.amount ) {
      callback.amount = object.amount;
    }

    if ( object.comparison ) {
      callback.comparison = object.comparison;
    }

    return callback;
  }

  /**
   * @return {boolean}
   */
  isReject () {
    return this._is( 'reject' );
  }

  /**
   * @return {boolean}
   */
  isMeta () {
    const prop = intersect( Object.keys( this.toJSON() ), ['action', 'metaId', 'metaType', 'meta'] );

    return prop.length === 4 && this._is( 'meta' );
  }

  /**
   * @return {boolean}
   */
  isCollect () {
    const prop = intersect( Object.keys( this.toJSON() ), ['action', 'address', 'token', 'amount', 'comparison'] );

    return prop.length === 5 && this._is( 'collect' );
  }

  /**
   * @return {boolean}
   */
  isBuffer () {
    const prop = intersect( Object.keys( this.toJSON() ), ['action', 'address', 'token', 'amount', 'comparison'] );

    return prop.length === 5 && this._is( 'buffer' );
  }

  /**
   * @return {boolean}
   */
  isRemit () {
    const prop = intersect( Object.keys( this.toJSON() ), ['action', 'token', 'amount'] );

    return prop.length === 3 && this._is( 'remit' );
  }

  /**
   * @return {boolean}
   */
  isBurn () {
    const prop = intersect( Object.keys( this.toJSON() ), ['action', 'token', 'amount', 'comparison'] );

    return prop.length === 4 && this._is( 'burn' );
  }

  /**
   * @param {string} type
   *
   * @return {boolean}
   * @private
   */
  _is( type ) {
    return this.__action.toLowerCase() === type.toLowerCase();
  }
}
