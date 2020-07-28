import Response from "./Response";
import WalletShadow from "../WalletShadow";
import Wallet from "../Wallet";

export default class ResponseBalance extends Response {
  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.Balance';
    this.init();
  }

  payload () {
    const balance = this.data();

    if ( !balance ) {
      return null;
    }

    let wallet = null;

    // Shadow wallet
    if ( balance[ 'position' ] === null ) {
      wallet = new WalletShadow( balance['bundleHash'], balance['tokenSlug'], balance['batchId'] );
    }
    // Regular wallet
    else {
      wallet = new Wallet( null, balance[ 'tokenSlug' ] );
      wallet.address = balance[ 'address' ];
      wallet.position = balance[ 'position' ];
      wallet.bundle = balance[ 'bundleHash' ];
      wallet.batchId = balance[ 'batchId' ];
      wallet.characters = balance[ 'characters' ];
      wallet.pubkey = balance[ 'pubkey' ];
    }

    wallet.balance = balance[ 'amount' ];

    return wallet;
  }
}
