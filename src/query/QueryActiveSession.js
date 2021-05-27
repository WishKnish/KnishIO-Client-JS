import Query from './Query';
import ResponseQueryActiveSession from '../response/ResponseQueryActiveSession';
import gql from "graphql-tag";


export default class QueryActiveSession extends Query {
  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );

    this.$__query = gql`query ActiveUserQuery ($metaType: String!, $metaId: String!) {
        ActiveUser (metaType: $metaType, metaId: $metaId) {
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
