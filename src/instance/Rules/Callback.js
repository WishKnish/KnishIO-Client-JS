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
  // server to execute signed molecule with given atom meta; other options: 'reject' (reject matches);
  // 'accept' (reject non-matches), 'burn' (require appropriate burning of tokens in same molecule)
  #action
  // supporting metadata for executing callback goes here
  #meta = null

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

    this.#action = action;
  }

  set meta ( meta ) {
    if ( ! ( meta instanceof Meta ) ) {
      throw new RuleArgumentException( 'Incorrect meta argument. The meta argument can only be an instance of the Meta class.' );
    }

    this.#meta = meta;
  }

  toJSON () {
    const meta = {
      action: this.#action
    };

    if ( this.#meta ) {
      meta.meta = this.#meta;
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
