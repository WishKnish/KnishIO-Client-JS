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

import type { GraphQLResponse } from '@/types';
import InvalidResponseException from '@/exception/InvalidResponseException';
import UnauthenticatedException from '@/exception/UnauthenticatedException';
import Dot from '../libraries/Dot';
import type Query from '../query/Query';
import type { ResponseOptions } from '../types';


/**
 * Base Response class for processing node responses
 */
export default class Response {
  protected dataKey: string | null;
  protected errorKey = 'exception';
  protected $__payload: unknown = null;
  protected $__query: Query;
  protected $__originResponse: GraphQLResponse;
  protected $__response: GraphQLResponse;

  /**
   * Class constructor
   */
  constructor({ query, json, dataKey = null }: ResponseOptions) {
    this.dataKey = dataKey;
    this.$__query = query;
    this.$__originResponse = json;
    this.$__response = json;

    if (typeof this.$__response === 'undefined' || this.$__response === null) {
      throw new InvalidResponseException();
    }

    if (Dot.has(this.$__response as Record<string, unknown>, this.errorKey)) {
      const error = Dot.get(this.$__response as Record<string, unknown>, this.errorKey);

      if (String(error).includes('Unauthenticated')) {
        throw new UnauthenticatedException();
      }

      throw new InvalidResponseException();
    }

    this.init();
  }

  /**
   * Initialize the response - override in subclasses
   */
  protected init(): void {
    // Override in subclasses
  }

  /**
   * Get response data, optionally by key
   */
  data(): unknown {
    if (!this.dataKey) {
      return this.response();
    }

    // Check key & return custom data from the response
    if (!Dot.has(this.response() as Record<string, unknown>, this.dataKey)) {
      throw new InvalidResponseException();
    }

    return Dot.get(this.response() as Record<string, unknown>, this.dataKey);
  }

  /**
   * Get the raw response object
   */
  response(): GraphQLResponse {
    return this.$__response;
  }

  /**
   * Get the payload - override in subclasses
   */
  payload(): unknown {
    return null;
  }

  /**
   * Get the originating query
   */
  query(): Query {
    return this.$__query;
  }

  /**
   * Get response status - override in subclasses
   */
  status(): unknown {
    return null;
  }
}
