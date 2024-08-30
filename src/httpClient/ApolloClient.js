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
    this.$__client = new Client({
      serverUri,
      soketi: socket,
      encrypt
    })
  }

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
  }

  unsubscribe (operationName) {
    if (Object.prototype.hasOwnProperty.call(this.$__subscribers, operationName)) {
      this.$__subscribers[operationName].unsubscribe()
      this.$__client.unsubscribeFromChannel(operationName)
      delete this.$__subscribers[operationName]
    }
  }

  unsubscribeAll () {
    for (const subscribe in this.$__subscribers) {
      this.unsubscribe(subscribe)
    }
  }

  socketDisconnect () {
    this.$__client.socketDisconnect()
    this.$__subscribers = {}
  }

  /**
   * @param request
   * @param closure
   * @returns {Subscription}
   */
  subscribe (request, closure) {
    return this.$__client.subscribe(request).subscribe(closure)
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
  setAuthData ({ token, pubkey, wallet }) {
    this.$__client.setAuthData({ token, pubkey, wallet })
  }

  /**
   * Gets the current auth token
   *
   * @return {string|null}
   */
  getAuthToken () {
    return this.$__client.getAuthToken()
  }

  /**
   * Gets the endpoint URI
   *
   * @return {string}
   */
  getUri () {
    return this.$__client.getServerUri()
  }

  /**
   * Sets the endpoint URI
   *
   * @param {string} uri
   */
  setUri (uri) {
    // This method might need to recreate the client with the new URI
    const clientConfig = {
      serverUri: uri,
      soketi: {
        socketUri: this.$__client.getSocketUri(),
        appKey: 'knishio'
      },
      encrypt: !!this.$__client.cipherLink
    }
    this.$__client = new Client(clientConfig)
  }

  /**
   * @return {string|null}
   */
  getSocketUri () {
    return this.$__client.getSocketUri()
  }

  setSocketUri ({ socketUri, appKey }) {
    // This method might need to recreate the client with the new socket URI
    const clientConfig = {
      serverUri: this.$__client.getServerUri(),
      soketi: { socketUri, appKey },
      encrypt: !!this.$__client.cipherLink
    }
    this.$__client = new Client(clientConfig)
  }
}
