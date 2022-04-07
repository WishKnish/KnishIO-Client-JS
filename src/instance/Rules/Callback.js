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
   * @param {Meta|null} meta
   */
  constructor ( {
    action,
    meta
  } ) {
    if ( meta ) {
      this.meta = meta;
    }

    if ( !action ) {
      throw new RuleArgumentException( 'Callback structure violated, missing mandatory "action" parameter.' );
    }

    this._action = action;
  }

  set meta ( meta ) {
    if ( ! ( meta instanceof Meta ) ) {
      throw new RuleArgumentException( 'Incorrect meta argument. The meta argument can only be an instance of the Meta class.' );
    }

    this._meta = meta;
  }

  toJSON () {
    const meta = {
      action: this._action
    };

    if ( this._meta ) {
      meta.meta = this._meta;
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
      meta: null
    } );

    if ( object.meta ) {
      callback.meta = new Meta( {
        metaType: object.meta.metaType,
        metaId: object.meta.metaId,
        isotope: object.meta.isotope,
        token: object.meta.token,
        amount: object.meta.amount
      } );
    }

    return callback;
  }
}
