import Query from "./Query";
import ResponseWalletBundle from "../response/ResponseWalletBundle";


export default class QueryWalletBundle extends Query {

  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `query( $bundleHash: String, $bundleHashes: [ String! ], $key: String, $keys: [ String! ], $value: String, $values: [ String! ], $keys_values: [ MetaInput ], $latest: Boolean, $limit: Int, $skip: Int, $order: String ) { WalletBundle( bundleHash: $bundleHash, bundleHashes: $bundleHashes, key: $key, keys: $keys, value: $value, values: $values, keys_values: $keys_values, latest: $latest, limit: $limit, skip: $skip, order: $order ) @fields }`;
    this.$__fields = {
      'bundleHash': null,
      'slug': null,
      'metas': {
      'molecularHash': null,
        'position': null,
        'metaType': null,
        'metaId': null,
        'key': null,
        'value': null,
        'createdAt': null,
    },
      //	'molecules',
      //	'wallets',
      'createdAt': null,
    };
  }
  /**
   *
   * @param {string} response
   * @return {ResponseMolecule}
   */
  createResponse ( response ) {
    return new ResponseWalletBundle( this, response );
  }
}
