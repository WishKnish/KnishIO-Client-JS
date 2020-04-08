import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";
import Molecule from "../Molecule";
import ResponseTokenTransfer from "../response/ResponseTokenTransfer";

export default class QueryTokenTransfer extends QueryMoleculePropose {

  /**
   * @param $fromSecret
   * @param {Wallet} fromWallet
   * @param {Wallet} toWallet
   * @param {string} token
   * @param {number} amount
   * @param {Wallet|null} remainderWallet
   */
  initMolecule ( $fromSecret, fromWallet, toWallet, token, amount, remainderWallet ) {

    this.$__remainderWallet = remainderWallet || Wallet.create( $fromSecret, token, toWallet.batchId, fromWallet.characters  );

    this.$__molecule = new Molecule();
    this.$__molecule.initValue( fromWallet, toWallet, this.$__remainderWallet, amount );
    this.$__molecule.sign( secret );
    this.$__molecule.check( fromWallet );
  }

  /**
   * @param response
   * @return {ResponseTokenTransfer}
   */
  createResponse ( response ) {
    return new ResponseTokenTransfer( this, response );
  }
}