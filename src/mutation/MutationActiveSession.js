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
      'bundleHash': null,
      'metaType': null,
      'metaId': null,
      'jsonData': null,
      'createdAt': null,
      'updatedAt': null
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
