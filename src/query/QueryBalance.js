import Query from "./Query";
import ResponseBalance from "../response/ResponseBalance";

export default class QueryBalance extends Query {

  /**
   * @param client
   * @param url
   */
  constructor( client, url ) {
    super( client, url );

    this.$__query = 'query( $address: String, $bundleHash: String, $token: String, $position: String ) { Balance( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) { address, bundleHash, tokenSlug, batchId, position, amount, characters, pubkey, createdAt } }';
  }

  /**
   * @param response
   * @return {ResponseBalance}
   */
  createResponse ( response ) {
    return new ResponseBalance( this, response );
  }
}
