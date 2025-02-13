import {
  createClient,
  subscriptionExchange,
  cacheExchange,
  fetchExchange, Client,
  OperationResult
} from '@urql/core'
import { createClient as createWSClient, SubscribePayload } from 'graphql-ws'
import { pipe, map } from 'wonka'
import Wallet from "../../Wallet";

class UrqlClientWrapper {
  $__client: Client
  $__authToken: string
  $__pubkey: string | null
  $__wallet: object | null
  serverUri: string
  soketi: object | null
  cipherLink: boolean
  $__subscriptionManager: Map<string, object>

  constructor( { serverUri, socket = null, encrypt = false } ) {
    this.$__client = this.createUrqlClient( { serverUri, socket, encrypt } )
    this.$__authToken = ''
    this.$__pubkey = null
    this.$__wallet = null
    this.serverUri = serverUri
    this.soketi = socket
    this.cipherLink = !!encrypt
    this.$__subscriptionManager = new Map()
  }

  createUrqlClient( { serverUri, socket, encrypt }: { serverUri: string, socket: object, encrypt: boolean } ): Client {
    const exchanges = [ cacheExchange, fetchExchange ]

    // Add subscription support if socket is configured
    if ( socket && socket.socketUri ) {
      const wsClient = createWSClient( {
        url: socket.socketUri,
        connectionParams: () => ({
          authToken: this.$__authToken
        })
      } )

      exchanges.push( subscriptionExchange( {
        forwardSubscription: operation => ({
          subscribe: sink => {
            const disposable = wsClient.subscribe( operation as SubscribePayload, sink )
            return { unsubscribe: disposable }
          }
        })
      } ) )
    }

    return createClient( {
      url: serverUri,
      exchanges,
      fetchOptions: () => ({
        headers: {
          'X-Auth-Token': this.$__authToken
        }
      })
    } )
  }

  setAuthData( { token, pubkey, wallet }: { token: string, pubkey: string, wallet: Wallet } ) {
    this.$__authToken = token
    this.$__pubkey = pubkey
    this.$__wallet = wallet

    // Recreate client with new auth data
    this.$__client = this.createUrqlClient( {
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    } )
  }

  async query( request: { query: any; variables: any; } ) {
    const { query, variables } = request
    const result = await this.$__client.query( query, variables ).toPromise()
    return this.formatResponse( result )
  }

  async mutate( request: { mutation: any; variables: any; } ) {
    const { mutation, variables } = request
    const result = await this.$__client.mutation( mutation, variables ).toPromise()
    return this.formatResponse( result )
  }

  subscribe( request: { query: any; variables: any; operationName: any; }, closure: ( arg0: {
    data: any;
    errors: any[];
  } ) => void ) {
    const { query, variables, operationName } = request

    const { unsubscribe } = pipe(
      this.$__client.subscription( query, variables ),
      map( result => {
        closure( this.formatResponse( result ) )
      } )
    ).subscribe( () => {
    } )

    // Store subscription for later cleanup
    this.$__subscriptionManager.set( operationName, { unsubscribe } )

    return {
      unsubscribe: () => this.unsubscribe( operationName )
    }
  }

  formatResponse( result: OperationResult<any, any> ) {
    // Match old Apollo response format
    return {
      data: result.data,
      errors: result.error ? [ result.error ] : undefined
    }
  }

  socketDisconnect() {
    if ( this.soketi ) {
      // Unsubscribe from all active subscriptions
      this.unsubscribeAll()
    }
  }

  unsubscribe( operationName: string ) {
    const subscription = this.$__subscriptionManager.get( operationName )
    if ( subscription ) {
      subscription.unsubscribe()
      this.$__subscriptionManager.delete( operationName )
    }
  }

  unsubscribeAll() {
    this.$__subscriptionManager.forEach( ( subscription, operationName ) => {
      this.unsubscribe( operationName )
    } )
  }

  unsubscribeFromChannel( operationName: string ) {
    this.unsubscribe( operationName )
  }

  setEncryption( encrypt = false ) {
    this.cipherLink = encrypt
    this.$__client = this.createUrqlClient( {
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt
    } )
  }

  getAuthToken() {
    return this.$__authToken
  }

  getPubKey() {
    return this.$__pubkey
  }

  getWallet() {
    return this.$__wallet
  }

  getServerUri() {
    return this.serverUri
  }

  getSocketUri() {
    return this.soketi ? this.soketi.socketUri : null
  }

  getUri() {
    return this.serverUri
  }

  setUri( uri: string ) {
    this.serverUri = uri
    this.$__client = this.createUrqlClient( {
      serverUri: uri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    } )
  }

  setSocketUri( { socketUri, appKey }: { socketUri: string, appKey: string } ) {
    this.soketi = { socketUri, appKey }
    this.$__client = this.createUrqlClient( {
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    } )
  }
}

export default UrqlClientWrapper
