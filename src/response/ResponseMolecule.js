import Response from "./Response";
import Dot from "../libraries/Dot";
import MoleculeStructure from "../MoleculeStructure";


export default class ResponseMolecule extends Response {

  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.ProposeMolecule';
    this.init ();
  }

  init () {
    const payload_json = Dot.get( this.data(), 'payload' );
    try {
      this.$__payload = JSON.parse( payload_json );
    }
    catch ( err ) {
      this.$__payload = null;
    }
  }

  molecule () {

    const data = this.data();

    if ( !data ) {
      return null;
    }

    const molecule = new MoleculeStructure();

    molecule.molecularHash = Dot.get( data, 'molecularHash' );
    molecule.status = Dot.get( data, 'status' );
    molecule.status = Dot.get( data, 'createdAt' );

    return molecule;
  }

  /**
   * @returns {boolean}
   */
  success () {
    return this.status() === 'accepted';
  }

  /**
   * @returns {string}
   */
  status () {
    return Dot.get( this.data(), 'status', 'rejected' );
  }

  /**
   * @returns {string}
   */
  reason () {
    return Dot.get( this.data(), 'reason', 'Invalid response from server' );
  }

  payload () {
    return this.$__payload;
  }

}
