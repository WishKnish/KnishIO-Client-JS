import QueryMoleculePropose from "./QueryMoleculePropose";

/**
 *
 */
export default class QueryTokenReceive extends QueryMoleculePropose {

  /**
   *
   * @param token
   * @param value
   * @param metaType
   * @param metaId
   * @param metas
   */
  fillMolecule ( token, value, metaType, metaId, metas = null ) {

    this.$__molecule.initTokenTransfer( token, value, metaType, metaId, metas || {} );
    this.$__molecule.sign();
    console.log( this.$__molecule );
    this.$__molecule.check();
  }
}
