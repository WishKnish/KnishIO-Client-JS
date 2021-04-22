import { fetch, } from "popsicle";
import { Request, Headers, Body, } from 'servie';
import { ApolloLink, Observable, } from 'apollo-link';
import Echo from 'laravel-echo';

class EchoLink extends ApolloLink {

  /**
   * @param {string} socketUri
   * @param {string} serverUri
   */
  constructor ( {
    socketUri,
    serverUri,
  } ) {
    super();

    console.log( `EchoLink::constructor()...` );

    this.subscriptions = [];
    this.echo = null;
    this.socketUri = null;
    this.serverUri = null;
    this.auth = '';

    this.setEcho( socketUri );
    this.setServerUri( serverUri );
  }

  /**
   *
   * @return {string}
   */
  getAuthToken () {
    return this.auth;
  }

  /**
   * @param {string} auth
   */
  setAuthToken ( auth ) {
    this.auth = auth;
  }

  /**
   * @param {string} serverUri
   */
  setServerUri ( serverUri ) {
    this.serverUri = serverUri;
  }

  /**
   * @return {string|null}
   */
  getServerUri () {
    return this.serverUri;
  }

  /**
   * @return {string|null}
   */
  getSocketUri () {
    return this.socketUri;
  }

  /**
   * @param {string} socketUri
   */
  setEcho ( socketUri ) {

    console.log( `Connecting to socket endpoint ${ socketUri }...` );

    this.socketUri = socketUri;

    this.echo = new Echo( {
      broadcaster: 'socket.io',
      client: require( 'socket.io-client' ),
      authEndpoint: `graphql/subscriptions/auth`,
      host: this.getSocketUri(),
      transports: [ 'websocket', ],
      auth: {
        headers: {
          'X-Auth-Token': this.getAuthToken(),
          Accept: 'application/json',
        },
      },
    } );
  }

  request ( operation, forward ) {
    return new Observable( observer => {
      let subscriptionChannel;

      // Check the result of the operation
      forward( operation ).subscribe( {
        next: data => {
          // If the operation has the subscription extension, it's a subscription
          subscriptionChannel = this._getChannel( data, operation );

          if ( subscriptionChannel ) {
            this._setAuthToken();
            this._createSubscription( subscriptionChannel, observer );
          } else {
            // No subscription found in the response, pipe data through
            observer.next( data );
            observer.complete();
          }
        },
      } );

      // Return an object that will unsubscribe _if_ the query was a subscription.
      return {
        closed: false,
        unsubscribe: () => {
          if ( subscriptionChannel ) {
            this._leaveSubscription( subscriptionChannel );
          }
        },
      };
    } );
  }

  _setAuthToken () {
    this.echo.options.auth.headers[ 'X-Auth-Token' ] = this.getAuthToken();
  }

  _getChannel ( data, operation ) {

    return !!data.extensions &&
    !!data.extensions.lighthouse_subscriptions &&
    !!data.extensions.lighthouse_subscriptions.channels
      ? data.extensions.lighthouse_subscriptions.channels[ operation.operationName ]
      : null;

  }

  _createSubscription ( subscriptionChannel, observer ) {

    const privateChannelName = subscriptionChannel.split( 'private-' ).pop();

    if ( !this.subscriptions.find( socket => socket.channel === subscriptionChannel ) ) {

      this.subscriptions.push( {
        channel: subscriptionChannel,
        observer: observer,
      } );
    }

    this.echo.private( privateChannelName ).listen( '.lighthouse-subscription', payload => {

      if ( !payload.more || observer._subscription._state === 'closed' ) {

        this._leaveSubscription( subscriptionChannel, observer );
        return;
      }

      const result = payload.result;

      if ( result ) {

        observer.next( {
          data: result.data,
          extensions: result.extensions,
        } );
      }
    } );
  }

  _leaveSubscription ( channel, observer ) {

    const subscription = this.subscriptions.find( socket => socket.channel === channel );

    this.echo.leave( channel );
    observer.complete();
    this.subscriptions = this.subscriptions.slice( this.subscriptions.indexOf( subscription ), 1 );

    this._unsubscription( [ {
      'name': 'channel_vacated',
      'channel': channel,
    }, ] );
  }

  /**
   * @param {array} channel
   * @private
   */
  _unsubscription ( channel ) {

    const webhookUri = `${ this.getServerUri() }/subscriptions/webhook`;

    console.log( `EchoLink::_unsubscription() - unsubscribing from ${ channel }...` );

    fetch(
      new Request( webhookUri, {
        method: 'POST',
        headers: new Headers( {
          'accept': 'application/json',
          'content-type': 'application/json; charset=UTF-8',
        } ),
        body: new Body( JSON.stringify( { events: channel } ) ),
      } )
    ).then(
      null,
      error => {
        console.error( 'EchoLink::_unsubscription() - Unsubscription error: ', error );
      }
    );
  }
}

export default EchoLink;
