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
 * Variables for WalletStatus subscription
 */
export interface WalletStatusSubscribeVariables extends SubscriptionVariables {
  bundle: string;
  token: string;
}

/**
 * Response data structure for WalletStatus subscription
 */
export interface WalletStatusSubscribeResponse {
  WalletStatus: {
    bundle: string;
    token: string;
    admission: string;
    balance: string;
  };
}

/**
 * Subscription class for monitoring wallet status changes
 * 
 * This subscription listens for real-time updates to wallet status including
 * balance changes, admission status, and other wallet-related events for a
 * specific wallet bundle and token combination.
 * 
 * @example
 * ```typescript
 * const subscription = new WalletStatusSubscribe(client);
 * const handle = await subscription.execute({
 *   variables: { 
 *     bundle: 'wallet-bundle-hash',
 *     token: 'TOKEN_SLUG'
 *   },
 *   closure: (result) => {
 *     console.log('Wallet status updated:', result.WalletStatus);
 *     console.log('New balance:', result.WalletStatus.balance);
 *   }
 * });
 * ```
 */
export default class WalletStatusSubscribe extends Subscribe {
  /**
   * Creates a new WalletStatusSubscribe instance
   * 
   * @param graphQLClient - The URQL client wrapper for GraphQL operations
   */
  constructor(graphQLClient: UrqlClientWrapper) {
    super(graphQLClient);
    this.$__subscribe = gql`
      subscription onWalletStatus ( $bundle: String!, $token: String! ) {
        WalletStatus( bundle: $bundle, token: $token ) {
          bundle,
          token,
          admission,
          balance,
        }
      }
    `;
  }
}