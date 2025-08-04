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
 * GraphQL operation types for Knish.IO SDK
 */

import type { GraphQLVariables } from './api'
import type { NormalizedMeta } from './meta'

/**
 * Generic GraphQL response structure
 */
export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

// Base GraphQL operation interfaces
export interface BaseQueryVariables extends GraphQLVariables {}
export interface BaseMutationVariables extends GraphQLVariables {}
export interface SubscriptionVariables extends GraphQLVariables {}

// Common GraphQL field types
export interface AtomGraphQL {
  position: string;
  walletAddress: string;
  isotope: string;
  token: string;
  value: string;
  batchId: string;
  metaType?: string;
  metaId?: string;
  meta?: NormalizedMeta[];
  index?: number;
  otsFragment?: string;
}

export interface MoleculeGraphQL {
  molecularHash: string;
  height: number;
  depth: number;
  status: string;
  createdAt: string;
  cellSlug: string;
  bundle: string;
  atoms: AtomGraphQL[];
}

export interface WalletGraphQL {
  address: string;
  bundle: string;
  token: string;
  balance: string;
  tokenSlug: string;
  position: string;
  createdAt: string;
}

export interface BalanceGraphQL {
  address: string;
  bundleHash: string;
  token: string;
  balance: string;
  molecularHash: string;
  position: string;
  amount: string;
  characterCount: number;
  pubkey: string;
  createdAt: string;
}

export interface MetaTypeGraphQL {
  metaType: string;
  metaId: string;
  meta: NormalizedMeta[];
  molecule: MoleculeGraphQL;
  snapshotMolecule?: MoleculeGraphQL;
}

export interface BatchGraphQL {
  batchId: string;
  height: number;
  atoms: AtomGraphQL[];
}

export interface TokenGraphQL {
  slug: string;
  name: string;
  supply: string;
  decimals: number;
  amount: string;
  meta: NormalizedMeta[];
  fungibility: string;
  stackable: boolean;
  splittable: boolean;
  burnt: boolean;
}

export interface ContinuIdGraphQL {
  continuId: string;
  hash: string;
}

export interface UserActivityGraphQL {
  address: string;
  metaType: string;
  metaId: string;
  count: number;
  latest: string;
}

export interface AuthSessionGraphQL {
  token: string;
  time: number;
  wallet: string;
  encrypt: boolean;
}

// Query response types
export interface QueryBalanceResponse extends GraphQLResponse {
  data?: {
    Wallet: BalanceGraphQL[];
  };
}

export interface QueryWalletBundleResponse extends GraphQLResponse {
  data?: {
    Wallet: WalletGraphQL[];
  };
}

export interface QueryWalletListResponse extends GraphQLResponse {
  data?: {
    Wallet: WalletGraphQL[];
  };
}

export interface QueryAtomResponse extends GraphQLResponse {
  data?: {
    Atom: AtomGraphQL[];
  };
}

export interface QueryBatchResponse extends GraphQLResponse {
  data?: {
    Batch: BatchGraphQL;
  };
}

export interface QueryBatchHistoryResponse extends GraphQLResponse {
  data?: {
    Batch: BatchGraphQL[];
  };
}

export interface QueryMetaTypeResponse extends GraphQLResponse {
  data?: {
    MetaType: MetaTypeGraphQL[];
  };
}

export interface QueryTokenResponse extends GraphQLResponse {
  data?: {
    Token: TokenGraphQL[];
  };
}

export interface QueryContinuIdResponse extends GraphQLResponse {
  data?: {
    ContinuId: ContinuIdGraphQL;
  };
}

export interface QueryActiveSessionResponse extends GraphQLResponse {
  data?: {
    ActiveSession: AuthSessionGraphQL[];
  };
}

export interface QueryUserActivityResponse extends GraphQLResponse {
  data?: {
    UserActivity: UserActivityGraphQL[];
  };
}

export interface QueryPolicyResponse extends GraphQLResponse {
  data?: {
    Policy: {
      policy: string;
      rules: string[];
    }[];
  };
}

// Mutation response types
export interface MutationProposeMoleculeResponse extends GraphQLResponse {
  data?: {
    ProposeMolecule: {
      molecularHash: string;
      height: number;
      status: string;
      reason?: string;
      payload?: unknown;
    };
  };
}

export interface MutationCreateWalletResponse extends GraphQLResponse {
  data?: {
    CreateWallet: {
      molecularHash: string;
      status: string;
      wallet?: WalletGraphQL;
    };
  };
}

export interface MutationTransferTokensResponse extends GraphQLResponse {
  data?: {
    TransferTokens: {
      molecularHash: string;
      status: string;
      fromWallet?: WalletGraphQL;
      toWallet?: WalletGraphQL;
    };
  };
}

export interface MutationCreateTokenResponse extends GraphQLResponse {
  data?: {
    CreateToken: {
      molecularHash: string;
      status: string;
      token?: TokenGraphQL;
    };
  };
}

export interface MutationRequestAuthorizationResponse extends GraphQLResponse {
  data?: {
    RequestAuthorization: {
      token: string;
      pubkey: string;
      signature: string;
    };
  };
}

export interface MutationRequestAuthorizationGuestResponse extends GraphQLResponse {
  data?: {
    RequestAuthorizationGuest: {
      token: string;
      pubkey: string;
      signature: string;
    };
  };
}

export interface MutationActiveSessionResponse extends GraphQLResponse {
  data?: {
    ActiveSession: AuthSessionGraphQL;
  };
}

export interface MutationCreateIdentifierResponse extends GraphQLResponse {
  data?: {
    CreateIdentifier: {
      molecularHash: string;
      status: string;
    };
  };
}

export interface MutationLinkIdentifierResponse extends GraphQLResponse {
  data?: {
    LinkIdentifier: {
      molecularHash: string;
      status: string;
    };
  };
}

export interface MutationCreateMetaResponse extends GraphQLResponse {
  data?: {
    CreateMeta: {
      molecularHash: string;
      status: string;
    };
  };
}

export interface MutationCreateRuleResponse extends GraphQLResponse {
  data?: {
    CreateRule: {
      molecularHash: string;
      status: string;
    };
  };
}

export interface MutationClaimShadowWalletResponse extends GraphQLResponse {
  data?: {
    ClaimShadowWallet: {
      molecularHash: string;
      status: string;
      wallet?: WalletGraphQL;
    };
  };
}

export interface MutationRequestTokensResponse extends GraphQLResponse {
  data?: {
    RequestTokens: {
      molecularHash: string;
      status: string;
    };
  };
}

export interface MutationDepositBufferTokenResponse extends GraphQLResponse {
  data?: {
    DepositBufferToken: {
      molecularHash: string;
      status: string;
    };
  };
}

export interface MutationWithdrawBufferTokenResponse extends GraphQLResponse {
  data?: {
    WithdrawBufferToken: {
      molecularHash: string;
      status: string;
    };
  };
}

// Subscription types
export interface SubscriptionMoleculeStatusUpdate {
  MoleculeStatusUpdate: {
    molecularHash: string;
    status: string;
    height?: number;
    reason?: string;
  };
}

export interface SubscriptionActiveWalletUpdate {
  ActiveWalletUpdate: WalletGraphQL;
}

export interface SubscriptionWalletStatusUpdate {
  WalletStatusUpdate: {
    address: string;
    status: string;
    balance?: string;
  };
}

// Input types for mutations
export interface MoleculeInput {
  molecularHash: string;
  height: number;
  depth: number;
  cellSlug: string;
  bundle: string;
  status: string;
  atoms: AtomInput[];
}

export interface AtomInput {
  position: string;
  walletAddress: string;
  isotope: string;
  token: string;
  value: string;
  batchId: string;
  metaType?: string;
  metaId?: string;
  meta?: NormalizedMeta[];
  index?: number;
  otsFragment?: string;
}
