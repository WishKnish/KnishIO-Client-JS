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

import PolicyMeta from './PolicyMeta'
import Meta from './Meta'
import type { MetaData, NormalizedMeta, MetaObject } from '@/types'

const USE_META_CONTEXT = false
const DEFAULT_META_CONTEXT = 'https://www.schema.org'

import type { WalletLike } from '@/types';

/**
 * AtomMeta class for managing metadata associated with atoms
 */
export default class AtomMeta {
  private meta: NormalizedMeta[]

  /**
   * Constructor
   * @param meta - Initial metadata
   */
  constructor (meta: MetaData = []) {
    this.meta = Meta.normalizeMeta(meta)
  }

  /**
   * Merge additional metadata
   * @param meta - Metadata to merge
   * @returns This instance for chaining
   */
  merge (meta: MetaData | Record<string, unknown>): AtomMeta {
    let normalized: NormalizedMeta[]

    if (Array.isArray(meta)) {
      normalized = meta
    } else {
      normalized = Meta.normalizeMeta(meta as MetaObject)
    }

    // Remove duplicates by creating a Set and converting back to array
    const combined = [...this.meta, ...normalized]
    const uniqueKeys = new Set()
    this.meta = combined.filter(item => {
      const key = `${item.key}:${item.value}`
      if (uniqueKeys.has(key)) {
        return false
      }
      uniqueKeys.add(key)
      return true
    })
    return this
  }

  /**
   * Add context metadata if enabled
   * @param context - Context to add
   * @returns This instance for chaining
   */
  addContext (context: string | null = null): AtomMeta {
    // Add context key if it is enabled
    if (USE_META_CONTEXT) {
      this.merge({ context: context ?? DEFAULT_META_CONTEXT })
    }

    return this
  }

  /**
   * Set atom wallet metadata
   * @param wallet - Wallet instance
   * @returns This instance for chaining
   */
  setAtomWallet (wallet: WalletLike): AtomMeta {
    const walletMeta: Record<string, unknown> = {
      pubkey: wallet.pubkey,
      characters: wallet.characters
    }

    // Add token units meta key
    if (wallet.tokenUnits?.length && wallet.getTokenUnitsData) {
      walletMeta.tokenUnits = JSON.stringify(wallet.getTokenUnitsData())
    }

    // Add trade rates meta key
    if (wallet.tradeRates?.length) {
      walletMeta.tradeRates = JSON.stringify(wallet.tradeRates)
    }

    // Merge all wallet's metas
    this.merge(walletMeta)
    return this
  }

  /**
   * Set full NEW wallet metadata
   * Used for shadow wallet claim & wallet creation & token creation
   * @param wallet - Wallet instance
   * @returns This instance for chaining
   */
  setMetaWallet (wallet: WalletLike): AtomMeta {
    this.merge({
      walletTokenSlug: wallet.token,
      walletBundleHash: wallet.bundle,
      walletAddress: wallet.address,
      walletPosition: wallet.position,
      walletBatchId: wallet.batchId,
      walletPubkey: wallet.pubkey,
      walletCharacters: wallet.characters
    })
    return this
  }

  /**
   * Set shadow wallet claim metadata
   * @param shadowWalletClaim - Shadow wallet claim value
   * @returns This instance for chaining
   */
  setShadowWalletClaim (shadowWalletClaim: number | string): AtomMeta {
    this.merge({ shadowWalletClaim: Number(shadowWalletClaim) })
    return this
  }

  /**
   * Set signing wallet metadata
   * @param signingWallet - Signing wallet instance
   * @returns This instance for chaining
   */
  setSigningWallet (signingWallet: WalletLike): AtomMeta {
    this.merge({
      signingWallet: JSON.stringify({
        tokenSlug: signingWallet.token,
        bundleHash: signingWallet.bundle,
        address: signingWallet.address,
        position: signingWallet.position,
        pubkey: signingWallet.pubkey,
        characters: signingWallet.characters
      })
    })
    return this
  }

  /**
   * Add policy metadata
   * @param policy - Policy to add
   * @returns This instance for chaining
   */
  addPolicy (policy: unknown): AtomMeta {
    // Policy meta initialization
    const policyMeta = new PolicyMeta(policy as Record<string, unknown> | undefined, Object.keys(this.meta))

    this.merge({
      policy: policyMeta.toJson()
    })

    return this
  }

  /**
   * Get the metadata array
   * @returns Normalized metadata array
   */
  get (): NormalizedMeta[] {
    return this.meta
  }

  /**
   * Convert to JSON string
   * @returns JSON string representation
   */
  toJSON (): string {
    return JSON.stringify(this.meta)
  }

  /**
   * Clear all metadata
   * @returns This instance for chaining
   */
  clear (): AtomMeta {
    this.meta = []
    return this
  }

  /**
   * Get metadata as aggregated object
   * @returns Metadata as key-value object
   */
  aggregate (): Record<string, unknown> {
    return Meta.aggregateMeta(this.meta)
  }
}
