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
import ResponseCreateRule from '../response/ResponseCreateRule'

/**
 * Variables for create rule mutation
 */
export interface MutationCreateRuleVariables {
  metaType: string;
  metaId: string;
  rule: Record<string, unknown>[];
  policy: Record<string, unknown>;
}

/**
 * Mutation for creating a new rule
 */
export default class MutationCreateRule extends MutationProposeMolecule {
  /**
   * Fills the Molecule with rule creation data
   * @param metaType - Type of metadata
   * @param metaId - Metadata identifier
   * @param rule - Rule configuration array
   * @param policy - Policy configuration object
   */
  fillMolecule ({
    metaType,
    metaId,
    rule,
    policy
  }: MutationCreateRuleVariables): void {
    this.$__molecule.createRule?.({
      metaType,
      metaId,
      rule,
      policy
    })
    this.$__molecule.sign?.({})
    this.$__molecule.check?.()
  }

  /**
   * Creates a response instance for this mutation
   * @param json - The GraphQL response data
   * @returns Response instance
   */
  createResponse (json: GraphQLResponse): ResponseCreateRule {
    return new ResponseCreateRule({
      query: this,
      json
    })
  }
}