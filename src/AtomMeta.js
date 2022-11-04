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

import {
  diff
} from './libraries/array';
import PolicyMeta from './PolicyMeta';

const USE_META_CONTEXT = false;
const DEFAULT_META_CONTEXT = 'https://www.schema.org';

/**
 *
 */
export default class AtomMeta {

  /**
   *
   * @param meta
   */
  constructor( meta = {} ) {
    this.meta = meta;
  }

  /**
   *
   * @param meta
   * @returns {AtomMeta}
   */
  merge( meta ) {
    this.meta = Object.assign( this.meta, meta );
    return this;
  }

  /**
   *
   * @param context
   * @returns {AtomMeta}
   */
  addContext( context = null ) {

    // Add context key if it is enabled
    if ( USE_META_CONTEXT ) {
      this.merge( { context: context || DEFAULT_META_CONTEXT } );
    }

    return this;
  }

  /**
   *
   * @param wallet
   * @returns {AtomMeta}
   */
  addWallet( wallet ) {
    let walletMeta = {
      pubkey: wallet.pubkey,
      characters: wallet.characters
    };

    // Add token units meta key
    if ( wallet.tokenUnits && wallet.tokenUnits.length ) {
      walletMeta.tokenUnits = JSON.stringify( wallet.getTokenUnitsData() );
    }
    // Add trade rates meta key
    if ( wallet.tradeRates && wallet.tradeRates.length ) {
      walletMeta.tradeRates = JSON.stringify( wallet.tradeRates );
    }

    // Merge all wallet's metas
    this.merge( walletMeta );
    return this;
  }


  /**
   *
   * @param policy
   * @todo move logic to the separated class
   * @returns {AtomMeta}
   */
  addPolicy( policy ) {

    // Policy does not passed: do nothing
    if ( !policy ) {
      return this;
    }

    // Policy meta intialization
    let policyMeta = new PolicyMeta( policy, Object.keys( this.meta ) );

    this.merge( {
      policy: policyMeta.toJson()
    } );

    return this;
  }

  /**
   *
   * @param wallet
   * @returns {AtomMeta}
   */
  addSigningWallet( wallet ) {
    this.merge( {
      signingWallet: JSON.stringify( {
        address: wallet.address,
        position: wallet.position,
        pubkey: wallet.pubkey,
        characters: wallet.characters
      } )
    } );
    return this;
  }


  /**
   *
   * @returns {*}
   */
  get() {
    return this.meta;
  }

}
