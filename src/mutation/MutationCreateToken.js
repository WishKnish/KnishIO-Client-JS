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
import ResponseCreateToken from '../response/ResponseCreateToken'

/**
 * Query for creating new Tokens
 */
export default class MutationCreateToken extends MutationProposeMolecule {
  /**
   * @param {Wallet|null} recipientWallet
   * @param {number|null} amount
   * @param {object|null} meta
   */
  fillMolecule ({
    recipientWallet,
    amount,
    meta = null
  }) {
    this.$__molecule.initTokenCreation({
      recipientWallet,
      amount,
      meta: meta || {}
    })
    this.$__molecule.sign({
      bundle: recipientWallet.bundle
    })
    this.$__molecule.check()
  }

  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateToken}
   */
  createResponse (json) {
    return new ResponseCreateToken({
      query: this,
      json
    })
  }
}
