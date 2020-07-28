import Query from "./Query";
import ResponseMetaType from "../response/ResponseMetaType";


export default class QueryLinkIdentifierMutation extends Query {

  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `query( $metaType: String, $metaTypes: [ String! ], $metaId: String, $metaIds: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $count: String, $newLogic: Boolean ) { MetaType( metaType: $metaType, metaTypes: $metaTypes, metaId: $metaId, metaIds: $metaIds, key: $key, keys: $keys, value: $value, values: $values, count: $count, newLogic: $newLogic ) @fields }`;
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
        'atoms': {
          'molecularHash': null,
          'position': null,
          'isotope': null,
          'walletAddress': null,
          'tokenSlug': null,
          'batchId': null,
          'value': null,
          'index': null,
          'metaType': null,
          'metaId': null,
          'otsFragment': null,
          'createdAt': null,
        },
        'molecules': {
          'molecularHash': null,
          'cellSlug': null,
          'bundleHash': null,
          'status': null,
          'height': null,
          'createdAt': null,
          'receivedAt': null,
          'processedAt': null,
          'broadcastedAt': null,
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
   *
   * @param {string} response
   * @return {ResponseMetaType}
   */
  createResponse ( response ) {
    return new ResponseMetaType( this, response );
  }

}