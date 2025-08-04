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

/**
 * GraphQL Mutation variable type definitions for Knish.IO SDK
 */

import type { MetaData } from '../meta'
import type { WalletLike } from '../wallet'

import type { QueryOptions, GraphQLVariables, MutationVariables } from '../index'

/**
 * Base mutation options interface
 */
export interface MutationOptions extends Omit<QueryOptions, 'variables'> {
  variables?: MutationVariables;
}

/**
 * Base mutation request interface
 */
export interface MutationRequest {
  mutation: string | unknown; // TypedDocumentNode
  variables: GraphQLVariables | null;
}

/**
 * Mutation variables for active session mutations
 */
export interface MutationActiveSessionVariables {
  bundleHash: string;
  metaType: string;
  metaId: string;
  meta?: MetaData;
}

/**
 * Mutation variables for create identifier mutations
 */
export interface MutationCreateIdentifierVariables {
  type: string;
  contact: string;
  code?: string;
}

/**
 * Mutation variables for create rule mutations
 */
export interface MutationCreateRuleVariables {
  metaType: string;
  metaId: string;
  rule: unknown[];
  policy: MetaData;
}

/**
 * Mutation variables for create token mutations
 */
export interface MutationCreateTokenVariables {
  recipientWallet: WalletLike;
  amount: string | number;
  meta?: Record<string, unknown> | null;
}

/**
 * Mutation variables for propose molecule mutations
 */
export interface MutationProposeMoleculeVariables {
  molecule: unknown;
  meta?: MetaData;
}

/**
 * Mutation variables for request authorization mutations
 */
export interface MutationRequestAuthorizationVariables {
  meta: MetaData;
}

/**
 * Mutation variables for request tokens mutations
 */
export interface MutationRequestTokensVariables {
  token: string;
  amount: string | number;
  metaType: string;
  metaId: string;
  meta?: Record<string, unknown> | null;
  batchId?: string | null;
}

/**
 * Mutation variables for transfer tokens mutations
 */
export interface MutationTransferTokensVariables {
  recipientWallet: WalletLike;
  amount: string | number;
  memo?: string;
  meta?: MetaData;
}