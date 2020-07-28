import Query from "./Query";
import ResponseWalletList from "../response/ResponseWalletList";



export default class QueryWalletBundle extends Query {

  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `query( $address: String, $bundleHash: String, $token: String, $position: String ) { Wallet( address: $address, bundleHash: $bundleHash, token: $token, position: $position ) @fields }`;
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
   *
   * @param {string} response
   * @return {ResponseMolecule}
   */
  createResponse ( response ) {
    return new ResponseWalletList( this, response );
  }
}
