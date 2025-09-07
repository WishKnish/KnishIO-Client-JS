import {
  createClient,
  subscriptionExchange,
  cacheExchange,
  fetchExchange
} from '@urql/core'
import { createClient as createWSClient } from 'graphql-ws'
import { pipe, map } from 'wonka'

class UrqlClientWrapper {
  constructor ({ serverUri, socket = null, encrypt = false }) {
    this.$__client = this.createUrqlClient({ serverUri, socket, encrypt })
    this.$__authToken = ''
    this.$__pubkey = null
    this.$__wallet = null
    this.serverUri = serverUri
    this.soketi = socket
    this.cipherLink = !!encrypt
    this.$__subscriptionManager = new Map()
  }

  createUrqlClient ({ serverUri, socket, encrypt }) {
    const exchanges = [cacheExchange, fetchExchange]

    // Add subscription support if socket is configured
    if (socket && socket.socketUri) {
      const wsClient = createWSClient({
        url: socket.socketUri,
        connectionParams: () => ({
          authToken: this.$__authToken
        })
      })

      exchanges.push(subscriptionExchange({
        forwardSubscription: operation => ({
          subscribe: sink => {
            const disposable = wsClient.subscribe(operation, sink)
            return { unsubscribe: disposable }
          }
        })
      }))
    }

    return createClient({
      url: serverUri,
      exchanges,
      fetchOptions: () => ({
        headers: {
          'X-Auth-Token': this.$__authToken
        },
        // Add 60 second timeout for debugging
        signal: AbortSignal.timeout(60000)
      })
    })
  }

  setAuthData ({ token, pubkey, wallet }) {
    this.$__authToken = token
    this.$__pubkey = pubkey
    this.$__wallet = wallet

    // Recreate client with new auth data
    this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    })
  }

  async query (request) {
    const { query, variables } = request
    const result = await this.$__client.query(query, variables).toPromise()
    return this.formatResponse(result)
  }

  async mutate (request) {
    const { mutation, variables } = request
    const result = await this.$__client.mutation(mutation, variables).toPromise()
    return this.formatResponse(result)
  }

  subscribe (request, closure) {
    const { query, variables, operationName } = request

    const { unsubscribe } = pipe(
      this.$__client.subscription(query, variables),
      map(result => {
        closure(this.formatResponse(result))
      })
    ).subscribe(() => {})

    // Store subscription for later cleanup
    this.$__subscriptionManager.set(operationName, { unsubscribe })

    return {
      unsubscribe: () => this.unsubscribe(operationName)
    }
  }

  formatResponse (result) {
    // Match old Apollo response format
    return {
      data: result.data,
      errors: result.error ? [result.error] : undefined
    }
  }

  socketDisconnect () {
    if (this.soketi) {
      // Unsubscribe from all active subscriptions
      this.unsubscribeAll()
    }
  }

  unsubscribe (operationName) {
    const subscription = this.$__subscriptionManager.get(operationName)
    if (subscription) {
      subscription.unsubscribe()
      this.$__subscriptionManager.delete(operationName)
    }
  }

  unsubscribeAll () {
    this.$__subscriptionManager.forEach((subscription, operationName) => {
      this.unsubscribe(operationName)
    })
  }

  unsubscribeFromChannel (operationName) {
    this.unsubscribe(operationName)
  }

  setEncryption (encrypt = false) {
    this.cipherLink = encrypt
    this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt
    })
  }

  getAuthToken () { return this.$__authToken }
  getPubKey () { return this.$__pubkey }
  getWallet () { return this.$__wallet }
  getServerUri () { return this.serverUri }
  getSocketUri () { return this.soketi ? this.soketi.socketUri : null }
  getUri () { return this.serverUri }

  setUri (uri) {
    this.serverUri = uri
    this.$__client = this.createUrqlClient({
      serverUri: uri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    })
  }

  setSocketUri ({ socketUri, appKey }) {
    this.soketi = { socketUri, appKey }
    this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    })
  }
}

export default UrqlClientWrapper
