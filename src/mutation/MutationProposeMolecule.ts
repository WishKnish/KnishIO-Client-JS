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

import type { GraphQLVariables, GraphQLResponse, UrqlClientWrapper, MoleculeInput, MoleculeStructure } from '@/types';
import Mutation from './Mutation';
import ResponseProposeMolecule from '../response/ResponseProposeMolecule';
import type KnishIOClient from '../KnishIOClient';
import { gql } from '@urql/core';

export interface MutationProposeMoleculeVariables {
  molecule: MoleculeInput;
}


/**
 * Mutation for proposing a molecule to the blockchain
 */
export default class MutationProposeMolecule extends Mutation {
  protected $__molecule: MoleculeStructure;
  protected $__remainderWallet: unknown = null;

  /**
   * @param graphQLClient - The URQL client wrapper
   * @param knishIOClient - The main KnishIO client instance
   * @param molecule - The molecule to propose
   */
  constructor(graphQLClient: UrqlClientWrapper, knishIOClient: KnishIOClient, molecule: MoleculeStructure) {
    super(graphQLClient, knishIOClient);

    this.$__molecule = molecule;
    this.$__query = gql`
      mutation($molecule: MoleculeInput!) {
        ProposeMolecule(molecule: $molecule) {
          molecularHash
          height
          depth
          status
          reason
          payload
          createdAt
          receivedAt
          processedAt
          broadcastedAt
        }
      }
    `;
  }

  /**
   * Returns an object of query variables with the molecule data
   * @param variables - Additional variables to merge
   * @returns Compiled variables including the molecule
   */
  compiledVariables(variables: GraphQLVariables | null = null): GraphQLVariables {
    const _variables = super.compiledVariables(variables);
    return { ..._variables, molecule: this.molecule() as unknown as MoleculeInput };
  }

  /**
   * Get the molecule structure
   * @returns The molecule to be proposed
   */
  molecule(): MoleculeStructure {
    return this.$__molecule;
  }

  /**
   * Set the remainder wallet
   * @param wallet - The remainder wallet
   */
  setRemainderWallet(wallet: unknown): void {
    this.$__remainderWallet = wallet;
  }

  /**
   * Get the remainder wallet
   * @returns The remainder wallet
   */
  remainderWallet(): unknown {
    return this.$__remainderWallet;
  }

  /**
   * Executes the query
   * @param variables - Optional variables for the mutation
   * @returns Promise resolving to the response
   */
  async execute ({ variables = null }: { variables?: GraphQLVariables | null } = {}): Promise<ResponseProposeMolecule> {
    variables = variables || {}
    variables.molecule = this.molecule() as unknown as MoleculeInput

    const response = await super.execute({
      variables
    })

    return response as ResponseProposeMolecule
  }

  /**
   * Create a typed response object for this mutation
   * @param json - The GraphQL response data
   * @returns A typed ResponseProposeMolecule instance
   */
  createResponse(json: GraphQLResponse): ResponseProposeMolecule {
    return new ResponseProposeMolecule({
      query: this,
      json
    });
  }
}
