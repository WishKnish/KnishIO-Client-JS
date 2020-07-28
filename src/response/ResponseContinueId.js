import Response from "./Response";
import Wallet from "../Wallet";

/**
 *
 */
export default class ResponseContinueId extends Response {
  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.ContinuId';
    this.init();
  }

  /**
   * @return {Wallet|null}
   */
  payload () {
    let wallet = null;

    const continueId = this.data();

    if ( continueId ) {
      wallet = new Wallet( null, continueId[ 'tokenSlug' ] );
      wallet.address = continueId[ 'address' ];
      wallet.position = continueId[ 'position' ];
      wallet.bundle = continueId[ 'bundleHash' ];
      wallet.batchId = continueId[ 'batchId' ];
      wallet.characters = continueId[ 'characters' ];
      wallet.pubkey = continueId[ 'pubkey' ];
      wallet.balance = continueId[ 'amount' ] * 1.0;
    }

    return wallet;
  }
}