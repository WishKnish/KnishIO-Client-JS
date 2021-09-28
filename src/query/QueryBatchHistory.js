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
import Query from './Query';
import QueryBatch from './QueryBatch';
import Response from '../response/Response';
import gql from 'graphql-tag';

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryBatchHistory extends Query {

  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`query( $batchId: String ) {
      BatchHistory( batchId: $batchId ) {
        ${ QueryBatch.getFields() }
      }
    }`;
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
      json
    } );
    responseObject.dataKey = 'data.BatchHistory';
    return responseObject;
  }

}
