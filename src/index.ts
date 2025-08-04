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

// Import TypeScript versions (canon-equivalent)
import KnishIOClient from './KnishIOClient'  // Keep JS version since TS has compilation issues
import Atom from './Atom'
import Meta from './Meta'
import AtomMeta from './AtomMeta'
import Molecule from './Molecule'
import Wallet from './Wallet'

// Import utility functions
import {
  base64ToHex,
  bufferToHexString,
  charsetBaseConvert,
  chunkSubstr,
  hexStringToBuffer,
  hexToBase64,
  isHex,
  randomString
} from './libraries/strings'

import {
  generateBundleHash,
  generateSecret
} from './libraries/crypto'

// Import exception classes (TypeScript versions)
import BaseException from './exception/BaseException'
import AtomsMissingException from './exception/AtomsMissingException'
import WalletCredentialException from './exception/WalletCredentialException'
import TransferBalanceException from './exception/TransferBalanceException'
import SignatureMismatchException from './exception/SignatureMismatchException'

// Re-export all types
export type * from '@/types'

// Export main classes
export {
  Atom,
  Molecule,
  Wallet,
  Meta,
  AtomMeta,
  KnishIOClient,

  // Exception classes
  BaseException,
  AtomsMissingException,
  WalletCredentialException,
  TransferBalanceException,
  SignatureMismatchException,

  // String utility functions
  chunkSubstr,
  base64ToHex,
  bufferToHexString,
  charsetBaseConvert,
  hexStringToBuffer,
  hexToBase64,
  isHex,
  randomString,

  // Cryptographic utility functions
  generateSecret,
  generateBundleHash
}

// Default export for backward compatibility
export default KnishIOClient
