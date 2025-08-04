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
 * Type guards for runtime validation in Knish.IO SDK
 */

import type { 
  WalletLike, 
  AuthTokenData, 
  MetaData, 
  MetaObject, 
  NormalizedMeta,
  GraphQLResponse,
  IsotopeType 
} from '@/types'

/**
 * Type guard to check if value is a WalletLike object
 */
export function isWalletLike(value: unknown): value is WalletLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as WalletLike).position === 'string' &&
    typeof (value as WalletLike).address === 'string' &&
    typeof (value as WalletLike).token === 'string' &&
    typeof (value as WalletLike).batchId === 'string' &&
    typeof (value as WalletLike).pubkey === 'string' &&
    typeof (value as WalletLike).characters === 'string' &&
    typeof (value as WalletLike).bundle === 'string'
  )
}

/**
 * Type guard to check if value is AuthTokenData
 */
export function isAuthTokenData(value: unknown): value is AuthTokenData {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AuthTokenData).token === 'string' &&
    typeof (value as AuthTokenData).pubkey === 'string' &&
    (typeof (value as AuthTokenData).expiresAt === 'undefined' ||
     typeof (value as AuthTokenData).expiresAt === 'string' ||
     typeof (value as AuthTokenData).expiresAt === 'number') &&
    (typeof (value as AuthTokenData).encrypt === 'undefined' ||
     typeof (value as AuthTokenData).encrypt === 'boolean')
  )
}

/**
 * Type guard to check if value is a MetaObject
 */
export function isMetaObject(value: unknown): value is MetaObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(v => 
      typeof v === 'string' || 
      typeof v === 'number' || 
      typeof v === 'boolean' || 
      v === null
    )
  )
}

/**
 * Type guard to check if value is a NormalizedMeta array
 */
export function isNormalizedMetaArray(value: unknown): value is NormalizedMeta[] {
  return (
    Array.isArray(value) &&
    value.every(item => 
      typeof item === 'object' &&
      item !== null &&
      typeof (item as NormalizedMeta).key === 'string' &&
      (typeof (item as NormalizedMeta).value === 'string' ||
       typeof (item as NormalizedMeta).value === 'number' ||
       typeof (item as NormalizedMeta).value === 'boolean' ||
       (item as NormalizedMeta).value === null)
    )
  )
}

/**
 * Type guard to check if value is valid MetaData
 */
export function isMetaData(value: unknown): value is MetaData {
  return (
    isMetaObject(value) ||
    isNormalizedMetaArray(value) ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  )
}

/**
 * Type guard to check if value is a GraphQL response
 */
export function isGraphQLResponse(value: unknown): value is GraphQLResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    (typeof (value as GraphQLResponse).data === 'undefined' ||
     (value as GraphQLResponse).data !== undefined) &&
    (typeof (value as GraphQLResponse).errors === 'undefined' ||
     Array.isArray((value as GraphQLResponse).errors))
  )
}

/**
 * Type guard to check if value is a valid IsotopeType
 */
export function isIsotopeType(value: unknown): value is IsotopeType {
  return (
    typeof value === 'string' &&
    ['V', 'M', 'C', 'T', 'I', 'R', 'U', 'S'].includes(value)
  )
}

/**
 * Assertion function for WalletLike objects
 */
export function assertWalletLike(value: unknown, message = 'Expected WalletLike object'): asserts value is WalletLike {
  if (!isWalletLike(value)) {
    throw new TypeError(message)
  }
}

/**
 * Assertion function for AuthTokenData
 */
export function assertAuthTokenData(value: unknown, message = 'Expected AuthTokenData object'): asserts value is AuthTokenData {
  if (!isAuthTokenData(value)) {
    throw new TypeError(message)
  }
}

/**
 * Assertion function for MetaData
 */
export function assertMetaData(value: unknown, message = 'Expected valid MetaData'): asserts value is MetaData {
  if (!isMetaData(value)) {
    throw new TypeError(message)
  }
}