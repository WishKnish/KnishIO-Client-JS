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
import ResponseMetaType from "../response/ResponseMetaType";

/**
 * Query for retrieving Meta Asset information
 */
export default class QueryMetaType extends Query {

  /**
   * Class constructor
   *
   * @param knishIO
   */
  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String ) { MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count ) @fields }`;
    this.$__fields = {
      'metaType': null,
      'instances': {
        'metaType': null,
        'metaId': null,
        'createdAt': null,
        'metas': {
          'molecularHash': null,
          'position': null,
          'metaType': null,
          'metaId': null,
          'key': null,
          'value': null,
          'createdAt': null,
        },
      },
      'metas': {
        'molecularHash': null,
        'position': null,
        'metaType': null,
        'metaId': null,
        'key': null,
        'value': null,
        'createdAt': null,
      },
      'createdAt': null,
    };
  }

  /**
   * Returns a Response object
   *
   * @param {string} response
   * @return {ResponseMetaType}
   */
  createResponse ( response ) {
    return new ResponseMetaType( this, response );
  }

  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|array|null} key
   * @param {string|array|null} value
   * @returns {{}}
   */
  static createVariables ( metaType = null, metaId = null, key = null, value = null ) {

    const variables = {};

    if ( metaType ) {
      variables[ typeof metaType === "string" ? 'metaType' : 'metaTypes' ] = metaType;
    }

    if ( metaId ) {
      variables[ typeof metaId === "string" ? 'metaId' : 'metaIds' ] = metaId;
    }

    if ( key ) {
      variables[ typeof key === "string" ? 'key' : 'keys' ] = key;
    }

    if ( value ) {
      variables[ typeof value === "string" ? 'value' : 'values' ] = value;
    }

    return variables;

  }
}
