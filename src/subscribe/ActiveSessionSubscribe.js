import Subscribe from "./Subscribe";
import gql from "graphql-tag";


export default class ActiveSessionSubscribe extends Subscribe {
  constructor( apolloClient ) {
    super( apolloClient );
    this.$__subscribe = gql`
      subscription onActiveWallet ( $metaType: String!, $metaId: String! ) {
        ActiveUser( metaType: $metaType, metaId: $metaId ) {
            bundle_hash,
            meta_type,
            meta_id,
            json_data,
            created_at,
            updated_at
        }
      }`;
  }
}