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
import ResponseProposeMolecule from "../response/ResponseProposeMolecule";
import Mutation from "./Mutation";

const merge = require( 'lodash.merge' );

/**
 * Query for proposing a new Molecule
 */
export default class MutationProposeMolecule extends Mutation {

  /**
   * Class constructor
   *
   * @param knishIO
   * @param {Molecule|null} molecule
   */
  constructor ( knishIO, molecule = null ) {
    super( knishIO );
    this.$__molecule = molecule;
    this.$__remainderWallet = null;
    this.$__query = `mutation( $molecule: MoleculeInput! ) { ProposeMolecule( molecule: $molecule ) @fields }`;
    this.$__fields = {
      'molecularHash': null,
      'height': null,
      'depth': null,
      'status': null,
      'reason': null,
      'payload': null,
      'createdAt': null,
      'receivedAt': null,
      'processedAt': null,
      'broadcastedAt': null,
    };
  }

  /**
   * Returns an object of query variables
   *
   * @param variables
   * @returns {*}
   */
  compiledVariables ( variables ) {
    const _variables = super.compiledVariables( variables );

    return merge( _variables, { molecule: this.molecule() } );
  }

  /**
   * Creates a new response from a JSON string
   *
   * @param {string} response
   * @return {ResponseProposeMolecule}
   */
  createResponse ( response ) {
    return new ResponseProposeMolecule( {
      query: this,
      response,
    } );
  }

  /**
   * Executes the query
   *
   * @param {Object} variables
   * @param {Object|null} fields
   * @return {Promise}
   */
  async execute ( {
    variables = null,
    fields = null
  } ) {
    return await super.execute( {
      variables: merge( variables || {}, { 'molecule': this.molecule() } ),
      fields,
    } );
  }

  /**
   * Returns the remainder wallet
   *
   * @returns {null}
   */
  remainderWallet () {
    return this.$__remainderWallet;
  }

  /**
   * Returns the molecule we are proposing
   *
   * @returns {null}
   */
  molecule () {
    return this.$__molecule;
  }

}
