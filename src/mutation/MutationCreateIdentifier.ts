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
import ResponseCreateIdentifier from '../response/ResponseCreateIdentifier'
import type { GraphQLResponse } from '../types/graphql'

/**
 * Variables for create identifier mutation
 */
export interface MutationCreateIdentifierVariables {
  type: string;
  contact: string;
  code?: string;
}

/**
 * Mutation for creating a new identifier
 */
export default class MutationCreateIdentifier extends MutationProposeMolecule {
  /**
   * Fills the Molecule with identifier creation data
   * @param type - Type of identifier
   * @param contact - Contact information
   * @param code - Optional verification code
   */
  fillMolecule ({
    type,
    contact,
    code
  }: MutationCreateIdentifierVariables): void {
    this.$__molecule.initIdentifierCreation?.({
      type,
      contact,
      code: code ?? ''
    })
    this.$__molecule.sign?.({})
    this.$__molecule.check?.()
  }

  /**
   * Creates a response instance for this mutation
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): ResponseCreateIdentifier {
    return new ResponseCreateIdentifier({
      query: this,
      json
    });
  }
}