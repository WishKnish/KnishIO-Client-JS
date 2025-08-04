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

import type { GraphQLVariables, GraphQLResponse, UrqlClientWrapper } from '@/types';
import type { TypedDocumentNode } from '@urql/core';
import CodeException from '@/exception/CodeException';
import Response from '../response/Response';
import { createScopedLogger } from '../libraries/Logger';
import type KnishIOClient from '../KnishIOClient';

import type { QueryOptions, QueryRequest, QueryContext } from '@/types';

/**
 * Base class for all GraphQL query operations
 */
export default class Query {
  protected client: UrqlClientWrapper;
  protected knishIOClient: KnishIOClient;
  protected $__variables: GraphQLVariables | null = null;
  protected $__query: string | TypedDocumentNode | null = null;
  protected $__response: Response | null = null;
  protected $__request: QueryRequest | null = null;
  private logger = createScopedLogger('Query');

  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor(graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient) {
    this.client = graphQLClient;
    this.knishIOClient = knishIOClient;
  }

  /**
   * Return a response object
   * Used at KnishIOClient::createMolecule => sets the source wallet from the remainder one stored in response object
   */
  response(): Response | null {
    return this.$__response;
  }

  /**
   * Builds a Response based on JSON input
   */
  async createResponseRaw(response: GraphQLResponse): Promise<Response> {
    return this.createResponse(response);
  }

  /**
   * Returns a Response object
   */
  createResponse(json: GraphQLResponse): Response {
    return new Response({
      query: this,
      json
    });
  }

  /**
   * Creates a new Request for the given parameters
   */
  createQuery({ variables = null }: { variables?: GraphQLVariables | null } = {}): QueryRequest {
    this.$__variables = this.compiledVariables(variables);

    // Uri is a required parameter
    const uri = this.uri();

    if (!uri) {
      throw new CodeException('Query::createQuery() - Node URI was not initialized for this client instance!');
    }

    if (this.$__query === null) {
      throw new CodeException('Query::createQuery() - GraphQL subscription was not initialized!');
    }

    return {
      query: this.$__query,
      variables: this.variables()
    };
  }

  /**
   * Sends the Query to a Knish.IO node and returns the Response
   */
  async execute({ variables = null, context = {} }: QueryOptions = {}): Promise<Response> {
    this.$__request = this.createQuery({ variables });

    const mergedContext: QueryContext = {
      ...context,
      ...this.createQueryContext()
    };

    try {
      const response = await this.client.query({
        ...this.$__request,
        context: mergedContext
      });

      this.$__response = await this.createResponseRaw(response as any);

      return this.$__response;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.logger.warn('Query was cancelled');
        // Create a custom response for cancelled queries
        return new Response({
          query: this,
          json: { data: { Wallet: [] }, errors: [{ message: 'Query was cancelled' }] }
        });
      } else {
        throw error;
      }
    }
  }

  /**
   * Returns a variables object for the Query
   */
  compiledVariables(variables: GraphQLVariables | null = null): GraphQLVariables {
    return variables || {};
  }

  /**
   * Returns the Knish.IO endpoint URI
   */
  uri(): string {
    return (this.client as any).getUri();
  }

  /**
   * Returns the query variables object
   */
  variables(): GraphQLVariables | null {
    return this.$__variables;
  }

  /**
   * Create additional context for the query
   * Override this method in subclasses if needed
   */
  createQueryContext(): QueryContext {
    return {};
  }
}
