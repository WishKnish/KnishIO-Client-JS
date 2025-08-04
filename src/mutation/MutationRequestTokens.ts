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
import ResponseRequestTokens from '../response/ResponseRequestTokens'

/**
 * Variables for request tokens mutation
 */
export interface MutationRequestTokensVariables {
  token: string;
  amount: string | number;
  metaType: string;
  metaId: string;
  meta?: Record<string, unknown> | null;
  batchId?: string | null;
}

/**
 * Mutation for requesting tokens from the network
 */
export default class MutationRequestTokens extends MutationProposeMolecule {
  /**
   * Fills the Molecule with token request data
   * @param token - Token slug to request
   * @param amount - Amount of tokens to request
   * @param metaType - Type of metadata
   * @param metaId - Metadata identifier
   * @param meta - Optional metadata object
   * @param batchId - Optional batch identifier
   */
  fillMolecule ({
    token,
    amount,
    metaType,
    metaId,
    meta = null,
    batchId = null
  }: MutationRequestTokensVariables & { meta?: Record<string, unknown> | null; batchId?: string | null }): void {
    this.$__molecule.initTokenRequest?.({
      token,
      amount: Number(amount),
      metaType,
      metaId,
      meta: meta ?? {},
      batchId: batchId ?? null
    })
    this.$__molecule.sign?.({})
    this.$__molecule.check?.()
  }

  /**
   * Creates a response instance for this mutation
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): any {
    return new ResponseRequestTokens({
      query: this,
      json
    })
  }
}