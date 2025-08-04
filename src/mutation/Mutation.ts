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

import type { GraphQLVariables, MutationVariables, UrqlClientWrapper } from '@/types';
import { createScopedLogger } from '../libraries/Logger';
import type KnishIOClient from '../KnishIOClient';
import Query from '../query/Query';
import type { QueryContext } from '@/types';
import Response from '../response/Response';

import type { MutationOptions, MutationRequest } from '@/types';

/**
 * Base class used to construct various GraphQL mutations
 */
export default class Mutation extends Query {
  protected $__mutationRequest: MutationRequest | null = null;
  private mutationLogger = createScopedLogger('Mutation');

  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor(graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient) {
    super(graphQLClient, knishIOClient);
  }

  /**
   * Creates a new Request for the given parameters (backward compatibility with JS version)
   */
  createQuery ({ variables = null }: { variables?: GraphQLVariables | null } = {}): any {
    const request = super.createQuery({ variables })
    const mutationRequest: MutationRequest = {
      mutation: request.query,
      variables: request.variables
    }
    delete (request as any).query
    return mutationRequest
  }

  /**
   * Creates a new Mutation Request for the given parameters
   */
  createMutationQuery({ variables = null }: { variables?: GraphQLVariables | null } = {}): MutationRequest {
    const request = super.createQuery({ variables });
    const mutationRequest: MutationRequest = {
      mutation: request.query,
      variables: request.variables
    };
    return mutationRequest;
  }

  /**
   * Sends the Mutation to a Knish.IO node and returns the Response
   */
  async execute({ variables = {} as MutationVariables, context = {} }: MutationOptions = {}): Promise<Response> {
    this.$__mutationRequest = this.createMutationQuery({ variables });

    const mergedContext: QueryContext = {
      ...context,
      ...this.createQueryContext()
    };

    try {
      const mutationParams = {
        ...this.$__mutationRequest,
        context: mergedContext
      };
      const response = await this.client.mutate(mutationParams);

      this.$__response = await this.createResponseRaw(response as any);

      return this.$__response;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.mutationLogger.warn('Mutation was cancelled');
        // Create a custom response for cancelled mutations
        return new Response({
          query: this as any,
          json: { data: { Wallet: [] }, errors: [{ message: 'Mutation was cancelled' }] }
        });
      } else {
        throw error;
      }
    }
  }

  /**
   * Create additional context for the mutation
   * Override this method in subclasses if needed
   */
  createQueryContext(): QueryContext {
    return {};
  }
}
