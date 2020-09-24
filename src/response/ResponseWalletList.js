import Response from "./Response";
import WalletShadow from "../WalletShadow";
import Wallet from "../Wallet";


export default class ResponseWalletList extends Response {
  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.Wallet';
    this.init();
  }

  toClientWallet ( data ) {
    let wallet;

    if ( data[ 'position' ] === null || typeof data[ 'position' ] === 'undefined') {
      wallet = new WalletShadow( data['bundleHash'], data['tokenSlug'], data['batchId'] );
    }
    else {
      wallet = new Wallet( null, data[ 'tokenSlug' ] );
      wallet.address = data[ 'address' ];
      wallet.position = data[ 'position' ];
      wallet.bundle = data[ 'bundleHash' ];
      wallet.batchId = data[ 'batchId' ];
      wallet.characters = data[ 'characters' ];
      wallet.pubkey = data[ 'pubkey' ];
    }

    wallet.balance = data[ 'amount' ];

    return wallet;
  }

  payload () {
    const list = this.data();

    if ( !list ) {
      return null;
    }

    const wallets = [];

    for ( let item of list ) {
      wallets.push( this.toClientWallet( item ) );
    }

    return wallets;
  }
}
