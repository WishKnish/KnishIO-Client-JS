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
import Query from "./Query";
import ResponseWalletList from "../response/ResponseWalletList";

/**
 * Query for getting a list of Wallets
 */
export default class QueryWalletList extends Query {

  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );
    this.$__query = `query( $address: String, $bundleHash: String, $token: String, $position: String, $unspent: Boolean ) { Wallet( address: $address, bundleHash: $bundleHash, token: $token, position: $position, unspent: $unspent ) @fields }`;
    this.$__fields = {
      'address': null,
      'bundleHash': null,
      'token': {
        name: null,
        amount: null,
      },
      'molecules': {
        molecularHash: null,
        createdAt: null,
      },
      'tokenSlug': null,
      'batchId': null,
      'position': null,
      'amount': null,
      'characters': null,
      'pubkey': null,
      'createdAt': null,
    };
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseWalletList}
   */
  createResponse ( json ) {
    return new ResponseWalletList( {
      query: this,
      json,
    } );
  }
}
