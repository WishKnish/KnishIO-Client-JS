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


export default class Callback {

  /**
   *
   * @param {string} action
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {Meta|null} meta
   */
  constructor ( {
    action,
    metaType= null,
    metaId = null,
    meta = null
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
  }

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
      action: object.action,
      metaType: null,
      metaId: null,
      meta: null
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

    return callback;
  }
}
