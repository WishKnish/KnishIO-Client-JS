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
 * Response for Wallet List query
 */
export default class ResponseWalletList extends Response {

  /**
   * Class constructor
   *
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.Wallet';
    this.init();
  }

  /**
   * Returns a Knish.IO client Wallet class instance out of object data
   *
   * @param data
   * @returns {Wallet|WalletShadow}
   */
  toClientWallet ( data ) {
    let wallet;

    if ( data[ 'position' ] === null || typeof data[ 'position' ] === 'undefined' ) {
      wallet = new WalletShadow( data[ 'bundleHash' ], data[ 'tokenSlug' ], data[ 'batchId' ] );
    } else {
      wallet = new Wallet( null, data[ 'tokenSlug' ] );
      wallet.address = data[ 'address' ];
      wallet.position = data[ 'position' ];
      wallet.bundle = data[ 'bundleHash' ];
      wallet.batchId = data[ 'batchId' ];
      wallet.characters = data[ 'characters' ];
      wallet.pubkey = data[ 'pubkey' ];
    }

    wallet.createdAt = data[ 'createdAt' ];
    wallet.balance = data[ 'amount' ];

    return wallet;
  }

  /**
   * Returns response payload
   *
   * @returns {null|[]}
   */
  payload () {
    const list = this.data();

    if ( !list ) {
      return null;
    }

    const wallets = [];

    for ( let item of list ) {
      wallets.push( this.toClientWallet( item ) );
    }

    return wallets;
  }
}
