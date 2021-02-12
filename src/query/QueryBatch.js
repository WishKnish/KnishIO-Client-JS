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
import Response from "../response/Response";
import ResponseMetaType from "../response/ResponseMetaBatch";

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryBatch extends Query {

  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );
    this.$__query = `query( $batchId: String ) { Batch( batchId: $batchId ) @fields }`;
    this.$__fields = {
      'batchId': null,
      'type': null,
      'createdAt': null,
      'wallet': {
        'address': null,
        'bundleHash': null,
        'amount': null
      },
      'metas': {
        'key': null,
        'value': null,
      },
    };
  }

  /**
   * Returns a Response object
   *
   * @param {string} response
   * @return {ResponseMetaType}
   */
  createResponse ( json ) {
    let responseObject = new Response( {
      query: this,
      json,
    } );
    responseObject.dataKey = 'data.Batch';
    return responseObject;
  }

}
