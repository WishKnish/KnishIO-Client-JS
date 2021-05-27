import Query from './Query';
import ResponseQueryActiveSession from '../response/ResponseQueryActiveSession';


export default class QueryActiveSession extends Query {
  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );

    this.$__query = 'query ActiveUserQuery ($metaType: String!, $metaId: String!) {ActiveUser (metaType: $metaType, metaId: $metaId) @fields }';
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
   * @param {object} json
   * @return {ResponseQueryActiveSession}
   */
  createResponse ( json ) {
    return new ResponseQueryActiveSession( {
      query: this,
      json
    } );
  }
}