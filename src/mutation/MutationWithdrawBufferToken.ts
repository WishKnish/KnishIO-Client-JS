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
import MutationProposeMolecule from './MutationProposeMolecule';
import type { WalletLike } from '../types/wallet';

/**
 * Variables for withdrawing buffer tokens
 */
export interface MutationWithdrawBufferTokenVariables {
  recipients: unknown;
  signingWallet: WalletLike;
}

/**
 * Mutation for withdrawing tokens from buffer
 */
export default class MutationWithdrawBufferToken extends MutationProposeMolecule {
  /**
   * Fills the Molecule with withdrawal data
   *
   * @param recipients - The recipients of the withdrawal
   * @param signingWallet - The wallet used for signing
   */
  fillMolecule ({
    recipients,
    signingWallet
  }: MutationWithdrawBufferTokenVariables): void {
    this.$__molecule.initWithdrawBuffer?.({
      recipients,
      signingWallet
    })
    this.$__molecule.sign?.({})
    this.$__molecule.check?.(this.$__molecule.sourceWallet)
  }
}