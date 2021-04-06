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

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryBatch extends Query {

  /**
   * Get cloned fields
   * @returns {any}
   */
  static getFields () {
    return {
      'batchId': null,
      'type': null,
      'status': null,
      'createdAt': null,
      'wallet': {
        'address': null,
        'bundleHash': null,
        'amount': null,
        'tokenSlug': null,
        'token': {
          name: null,
          amount: null,
        },
        'tokenUnits': {
          'id': null,
          'name': null,
          'metas': null,
        },
      },
      'fromWallet': {
        'address': null,
        'bundleHash': null,
        'amount': null
      },
      'toWallet': {
        'address': null,
        'bundleHash': null,
        'amount': null
      },
      'sourceTokenUnits': {
        'id': null,
        'name': null,
        'metas': null,
      },
      'transferTokenUnits': {
        'id': null,
        'name': null,
        'metas': null,
      },
      'metas': {
        'key': null,
        'value': null,
      },
    };
  }

  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );
    this.$__query = `query( $batchId: String ) { Batch( batchId: $batchId ) @fields }`;

    this.$__fields = QueryBatch.getFields();
    this.$__fields[ 'children' ] = QueryBatch.getFields();
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
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
