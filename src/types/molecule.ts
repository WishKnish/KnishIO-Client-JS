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
 * Molecule-related type definitions for Knish.IO SDK
 */

import type { WalletLike } from './wallet'
import type { MetaData } from './meta'

export interface MoleculeOptions {
  secret?: string | null;
  bundle?: string | null;
  sourceWallet?: WalletLike | null;
  remainderWallet?: WalletLike | null;
  cellSlug?: string | null;
  version?: string | null;
}

export type MoleculeStatus = 
  | 'pending' 
  | 'broadcasted' 
  | 'accepted' 
  | 'rejected' 
  | 'confirmed';

// SignatureData and OTSSignature are imported from crypto.ts

export interface MoleculeAtom {
  index: number | null;
  isotope: string;
  token: string;
  value: number;
  walletAddress: string;
  batchId: string | null;
  meta: unknown[];
  metaType?: string;
  otsFragment: string;
  aggregatedMeta(): Record<string, unknown>;
}

export interface MoleculeStructure {
  molecularHash: string | null;
  atoms: MoleculeAtom[];
  secret: string | null;
  bundle: string | null;
  getIsotopes(isotope: string): MoleculeAtom[];
  normalizedHash(): number[];
  initValue?: (params: { recipientWallet: WalletLike; amount: number }) => void;
  initWalletCreation?: (wallet: WalletLike) => void;
  initShadowWalletClaim?: (wallet: WalletLike) => void;
  initTokenCreation?: (params: {
    recipientWallet: WalletLike;
    amount: number;
    meta: MetaData;
  }) => void;
  initTokenRequest?: (params: {
    token: string;
    amount: number;
    metaType: string;
    metaId: string;
    meta?: MetaData;
    batchId?: string | null;
  }) => void;
  initIdentifierCreation?: (params: {
    type: string;
    contact: string;
    code: string;
  }) => void;
  initAuthorization?: (params: { meta: MetaData }) => void;
  createRule?: (params: {
    metaType: string;
    metaId: string;
    rule: unknown[];
    policy: MetaData;
  }) => void;
  initMeta?: (params: {
    meta: MetaData;
    metaType: string;
    metaId: string;
    policy?: MetaData;
  }) => void;
  initDepositBuffer?: (params: {
    amount: number | string;
    tradeRates: unknown;
  }) => void;
  initWithdrawBuffer?: (params: {
    recipients: unknown;
    signingWallet: WalletLike;
  }) => void;
  sign?: (params: { bundle?: string }) => void;
  check?: (sourceWallet?: WalletLike) => void;
  sourceWallet?: WalletLike;
}