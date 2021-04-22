import ApolloClient from "apollo-client";
import { createHttpLink, } from 'apollo-link-http';
import { onError, } from 'apollo-link-error';
import fetch from 'isomorphic-fetch';
import { ApolloLink, } from 'apollo-link';
import { InMemoryCache, } from 'apollo-cache-inmemory';
import EchoLink from '../libraries/EchoLink';


export default class SocketClient {

  /**
   *
   * @param {string} socketUri
   * @param {string} serverUri
   * @param {string|null} authorization
   */
  constructor ( { socketUri, serverUri, authorization = null } ) {

    const httpLink = createHttpLink({
        uri: serverUri,
        fetch: fetch,
        transportBatching: true,
      }),
      authLink = new ApolloLink((operation, forward) => {
        // Use the setContext method to set the HTTP headers.
        operation.setContext({
          headers: {
            'X-Auth-Token': this.getAuthToken(),
          },
        });
        // Call the next link in the middleware chain.
        return forward(operation);
      }),
      errorLink = onError(({graphQLErrors, networkError, operation, forward,}) => {

        if (graphQLErrors) {
          graphQLErrors.map(({message, debugMessage, locations, path,}) => console.error(
            `[GraphQL error]: ${message}\r\n`,
            `  Message : ${debugMessage}\r\n`,
            `  Path    : ${path}\r\n`,
            `  Location: ${locations}\r\n`,
          ));
        }

        if (networkError) {

          if (networkError.name === 'ServerError' && networkError.statusCode === 401) {

            operation.setContext({
              headers: {
                ...operation.getContext().headers,
                'X-Auth-Token': this.getAuthToken(),
              },
            });
            // retry the request, returning the new observable
            return forward(operation);
          }

          console.error(`[Network error]: ${networkError}`);
          // if you would also like to retry automatically on
          // network errors, we recommend that you use
          // apollo-link-retry
        }
      });

    this.$__authorization = authorization;
    this.$__uri = socketUri;
    this.$__echo = new EchoLink( { socketUri, serverUri, } );
    this.$__client = new ApolloClient( {
      link: ApolloLink.from( [ authLink, this.$__echo, errorLink.concat( httpLink ), ] ),
      cache: new InMemoryCache(),
      connectToDevTools: true,
    } );
  }

  /**
   * @param {object} request
   * @param {function} closure
   */
  subscribe ( request, closure ) {
    const subscriber = this.$__client.subscribe( request );

    subscriber.subscribe( {
      next ( data ) {
        closure( data );
      },
      error ( error ) {
        console.log( error );
      },
    } );
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
