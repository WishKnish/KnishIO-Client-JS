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
import Response from '@wishknish/knishio-client-js/src/response/Response';

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryMetaInstance extends Query {

  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );

    this.$__query = `query( $metaType: String!, $metaIds: [ String! ], $keys: [ String! ], $values: [ String! ], $filter: [ MetaFilter! ], $countBy: String, $queryArgs: QueryArgs, $latestMetas: Boolean) { MetaInstance( metaType: $metaType, metaIds: $metaIds, keys: $keys, values: $values, filter: $filter, countBy: $countBy, queryArgs: $queryArgs, latestMetas: $latestMetas ) @fields }`;
    this.$__fields = {
      'nodes': {
        'metaType': null,
        'metaId': null,
        'createdAt': null,
        'metas(latest:$latest)': {
          'molecularHash': null,
          'position': null,
          'key': null,
          'value': null,
          'createdAt': null,
        },
      },
      'counts': {
        'key': null,
        'value': null,
      },
      'paginator': {
        'offset': null,
        'total': null,
      }
    };
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaType}
   */
  createResponse ( json ) {
    return new Response( {
      query: this,
      json,
      dataKey: 'MetaInstance',
    } );
  }


}
