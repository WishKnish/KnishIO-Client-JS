import Query from './Query';
import ResponseQueryActiveSession from '../response/ResponseQueryActiveSession';
import gql from 'graphql-tag';


export default class QueryActiveSession extends Query {
  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );

    this.$__query = gql`query ActiveUserQuery ($bundleHash:String, $metaType: String, $metaId: String) {
        ActiveUser (bundleHash: $bundleHash, metaType: $metaType, metaId: $metaId) {
            bundleHash,
            metaType,
            metaId,
            jsonData,
            createdAt,
            updatedAt
        }
    }`;
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
