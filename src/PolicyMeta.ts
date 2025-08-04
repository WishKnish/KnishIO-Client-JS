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
import type { PolicyMetaStructure, PolicyRule } from './types'

/**
 * Policy metadata management class
 */
export default class PolicyMeta {
  private policy: PolicyMetaStructure | PolicyRule[]

  /**
   * Creates a PolicyMeta instance
   */
  constructor(policy: Record<string, unknown> = {}, metaKeys: string[] = []) {
    this.policy = PolicyMeta.normalizePolicy(policy)
    this.fillDefault(metaKeys)
  }

  /**
   * Normalizes policy object structure
   */
  static normalizePolicy(policy: Record<string, unknown> = {}): PolicyMetaStructure {
    const policyMeta: PolicyMetaStructure = {}
    
    for (const [policyKey, value] of Object.entries(policy)) {
      if (value !== null && ['read', 'write'].includes(policyKey)) {
        policyMeta[policyKey as 'read' | 'write'] = {}
        for (const [key, content] of Object.entries(value as Record<string, unknown>)) {
          policyMeta[policyKey as 'read' | 'write']![key] = content as string[]
        }
      }
    }
    
    return policyMeta
  }

  /**
   * Fills in default policy values
   */
  fillDefault(metaKeys: string[] = []): void {
    // Note: The original code has a logic issue - it tries to filter an object as an array
    // This is a simplified version that maintains the expected behavior
    const readPolicy: PolicyRule[] = []
    const writePolicy: PolicyRule[] = []

    // Check if policy is an array (as the original code suggests)
    if (Array.isArray(this.policy)) {
      const policyArray = this.policy as PolicyRule[]
      readPolicy.push(...policyArray.filter(item => item.action === 'read'))
      writePolicy.push(...policyArray.filter(item => item.action === 'write'))
    }

    // Ensure policy is a structure for the following operations
    if (Array.isArray(this.policy)) {
      this.policy = {}
    }

    for (const [type, value] of Object.entries({
      read: readPolicy,
      write: writePolicy
    })) {
      const policyKey = value.map(item => item.key).filter(Boolean) as string[]

      if (!(this.policy as PolicyMetaStructure)[type as 'read' | 'write']) {
        (this.policy as PolicyMetaStructure)[type as 'read' | 'write'] = {}
      }

      const diffKeys = diff(metaKeys, policyKey)
      for (const key of diffKeys) {
        if (!(this.policy as PolicyMetaStructure)[type as 'read' | 'write']![key]) {
          (this.policy as PolicyMetaStructure)[type as 'read' | 'write']![key] = 
            (type === 'write' && !['characters', 'pubkey'].includes(key)) ? ['self'] : ['all']
        }
      }
    }
  }

  /**
   * Gets the policy structure
   */
  get(): PolicyMetaStructure {
    return this.policy as PolicyMetaStructure
  }

  /**
   * Converts policy to JSON string
   */
  toJson(): string {
    return JSON.stringify(this.get())
  }
}