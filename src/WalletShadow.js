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
import Base58 from './libraries/Base58';
import Decimal from "./libraries/Decimal";
import { generateBatchId, } from './libraries/crypto';

/**
 * Shadow Wallet class to represent wallets that contain tokens
 * but have no keys. This situation can happen when tokens are sent
 * to a wallet bundle that has no wallet for the given token slug.
 * Shadow wallets must be claimed to become a 'real' wallet via C isotope.
 */
export default class WalletShadow {

  /**
   * Class constructor
   *
   * @param {string} bundleHash
   * @param {string} token
   * @param {string|null} batchId
   * @param {string|null} characters
   */
  constructor ( bundleHash, token = null, batchId = null, characters = null ) {

    this.token = token || 'USER';
    this.balance = 0;
    this.molecules = {};
    this.bundle = bundleHash;
    this.batchId = batchId;
    this.characters = ( new Base58() )[ characters ] !== 'undefined' ? characters : null;

    // Empty values
    this.key = null;
    this.address = null;
    this.position = null;
    this.privkey = null;
    this.pubkey = null;
  }


  /**
   * Sets up a batch ID - either using the sender's, or a new one
   *
   * @param {Wallet} senderWallet
   * @param {number} transferAmount
   */
  initBatchId ( senderWallet, transferAmount ) {

    if ( senderWallet.batchId ) {

      // Set batchID to recipient wallet
      this.batchId = ( !this.batchId && Decimal.cmp( senderWallet.balance, transferAmount ) > 0 ) ?
        // Has a remainder value (source balance is bigger than a transfer value)
        generateBatchId() :
        // Has no remainder? use batch ID from the source wallet
        senderWallet.batchId;
    }
  }


}
