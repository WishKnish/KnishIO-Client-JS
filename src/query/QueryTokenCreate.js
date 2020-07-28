import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";
import Molecule from "../Molecule";
import ResponseTokenCreate from "../response/ResponseTokenCreate";

/**
 *
 */
export default class QueryTokenCreate extends QueryMoleculePropose {

  fillMolecule ( recipientWallet, amount, metas = null) {
    this.$__molecule.initTokenCreation( recipientWallet, amount, metas || {} );
    this.$__molecule.sign();
    this.$__molecule.check();
  }

  /**
   * @param response
   * @return {ResponseTokenCreate}
   */
  createResponse ( response ) {
    return new ResponseTokenCreate( this, response );
  }
}
