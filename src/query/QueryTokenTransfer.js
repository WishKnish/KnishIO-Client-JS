import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";
import Molecule from "../Molecule";
import ResponseTokenTransfer from "../response/ResponseTokenTransfer";

export default class QueryTokenTransfer extends QueryMoleculePropose {

  /**
   *
   * @param toWallet
   * @param amount
   */
  fillMolecule ( toWallet, amount ) {

    this.$__molecule.initValue( toWallet, amount );
    this.$__molecule.sign();
    this.$__molecule.check( this.$__molecule.sourceWallet() );
  }

  /**
   * @param response
   * @return {ResponseTokenTransfer}
   */
  createResponse ( response ) {
    return new ResponseTokenTransfer( this, response );
  }
}