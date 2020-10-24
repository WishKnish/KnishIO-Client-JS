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
import ResponseContinueId from "../response/ResponseContinueId";

/**
 * Queries the node for the next wallet to sign with for ContinuID
 */
export default class QueryContinueId extends Query {

  /**
   * Class constructor
   *
   * @param knishIO
   */
  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `query ($bundle: String!) { ContinuId(bundle: $bundle) @fields }`;
    this.$__fields = {
      'address': null,
      'bundleHash': null,
      'tokenSlug': null,
      'position': null,
      'batchId': null,
      'characters': null,
      'pubkey': null,
      'amount': null,
      'createdAt': null,
    };
  }

  /**
   * @param response
   * @returns {ResponseContinueId}
   */
  createResponse ( response ) {
    return new ResponseContinueId( this, response );
  }
}
