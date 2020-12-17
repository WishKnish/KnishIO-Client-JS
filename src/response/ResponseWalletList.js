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
   * @returns {Wallet}
   */
  static toClientWallet ( data, secret = null ) {
    let wallet;

    if ( data.position === null || typeof data.position === 'undefined' ) {
      wallet = Wallet.create(
        data.bundleHash,
        data.tokenSlug,
        data.batchId,
        data.characters
      );
    } else {
      wallet = new Wallet(
        secret,
        data.tokenSlug,
        data.position,
        data.batchId,
        data.characters
      );
      wallet.address = data.address;
      wallet.bundle = data.bundleHash;
    }

    if ( data.token ) {
      wallet.tokenName = data.token.name;
      wallet.tokenSupply = data.token.amount;
    }

    wallet.balance = Number( data.amount );
    wallet.pubkey = data.pubkey;
    wallet.createdAt = data.createdAt;

    return wallet;
  }

  /**
   * Returns a list of Wallet class instances
   *
   * @param secret
   * @returns {null|[]}
   */
  getWallets ( secret ) {

    const list = this.data();

    if ( !list ) {
      return null;
    }

    const wallets = [];

    for ( let item of list ) {
      wallets.push( ResponseWalletList.toClientWallet( item, secret ) );
    }

    return wallets;
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
      wallets.push( ResponseWalletList.toClientWallet( item ) );
    }

    return wallets;
  }
}
