import QueryMoleculePropose from "./QueryMoleculePropose";
import Molecule from "../Molecule";

/**
 *
 */
export default class QueryTokenReceive extends QueryMoleculePropose {

  /**
   * @param secret
   * @param sourceWallet
   * @param token
   * @param value
   * @param metaType
   * @param metaId
   * @param metas
   */
  initMolecule ( secret, sourceWallet, token, value, metaType, metaId, metas ) {

    this.$__molecule = new Molecule();
    this.$__molecule.initTokenTransfer( sourceWallet, token, value, metaType, metaId, metas || {} );
    this.$__molecule.sign( secret );
    this.$__molecule.check();
  }
}
