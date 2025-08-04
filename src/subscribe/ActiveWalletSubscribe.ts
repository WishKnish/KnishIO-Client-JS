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
 * Variables for ActiveWallet subscription
 */
export interface ActiveWalletSubscribeVariables extends SubscriptionVariables {
  bundle: string;
}

/**
 * Response data structure for ActiveWallet subscription
 */
export interface ActiveWalletSubscribeResponse {
  ActiveWallet: {
    address: string;
    bundleHash: string;
    walletBundle: {
      bundleHash: string;
      slug: string;
      createdAt: string;
    };
    tokenSlug: string;
    token: {
      slug: string;
      name: string;
      fungibility: string;
      supply: string;
      decimals: number;
      amount: string;
      icon: string;
      createdAt: string;
    };
    batchId: string;
    position: string;
    characters: string;
    pubkey: string;
    amount: string;
    createdAt: string;
    metas: Array<{
      molecularHash: string;
      position: string;
      metaType: string;
      metaId: string;
      key: string;
      value: string;
      createdAt: string;
    }>;
  };
}

/**
 * Subscription class for monitoring active wallet changes
 * 
 * This subscription listens for real-time updates when wallets become active
 * or their activity status changes for a specific wallet bundle. It provides
 * comprehensive wallet information including token details, metadata, and
 * associated bundle information.
 * 
 * @example
 * ```typescript
 * const subscription = new ActiveWalletSubscribe(client);
 * const handle = await subscription.execute({
 *   variables: { bundle: 'wallet-bundle-hash' },
 *   closure: (result) => {
 *     console.log('Active wallet update:', result.ActiveWallet);
 *     console.log('Wallet address:', result.ActiveWallet.address);
 *     console.log('Token info:', result.ActiveWallet.token);
 *   }
 * });
 * ```
 */
export default class ActiveWalletSubscribe extends Subscribe {
  /**
   * Creates a new ActiveWalletSubscribe instance
   * 
   * @param graphQLClient - The URQL client wrapper for GraphQL operations
   */
  constructor(graphQLClient: UrqlClientWrapper) {
    super(graphQLClient);
    this.$__subscribe = gql`
      subscription onActiveWallet ( $bundle: String! ) {
        ActiveWallet( bundle: $bundle ) {
          address,
          bundleHash,
          walletBundle {
            bundleHash,
            slug,
            createdAt,
          },
          tokenSlug,
          token {
            slug,
            name,
            fungibility,
            supply,
            decimals,
            amount,
            icon,
            createdAt
          },
          batchId,
          position,
          characters,
          pubkey,
          amount,
          createdAt,
          metas {
            molecularHash,
            position,
            metaType,
            metaId,
            key,
            value,
            createdAt,
          }
        }
      }
    `;
  }
}