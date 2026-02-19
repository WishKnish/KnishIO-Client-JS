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
import InvalidResponseException from '../exception/InvalidResponseException.js'
import UnauthenticatedException from '../exception/UnauthenticatedException.js'
import Dot from '../libraries/Dot.js'

/**
 * Base Response class for processing node responses
 */
export default class Response {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   * @param {string|null} dataKey
   */
  constructor ({
    query,
    json,
    dataKey = null
  }) {
    this.dataKey = dataKey
    this.errorKey = 'exception'
    this.$__payload = null
    this.$__query = query
    this.$__originResponse = json
    this.$__response = json

    if (typeof this.$__response === 'undefined' || this.$__response === null) {
      throw new InvalidResponseException()
    }

    if (Dot.has(this.$__response, this.errorKey)) {
      const error = Dot.get(this.$__response, this.errorKey)

      if (String(error).includes('Unauthenticated')) {
        throw new UnauthenticatedException()
      }

      throw new InvalidResponseException()
    }

    // Check for GraphQL errors array
    if (this.$__response.errors && Array.isArray(this.$__response.errors) && this.$__response.errors.length > 0) {
      const errorMessage = this.$__response.errors[0].message || 'Unknown GraphQL error'

      if (errorMessage.includes('Unauthenticated')) {
        throw new UnauthenticatedException()
      }

      throw new InvalidResponseException(`GraphQL Error: ${errorMessage}`)
    }

    this.init()
  }

  /**
   *
   */
  init () {
  }

  /**
   * @return {*}
   */
  data () {
    if (!this.dataKey) {
      return this.response()
    }

    // Check if response has data field
    if (!this.response().data) {
      throw new InvalidResponseException('Response has no data field')
    }

    // Check key & return custom data from the response
    if (!Dot.has(this.response(), this.dataKey)) {
      throw new InvalidResponseException(`Missing expected field: ${this.dataKey}`)
    }

    return Dot.get(this.response(), this.dataKey)
  }

  /**
   * @return {object}
   */
  response () {
    return this.$__response
  }

  /**
   * @return {*}
   */
  payload () {
    return null
  }

  /**
   * @return {Query}
   */
  query () {
    return this.$__query
  }

  /**
   * @return {*}
   */
  status () {
    return null
  }

  /**
   * Check if response was successful
   * @return {boolean}
   */
  success () {
    // Default implementation - can be overridden by subclasses
    return !this.$__response?.errors?.length
  }

  /**
   * Get error message if any
   *
   * @return {string|null}
   */
  error () {
    return this.$__response?.errors?.length ? this.$__response.errors[0].message || 'Unknown error' : null
  }

  /**
   * Enhanced interface methods for standardized response handling
   */
  
  /**
   * Get error reason (alias for error() to match standardized interface)
   * @return {string|null}
   */
  reason () {
    return this.error()
  }

  /**
   * Convert to ValidationResult for enhanced error handling
   * @return {object}
   */
  toValidationResult () {
    if (this.success() && this.payload() !== null) {
      return {
        success: true,
        data: this.payload(),
        warnings: []
      }
    } else {
      return {
        success: false,
        error: {
          message: this.reason() || 'Unknown error',
          context: this.constructor.name,
          details: this.$__response?.errors || []
        }
      }
    }
  }

  /**
   * Enhanced error handling with callbacks
   * @param {function} callback
   * @return {Response}
   */
  onSuccess (callback) {
    if (this.success() && this.payload() !== null) {
      try {
        callback(this.payload())
      } catch (error) {
        console.warn('Response.onSuccess callback failed:', error)
      }
    }
    return this
  }

  /**
   * Enhanced failure handling with callbacks
   * @param {function} callback
   * @return {Response}
   */
  onFailure (callback) {
    if (!this.success()) {
      try {
        callback(this.reason() || 'Unknown error')
      } catch (error) {
        console.warn('Response.onFailure callback failed:', error)
      }
    }
    return this
  }

  /**
   * Debug logging with enhanced context
   * @param {string|null} label
   * @return {Response}
   */
  debug (label = null) {
    const debugPrefix = label ? `[${label}]` : `[${this.constructor.name}]`
    
    if (this.success()) {
      console.debug(`${debugPrefix} Success:`, {
        payload: this.payload(),
        query: this.$__query?.constructor?.name,
        dataKey: this.dataKey
      })
    } else {
      console.debug(`${debugPrefix} Failure:`, {
        error: this.reason(),
        errors: this.$__response?.errors,
        rawData: this.$__response
      })
    }
    
    return this
  }

  /**
   * Promise conversion for enhanced async patterns
   * @return {Promise}
   */
  toPromise () {
    if (this.success() && this.payload() !== null) {
      return Promise.resolve(this.payload())
    } else {
      return Promise.reject(new Error(this.reason() || 'Unknown error'))
    }
  }

  /**
   * Functional programming map operation
   * @param {function} mapper
   * @return {Response}
   */
  map (mapper) {
    if (this.success() && this.payload() !== null) {
      try {
        const mappedPayload = mapper(this.payload())
        // Create new response with mapped payload
        const newResponse = Object.create(Object.getPrototypeOf(this))
        Object.assign(newResponse, this)
        newResponse.$__payload = mappedPayload
        return newResponse
      } catch (error) {
        // Create error response
        const errorResponse = Object.create(Object.getPrototypeOf(this))
        Object.assign(errorResponse, this)
        errorResponse.$__response = { errors: [{ message: `Mapping failed: ${error.message}` }] }
        return errorResponse
      }
    } else {
      return this
    }
  }
}
