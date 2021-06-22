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
import gql from 'graphql-tag';
import ResponseBalance from '../response/ResponseBalance';

/**
 * Query for getting the balance of a given wallet or token slug
 */
export default class QueryBalance extends Query {
  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`query( $address: String, $bundleHash: String, $token: String, $position: String ) {
        Balance( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) {
            address,
            bundleHash,
            tokenSlug,
            batchId,
            position,
            amount,
            characters,
            pubkey,
            createdAt,
            tokenUnits {
                id,
                name,
                metas
            }
        }
    }`;
  }

  /**
   * @param {object} json
   * @return {ResponseBalance}
   */
  createResponse ( json ) {
    return new ResponseBalance( {
      query: this,
      json
    } );
  }
}
