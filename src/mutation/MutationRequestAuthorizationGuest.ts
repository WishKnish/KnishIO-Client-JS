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
import Mutation from '../mutation/Mutation';
import type { GraphQLResponse } from '../types/graphql';
import type { UrqlClientWrapper } from '../types/client';
import type KnishIOClient from '../KnishIOClient';
import ResponseRequestAuthorizationGuest from '../response/ResponseRequestAuthorizationGuest';
import { gql } from '@urql/core';

/**
 * Variables for guest authorization request
 */
export interface MutationRequestAuthorizationGuestVariables {
  cellSlug?: string | null;
  pubkey?: string | null;
  encrypt?: boolean | null;
}

/**
 * Mutation for requesting guest authorization access token
 */
export default class MutationRequestAuthorizationGuest extends Mutation {
  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   */
  constructor (graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`mutation( $cellSlug: String, $pubkey: String, $encrypt: Boolean ) {
      AccessToken( cellSlug: $cellSlug, pubkey: $pubkey, encrypt: $encrypt ) {
        token,
        pubkey,
        expiresAt
      }
    }`
  }

  /**
   * Returns a Response object
   *
   * @param json - The GraphQL response data
   * @return Response for guest authorization request
   */
  createResponse (json: GraphQLResponse): ResponseRequestAuthorizationGuest {
    return new ResponseRequestAuthorizationGuest({
      query: this,
      json
    })
  }
}