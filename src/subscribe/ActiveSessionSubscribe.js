import Subscribe from "./Subscribe";
import gql from "graphql-tag";


export default class ActiveSessionSubscribe extends Subscribe {
  constructor( apolloClient ) {
    super( apolloClient );
    this.$__subscribe = gql`
      subscription onActiveWallet ( $metaType: String!, $metaId: String! ) {
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