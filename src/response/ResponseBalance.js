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
import Response from "./Response";
import WalletShadow from "../WalletShadow";
import Wallet from "../Wallet";

/**
 * Response for balance query
 */
export default class ResponseBalance extends Response {

  /**
   * Class constructor
   *
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.Balance';
    this.init();
  }

  /**
   * Returns a wallet with balance
   *
   * @returns {null|Wallet|WalletShadow}
   */
  payload () {
    const balance = this.data();

    if ( !balance ) {
      return null;
    }

    let wallet = null;

    // Shadow wallet
    if ( balance[ 'position' ] === null ) {
      wallet = new WalletShadow( balance[ 'bundleHash' ], balance[ 'tokenSlug' ], balance[ 'batchId' ] );
    }
    // Regular wallet
    else {
      wallet = new Wallet( null, balance[ 'tokenSlug' ] );
      wallet.address = balance[ 'address' ];
      wallet.position = balance[ 'position' ];
      wallet.bundle = balance[ 'bundleHash' ];
      wallet.batchId = balance[ 'batchId' ];
      wallet.characters = balance[ 'characters' ];
      wallet.pubkey = balance[ 'pubkey' ];
    }

    wallet.balance = balance[ 'amount' ];

    return wallet;
  }
}
