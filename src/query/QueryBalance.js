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
import ResponseBalance from "../response/ResponseBalance";

/**
 * Query for getting the balance of a given wallet or token slug
 */
export default class QueryBalance extends Query {

  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );

    this.$__query = `query( $address: String, $bundleHash: String, $token: String, $position: String ) { Balance( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) @fields }`;
    this.$__fields = {
      'address': null,
      'bundleHash': null,
      'tokenSlug': null,
      'batchId': null,
      'position': null,
      'amount': null,
      'characters': null,
      'pubkey': null,
      'createdAt': null,
      'tokenUnits': {
        'id': null,
        'name': null,
        'metas': null,
      },
    };
  }

  /**
   * @param {object} json
   * @return {ResponseBalance}
   */
  createResponse ( json ) {
    return new ResponseBalance( {
      query: this,
      json,
    } );
  }
}
