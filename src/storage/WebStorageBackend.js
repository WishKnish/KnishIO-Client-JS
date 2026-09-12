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

import SecretStorageException from '../exception/SecretStorageException.js'

/**
 * Browser persistent storage backend wrapping Web Storage (localStorage or sessionStorage).
 * Adapts the Web Storage API (length + key(i)) to IStorageBackend.keys(), filtering
 * by a prefix (defaults to 'knishio:') so unrelated items are ignored.
 */
export default class WebStorageBackend {
  /**
   * @param {Storage} [storage]
   * @param {string} [prefix]
   */
  constructor (storage, prefix = 'knishio:') {
    if (storage) {
      this.storage = storage
    } else if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      this.storage = globalThis.localStorage
    } else {
      throw SecretStorageException.unavailable(
        'web-storage',
        'WebStorageBackend requires a Storage object or global localStorage'
      )
    }
    this.prefix = prefix
  }

  /**
   * @param {string} key
   * @returns {string|null}
   */
  getItem (key) {
    return this.storage.getItem(key)
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  setItem (key, value) {
    this.storage.setItem(key, value)
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  removeItem (key) {
    const existed = this.storage.getItem(key) !== null
    this.storage.removeItem(key)
    return existed
  }

  /**
   * @returns {string[]}
   */
  keys () {
    const result = []
    const len = this.storage.length
    for (let i = 0; i < len; i++) {
      const k = this.storage.key(i)
      if (k !== null) {
        if (!this.prefix || k.startsWith(this.prefix)) {
          result.push(k)
        }
      }
    }
    return result
  }
}
