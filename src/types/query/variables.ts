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
 * GraphQL Query variable type definitions for Knish.IO SDK
 */

import type { GraphQLVariables } from '../index'

/**
 * Base query options interface
 */
export interface QueryOptions {
  variables?: GraphQLVariables | null;
  context?: Record<string, unknown>;
}

/**
 * Base query request interface
 */
export interface QueryRequest {
  query: string | unknown; // TypedDocumentNode
  variables: GraphQLVariables | null;
}

/**
 * Base query context interface
 */
export interface QueryContext {
  [key: string]: unknown;
}

/**
 * Query variables for active session queries
 */
export interface QueryActiveSessionVariables {
  bundleHash: string;
  metaType: string;
  metaId: string;
}

/**
 * Query variables for atom queries
 */
export interface QueryAtomVariables {
  molecularHash?: string;
  position?: string;
  isotope?: string;
  token?: string;
  walletAddress?: string;
  metaType?: string;
  metaId?: string;
  metaKey?: string;
  metaValue?: string;
  limit?: number;
  latest?: boolean;
}

/**
 * Query variables for balance queries
 */
export interface QueryBalanceVariables {
  bundleHash?: string;
  token?: string;
  limit?: number;
  latest?: boolean;
}

/**
 * Query variables for batch queries
 */
export interface QueryBatchVariables {
  batchId?: string;
  limit?: number;
  latest?: boolean;
}

/**
 * Query variables for ContinuId queries
 */
export interface QueryContinuIdVariables {
  bundleHash: string;
}

/**
 * Query variables for meta type queries
 */
export interface QueryMetaTypeVariables {
  metaType?: string;
  metaId?: string;
  key?: string;
  value?: string;
  latest?: boolean;
  limit?: number;
}

/**
 * Query variables for policy queries
 */
export interface QueryPolicyVariables {
  policy: string;
  limit?: number;
}

/**
 * Query variables for token queries
 */
export interface QueryTokenVariables {
  token?: string;
  limit?: number;
  latest?: boolean;
}

/**
 * Query variables for user activity queries
 */
export interface QueryUserActivityVariables {
  bundleHash: string;
  limit?: number;
  latest?: boolean;
}

/**
 * Query variables for wallet bundle queries
 */
export interface QueryWalletBundleVariables {
  bundleHash: string;
}

/**
 * Query variables for wallet list queries
 */
export interface QueryWalletListVariables {
  bundleHash?: string;
  token?: string;
  limit?: number;
  latest?: boolean;
}