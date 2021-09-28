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
import ResponseWalletBundle from '../response/ResponseWalletBundle';
import gql from 'graphql-tag';

/**
 * Query for retrieving information about Wallet Bundles
 */
export default class QueryWalletBundle extends Query {

  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`query( $bundleHash: String, $bundleHashes: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $keys_values: [ MetaInput ], $latest: Boolean, $limit: Int, $order: String ) {
      WalletBundle( bundleHash: $bundleHash, bundleHashes: $bundleHashes, key: $key, keys: $keys, value: $value, values: $values, keys_values: $keys_values, latest: $latest, limit: $limit, order: $order ) {
        bundleHash,
        metas {
          molecularHash,
          position,
          key,
          value,
          createdAt
        },
        createdAt
      }
    }`;
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseWalletBundle}
   */
  createResponse ( json ) {
    return new ResponseWalletBundle( {
      query: this,
      json
    } );
  }

  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} bundleHash
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @param {boolean|null} latest
   * @return {{}}
   */
  static createVariables ( {
    bundleHash = null,
    key = null,
    value = null,
    latest = true
  } ) {

    const variables = {
      latest: latest
    };

    if ( bundleHash ) {
      variables[ typeof bundleHash === 'string' ? 'bundleHash' : 'bundleHashes' ] = bundleHash;
    }

    if ( key ) {
      variables[ typeof key === 'string' ? 'key' : 'keys' ] = key;
    }

    if ( value ) {
      variables[ typeof value === 'string' ? 'value' : 'values' ] = value;
    }

    return variables;
  }

}
