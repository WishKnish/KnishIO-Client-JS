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

const USE_META_CONTEXT = false
const DEFAULT_META_CONTEXT = 'https://www.schema.org'

/**
 *
 */
export default class AtomMeta {
  /**
   *
   * @param meta
   */
  constructor (meta = {}) {
    this.meta = meta
  }

  /**
   *
   * @param meta
   * @returns {AtomMeta}
   */
  merge (meta) {
    this.meta = Object.assign(this.meta, meta)
    return this
  }

  /**
   *
   * @param context
   * @returns {AtomMeta}
   */
  addContext (context = null) {
    // Add context key if it is enabled
    if (USE_META_CONTEXT) {
      this.merge({ context: context || DEFAULT_META_CONTEXT })
    }

    return this
  }

  /**
   *
   * @param {Wallet} wallet
   * @returns {AtomMeta}
   */
  setAtomWallet (wallet) {
    const walletMeta = {
      pubkey: wallet.pubkey,
      characters: wallet.characters
    }

    // Add token units meta key
    if (wallet.tokenUnits && wallet.tokenUnits.length) {
      walletMeta.tokenUnits = JSON.stringify(wallet.getTokenUnitsData())
    }
    // Add trade rates meta key
    if (wallet.tradeRates && wallet.tradeRates.length) {
      walletMeta.tradeRates = JSON.stringify(wallet.tradeRates)
    }

    // Merge all wallet's metas
    this.merge(walletMeta)
    return this
  }

  /**
   * Set full NEW wallet metadata
   * Used for shadow wallet claim & wallet creation & token creation
   *
   * @param {Wallet} wallet
   * @returns {AtomMeta}
   */
  setMetaWallet (wallet) {
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
   *
   * @param shadowWalletClaim
   * @returns {AtomMeta}
   */
  setShadowWalletClaim (shadowWalletClaim) {
    this.merge({ shadowWalletClaim: shadowWalletClaim * 1 })
    return this
  }

  /**
   *
   * @param {Wallet} signingWallet
   * @returns {AtomMeta}
   */
  setSigningWallet (signingWallet) {
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
   *
   * @param policy
   * @todo move logic to the separated class
   * @returns {AtomMeta}
   */
  addPolicy (policy) {
    // Policy meta initialization
    const policyMeta = new PolicyMeta(policy, Object.keys(this.meta))

    this.merge({
      policy: policyMeta.toJson()
    })

    return this
  }

  /**
   *
   * @returns {*}
   */
  get () {
    return this.meta
  }
}
