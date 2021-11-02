import Subscribe from './Subscribe';
import { gql } from '@apollo/client/core';


export default class WalletStatusSubscribe extends Subscribe {
  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__subscribe = gql`
      subscription onWalletStatus ( $bundle: String!, $token: String! ) {
        WalletStatus( bundle: $bundle, token: $token ) {
          bundle,
          token,
          admission,
          balance,
        }
      }
    `;
  }
}
