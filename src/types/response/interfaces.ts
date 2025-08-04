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
 * Response interface definitions for Knish.IO SDK
 */

/**
 * Base response options interface
 */
export interface ResponseOptions {
  query: any; // Query instance
  json: any; // GraphQLResponse
  dataKey?: string | null;
  timeout?: number;
  retries?: number;
}

/**
 * Response parameters for atom responses
 */
export interface ResponseAtomParams {
  query: unknown;
  json: unknown;
  limit?: number;
}

/**
 * Atom response payload interface
 */
export interface AtomResponsePayload {
  atoms: unknown[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * Response parameters for balance responses
 */
export interface ResponseBalanceParams {
  query: unknown;
  json: unknown;
  currency?: string;
}

/**
 * Transfer tokens response payload interface
 */
export interface TransferTokensPayload {
  molecularHash: string;
  status: string;
  fromWallet?: unknown;
  toWallet?: unknown;
  amount: number;
  fee?: number;
}