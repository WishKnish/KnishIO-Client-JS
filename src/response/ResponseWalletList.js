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
import Response from './Response';
import Wallet from '../Wallet';

/**
 * Response for Wallet List query
 */
export default class ResponseWalletList extends Response {

  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ( {
    query,
    json
  } ) {
    super( {
      query,
      json
    } );
    this.dataKey = 'data.Wallet';
    this.init();
  }

  /**
   * Returns a Knish.IO client Wallet class instance out of object data
   *
   * @param {object} data
   * @param {string|null} secret
   * @returns {Wallet}
   */
  static toClientWallet ( {
    data,
    secret = null
  } ) {
    let wallet;

    if ( data.position === null || typeof data.position === 'undefined' ) {
      wallet = Wallet.create( {
        secretOrBundle: data.bundleHash,
        token: data.tokenSlug,
        batchId: data.batchId,
        characters: data.characters
      } );
    } else {
      wallet = new Wallet( {
        secret,
        token: data.tokenSlug,
        position: data.position,
        batchId: data.batchId,
        characters: data.characters
      } );
      wallet.address = data.address;
      wallet.bundle = data.bundleHash;
    }

    if ( data.token ) {
      wallet.tokenName = data.token.name;
      wallet.tokenSupply = data.token.amount;
    }

    wallet.tokenUnits = data.tokenUnits;
    wallet.molecules = data.molecules;
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
  getWallets ( secret = null ) {

    const list = this.data();

    if ( !list ) {
      return null;
    }

    const wallets = [];

    for ( let data of list ) {
      wallets.push( ResponseWalletList.toClientWallet( {
        data,
        secret
      } ) );
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
      wallets.push( ResponseWalletList.toClientWallet( {
        data: item
      } ) );
    }

    return wallets;
  }
}
