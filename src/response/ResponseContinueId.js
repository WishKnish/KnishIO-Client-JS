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
export default class ResponseContinueId extends Response {

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

    const continueId = this.data();

    if ( continueId ) {
      wallet = new Wallet( null, continueId[ 'tokenSlug' ] );
      wallet.address = continueId[ 'address' ];
      wallet.position = continueId[ 'position' ];
      wallet.bundle = continueId[ 'bundleHash' ];
      wallet.batchId = continueId[ 'batchId' ];
      wallet.characters = continueId[ 'characters' ];
      wallet.pubkey = continueId[ 'pubkey' ];
      wallet.balance = continueId[ 'amount' ] * 1.0;
    }

    return wallet;
  }
}
