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
 * Utility types for better type composition in Knish.IO SDK
 */

import type { WalletOptions, AuthTokenData, MetaData } from '@/types'

/**
 * Make specific properties required in a type
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific properties optional in a type
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Create a type that excludes null and undefined
 */
export type NonNullable<T> = T extends null | undefined ? never : T

/**
 * Extract non-nullable values from a union type
 */
export type DefinedValues<T> = {
  [K in keyof T]: NonNullable<T[K]>
}

/**
 * Wallet credentials with required secret
 */
export type WalletWithSecret = RequireFields<WalletOptions, 'secret'>

/**
 * Wallet credentials with required token and address
 */
export type WalletWithTokenAndAddress = RequireFields<WalletOptions, 'token' | 'address'>

/**
 * AuthToken data with required expiration
 */
export type AuthTokenWithExpiry = RequireFields<AuthTokenData, 'expiresAt'>

/**
 * AuthToken data with required encryption flag
 */
export type AuthTokenWithEncryption = RequireFields<AuthTokenData, 'encrypt'>

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E }

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

/**
 * Configuration object with required fields
 */
export type Config<T> = {
  readonly [K in keyof T]: T[K]
}

/**
 * Branded type for type-safe strings
 */
export type Branded<T, Brand> = T & { readonly __brand: Brand }

/**
 * Type-safe wallet address
 */
export type WalletAddress = Branded<string, 'WalletAddress'>

/**
 * Type-safe token identifier
 */
export type TokenId = Branded<string, 'TokenId'>

/**
 * Type-safe batch identifier
 */
export type BatchId = Branded<string, 'BatchId'>

/**
 * Type-safe public key
 */
export type PublicKey = Branded<string, 'PublicKey'>

/**
 * Type-safe private key
 */
export type PrivateKey = Branded<string, 'PrivateKey'>

/**
 * Type-safe bundle hash
 */
export type BundleHash = Branded<string, 'BundleHash'>

/**
 * Type-safe molecular hash
 */
export type MolecularHash = Branded<string, 'MolecularHash'>

/**
 * Extract promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Deep partial type for nested objects
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Deep readonly type for immutable objects
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * Flatten nested object types
 */
export type Flatten<T> = T extends object ? T extends infer O ? { [K in keyof O]: O[K] } : never : T

/**
 * Union to intersection type conversion
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never

/**
 * Type-safe metadata with validation
 */
export type ValidatedMeta<T extends MetaData = MetaData> = T & { readonly __validated: true }

/**
 * Conditional type for nullable fields
 */
export type Nullable<T> = T | null

/**
 * Extract keys of a specific type from an object
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/**
 * Create a type with all properties as functions returning the property type
 */
export type Functionify<T> = {
  [K in keyof T]: () => T[K]
}

/**
 * TypeScript 5.x Features
 */

/**
 * Const assertion helper for better type inference
 */
export const asConst = <T>(value: T) => value

/**
 * Satisfies operator helper for type validation while preserving literal types
 */
export const satisfies = <T>() => <U extends T>(value: U) => value

/**
 * Template literal type for wallet addresses
 */
export type WalletAddressPattern = `${string}-${string}-${string}`

/**
 * Template literal type for bundle hashes (64 character hex)
 */
export type BundleHashPattern = `${string}${string}${string}${string}${string}${string}${string}${string}`

/**
 * Using operator for type constraints with better error messages
 */
export type Using<T, U extends T> = U

/**
 * Const assertion for token status values
 */
export const TokenStatus = asConst({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  REVOKED: 'revoked'
})

export type TokenStatusType = typeof TokenStatus[keyof typeof TokenStatus]

/**
 * Const assertion for molecule status values
 */
export const MoleculeStatusConstants = asConst({
  PENDING: 'pending',
  BROADCASTED: 'broadcasted', 
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CONFIRMED: 'confirmed'
})

export type MoleculeStatusConstantsType = typeof MoleculeStatusConstants[keyof typeof MoleculeStatusConstants]

/**
 * Const assertion for isotope types
 */
export const IsotopeConstants = asConst({
  C: 'C',   // Create
  I: 'I',   // Increase  
  V: 'V',   // Value
  M: 'M',   // Meta
  T: 'T',   // Token
  U: 'U',   // User
  R: 'R'    // Rule
})

export type IsotopeConstantsType = typeof IsotopeConstants[keyof typeof IsotopeConstants]

/**
 * Const assertion for meta types with satisfies
 */
export const MetaTypeConfig = {
  USER: 'user',
  POLICY: 'policy', 
  IDENTIFIER: 'identifier',
  AUTHORIZATION: 'authorization',
  WALLET: 'wallet',
  TOKEN: 'token'
} satisfies Record<string, string>

export type MetaTypeConfigType = typeof MetaTypeConfig[keyof typeof MetaTypeConfig]

/**
 * Type predicate with const assertion
 */
export const WalletTokens = asConst(['USER', 'STAKE', 'SHADOW', 'AUTH'])
export type WalletTokenType = typeof WalletTokens[number]

/**
 * Advanced conditional types with const assertions
 */
export type ConstantRecord<K extends PropertyKey, V> = {
  readonly [P in K]: V
}

/**
 * Infer type from const assertion
 */
export type InferConst<T> = T extends readonly (infer U)[] ? U : T extends Record<infer K, infer V> ? { [P in K]: V } : T

/**
 * Template literal for error codes
 */
export type ErrorCode = `ERR_${Uppercase<string>}`

/**
 * Const assertion for error codes
 */
export const ErrorCodes = asConst({
  WALLET_NOT_FOUND: 'ERR_WALLET_NOT_FOUND' as ErrorCode,
  INVALID_SIGNATURE: 'ERR_INVALID_SIGNATURE' as ErrorCode,
  INSUFFICIENT_BALANCE: 'ERR_INSUFFICIENT_BALANCE' as ErrorCode,
  NETWORK_ERROR: 'ERR_NETWORK_ERROR' as ErrorCode,
  INVALID_TOKEN: 'ERR_INVALID_TOKEN' as ErrorCode,
  MALFORMED_REQUEST: 'ERR_MALFORMED_REQUEST' as ErrorCode
})

export type ErrorCodeType = typeof ErrorCodes[keyof typeof ErrorCodes]