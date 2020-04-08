import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";
import Molecule from "../Molecule";
import ResponseTokenCreate from "../response/ResponseTokenCreate";

/**
 *
 */
export default class QueryTokenCreate extends QueryMoleculePropose {
  /**
   * @param {string} secret
   * @param {Wallet} sourceWallet
   * @param {Wallet} recipientWallet
   * @param {number} amount
   * @param {Array|Object} metas
   * @param {Wallet|null} remainderWallet
   */
  initMolecule ( secret, sourceWallet, recipientWallet, amount, metas, remainderWallet ) {
    this.$__remainderWallet = remainderWallet || new Wallet( secret );
    this.$__molecule = new Molecule();
    this.$__molecule.initTokenCreation( sourceWallet, recipientWallet, this.$__remainderWallet, amount,  metas || {} );
    this.$__molecule.sign( secret );
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
