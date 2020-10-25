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
 * Response for ContinuID query
 */
export default class ResponseContinuId extends Response {

  /**
   * Class constructor
   *
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.ContinuId';
    this.init();
  }

  /**
   * Returns the ContinuID wallet
   *
   * @return {Wallet|null}
   */
  payload () {
    let wallet = null;

    const continuId = this.data();

    if ( continuId ) {
      wallet = new Wallet( null, continuId[ 'tokenSlug' ] );
      wallet.address = continuId[ 'address' ];
      wallet.position = continuId[ 'position' ];
      wallet.bundle = continuId[ 'bundleHash' ];
      wallet.batchId = continuId[ 'batchId' ];
      wallet.characters = continuId[ 'characters' ];
      wallet.pubkey = continuId[ 'pubkey' ];
      wallet.balance = continuId[ 'amount' ] * 1.0;
    }

    return wallet;
  }
}
