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
import { ApolloLink, Observable } from '@apollo/client/core';
import Pusher from 'pusher-js';
import { parse } from 'uri-js';
import CodeException from '../../exception/CodeException';


class PusherLink extends ApolloLink {

    // constructor( options ) {
    constructor( { socketUri, authEndpoint, appKey = 'app-key' } ) {
        console.log( 'PusherLink::constructor()...' );
        super();

        this.socketUri = socketUri;
        this.authEndpoint = authEndpoint;
        this.appKey = appKey;

        this.setAuthToken( '' );
        this.setTransport( this.getSocketUri() );
    }

    /**
     *
     * @param {string} socketUri
     */
    setTransport ( socketUri ) {

        console.log( `Connecting to socket endpoint ${ socketUri }...` );

        const wsPath = parse( socketUri );

        if ( ![ 'ws', 'wss' ].includes( wsPath.scheme ) ) {
            throw new CodeException( 'Incorrect scheme for the socket' );
        }

        this.transport = new Pusher( this.appKey, {
            auth: {
                headers: {
                    'X-Auth-Token': this.getAuthToken(),
                    Accept: 'application/json'
                }
            },
            wsHost: wsPath.host,
            wsPort: wsPath.port,
            forceTLS: wsPath.scheme === 'wss',
            encrypted: true,
            enabledTransports: [ wsPath.scheme ],
            authEndpoint: this.authEndpoint
        } );
    }

    disconnect() {
        this.transport.disconnect();
    }

    /**
     *
     * @param {string} name
     * @returns {Channel|null}
     */
    channel( name ) {
        return this.transport.channel( name ) || null;
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
     * @return {string|null}
     */
    getSocketUri () {
        return this.socketUri;
    }

    request( operation, forward ) {
        this.transport.config.auth.headers[ 'X-Auth-Token' ] = this.getAuthToken();

        const subscribeObservable = new Observable( ( _observer ) => {
            //
        } );

        // Capture the super method
        const prevSubscribe = subscribeObservable.subscribe.bind( subscribeObservable );

        // Override subscribe to return an `unsubscribe` object, see
        // https://github.com/apollographql/subscriptions-transport-ws/blob/master/src/client.ts#L182-L212
        subscribeObservable.subscribe = ( observerOrNext, onError, onComplete ) => {
            prevSubscribe( observerOrNext, onError, onComplete );

            const observer = getObserver( observerOrNext, onError, onComplete );

            let subscriptionChannel;

            forward( operation ).subscribe({
                next: ( data ) => {
                    // If the operation has the subscription channel, it's a subscription
                    subscriptionChannel = data?.extensions?.lighthouse_subscriptions.channel ?? null;

                    // No subscription found in the response, pipe data through
                    if ( !subscriptionChannel ) {
                        observer.next( data );
                        observer.complete();

                        return;
                    }

                    this.subscribeToChannel( subscriptionChannel, observer );
                }
            });

            // Return an object that will unsubscribe_if the query was a subscription
            return {
                closed: false,
                unsubscribe: () => {
                    subscriptionChannel &&
                    this.unsubscribeFromChannel( subscriptionChannel );
                }
            };
        };

        return subscribeObservable;
    }

    subscribeToChannel( subscriptionChannel, observer ) {
        this.transport
            .subscribe( subscriptionChannel )
            .bind('lighthouse-subscription', ( payload ) => {
                if ( !payload.more ) {
                    this.unsubscribeFromChannel( subscriptionChannel );

                    observer.complete();
                }

                const result = payload.result;

                if (result) {
                    observer.next( result );
                }
            });
    }

    unsubscribeFromChannel( subscriptionChannel ) {
        this.transport.unsubscribe( subscriptionChannel );
    }
}

// Turn `subscribe` arguments into an observer-like thing, see getObserver
// https://github.com/apollographql/subscriptions-transport-ws/blob/master/src/client.ts#L329-L343
function getObserver( observerOrNext, onError, onComplete ) {
    if ( typeof observerOrNext === 'function' ) {
        // Duck-type an observer
        return {
            next: ( v ) => observerOrNext( v ),
            error: ( e ) => onError && onError( e ),
            complete: () => onComplete && onComplete()
        };
    } else {
        // Make an object that calls to the given object, with safety checks
        return {
            next: ( v ) => observerOrNext.next && observerOrNext.next( v ),
            error: ( e ) => observerOrNext.error && observerOrNext.error( e ),
            complete: () => observerOrNext.complete && observerOrNext.complete()
        };
    }
}

export default PusherLink;
