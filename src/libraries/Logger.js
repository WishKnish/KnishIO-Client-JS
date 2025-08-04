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
 * Centralized logging utility for KnishIO SDK
 * Provides consistent logging behavior across all components
 * JavaScript version - functionally equivalent to TypeScript version
 */
class Logger {
  constructor(enabled = false, logLevel = 'info') {
    this.enabled = enabled;
    this.logLevel = logLevel;
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  /**
   * Check if a log level should be output
   */
  shouldLog(level) {
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
  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.debug(message, ...args);
    }
  }

  /**
   * Log an info message
   */
  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.info(message, ...args);
    }
  }

  /**
   * Log a warning message
   */
  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(message, ...args);
    }
  }

  /**
   * Log an error message
   */
  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(message, ...args);
    }
  }

  /**
   * Generic log method matching KnishIOClient.log signature
   */
  log(level, message, ...args) {
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
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Set minimum log level
   */
  setLogLevel(level) {
    if (level in this.levels) {
      this.logLevel = level;
    }
  }

  /**
   * Create a scoped logger with a prefix
   */
  scope(scope) {
    return {
      debug: (message, ...args) => this.debug(`${scope}: ${message}`, ...args),
      info: (message, ...args) => this.info(`${scope}: ${message}`, ...args),
      warn: (message, ...args) => this.warn(`${scope}: ${message}`, ...args),
      error: (message, ...args) => this.error(`${scope}: ${message}`, ...args),
      log: (level, message, ...args) => this.log(level, `${scope}: ${message}`, ...args)
    };
  }
}

// Global logger instance
let globalLogger = new Logger();

/**
 * Get the global logger instance
 */
export function getLogger() {
  return globalLogger;
}

/**
 * Configure the global logger
 */
export function configureLogger({ enabled = false, level = 'info' } = {}) {
  globalLogger = new Logger(enabled, level);
}

/**
 * Create a scoped logger
 */
export function createScopedLogger(scope) {
  return globalLogger.scope(scope);
}

export default Logger;