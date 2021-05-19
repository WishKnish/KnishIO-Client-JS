import Query from '../query/Query';
import ResponseActiveSession from '../response/ResponseActiveSession';


export default class MutationActiveSession extends Query {

  /**
   * Class constructor
   *
   * @param knishIO
   */
  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = 'mutation( $bundleHash: String!, $metaType: String!, $metaId: String!, $json: String ) { ActiveSession( bundleHash: $bundleHash, metaType: $metaType, metaId: $metaId, json: $json ) @fields }';
    this.$__fields = {
      'bundle_hash': null,
      'meta_type': null,
      'meta_id': null,
      'json_data': null,
      'created_at': null,
      'updated_at': null
    };
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseActiveSession}
   */
  createResponse ( json ) {
    return new ResponseActiveSession( {
      query: this,
      json
    } );
  }
}
