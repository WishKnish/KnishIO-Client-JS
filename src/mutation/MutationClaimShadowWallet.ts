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

import MutationProposeMolecule from './MutationProposeMolecule'
import Wallet from '../Wallet'
import ResponseClaimShadowWallet from '../response/ResponseClaimShadowWallet'

interface ClaimShadowWalletOptions {
  token: string
  batchId?: string | null
}

/**
 * Mutation for claiming a Shadow Wallet
 */
export default class MutationClaimShadowWallet extends MutationProposeMolecule {
  /**
   * Class constructor - fills the molecule with shadow wallet claim data
   *
   * @param options - Options for claiming shadow wallet
   */
  fillMolecule ({
    token,
    batchId = null
  }: ClaimShadowWalletOptions): void {
    const wallet = Wallet.create({
      secret: this.$__molecule.secret,
      bundle: this.$__molecule.bundle,
      token,
      batchId
    })

    this.$__molecule.initShadowWalletClaim?.(wallet)
    this.$__molecule.sign?.({})
    this.$__molecule.check?.()
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param json - The JSON response data
   * @return ResponseClaimShadowWallet object
   */
  createResponse (json: any): any {
    return new (ResponseClaimShadowWallet as any)({
      query: this,
      json
    })
  }
}