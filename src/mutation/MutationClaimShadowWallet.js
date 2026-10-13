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
import MutationProposeMolecule from './MutationProposeMolecule.js'
import Wallet from '../Wallet.js'
import ResponseClaimShadowWallet from '../response/ResponseClaimShadowWallet.js'

/**
 * Mutation for claiming a Shadow Wallet
 */
export default class MutationClaimShadowWallet extends MutationProposeMolecule {
  /**
   * Class constructor
   *
   * @param {string} token
   * @param {string|null} batchId
   * @param {number} otsVersion - OTS version of the claimed wallet's key: 1 (default) or 2
   */
  fillMolecule ({
    token,
    batchId = null,
    otsVersion = 1
  }) {
    const wallet = Wallet.create({
      secret: this.$__molecule.secret,
      bundle: this.$__molecule.bundle,
      token,
      batchId,
      otsVersion
    })

    this.$__molecule.initShadowWalletClaim(wallet)
    this.$__molecule.sign({})
    this.$__molecule.check()
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseClaimShadowWallet}
   */
  createResponse (json) {
    return new ResponseClaimShadowWallet({
      query: this,
      json
    })
  }
}
