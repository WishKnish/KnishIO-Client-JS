/**
 * Manages GraphQL subscriptions
 */
class SubscriptionManager {
  /**
   * @param {Client} client - Apollo Client instance
   */
  constructor (client) {
    this.$__client = client
    this.$__subscribers = {}
  }

  /**
   * Set the client instance
   * @param {Client} client - Apollo Client instance
   */
  setClient (client) {
    this.$__client = client
  }

  /**
   * Create a new subscription
   * @param {Object} request - Subscription request
   * @param {Function} closure - Callback function for subscription updates
   * @returns {Object} Subscription object
   */
  subscribe (request, closure) {
    const subscription = this.$__client.subscribe(request).subscribe(closure)
    this.$__subscribers[request.operationName] = subscription
    return subscription
  }

  /**
   * Unsubscribe from a specific subscription
   * @param {string} operationName - Name of the operation to unsubscribe from
   */
  unsubscribe (operationName) {
    if (this.$__subscribers[operationName]) {
      this.$__subscribers[operationName].unsubscribe()
      this.$__client.unsubscribeFromChannel(operationName)
      delete this.$__subscribers[operationName]
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll () {
    Object.keys(this.$__subscribers).forEach(this.unsubscribe.bind(this))
  }

  /**
   * Clear all subscriptions without unsubscribing
   */
  clear () {
    this.$__subscribers = {}
  }
}

export default SubscriptionManager
