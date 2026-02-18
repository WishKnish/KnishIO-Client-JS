import Subscribe from './Subscribe.js'
import { gql } from '@urql/core'

export default class ActiveSessionSubscribe extends Subscribe {
  constructor (graphQLClient) {
    super(graphQLClient)
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
      }`
  }
}
