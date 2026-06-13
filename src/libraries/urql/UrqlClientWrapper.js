import {
  createClient,
  subscriptionExchange,
  cacheExchange,
  fetchExchange
} from '@urql/core'
import { createClient as createWSClient } from 'graphql-ws'
import { pipe, map, subscribe } from 'wonka'

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
    const { query, variables, context } = request
    // Forward ONLY urql's requestPolicy (e.g. 'network-only') so a long-lived
    // client does not serve stale cache-first reads. We deliberately do NOT
    // forward the whole context: urql REPLACES (not merges) the client-level
    // fetchOptions with any context.fetchOptions (createRequestOperation builds
    // the op context as {...baseOpts, ...opts}), which would drop the
    // X-Auth-Token header set in createUrqlClient and break authentication.
    const opts = (context && context.requestPolicy) ? { requestPolicy: context.requestPolicy } : undefined
    const result = await this.$__client.query(query, variables || {}, opts).toPromise()
    return this.formatResponse(result)
  }

  async mutate (request) {
    const { mutation, variables, context } = request
    // Forward requestPolicy only (see query() — never the whole context, which
    // would clobber the auth-bearing client-level fetchOptions).
    const opts = (context && context.requestPolicy) ? { requestPolicy: context.requestPolicy } : undefined
    const result = await this.$__client.mutation(mutation, variables || {}, opts).toPromise()
    return this.formatResponse(result)
  }

  subscribe (request, closure) {
    const { query, variables, operationName } = request

    // F-22 fix: wonka v3 — `subscribe` is a function applied via pipe, not a
    // method on the result. The pipe-with-subscribe expression returns the
    // subscription object directly (already shaped as `{ unsubscribe }`).
    const subscription = pipe(
      this.$__client.subscription(query, variables),
      map(result => {
        closure(this.formatResponse(result))
      }),
      subscribe(() => {})
    )

    // Store subscription for later cleanup
    this.$__subscriptionManager.set(operationName, subscription)

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
