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
 * Client-related type definitions for Knish.IO SDK
 */

/**
 * Configuration options for KnishIO client initialization
 */
export interface KnishIOClientConfig {
  /** GraphQL endpoint URI(s) for the Knish.IO server */
  uri: string | string[];
  /** Cell slug for the blockchain cell to connect to */
  cellSlug?: string;
  /** Enable debug logging */
  logging?: boolean;
  /** Enable client-side encryption */
  encrypt?: boolean;
  /** Enable server-side encryption */
  serverSideEncryption?: boolean;
  /** SDK version to use */
  version?: string;
}

export interface KnishIOClientInitializeOptions {
  secret?: string;
  encrypt?: boolean;
  uri?: string | string[];
  cellSlug?: string | null;
  client?: unknown | null;
  serverSdkVersion?: number;
  logging?: boolean;
}

export interface AuthTokenData {
  token: string;
  pubkey: string;
  expiresAt?: string | number | undefined;
  encrypt?: boolean | undefined;
}

export interface AuthTokenSnapshot {
  getToken(): string;
  getAuthData(): AuthTokenData;
  wallet?: {
    position: string;
    characters: string;
  } | undefined;
  token?: string | undefined;
  expiresAt?: number | undefined;
  pubkey?: string | undefined;
  encrypt?: boolean | undefined;
}

// KnishIOError is defined in errors.ts for comprehensive error handling


export interface UrqlClientWrapper {
  query: (request: { query: unknown, variables?: unknown, context?: unknown }) => Promise<unknown>;
  mutate: (request: { mutation: unknown, variables?: unknown, context?: unknown }) => Promise<unknown>;
  subscribe: (request: { query: unknown, variables?: unknown, operationName: string }, closure: (result: unknown) => void) => { unsubscribe: () => void };
  setUri(uri: string): void;
  setEncryption(encrypt: boolean): void;
  setAuthData(data: unknown): void;
  getSocketUri(): string | null;
  getUri(): string;
}

