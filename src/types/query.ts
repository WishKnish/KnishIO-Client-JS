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
 * Query-related type definitions for Knish.IO SDK
 */

export interface QueryVariables {
  [key: string]: unknown;
}

export interface BalanceQueryVariables {
  bundleHash?: string;
  token?: string;
  limit?: number;
  latest?: boolean;
}

export interface AtomQueryVariables {
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

export interface BatchQueryVariables {
  batchId?: string;
  limit?: number;
  latest?: boolean;
}

export interface WalletBundleQueryVariables {
  bundleHash: string;
}

export interface WalletListQueryVariables {
  bundleHash?: string;
  token?: string;
  limit?: number;
  latest?: boolean;
}

export interface MetaTypeQueryVariables {
  metaType?: string;
  metaId?: string;
  key?: string;
  value?: string;
  latest?: boolean;
  limit?: number;
}

export interface TokenQueryVariables {
  token?: string;
  limit?: number;
  latest?: boolean;
}

export interface ContinuIdQueryVariables {
  bundleHash: string;
}

export interface ActiveSessionQueryVariables {
  bundleHash: string;
  metaType: string;
  metaId: string;
}

export interface UserActivityQueryVariables {
  bundleHash?: string;
  metaType?: string;
  metaId?: string;
  interval?: string;
  limit?: number;
  latest?: boolean;
}

export interface PolicyQueryVariables {
  metaType: string;
  metaId: string;
}