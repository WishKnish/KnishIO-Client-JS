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
 * Variables for CreateMolecule subscription
 */
export interface CreateMoleculeSubscribeVariables extends SubscriptionVariables {
  bundle: string;
}

/**
 * Response data structure for CreateMolecule subscription
 */
export interface CreateMoleculeSubscribeResponse {
  CreateMolecule: {
    molecularHash: string;
    cellSlug: string;
    counterparty: string;
    bundleHash: string;
    status: string;
    local: boolean;
    height: number;
    depth: number;
    createdAt: string;
    receivedAt: string;
    processedAt: string;
    broadcastedAt: string;
    reason: string;
    reasonPayload: unknown;
    payload: unknown;
    atoms: Array<{
      molecularHash: string;
      position: string;
      isotope: string;
      walletAddress: string;
      tokenSlug: string;
      batchId: string;
      value: string;
      index: number;
      metaType: string;
      metaId: string;
      metasJson: string;
      otsFragment: string;
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
    }>;
  };
}

/**
 * Subscription class for monitoring molecule creation events
 * 
 * This subscription listens for real-time updates when new molecules are created
 * for a specific wallet bundle, providing complete molecule and atom information
 * including metadata and status updates.
 * 
 * @example
 * ```typescript
 * const subscription = new CreateMoleculeSubscribe(client);
 * const handle = await subscription.execute({
 *   variables: { bundle: 'wallet-bundle-hash' },
 *   closure: (result) => {
 *     console.log('New molecule created:', result.CreateMolecule);
 *   }
 * });
 * ```
 */
export default class CreateMoleculeSubscribe extends Subscribe {
  /**
   * Creates a new CreateMoleculeSubscribe instance
   * 
   * @param graphQLClient - The URQL client wrapper for GraphQL operations
   */
  constructor(graphQLClient: UrqlClientWrapper) {
    super(graphQLClient);
    this.$__subscribe = gql`
      subscription onCreateMolecule ( $bundle: String! ) {
        CreateMolecule( bundle: $bundle ) {
          molecularHash,
          cellSlug,
          counterparty,
          bundleHash,
          status,
          local,
          height,
          depth,
          createdAt,
          receivedAt,
          processedAt,
          broadcastedAt,
          reason,
          reasonPayload,
          payload,
          status,
          atoms {
            molecularHash,
            position,
            isotope,
            walletAddress,
            tokenSlug,
            batchId,
            value,
            index,
            metaType,
            metaId,
            metasJson,
            otsFragment,
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
      }
    `;
  }
}