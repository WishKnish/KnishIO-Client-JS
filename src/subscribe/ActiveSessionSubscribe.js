import Subscribe from './Subscribe';
import { gql } from '@apollo/client/core';


export default class ActiveSessionSubscribe extends Subscribe {
  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__subscribe = gql`
      subscription onActiveUser ( $metaType: String!, $metaId: String! ) {
        ActiveUser( metaType: $metaType, metaId: $metaId ) {
          bundleHash,
          metaType,
          metaId,
          jsonData,
          createdAt,
          updatedAt
        }
      }`;
  }
}
