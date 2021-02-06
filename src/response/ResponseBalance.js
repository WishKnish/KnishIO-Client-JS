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
import ResponseWalletList from "./ResponseWalletList";

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
  constructor ( {
    query,
    json,
  } ) {
    super( {
      query,
      json,
    } );
    this.dataKey = 'data.Balance';
    this.init();
  }

  /**
   * Returns a wallet with balance
   *
   * @returns {null|Wallet}
   */
  payload () {
    const walletData = this.data();

    if ( !walletData || !walletData[ 'bundleHash' ] || !walletData[ 'tokenSlug' ] ) {
      return null;
    }

    return ResponseWalletList.toClientWallet( walletData );
  }
}
