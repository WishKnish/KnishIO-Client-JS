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
                      (((((((((((((((((((              ((((((((((((((
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

import Mutation from '../mutation/Mutation'
import ResponseLinkIdentifier from '../response/ResponseLinkIdentifier'
import { gql } from '@urql/core'
import type { GraphQLResponse } from '../types'
import type KnishIOClient from '../KnishIOClient'
import type UrqlClientWrapper from '../libraries/urql/UrqlClientWrapper'

/**
 * Mutation for linking an Identifier to a Wallet Bundle
 * 
 * This mutation allows linking external identifiers (such as usernames, email addresses,
 * or other identity markers) to existing wallet bundles on the Knish.IO network.
 * This enables identity mapping and cross-reference functionality.
 */
export default class MutationLinkIdentifier extends Mutation {
  /**
   * Creates a new MutationLinkIdentifier instance
   * 
   * @param graphQLClient - The GraphQL client wrapper for network communication
   * @param knishIOClient - The main Knish.IO client instance
   */
  constructor(graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient) {
    super(graphQLClient, knishIOClient)

    this.$__query = gql`mutation( $bundle: String!, $type: String!, $content: String! ) {
      LinkIdentifier( bundle: $bundle, type: $type, content: $content ) {
        type,
        bundle,
        content,
        set,
        message
      }
    }`
  }

  /**
   * Creates a response object from the GraphQL result
   * 
   * @param json - The raw GraphQL response data
   * @returns A ResponseLinkIdentifier instance for handling the response
   */
  createResponse(json: GraphQLResponse): ResponseLinkIdentifier {
    return new ResponseLinkIdentifier({
      query: this,
      json
    })
  }
}
