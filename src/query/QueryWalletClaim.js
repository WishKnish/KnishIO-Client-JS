import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";
import Molecule from "../Molecule";

export default class QueryWalletClaim extends QueryMoleculePropose {

  /**
   *
   * @param {string} secret
   * @param {Wallet} sourceWallet
   * @param {Wallet} shadowWallet
   * @param {string} token
   * @param {Wallet||null} recipientWallet
   */
  initMolecule ( secret, sourceWallet, shadowWallet, token, recipientWallet ) {

    this.recipientWallet = recipientWallet || new Wallet( secret, token );

    const metas = {
      'walletAddress': this.recipientWallet.address,
      'walletPosition': this.recipientWallet.position
    };

    this.$__remainderWallet = new Wallet( secret );
    this.$__molecule = new Molecule();
    this.$__molecule.initShadowWalletClaim( sourceWallet, shadowWallet, this.recipientWallet, metas );
    this.$__molecule.sign( secret );
    this.$__molecule.check();
  }
}