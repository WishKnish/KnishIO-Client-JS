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

import { diff } from './libraries/array'

/**
 *
 */
export default class PolicyMeta {
  /**
   *
   * @param policy
   * @param metaKeys
   */
  constructor (policy = {}, metaKeys = {}) {
    this.policy = PolicyMeta.normalizePolicy(policy)
    this.fillDefault(metaKeys)
  }

  /**
   *
   * @param policy
   * @returns {{}}
   */
  static normalizePolicy (policy = {}) {
    const policyMeta = {}
    for (const [policyKey, value] of Object.entries(policy)) {
      if (value !== null && ['read', 'write'].includes(policyKey)) {
        policyMeta[policyKey] = {}
        for (const [key, content] of Object.entries(value)) {
          policyMeta[policyKey][key] = content
        }
      }
    }
    return policyMeta
  }

  /**
   *
   */
  fillDefault (metaKeys = {}) {
    const readPolicy = Array.from(this.policy).filter(item => item.action === 'read')
    const writePolicy = Array.from(this.policy).filter(item => item.action === 'write')

    for (const [type, value] of Object.entries({
      read: readPolicy,
      write: writePolicy
    })) {
      const policyKey = value.map(item => item.key)

      if (!this.policy[type]) {
        this.policy[type] = {}
      }

      for (const key of diff(metaKeys, policyKey)) {
        if (!this.policy[type][key]) {
          this.policy[type][key] = (type === 'write' && !['characters', 'pubkey'].includes(key)) ? ['self'] : ['all']
        }
      }
    }
  }

  /**
   *
   * @returns {{}|*}
   */
  get () {
    return this.policy
  }

  /**
   *
   * @returns {string}
   */
  toJson () {
    return JSON.stringify(this.get())
  }
}
