import Query from './Query';
import ResponseQueryUserActivity from '../response/ResponseQueryUserActivity';
import gql from 'graphql-tag';


export default class QueryUserActivity extends Query {
  /**
   * Class constructor
   *
   * @param httpClient
   */
  constructor ( httpClient ) {
    super( httpClient );

    this.$__query = gql`query UserActivity ($bundleHash:String, $metaType: String, $metaId: String, $countBy: [CountByUserActivity], $interval: span) {
        UserActivity (bundleHash: $bundleHash, metaType: $metaType, metaId: $metaId, countBy: $countBy, interval: $interval ) {
            createdAt,
            bundleHash,
            metaType,
            metaId,
            instances {
                bundleHash,
                metaType,
                metaId,
                jsonData,
                createdAt,
                updatedAt
            },
            instanceCount
        }
    }`;
  }

  /**
   * @param {object} json
   * @return {ResponseQueryUserActivity}
   */
  createResponse ( json ) {
    return new ResponseQueryUserActivity( {
      query: this,
      json
    } );
  }

}
