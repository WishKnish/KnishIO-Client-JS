import QueryMoleculePropose from "./QueryMoleculePropose";
import ResponseAuthentication from "../response/ResponseAuthentication";

export default class QueryAuthentication extends QueryMoleculePropose {

  fillMolecule () {
    this.$__molecule.initAuthentication();
    this.$__molecule.sign();
    this.$__molecule.check()
  }

  createResponse ( response ) {
    return new ResponseAuthentication( this, response );
  }
}
