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
 * Cryptographic type definitions for Knish.IO SDK
 */

/**
 * ML-KEM (post-quantum) key pair interface
 */
export interface MLKEMKeys {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

/**
 * Batch ID generation options
 */
export interface BatchIdOptions {
  molecularHash?: string | null;
  index?: number | null;
}

/**
 * Cryptographic bundle containing keys and metadata
 */
export interface CryptoBundle {
  public: string;
  private: string;
  seed: string;
}

/**
 * Encryption result containing encrypted data and metadata
 */
export interface EncryptionResult {
  encryptedData: string;
  ephemeralPublicKey: string;
  mac: string;
}

/**
 * Signature data for molecular signing
 */
export interface SignatureData {
  signature: string;
  signaturePosition: string;
  signatureChecksum: string;
}

/**
 * One-Time Signature data
 */
export interface OTSSignature {
  otsFragment: string;
  position: string;
  pubkey: string;
}

/**
 * Supported version types for the SDK
 */
export type SupportedVersion = '4.0';

/**
 * Version handler interface for different SDK versions
 */
export interface VersionHandler {
  version: SupportedVersion;
  hashAtom: (atoms: unknown[]) => string;
  [key: string]: unknown;
}