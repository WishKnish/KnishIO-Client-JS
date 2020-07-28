import QueryMoleculePropose from "./QueryMoleculePropose";


export default class QueryIdentifierCreate extends QueryMoleculePropose {
  fillMolecule ( type, contact, code ) {
    this.$__molecule.initIdentifierCreation( type, contact, code );
    this.$__molecule.sign();
    this.$__molecule.check();
  }
}
