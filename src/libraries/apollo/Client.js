import {
  ApolloClient,
  InMemoryCache,
  from,
  split
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import { createHttpLink } from '@apollo/client/link/http'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import fetch from 'isomorphic-fetch'
import { errorHandler } from './errorHandler'
import CipherLink from './CipherLink'

/**
 * Custom Apollo Client implementation
 * Extends ApolloClient with additional functionality
 */
class Client extends ApolloClient {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.soketi - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor ({ serverUri, soketi = null, encrypt = false }) {
    // Create HTTP link
    const httpLink = createHttpLink({
      uri: serverUri,
      fetch
    })

    // Initialize empty auth token
    const authToken = ''

    // Create auth link to add token to headers
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'X-Auth-Token': authToken
      }
    }))

    // Create error handling link
    const errorLink = onError(errorHandler)

    // Combine links
    let link = from([authLink, errorLink, httpLink])

    // Add encryption link if enabled
    let cipherLink
    if (encrypt) {
      cipherLink = new CipherLink()
      link = from([cipherLink, link])
    }

    // Add WebSocket link if configured
    let wsLink
    if (soketi && soketi.socketUri) {
      wsLink = new GraphQLWsLink(createClient({
        url: soketi.socketUri,
        connectionParams: () => ({
          authToken
        })
      }))

      // Split queries between WebSocket and HTTP
      link = split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        link
      )
    }

    // Call parent constructor with configured options
    super({
      link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all'
        }
      }
    })

    // Store configuration and links
    this.serverUri = serverUri
    this.soketi = soketi
    this.authToken = authToken
    this.pubkey = null
    this.wallet = null
    this.cipherLink = cipherLink
    this.wsLink = wsLink
  }

  /**
   * Set authentication data
   * @param {Object} authData - Authentication data
   * @param {string} authData.token - Auth token
   * @param {string} authData.pubkey - Public key
   * @param {Object} authData.wallet - Wallet object
   */
  setAuthData ({ token, pubkey, wallet }) {
    this.authToken = token
    this.pubkey = pubkey
    this.wallet = wallet

    if (this.cipherLink) {
      this.cipherLink.setWallet(wallet)
      this.cipherLink.setPubKey(pubkey)
    }

    if (this.wsLink) {
      this.wsLink.client.connectionParams = () => ({
        authToken: this.authToken
      })
    }
  }

  /**
   * Disconnect the WebSocket connection
   */
  socketDisconnect () {
    if (this.wsLink) {
      this.wsLink.client.dispose()
    }
  }

  // Getter methods
  getAuthToken () { return this.authToken }
  getPubKey () { return this.pubkey }
  getWallet () { return this.wallet }
  getServerUri () { return this.serverUri }
  getSocketUri () { return this.soketi ? this.soketi.socketUri : null }
}

export default Client
