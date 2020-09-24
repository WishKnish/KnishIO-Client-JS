import Query from "./Query";

import ResponseContinueId from "../response/ResponseContinueId";

export default class QueryContinueId extends Query {

  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `query ($bundle: String!) { ContinuId(bundle: $bundle) @fields }`;
    this.$__fields = {
      'address': null,
      'bundleHash': null,
      'tokenSlug': null,
      'position': null,
      'batchId': null,
      'characters': null,
      'pubkey': null,
      'amount': null,
      'createdAt': null,
    };
  }

  /**
   * @param response
   * @returns {ResponseContinueId}
   */
  createResponse ( response ) {
    return new ResponseContinueId( this, response );
  }
}
