import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from "../Wallet";
import Molecule from "../Molecule";


export default class QueryIdentifierCreate extends QueryMoleculePropose {
  initMolecule ( secret, sourceWallet, type, contact, code, remainderWallet = null ) {
    this.$__remainderWallet = remainderWallet || new Wallet( secret );
    this.$__molecule = new Molecule();
    this.$__molecule.initIdentifierCreation( sourceWallet, this.$__remainderWallet, type, contact, code );
    this.$__molecule.sign( secret );
    this.$__molecule.check();
  }
}
