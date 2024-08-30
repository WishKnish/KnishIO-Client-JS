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
import { WebSocketLink } from '@apollo/client/link/ws'
import fetch from 'isomorphic-fetch'
import { errorHandler } from './handler'
import CipherLink from './CipherLink'

class Client extends ApolloClient {
  /**
   * @param {string} serverUri
   * @param {object|null} soketi
   * @param {boolean} encrypt
   */
  constructor ({
    serverUri,
    soketi = null,
    encrypt = false
  }) {
    const httpLink = createHttpLink({
      uri: serverUri,
      fetch
    })

    const authToken = ''

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'X-Auth-Token': authToken
      }
    }))

    const errorLink = onError(errorHandler)

    let link = from([authLink, errorLink, httpLink])

    let cipherLink
    if (encrypt) {
      cipherLink = new CipherLink()
      link = from([cipherLink, link])
    }

    let wsLink
    if (soketi && soketi.socketUri) {
      const webSocketConfig = {
        uri: soketi.socketUri,
        options: {
          reconnect: true,
          connectionParams: () => ({
            authToken
          })
        }
      }
      wsLink = new WebSocketLink(webSocketConfig)

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

    this.serverUri = serverUri
    this.soketi = soketi
    this.authToken = authToken
    this.pubkey = null
    this.wallet = null
    this.cipherLink = cipherLink
    this.wsLink = wsLink
  }

  setAuthData ({ token, pubkey, wallet }) {
    this.authToken = token
    this.pubkey = pubkey
    this.wallet = wallet

    if (this.cipherLink) {
      this.cipherLink.setWallet(wallet)
      this.cipherLink.setPubKey(pubkey)
    }

    if (this.wsLink) {
      this.wsLink.options.connectionParams = () => ({
        authToken: this.authToken
      })
    }
  }

  getAuthToken () {
    return this.authToken
  }

  getPubKey () {
    return this.pubkey
  }

  getWallet () {
    return this.wallet
  }

  getServerUri () {
    return this.serverUri
  }

  getSocketUri () {
    return this.soketi ? this.soketi.socketUri : null
  }
}

export default Client
