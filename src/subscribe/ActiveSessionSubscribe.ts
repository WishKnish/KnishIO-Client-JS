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

import Subscribe from './Subscribe';
import { gql } from '@urql/core';
import type { UrqlClientWrapper, SubscriptionVariables } from '@/types';

/**
 * Variables for ActiveSession subscription
 */
export interface ActiveSessionSubscribeVariables extends SubscriptionVariables {
  metaType: string;
  metaId: string;
}

/**
 * Response data structure for ActiveSession subscription
 */
export interface ActiveSessionSubscribeResponse {
  ActiveUser: {
    bundleHash: string;
    metaType: string;
    metaId: string;
    jsonData: string;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Subscription class for monitoring active user session changes
 * 
 * This subscription listens for real-time updates when user sessions become active
 * or their activity status changes. It monitors specific meta type and meta ID
 * combinations to track user activity and session state changes.
 * 
 * @example
 * ```typescript
 * const subscription = new ActiveSessionSubscribe(client);
 * const handle = await subscription.execute({
 *   variables: { 
 *     metaType: 'UserSession',
 *     metaId: 'user-identifier'
 *   },
 *   closure: (result) => {
 *     console.log('Active session update:', result.ActiveUser);
 *     console.log('Session data:', JSON.parse(result.ActiveUser.jsonData));
 *   }
 * });
 * ```
 */
export default class ActiveSessionSubscribe extends Subscribe {
  /**
   * Creates a new ActiveSessionSubscribe instance
   * 
   * @param graphQLClient - The URQL client wrapper for GraphQL operations
   */
  constructor(graphQLClient: UrqlClientWrapper) {
    super(graphQLClient);
    this.$__subscribe = gql`
      subscription onActiveUser ( $metaType: String!, $metaId: String! ) {
        ActiveUser( metaType: $metaType, metaId: $metaId ) {
          bundleHash,
          metaType,
          metaId,
          jsonData,
          createdAt,
          updatedAt
        }
      }`;
  }
}