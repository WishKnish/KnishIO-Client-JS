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
  deepCloning,
  diff
} from "../../../../../knishio-client-js/src/libraries/array";
import Meta from './Meta';

/**
 * Atom class used to form microtransactions within a Molecule
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
  addContext( context ) {
    this.merge( { context: context } );
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
   * @returns {AtomMeta}
   */
  addPolicy( policy ) {
    let policyMeta = {};
    if ( policy ) {
      for ( const [ policyKey, value ] of Object.entries( policy || {} ) ) {

        if ( value !== null && [ 'read', 'write' ].includes( policyKey ) ) {
          policyMeta[ policyKey ] = {};

          for ( const [ key, content ] of Object.entries( value ) ) {
            policyMeta[ policyKey ][ key ] = content;
          }
        }
      }
    }

    this.merge( {
      policy: JSON.stringify( Meta.__defaultPolicy( policyMeta, this.meta ) );
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
        characters: wallet.characters,
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
