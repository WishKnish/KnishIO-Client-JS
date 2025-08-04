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
import type { MutationTransferTokensVariables } from '../types'
import ResponseTransferTokens from '../response/ResponseTransferTokens'

/**
 * Variables for transfer tokens mutation
 */

/**
 * Mutation for moving tokens between wallets
 */
export default class MutationTransferTokens extends MutationProposeMolecule {
  /**
   * Fills the Molecule with provided wallet and amount data
   * @param recipientWallet - Target wallet for the transfer
   * @param amount - Amount to transfer
   */
  fillMolecule ({
    recipientWallet,
    amount
  }: MutationTransferTokensVariables): void {
    this.$__molecule.initValue?.({
      recipientWallet,
      amount: Number(amount)
    })
    this.$__molecule.sign?.({})
    this.$__molecule.check?.(this.$__molecule.sourceWallet)
  }

  /**
   * Creates a response instance for this mutation
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): any {
    return new ResponseTransferTokens({
      query: this,
      json
    })
  }
}