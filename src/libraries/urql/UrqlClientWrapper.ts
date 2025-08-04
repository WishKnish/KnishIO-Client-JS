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
  createClient,
  subscriptionExchange,
  cacheExchange,
  fetchExchange,
  Client,
  OperationResult
} from '@urql/core';
import { createClient as createWSClient, Client as WSClient } from 'graphql-ws';
import { pipe, map } from 'wonka';
import type { GraphQLResponse } from '../../types/graphql';

/**
 * Socket configuration for WebSocket connections
 */
export interface SocketConfig {
  socketUri: string | null;
  appKey?: string | undefined;
}

/**
 * Constructor options for UrqlClientWrapper
 */
export interface UrqlClientWrapperOptions {
  serverUri: string;
  socket?: SocketConfig | null;
  encrypt?: boolean;
}

/**
 * Authentication data structure
 */
export interface AuthData {
  token: string;
  pubkey: string;
  wallet: unknown;
}

/**
 * GraphQL request structure for queries
 */
export interface QueryRequest {
  query: string;
  variables?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

/**
 * GraphQL request structure for mutations
 */
export interface MutationRequest {
  mutation: string;
  variables?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

/**
 * GraphQL request structure for subscriptions
 */
export interface SubscriptionRequest {
  query: string;
  variables?: Record<string, unknown>;
  operationName: string;
}

/**
 * Subscription callback function type
 */
export type SubscriptionCallback = (result: GraphQLResponse) => void;

/**
 * Subscription management structure
 */
interface SubscriptionInfo {
  unsubscribe: () => void;
}

/**
 * Subscription return object with unsubscribe method
 */
export interface SubscriptionHandle {
  unsubscribe: () => void;
}

/**
 * UrqlClientWrapper class for handling GraphQL operations with URQL
 */
class UrqlClientWrapper {
  private $__client: Client;
  private $__authToken: string;
  private $__pubkey: string | null;
  private $__wallet: unknown | null;
  private serverUri: string;
  private soketi: SocketConfig | null;
  private cipherLink: boolean;
  private $__subscriptionManager: Map<string, SubscriptionInfo>;

  /**
   * Constructor for UrqlClientWrapper
   * @param options - Configuration options
   */
  constructor({ serverUri, socket = null, encrypt = false }: UrqlClientWrapperOptions) {
    this.$__client = this.createUrqlClient({ serverUri, socket, encrypt });
    this.$__authToken = '';
    this.$__pubkey = null;
    this.$__wallet = null;
    this.serverUri = serverUri;
    this.soketi = socket;
    this.cipherLink = !!encrypt;
    this.$__subscriptionManager = new Map<string, SubscriptionInfo>();
  }

  /**
   * Create URQL client with proper configuration
   * @param options - Client configuration options
   * @returns Configured URQL client
   */
  private createUrqlClient({ serverUri, socket }: UrqlClientWrapperOptions): Client {
    const exchanges = [cacheExchange, fetchExchange];

    // Add subscription support if socket is configured
    if (socket && socket.socketUri) {
      const wsClient: WSClient = createWSClient({
        url: socket.socketUri!,
        connectionParams: () => ({
          authToken: this.$__authToken
        })
      });

      exchanges.push(subscriptionExchange({
        forwardSubscription: operation => ({
          subscribe: sink => {
            const disposable = wsClient.subscribe(
              {
                query: operation.query!,
                variables: operation.variables
              },
              sink as any
            );
            return { unsubscribe: () => disposable() };
          }
        })
      }));
    }

    return createClient({
      url: serverUri,
      exchanges,
      fetchOptions: () => ({
        headers: {
          'X-Auth-Token': this.$__authToken
        }
      })
    });
  }

  /**
   * Set authentication data and recreate client
   * @param authData - Authentication data
   */
  setAuthData({ token, pubkey, wallet }: AuthData): void {
    this.$__authToken = token;
    this.$__pubkey = pubkey;
    this.$__wallet = wallet;

    // Recreate client with new auth data
    this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }

  /**
   * Execute a GraphQL query
   * @param request - Query request object
   * @returns Promise resolving to GraphQL response
   */
  async query(request: { query: unknown, variables?: unknown, context?: unknown }): Promise<unknown> {
    const { query, variables } = request;
    const result: OperationResult = await this.$__client.query(query as string, variables as any).toPromise();
    return this.formatResponse(result);
  }

  /**
   * Execute a GraphQL mutation
   * @param request - Mutation request object
   * @returns Promise resolving to GraphQL response
   */
  async mutate(request: { mutation: unknown, variables?: unknown, context?: unknown }): Promise<unknown> {
    const { mutation, variables } = request;
    const result: OperationResult = await this.$__client.mutation(mutation as string, variables as any).toPromise();
    return this.formatResponse(result);
  }

  /**
   * Subscribe to GraphQL subscription
   * @param request - Subscription request
   * @param closure - Callback function for subscription data
   * @returns Subscription handle with unsubscribe method
   */
  subscribe(request: { query: unknown, variables?: unknown, operationName: string }, closure: (result: unknown) => void): { unsubscribe: () => void } {
    const { query, variables, operationName } = request;

    const { unsubscribe } = (pipe(
      this.$__client.subscription(query as string, variables as any) as any,
      map((result: OperationResult) => {
        closure(this.formatResponse(result));
        return result;
      })
    ) as any).subscribe(() => {});

    // Store subscription for later cleanup
    this.$__subscriptionManager.set(operationName, { unsubscribe });

    return {
      unsubscribe: () => this.unsubscribe(operationName)
    };
  }

  /**
   * Format URQL response to match legacy Apollo format
   * @param result - URQL operation result
   * @returns Formatted GraphQL response
   */
  private formatResponse(result: OperationResult): GraphQLResponse {
    // Match old Apollo response format
    const response: GraphQLResponse = {
      data: result.data
    };
    
    if (result.error) {
      response.errors = [{
        message: result.error.message,
        ...(result.error.graphQLErrors?.[0]?.locations && { locations: [...result.error.graphQLErrors[0].locations] as { line: number; column: number; }[] }),
        ...(result.error.graphQLErrors?.[0]?.path && { path: [...result.error.graphQLErrors[0].path] as (string | number)[] })
      }];
    }
    
    return response;
  }

  /**
   * Disconnect socket and clean up subscriptions
   */
  socketDisconnect(): void {
    if (this.soketi) {
      // Unsubscribe from all active subscriptions
      this.unsubscribeAll();
    }
  }

  /**
   * Unsubscribe from a specific subscription
   * @param operationName - Name of the operation to unsubscribe from
   */
  unsubscribe(operationName: string): void {
    const subscription = this.$__subscriptionManager.get(operationName);
    if (subscription) {
      subscription.unsubscribe();
      this.$__subscriptionManager.delete(operationName);
    }
  }

  /**
   * Unsubscribe from all active subscriptions
   */
  unsubscribeAll(): void {
    this.$__subscriptionManager.forEach((_subscription, operationName) => {
      this.unsubscribe(operationName);
    });
  }

  /**
   * Unsubscribe from a specific channel (alias for unsubscribe)
   * @param operationName - Name of the operation to unsubscribe from
   */
  unsubscribeFromChannel(operationName: string): void {
    this.unsubscribe(operationName);
  }

  /**
   * Set encryption status and recreate client
   * @param encrypt - Whether to enable encryption
   */
  setEncryption(encrypt: boolean = false): void {
    this.cipherLink = encrypt;
    this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt
    });
  }

  /**
   * Get current authentication token
   * @returns Authentication token
   */
  getAuthToken(): string {
    return this.$__authToken;
  }

  /**
   * Get current public key
   * @returns Public key
   */
  getPubKey(): string | null {
    return this.$__pubkey;
  }

  /**
   * Get current wallet
   * @returns Wallet object
   */
  getWallet(): unknown | null {
    return this.$__wallet;
  }

  /**
   * Get server URI
   * @returns Server URI
   */
  getServerUri(): string {
    return this.serverUri;
  }

  /**
   * Get socket URI
   * @returns Socket URI or null
   */
  getSocketUri(): string | null {
    return this.soketi ? this.soketi.socketUri : null;
  }

  /**
   * Get URI (alias for getServerUri)
   * @returns Server URI
   */
  getUri(): string {
    return this.serverUri;
  }

  /**
   * Set server URI and recreate client
   * @param uri - New server URI
   */
  setUri(uri: string): void {
    this.serverUri = uri;
    this.$__client = this.createUrqlClient({
      serverUri: uri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }

  /**
   * Set socket URI and recreate client
   * @param socketConfig - Socket configuration
   */
  setSocketUri({ socketUri, appKey }: { socketUri: string; appKey?: string }): void {
    this.soketi = { socketUri, appKey: appKey || undefined };
    this.$__client = this.createUrqlClient({
      serverUri: this.serverUri,
      socket: this.soketi,
      encrypt: !!this.cipherLink
    });
  }
}

export default UrqlClientWrapper;