import Subscribe from './Subscribe'
import { gql } from '@urql/core'

export default class WalletStatusSubscribe extends Subscribe {
  constructor (graphQLClient) {
    super(graphQLClient)
    this.$__subscribe = gql`
      subscription onWalletStatus ( $bundle: String!, $token: String! ) {
        WalletStatus( bundle: $bundle, token: $token ) {
          bundle,
          token,
          admission,
          balance,
        }
      }
    `
  }
}
