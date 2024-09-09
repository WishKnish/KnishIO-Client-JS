import Client from './Client'
import SubscriptionManager from './SubscriptionManager'

/**
 * ApolloClient wrapper class
 * Provides a high-level interface for interacting with the GraphQL server
 */
export default class ApolloClient {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.serverUri - URI of the GraphQL server
   * @param {Object|null} config.socket - WebSocket configuration (optional)
   * @param {boolean} config.encrypt - Whether to use encryption (default: false)
   */
  constructor ({ serverUri, socket = null, encrypt = false }) {
    // Initialize the underlying Apollo Client
    this.$__client = new Client({ serverUri, soketi: socket, encrypt })

    // Initialize the subscription manager
    this.$__subscriptionManager = new SubscriptionManager(this.$__client)
  }

  /**
   * Set encryption for the client
   * @param {boolean} encrypt - Whether to use encryption
   */
  setEncryption (encrypt = false) {
    const clientConfig = {
      serverUri: this.$__client.getServerUri(),
      soketi: {
        socketUri: this.$__client.getSocketUri(),
        appKey: 'knishio'
      },
      encrypt
    }
    this.$__client = new Client(clientConfig)
    this.$__subscriptionManager.setClient(this.$__client)
  }

  /**
   * Unsubscribe from a specific subscription
   * @param {string} operationName - Name of the operation to unsubscribe from
   */
  unsubscribe (operationName) {
    this.$__subscriptionManager.unsubscribe(operationName)
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll () {
    this.$__subscriptionManager.unsubscribeAll()
  }

  /**
   * Disconnect the WebSocket
   */
  socketDisconnect () {
    this.$__client.socketDisconnect()
    this.$__subscriptionManager.clear()
  }

  /**
   * Create a new subscription
   * @param {Object} request - Subscription request
   * @param {Function} closure - Callback function for subscription updates
   * @returns {Object} Subscription object
   */
  subscribe (request, closure) {
    return this.$__subscriptionManager.subscribe(request, closure)
  }

  /**
   * Execute a query
   * @param {Object} request - Query request
   * @returns {Promise} Promise resolving to the query result
   */
  async query (request) {
    return this.$__client.query(request)
  }

  /**
   * Execute a mutation
   * @param {Object} request - Mutation request
   * @returns {Promise} Promise resolving to the mutation result
   */
  async mutate (request) {
    return this.$__client.mutate(request)
  }

  /**
   * Set authentication data for the client
   * @param {Object} authData - Authentication data
   * @param {string} authData.token - Authentication token
   * @param {string} authData.pubkey - Public key
   * @param {Object} authData.wallet - Wallet object
   */
  setAuthData ({ token, pubkey, wallet }) {
    this.$__client.setAuthData({ token, pubkey, wallet })
  }

  // Getter methods
  getAuthToken () { return this.$__client.getAuthToken() }

  getUri () {
    return this.$__client ? this.$__client.getServerUri() : null
  }

  getSocketUri () { return this.$__client.getSocketUri() }

  /**
   * Set the server URI
   * @param {string} uri - New server URI
   */
  setUri (uri) {
    const clientConfig = {
      serverUri: uri,
      soketi: {
        socketUri: this.$__client.getSocketUri(),
        appKey: 'knishio'
      },
      encrypt: !!this.$__client.cipherLink
    }
    this.$__client = new Client(clientConfig)
    this.$__subscriptionManager.setClient(this.$__client)
  }

  /**
   * Set the WebSocket URI
   * @param {Object} config - WebSocket configuration
   * @param {string} config.socketUri - New WebSocket URI
   * @param {string} config.appKey - Application key for the WebSocket
   */
  setSocketUri ({ socketUri, appKey }) {
    const clientConfig = {
      serverUri: this.$__client.getServerUri(),
      soketi: { socketUri, appKey },
      encrypt: !!this.$__client.cipherLink
    }
    this.$__client = new Client(clientConfig)
    this.$__subscriptionManager.setClient(this.$__client)
  }
}
