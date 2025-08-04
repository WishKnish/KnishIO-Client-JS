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
                 ################# ####
                ################# ######
               ################# #######
              ################# #########
             ################# ###########
            ################# #############
           ################# ###############
          ################# #################
         ################# ###################
        ################# #####################
       ################# #######################
      ################# #########################
     ################# ###########################
    ################# #############################
   ################# ###############################
  ################# #################################
 ################# ###################################
################# #####################################

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import MutationProposeMolecule from './MutationProposeMolecule'
import type { GraphQLResponse } from '../types/graphql'
import type { WalletLike } from '../types/wallet'
import ResponseCreateToken from '../response/ResponseCreateToken'

/**
 * Variables for create token mutation
 */
export interface MutationCreateTokenVariables {
  recipientWallet: WalletLike;
  amount: string | number;
  meta?: Record<string, unknown> | null;
}

/**
 * Mutation for creating a new token
 */
export default class MutationCreateToken extends MutationProposeMolecule {
  /**
   * Fills the Molecule with token creation data
   * @param recipientWallet - Wallet to receive the new tokens
   * @param amount - Amount of tokens to create
   * @param meta - Optional metadata for the token
   */
  fillMolecule ({
    recipientWallet,
    amount,
    meta = null
  }: MutationCreateTokenVariables & { meta?: Record<string, unknown> | null }): void {
    this.$__molecule.initTokenCreation?.({
      recipientWallet,
      amount: Number(amount),
      meta: meta ?? {}
    })
    this.$__molecule.sign?.({
      bundle: recipientWallet.bundle || ''
    })
    this.$__molecule.check?.()
  }

  /**
   * Creates a response instance for this mutation
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): ResponseCreateToken {
    return new ResponseCreateToken({
      query: this,
      json
    })
  }
}