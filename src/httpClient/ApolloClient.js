import { ApolloClient as RootApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import fetch from 'isomorphic-fetch';
import {
  ApolloLink,
  Operation
} from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import EchoLink from '../libraries/ApolloLink/EchoLink';
import { operationName } from '../libraries/ApolloLink/handler';


export default class ApolloClient {

  /**
   *
   * @param {string} socketUri
   * @param {string} serverUri
   * @param {string|null} authorization
   */
  constructor ( {
    socketUri,
    serverUri,
    authorization = null
  } ) {

    const httpLink = createHttpLink( {
        uri: serverUri,
        fetch: fetch,
        transportBatching: true
      } ),
      authLink = new ApolloLink( ( operation, forward ) => {
        // Use the setContext method to set the HTTP headers.
        operation.setContext( {
          headers: {
            'X-Auth-Token': this.getAuthToken()
          }
        } );
        // Call the next link in the middleware chain.
        return forward( operation );
      } ),
      errorLink = onError( ( {
        graphQLErrors,
        networkError,
        operation,
        forward
      } ) => {

        if ( graphQLErrors ) {
          graphQLErrors.map( ( {
            message,
            debugMessage,
            locations,
            path
          } ) => console.error(
            `[GraphQL error]: ${ message }\r\n`,
            `  Message : ${ debugMessage }\r\n`,
            `  Path    : ${ path }\r\n`,
            `  Location: ${ locations }\r\n`
          ) );
        }

        if ( networkError ) {

          if ( networkError.name === 'ServerError' && networkError.statusCode === 401 ) {

            operation.setContext( {
              headers: {
                ...operation.getContext().headers,
                'X-Auth-Token': this.getAuthToken()
              }
            } );
            // retry the request, returning the new observable
            return forward( operation );
          }

          console.error( `[Network error]: ${ networkError }` );
          // if you would also like to retry automatically on
          // network errors, we recommend that you use
          // apollo-link-retry
        }
      } );

    this.$__subscribers = {};
    this.$__authorization = authorization;
    this.$__uri = socketUri;
    this.$__echo = new EchoLink( { socketUri } );
    this.$__client = new RootApolloClient( {
      link: ApolloLink.from( [ authLink, this.$__echo, errorLink.concat( httpLink ) ] ),
      cache: new InMemoryCache(),
      connectToDevTools: true
    } );
  }

  /**
   *
   * @param {string} operationName
   */
  unsubscribe ( operationName ) {
    if ( this.$__subscribers[ operationName ] ) {
      this.$__subscribers[ operationName ].unsubscribe();
    }
  }

  unsubscribeAll () {
    for ( let subscribe in this.$__subscribers ) {
      if ( this.$__subscribers.hasOwnProperty( subscribe ) ) {
        this.unsubscribe( subscribe );
      }
    }
  }

  /**
   * @param {Operation} request
   * @param {function} closure
   *
   * @return {string}
   */
  subscribe ( request, closure ) {
    const operation = operationName( request );

    this.unsubscribe( operation );

    this.$__subscribers[ operation ] = this.$__client
      .subscribe( request )
      .subscribe( data => closure( data ) );

    return operation;
  }

  /**
   * Sets the authorization token for this session
   *
   * @param {string} authToken
   */
  setAuthToken ( authToken ) {
    this.$__echo.setAuthToken( authToken );
    this.$__authorization = authToken;
  }

  /**
   * Gets the current auth token
   *
   * @return {string}
   */
  getAuthToken () {
    return this.$__authorization || '';
  }

  /**
   * Gets the endpoint URI
   *
   * @returns {string}
   */
  getUri () {
    return this.$__uri;
  }

  /**
   * Sets the endpoint URI
   *
   * @param {string} uri
   */
  setUri ( uri ) {
    this.$__uri = uri;
  }

}
