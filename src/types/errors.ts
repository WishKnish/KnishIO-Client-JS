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
 * Comprehensive error handling types for Knish.IO SDK
 * Provides type-safe error patterns with modern TypeScript features
 */

import type { ErrorCodeType } from './utils'
import { asConst } from './utils'

/**
 * Base error interface for all Knish.IO errors
 */
export interface KnishIOError {
  readonly code: ErrorCodeType
  readonly message: string
  readonly timestamp: number
  readonly context?: Record<string, unknown>
  readonly cause?: Error
}

/**
 * Error severity levels with const assertion
 */
export const ErrorSeverity = asConst({
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  CRITICAL: 'critical'
})

export type ErrorSeverityType = typeof ErrorSeverity[keyof typeof ErrorSeverity]

/**
 * Enhanced error interface with severity and recovery info
 */
export interface EnhancedKnishIOError extends KnishIOError {
  readonly severity: ErrorSeverityType
  readonly recoverable: boolean
  readonly retryable: boolean
  readonly retryAfter?: number
}

/**
 * Wallet-specific error types
 */
export interface WalletError extends EnhancedKnishIOError {
  readonly code: 'ERR_WALLET_NOT_FOUND' | 'ERR_INSUFFICIENT_BALANCE' | 'ERR_INVALID_SIGNATURE'
  readonly walletAddress?: string
  readonly tokenType?: string
}

/**
 * Network-specific error types
 */
export interface NetworkError extends EnhancedKnishIOError {
  readonly code: 'ERR_NETWORK_ERROR'
  readonly endpoint?: string
  readonly statusCode?: number
  readonly responseHeaders?: Record<string, string>
}

/**
 * Token-specific error types
 */
export interface TokenError extends EnhancedKnishIOError {
  readonly code: 'ERR_INVALID_TOKEN'
  readonly tokenId?: string
  readonly tokenType?: string
}

/**
 * Request validation error types
 */
export interface ValidationError extends EnhancedKnishIOError {
  readonly code: 'ERR_MALFORMED_REQUEST'
  readonly field?: string
  readonly expected?: string
  readonly received?: string
}

/**
 * Union type of all possible Knish.IO errors
 */
export type KnishIOErrorUnion = WalletError | NetworkError | TokenError | ValidationError

/**
 * Error factory configuration with satisfies operator
 */
export const ErrorConfig = {
  wallet: {
    severity: ErrorSeverity.HIGH,
    recoverable: false,
    retryable: false
  },
  network: {
    severity: ErrorSeverity.MEDIUM,
    recoverable: true,
    retryable: true,
    retryAfter: 5000
  },
  token: {
    severity: ErrorSeverity.HIGH,
    recoverable: false,
    retryable: false
  },
  validation: {
    severity: ErrorSeverity.LOW,
    recoverable: true,
    retryable: false
  }
} satisfies Record<string, Partial<EnhancedKnishIOError>>

/**
 * Result type with enhanced error handling
 */
export type ErrorResult<T, E extends KnishIOError = KnishIOError> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E }

/**
 * Async error result type
 */
export type AsyncErrorResult<T, E extends KnishIOError = KnishIOError> = Promise<ErrorResult<T, E>>

/**
 * Error handler function type
 */
export type ErrorHandler<E extends KnishIOError = KnishIOError> = (error: E) => void | Promise<void>

/**
 * Error recovery function type
 */
export type ErrorRecovery<T, E extends KnishIOError = KnishIOError> = (error: E) => ErrorResult<T, E> | AsyncErrorResult<T, E>

/**
 * Error transformer type for mapping errors
 */
export type ErrorTransformer<E1 extends KnishIOError, E2 extends KnishIOError> = (error: E1) => E2

/**
 * Error boundary configuration
 */
export interface ErrorBoundaryConfig {
  readonly maxRetries: number
  readonly retryDelay: number
  readonly escalationThreshold: number
  readonly fallbackStrategies: readonly string[]
}

/**
 * Error metrics tracking
 */
export interface ErrorMetrics {
  readonly errorCount: number
  readonly errorRate: number
  readonly lastErrorTime: number
  readonly recoveryCount: number
  readonly retryCount: number
}

/**
 * Type guard for checking if error is recoverable
 */
export const isRecoverableError = (error: KnishIOError): error is EnhancedKnishIOError & { recoverable: true } => {
  return 'recoverable' in error && error.recoverable === true
}

/**
 * Type guard for checking if error is retryable
 */
export const isRetryableError = (error: KnishIOError): error is EnhancedKnishIOError & { retryable: true } => {
  return 'retryable' in error && error.retryable === true
}

/**
 * Type guard for wallet errors
 */
export const isWalletError = (error: KnishIOError): error is WalletError => {
  return error.code.startsWith('ERR_WALLET_') || error.code === 'ERR_INSUFFICIENT_BALANCE' || error.code === 'ERR_INVALID_SIGNATURE'
}

/**
 * Type guard for network errors  
 */
export const isNetworkError = (error: KnishIOError): error is NetworkError => {
  return error.code === 'ERR_NETWORK_ERROR'
}

/**
 * Template literal types for error message patterns
 */
export type WalletErrorMessage = `Wallet error: ${string}`
export type NetworkErrorMessage = `Network error: ${string}`
export type TokenErrorMessage = `Token error: ${string}`
export type ValidationErrorMessage = `Validation error: ${string}`

/**
 * Error message union type
 */
export type ErrorMessage = WalletErrorMessage | NetworkErrorMessage | TokenErrorMessage | ValidationErrorMessage

/**
 * Const assertion for common error messages
 */
export const CommonErrorMessages = asConst({
  WALLET_NOT_FOUND: 'Wallet error: Wallet not found' as WalletErrorMessage,
  INSUFFICIENT_BALANCE: 'Wallet error: Insufficient balance' as WalletErrorMessage,
  INVALID_SIGNATURE: 'Wallet error: Invalid signature' as WalletErrorMessage,
  NETWORK_TIMEOUT: 'Network error: Request timeout' as NetworkErrorMessage,
  NETWORK_UNREACHABLE: 'Network error: Network unreachable' as NetworkErrorMessage,
  INVALID_TOKEN_FORMAT: 'Token error: Invalid token format' as TokenErrorMessage,
  TOKEN_EXPIRED: 'Token error: Token expired' as TokenErrorMessage,
  MALFORMED_REQUEST: 'Validation error: Malformed request' as ValidationErrorMessage,
  MISSING_REQUIRED_FIELD: 'Validation error: Missing required field' as ValidationErrorMessage
})

export type CommonErrorMessageType = typeof CommonErrorMessages[keyof typeof CommonErrorMessages]

/**
 * Error context builder with fluent interface
 */
export interface ErrorContextBuilder {
  withField(field: string, value: unknown): ErrorContextBuilder
  withWallet(address: string): ErrorContextBuilder
  withToken(tokenId: string): ErrorContextBuilder
  withNetwork(endpoint: string): ErrorContextBuilder
  build(): Record<string, unknown>
}

/**
 * Error factory for creating typed errors
 */
export interface ErrorFactory {
  createWalletError(code: WalletError['code'], message: string, context?: Record<string, unknown>): WalletError
  createNetworkError(code: NetworkError['code'], message: string, context?: Record<string, unknown>): NetworkError
  createTokenError(code: TokenError['code'], message: string, context?: Record<string, unknown>): TokenError
  createValidationError(code: ValidationError['code'], message: string, context?: Record<string, unknown>): ValidationError
}