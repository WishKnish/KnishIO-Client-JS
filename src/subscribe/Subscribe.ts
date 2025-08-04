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

import type { GraphQLVariables, SubscriptionVariables, UrqlClientWrapper } from '@/types';
import CodeException from '@/exception/CodeException';
import type { TypedDocumentNode } from '@urql/core';

export interface SubscribeOptions {
  variables?: SubscriptionVariables | null;
  closure: (result: unknown) => void;
}

export interface SubscribeRequest {
  query: TypedDocumentNode<any, any>;
  variables: GraphQLVariables | null;
  fetchPolicy: string;
}

export type SubscriptionCallback = (result: unknown) => void;

/**
 * Base class for all GraphQL subscription operations
 */
export default class Subscribe {
  protected client: UrqlClientWrapper;
  protected $__variables: GraphQLVariables | null = null;
  protected $__subscribe: TypedDocumentNode<any, any> | null = null;
  protected $__request: SubscribeRequest | null = null;

  /**
   * @param graphQLClient - The URQL client wrapper
   */
  constructor(graphQLClient: UrqlClientWrapper) {
    this.client = graphQLClient;
  }

  /**
   * Creates a new Request for the given parameters
   */
  createSubscribe({ variables = null }: { variables?: SubscriptionVariables | null } = {}): SubscribeRequest {
    this.$__variables = this.compiledVariables(variables);

    // Uri is a required parameter
    const uri = this.uri();

    if (!uri) {
      throw new CodeException('Subscribe::createSubscribe() - Node URI was not initialized for this client instance!');
    }

    if (this.$__subscribe === null) {
      throw new CodeException('Subscribe::createSubscribe() - GraphQL subscription was not initialized!');
    }

    return {
      query: this.$__subscribe,
      variables: this.variables(),
      fetchPolicy: 'no-cache'
    };
  }

  /**
   * Sends the Subscription to a Knish.IO node and returns the subscription handle
   */
  async execute({ variables = null, closure }: SubscribeOptions): Promise<string> {
    if (!closure) {
      throw new CodeException(`${this.constructor.name}::execute() - closure parameter is required!`);
    }

    this.$__request = this.createSubscribe({ variables });

    return (this.client as any).subscribe(this.$__request, closure);
  }

  /**
   * Returns a variables object for the Subscription
   */
  compiledVariables(variables: SubscriptionVariables | null = null): GraphQLVariables {
    return variables || {};
  }

  /**
   * Returns the Knish.IO endpoint URI
   */
  uri(): string {
    return (this.client as any).getUri();
  }

  /**
   * Returns the subscription variables object
   */
  variables(): GraphQLVariables | null {
    return this.$__variables;
  }
}
