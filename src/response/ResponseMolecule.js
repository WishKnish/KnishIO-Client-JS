import Response from "./Response";

export default class ResponseMolecule extends Response {

  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.data.ProposeMolecule'
  }

  payload () {
    return this.data();
  }
}
