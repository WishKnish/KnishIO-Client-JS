import Query from "./Query";
import ResponseBalance from "../response/ResponseBalance";


export default class QueryBalance extends Query {

  /**
   * @param knishIO
   */
  constructor( knishIO ) {
    super( knishIO );

    this.$__query = `query( $address: String, $bundleHash: String, $token: String, $position: String ) { Balance( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) @fields }`;
    this.$__fields = {
      'address': null,
      'bundleHash': null,
      'tokenSlug': null,
      'batchId': null,
      'position': null,
      'amount': null,
      'characters': null,
      'pubkey': null,
      'createdAt': null,
    };
  }

  /**
   * @param response
   * @return {ResponseBalance}
   */
  createResponse ( response ) {
    return new ResponseBalance( this, response );
  }
}
