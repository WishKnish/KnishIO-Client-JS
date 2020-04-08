import Query from "./Query";

import ResponseContinueId from "../response/ResponseContinueId";

export default class QueryContinueId extends Query {

  constructor ( client, url ) {
    super( client, url );
    this.$__query = 'query ($bundle: String!) { ContinueId(bundle: $bundle) { address, bundleHash, tokenSlug, position, batchId, characters, pubkey, amount, createdAt } }';
  }
  /**
   *
   * @param {string} response
   * @return {ResponseMolecule}
   */
  createResponse ( response ) {
    return new ResponseContinueId( this, response );
  }
}
