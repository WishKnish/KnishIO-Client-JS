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
 * Wallet-related type definitions for Knish.IO SDK
 */

export interface WalletCredentials {
  address: string;
  token: string;
  position: string;
  bundle: string;
  publicKey: string;
  privateKey?: string | undefined;
  characters?: string | undefined;
  secret?: string | null;
}

export interface WalletOptions {
  secret?: string | null;
  bundle?: string | null;
  token?: string | null;
  address?: string | null;
  position?: string | null | undefined;
  batchId?: string | null | undefined;
  characters?: string | null | undefined;
  balance?: number | null;
  privateKey?: string | undefined;
  publicKey?: string;
}

export interface WalletLike {
  position: string | null;
  address: string | null;
  token: string;
  batchId: string | null;
  pubkey: string | null;
  characters: string | null;
  bundle: string | null;
  balance: number;
  tokenUnits?: unknown[];
  tradeRates?: Record<string, unknown>;
  getTokenUnitsData?(): unknown[];
}

export interface TokenUnit {
  id: string;
  name: string;
  metas: Record<string, unknown>;
}

