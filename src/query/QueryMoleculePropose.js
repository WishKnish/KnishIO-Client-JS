import Query from "./Query";
import ResponseMolecule from "../response/ResponseMolecule";

const merge = require('lodash.merge');

/**
 *
 */
export default class QueryMoleculePropose extends Query {
  /**
   * @param knishIO
   * @param molecule
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

  compiledVariables ( variables ) {
    const _variables = super.compiledVariables( variables );

    return merge( _variables, { molecule: this.molecule() } );
  }

  /**
   *
   * @param {string} response
   * @return {ResponseMolecule}
   */
  createResponse ( response ) {
    return new ResponseMolecule( this, response );
  }

  /**
   * @param {Object} variables
   * @param {Object|null} fields
   * @return {Promise<Response>}
   */
  async execute ( variables = null, fields = null ) {
    return await super.execute( merge( variables || {}, { 'molecule': this.molecule() } ), fields );
  }

  remainderWallet () {
    return this.$__remainderWallet;
  }

  molecule () {
    return this.$__molecule;
  }

}
