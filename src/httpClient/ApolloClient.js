/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import { operationName } from '../libraries/ApolloLink/handler'
import Client from '../libraries/ApolloLink/Client'

export default class ApolloClient {
  /**
   * @param {string} serverUri
   * @param {object|null} socket
   * @param {boolean} encrypt
   */
  constructor ({
    serverUri,
    socket = null,
    encrypt = false
  }) {
    this.$__subscribers = {}
    this.$__uri = serverUri
    this.$__socket = {
      ...{
        socketUri: null,
        appKey: 'knishio'
      },
...socket || {}
    }
    this.$__client = null

    this.restartTransport(encrypt)
  }

  /**
   * If you have subscriptions, you unsubscribe
   *
   * @param {boolean} encrypt
   */
  restartTransport (encrypt = false) {
    const client = new Client({
      serverUri: this.$__uri,
      soketi: this.$__socket,
      encrypt
    })

    if (this.$__client) {
      client.setAuthData({
        token: this.$__client.getAuthToken(),
        pubkey: this.$__client.getPubKey(),
        wallet: this.$__client.getWallet()
      })

      this.socketDisconnect()
    }

    this.$__client = client
  }

  /**
   * Sets the encryption mode for this session
   *
   * @param {boolean} encrypt
   */
  setEncryption (encrypt = false) {
    this.restartTransport(encrypt)
  }

  /**
   * @param {string} operationName
   */
  unsubscribe (operationName) {
    if (this.$__subscribers.hasOwnProperty(operationName)) {
      this.$__subscribers[operationName].unsubscribe()
      this.$__client.unsubscribeFromChannel(operationName)
      delete this.$__subscribers[operationName]
    }
  }

  /**
   *
   */
  unsubscribeAll () {
    for (const subscribe in this.$__subscribers) {
      this.unsubscribe(subscribe)
    }
  }

  /**
   *
   */
  socketDisconnect () {
    this.$__client.socketDisconnect()
    this.$__subscribers = {}
  }

  /**
   * @param {Operation} request
   * @param {function} closure
   *
   * @return {string}
   */
  subscribe (request, closure) {
    const operation = operationName(request)

    this.unsubscribe(operation)

    this.$__subscribers[operation] = this.$__client
      .subscribe(request)
      .subscribe(data => closure(data))

    return operation
  }

  /**
   *
   * @param request
   * @returns {Promise<*>}
   */
  async query (request) {
    return await this.$__client.query(request)
  }

  /**
   *
   * @param request
   * @returns {Promise<*>}
   */
  async mutate (request) {
    return await this.$__client.mutate(request)
  }

  /**
   * Sets the authorization token for this session
   *
   * @param {string} token
   * @param {string} pubkey
   * @param {Wallet|null} wallet
   */
  setAuthData ({
    token,
    pubkey,
    wallet
  }) {
    this.$__client.setAuthData({
      token,
      pubkey,
      wallet
    })
  }

  /**
   * Gets the current auth token
   *
   * @return {string|null}
   */
  getAuthToken () {
    const authTokenObject = this.$__client.getAuthToken()
    if (!authTokenObject) {
      return null
    }
    return authTokenObject.getToken()
  }

  /**
   * Gets the endpoint URI
   *
   * @return {string}
   */
  getUri () {
    return this.$__uri
  }

  /**
   * Sets the endpoint URI
   *
   * @param {string} uri
   */
  setUri (uri) {
    this.$__uri = uri
  }

  /**
   * @return {string|null}
   */
  getSocketUri () {
    return this.$__socket ? this.$__socket.socketUri : null
  }

  /**
   *
   * @param {string} socketUri
   * @param {string} appKey
   */
  setSocketUri ({
    socketUri,
    appKey
  }) {
    this.$__socket = arguments.length ? arguments[0] : this.$__socket
  }
}
