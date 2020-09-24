import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";


export default class QueryShadowWalletClaim extends QueryMoleculePropose {
  fillMolecule ( token, shadowWallets ) {
    const wallets = [];

    for ( let shadowWallet of shadowWallets ) {
      wallets.push( Wallet.create( this.$__molecule.secret(), token, shadowWallet.batchId ) );
    }

    this.$__molecule.initShadowWalletClaimAtom ( token, wallets );
    this.$__molecule.sign();
    this.$__molecule.check();
  }
}