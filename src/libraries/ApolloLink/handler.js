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
  Observable,
  Operation,
  FetchResult
} from 'apollo-link';
import { Observer } from 'apollo-client/util/Observable';

/**
 * @param {Echo} echoClient
 * @param {string} channelName
 * @param {Observer<FetchResult>} observer
 * @param {string} operationName
 */
function subscribeToEcho (
  echoClient,
  channelName,
  observer,
  operationName
) {
  const channel = echoClient.private(
    channelName.replace( /^private-/, '' )
  );

  channel.listen( '.lighthouse-subscription', result => {
    let data = result.data;

    if ( data.data ) {
      data = data.data;
    }
    if ( data[ operationName ] ) {
      data = data[ operationName ];
    }

    observer.next( data );
  } );
}

/**
 * @param {Echo} echoClient
 * @param {function(): string} getChannelName
 */
function unsubscribe ( echoClient, getChannelName ) {
  const channelName = getChannelName();

  if ( channelName ) {
    echoClient.leave( channelName );
  }
}

/**
 * @param {object} data
 * @param {string} subscriptionName
 * @return {null|*}
 */
function getChannel ( data, subscriptionName ) {

  if ( data.extensions && data.extensions.lighthouse_subscriptions && data.extensions.lighthouse_subscriptions.version ) {

    const version = data.extensions.lighthouse_subscriptions.version;

    if ( version < 2 ) {
      if ( data.extensions.lighthouse_subscriptions.channels ) {
        return data.extensions.lighthouse_subscriptions.channels[ subscriptionName ];
      }
    }

    if ( version === 2 ) {
      return data.extensions.lighthouse_subscriptions.channel;
    }
  }

  return null;
}

/**
 * @param {Echo} echoClient
 * @param {Operation} operation
 * @param {Observer<FetchResult>} observer
 * @param {function(name: string): any} setChannelName
 *
 * @return {(function(FetchResult): void)|*}
 */
function createSubscriptionHandler (
  echoClient,
  operation,
  observer,
  setChannelName
) {
  return data => {
    const nameOperation = operationName( operation ),
      channelName = getChannel( data, nameOperation );

    if ( channelName ) {
      setChannelName( channelName );
      subscribeToEcho( echoClient, channelName, observer, nameOperation );
    } else {
      observer.next( data );
      observer.complete();
    }
  };
}

/**
 * @param {Operation} operation
 * @return {string}
 */
export function operationName ( operation ) {
  const operationDefinition = operation.query
    .definitions.find( definitionNode => definitionNode.kind === 'OperationDefinition' );
  const fieldNode = operationDefinition.selectionSet
    .selections.find( definitionNode => definitionNode.kind === 'Field' );

  return fieldNode.name.value;
}

/**
 * @param {Operation} operation
 * @return {string}
 */
export function operationType ( operation ) {
  const operationDefinition = operation.query
    .definitions.find( definitionNode => definitionNode.kind === 'OperationDefinition' );

  return operationDefinition.operation;
}

export function errorHandler ( {
  graphQLErrors,
  networkError,
  operation,
  forward
} ) {
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
    console.error( `[Network error]: ${ networkError }` );
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
  }
}

/**
 *
 * @param {Echo} echoClient
 * @return {Observable<unknown>|Observable|*}
 */
export default function createRequestHandler ( echoClient ) {
  return ( operation, forward ) => {
    let channelName;

    return new Observable( ( observer ) => {
      forward( operation ).subscribe(
        createSubscriptionHandler( echoClient, operation, observer, name => channelName = name )
      );

      return () => unsubscribe( echoClient, () => channelName );
    } );
  };
}
