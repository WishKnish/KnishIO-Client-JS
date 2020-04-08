import Query from "./Query";
import ResponseMolecule from "../response/ResponseMolecule";
const merge = require('lodash.merge');

/**
 *
 */
export default class QueryMoleculePropose extends Query {
  /**
   * @param client
   * @param {string} url
   */
  constructor ( client, url ) {
    super( client, url );

    this.$__query = 'mutation( $molecule: MoleculeInput! ) { ProposeMolecule( molecule: $molecule, ) { molecularHash, height, depth, status, reason, reasonPayload, createdAt, receivedAt, processedAt, broadcastedAt } }';
    this.$__molecule = null;
    this.$__remainderWallet = null;
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
   * @param {boolean} request
   * @return {Promise<Response>}
   */
  async execute ( variables = null, request = false ) {
    return super.execute( merge( variables || {}, { 'molecule': this.molecule() } ), request );
  }

  remainderWallet () {
    return this.$__remainderWallet;
  }

  molecule () {
    return this.$__molecule;
  }
}
