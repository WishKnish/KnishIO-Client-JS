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
 * Atom-related type definitions for Knish.IO SDK
 */

import type { WalletLike } from './wallet'
import type { MetaData, AtomMetaOptions } from './meta'
import type AtomMeta from '../AtomMeta'

export type IsotopeType = 
  | 'V'  // Value
  | 'M'  // Meta
  | 'C'  // Create
  | 'T'  // Transfer
  | 'I'  // Identity
  | 'R'  // Rule
  | 'U'  // User
  | 'S'  // Shadow
  | 'B'; // Buffer

export type TransactionValue = string | number;

export interface AtomOptions {
  position?: string | null;
  walletAddress?: string | null;
  isotope?: IsotopeType | null;
  token?: string | null;
  value?: TransactionValue | null;
  metaType?: string | null;
  metaId?: string | null;
  meta?: AtomMetaOptions | MetaData | null;
  batchId?: string | null;
  createdAt?: number | null;
  index?: number | null;
  otsFragment?: string | null;
  wallet?: WalletLike | null;
  version?: string | undefined;
}

export interface AtomCreateOptions {
  isotope: IsotopeType;
  wallet?: WalletLike | null;
  value?: TransactionValue | null;
  metaType?: string | null;
  metaId?: string | null | undefined;
  meta?: AtomMeta | MetaData | null;
  batchId?: string | null;
}