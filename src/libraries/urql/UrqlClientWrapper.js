import {
  createClient,
  subscriptionExchange,
  cacheExchange,
  fetchExchange
} from '@urql/core'
import { createClient as createWSClient } from 'graphql-ws'
import { pipe, map, subscribe } from 'wonka'

// PQ-transport Phase E (cycle 163): the post-quantum CipherHash wrapper query. The validator
// intercepts the `CipherHash` op, decrypts `$Hash`, executes the inner request, and returns the
// encrypted response in `{ data: { CipherHash: { hash } } }`.
const CIPHER_HASH_QUERY = 'query ( $Hash: String! ) { CipherHash ( Hash: $Hash ) { hash } }'

/**
 * Light parse of a GraphQL request body's operation type + root field name, for the CipherHash
 * bypass decision (no full GraphQL parse needed). Operation type = the first query/mutation/
 * subscription keyword (default 'query' for an anonymous `{ ... }`); root field = the first
 * identifier inside the top-level selection set.
 */
function parseOperation (query) {
  const typeMatch = (query || '').match(/\b(query|mutation|subscription)\b/i)
  const type = typeMatch ? typeMatch[1].toLowerCase() : 'query'
  const braceIdx = (query || '').indexOf('{')
  const nameMatch = braceIdx >= 0 ? query.slice(braceIdx + 1).match(/[A-Za-z_][A-Za-z0-9_]*/) : null
  return { type, name: nameMatch ? nameMatch[0] : '' }
}

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
      // PQ-transport Phase E: when encryption is on, route fetch through the CipherHash
      // wrapper (encrypt the request body to the validator's ML-KEM pubkey, decrypt the
      // response). Undefined → urql uses the global fetch (plaintext).
      ...(encrypt ? { fetch: (input, init) => this.cipherFetch(input, init) } : {}),
      fetchOptions: () => ({
        headers: {
          'X-Auth-Token': this.$__authToken
        },
        // Add 60 second timeout for debugging
        signal: AbortSignal.timeout(60000)
      })
    })
  }

  /**
   * Whether an outgoing GraphQL request body should be wrapped in CipherHash. Bypass (plaintext):
   * introspection `__schema`, `ContinuId`, the `AccessToken` mutation, and the U-isotope
   * `ProposeMolecule` (auth bootstrap — the key exchange itself can't be encrypted). Mirrors the
   * Kotlin/validator bypass set.
   */
  shouldEncrypt (body) {
    let parsed
    try {
      parsed = JSON.parse(body)
    } catch (e) {
      return false
    }
    const { type, name } = parseOperation(parsed.query)
    if (type === 'query' && (name === '__schema' || name === 'ContinuId')) return false
    if (type === 'mutation' && name === 'AccessToken') return false
    if (type === 'mutation' && name === 'ProposeMolecule') {
      const isotope = parsed.variables && parsed.variables.molecule &&
        parsed.variables.molecule.atoms && parsed.variables.molecule.atoms[0] &&
        parsed.variables.molecule.atoms[0].isotope
      if (isotope === 'U') return false
    }
    return true
  }

  /**
   * Custom `fetch` that wraps a GraphQL request in the ML-KEM CipherHash envelope and decrypts the
   * response (PQ-transport Phase E). Operates on the raw POST body (mirrors Kotlin's
   * encryptBody/decryptBody). Reads the CURRENT client wallet + validator pubkey from auth.
   */
  async cipherFetch (input, init) {
    const wallet = this.getWallet()
    const serverPubkey = this.getPubKey()
    let encryptedRequest = false
    let requestInit = init

    if (wallet && serverPubkey && init && typeof init.body === 'string' && this.shouldEncrypt(init.body)) {
      const hashVar = await wallet.encryptStringML768(init.body, serverPubkey)
      requestInit = { ...init, body: JSON.stringify({ query: CIPHER_HASH_QUERY, variables: { Hash: hashVar } }) }
      encryptedRequest = true
    }

    const response = await fetch(input, requestInit)
    if (!encryptedRequest) {
      return response
    }

    // Decrypt the CipherHash response back to the inner GraphQL response JSON.
    const text = await response.text()
    const init2 = { status: response.status, statusText: response.statusText, headers: response.headers }
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      return new Response(text, init2)
    }
    const hash = parsed && parsed.data && parsed.data.CipherHash && parsed.data.CipherHash.hash
    if (typeof hash !== 'string') {
      // Plaintext (e.g. a validator-side error response) — pass through unchanged.
      return new Response(text, init2)
    }
    const decrypted = await wallet.decryptMyMessageML768(JSON.parse(hash))
    return new Response(decrypted != null ? decrypted : text, init2)
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

  /**
   * Builds the urql operation options forwarded with a query/mutation.
   *
   * Forwards the requestPolicy (so a long-lived client does not serve stale
   * cache-first reads) and, when the caller supplied a per-query abort signal,
   * the signal too — while re-supplying the X-Auth-Token header. urql REPLACES
   * (not merges) the client-level fetchOptions with any operation-context
   * fetchOptions (createRequestOperation builds the op context as
   * {...baseOpts, ...opts}), so forwarding fetchOptions WITHOUT the header would
   * drop X-Auth-Token and break auth. The header here is byte-identical to the
   * client-level one set in createUrqlClient.
   *
   * @param {object} context
   * @returns {object|undefined}
   */
  buildRequestOptions (context) {
    if (!context) {
      return undefined
    }
    const opts = {}
    if (context.requestPolicy) {
      opts.requestPolicy = context.requestPolicy
    }
    const callerSignal = context.fetchOptions && context.fetchOptions.signal
    if (callerSignal) {
      // Combine the per-query abort signal with the 60s timeout so either can
      // cancel the request; fall back to the caller signal where AbortSignal.any
      // is unavailable.
      const signal = (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function')
        ? AbortSignal.any([callerSignal, AbortSignal.timeout(60000)])
        : callerSignal
      opts.fetchOptions = {
        headers: { 'X-Auth-Token': this.$__authToken },
        signal
      }
    }
    return Object.keys(opts).length ? opts : undefined
  }

  async query (request) {
    const { query, variables, context } = request
    const opts = this.buildRequestOptions(context)
    const result = await this.$__client.query(query, variables || {}, opts).toPromise()
    return this.formatResponse(result)
  }

  async mutate (request) {
    const { mutation, variables, context } = request
    const opts = this.buildRequestOptions(context)
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
