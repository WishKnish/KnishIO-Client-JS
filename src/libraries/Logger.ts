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

import type { Logger as LoggerInterface, LoggerConfig, LogLevel, LogLevels, ScopedLogger } from '../types';

/**
 * Centralized logging utility for KnishIO SDK
 * Provides consistent logging behavior across all components
 */
class Logger implements LoggerInterface {
  private enabled: boolean;
  private logLevel: LogLevel;
  private readonly levels: LogLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(enabled = false, logLevel: LogLevel = 'info') {
    this.enabled = enabled;
    this.logLevel = logLevel;
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) {
      return false;
    }

    const currentLevelValue = this.levels[this.logLevel] ?? 1;
    const requestedLevelValue = this.levels[level] ?? 1;

    return requestedLevelValue >= currentLevelValue;
  }

  /**
   * Log a debug message
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(message, ...args);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(message, ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(message, ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(message, ...args);
    }
  }

  /**
   * Generic log method matching KnishIOClient.log signature
   */
  log(level: string, message: string, ...args: unknown[]): void {
    switch (level) {
      case 'debug':
        this.debug(message, ...args);
        break;
      case 'info':
        this.info(message, ...args);
        break;
      case 'warn':
        this.warn(message, ...args);
        break;
      case 'error':
        this.error(message, ...args);
        break;
      default:
        if (this.shouldLog('info')) {
          console.log(message, ...args);
        }
    }
  }

  /**
   * Set logging enabled state
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set minimum log level
   */
  setLogLevel(level: string): void {
    if (level in this.levels) {
      this.logLevel = level as LogLevel;
    }
  }

  /**
   * Create a scoped logger with a prefix
   */
  scope(scope: string): ScopedLogger {
    return {
      debug: (message: string, ...args: unknown[]) => this.debug(`${scope}: ${message}`, ...args),
      info: (message: string, ...args: unknown[]) => this.info(`${scope}: ${message}`, ...args),
      warn: (message: string, ...args: unknown[]) => this.warn(`${scope}: ${message}`, ...args),
      error: (message: string, ...args: unknown[]) => this.error(`${scope}: ${message}`, ...args),
      log: (level: string, message: string, ...args: unknown[]) => this.log(level, `${scope}: ${message}`, ...args)
    };
  }
}

// Global logger instance
let globalLogger = new Logger();

/**
 * Get the global logger instance
 */
export function getLogger(): Logger {
  return globalLogger;
}

/**
 * Configure the global logger
 */
export function configureLogger({ enabled = false, level = 'info' }: Partial<LoggerConfig> = {}): void {
  globalLogger = new Logger(enabled, level as LogLevel);
}

/**
 * Create a scoped logger
 */
export function createScopedLogger(scope: string): ScopedLogger {
  return globalLogger.scope(scope);
}

export default Logger;
