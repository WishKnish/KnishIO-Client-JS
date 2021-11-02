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
import ResponseProposeMolecule from '../response/ResponseProposeMolecule';
import Mutation from './Mutation';
import { gql } from '@apollo/client/core';


export default class MutationProposeMolecule extends Mutation {
  /**
   *
   * @param {ApolloClient} apolloClient
   * @param molecule
   */
  constructor ( apolloClient, molecule = null ) {
    super( apolloClient );
    this.$__molecule = molecule;
    this.$__remainderWallet = null;
    this.$__query = gql`mutation( $molecule: MoleculeInput! ) {
      ProposeMolecule( molecule: $molecule ) {
        molecularHash,
        height,
        depth,
        status,
        reason,
        payload,
        createdAt,
        receivedAt,
        processedAt,
        broadcastedAt,
      }
    }`;
  }

  /**
   * Returns an object of query variables
   *
   * @param {object} variables
   * @return {object}
   */
  compiledVariables ( variables ) {
    const _variables = super.compiledVariables( variables );

    return { ..._variables, ...{ molecule: this.molecule() } };
  }

  /**
   * Creates a new response from a JSON string
   *
   * @param {object} json
   * @return {ResponseProposeMolecule}
   */
  createResponse ( json ) {
    return new ResponseProposeMolecule( {
      query: this,
      json
    } );
  }

  /**
   * Executes the query
   *
   * @param {object} variables
   * @return {Promise}
   */
  async execute ( { variables = null } ) {
    variables = variables || {};
    variables.molecule = this.molecule();

    return super.execute( {
      variables
    } );
  }

  /**
   * Returns the remainder wallet
   *
   * @return {null}
   */
  remainderWallet () {
    return this.$__remainderWallet;
  }

  /**
   * Returns the molecule we are proposing
   *
   * @return {Molecule}
   */
  molecule () {
    return this.$__molecule;
  }

}
