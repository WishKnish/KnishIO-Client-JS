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
 * Mutation-related type definitions for Knish.IO SDK
 */

import type { WalletLike } from './wallet'
import type { MetaData } from './meta'

export interface MutationVariables {
  [key: string]: unknown;
}

export interface TransferTokensParams {
  recipientWallet: WalletLike;
  amount: number | string;
}

export interface CreateTokenParams {
  recipientWallet: WalletLike;
  amount: number | string;
  meta: MetaData;
}

export interface CreateWalletParams {
  wallet: WalletLike;
}

export interface CreateMetaParams {
  metaType: string;
  metaId: string;
  meta: MetaData;
  policy?: MetaData;
}

export interface CreateIdentifierParams {
  type: string;
  contact: string;
  code: string;
}

export interface RequestTokensParams {
  token: string;
  amount: number | string;
  metaType: string;
  metaId: string;
  meta?: MetaData;
  batchId?: string;
}

export interface RequestAuthorizationParams {
  meta: MetaData;
}

export interface ClaimShadowWalletParams {
  token: string;
  batchId?: string;
}

export interface CreateRuleParams {
  metaType: string;
  metaId: string;
  rule: unknown[];
  policy: MetaData;
}