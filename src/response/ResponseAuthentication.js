import ResponseMolecule from "./ResponseMolecule";

export default class ResponseAuthentication extends ResponseMolecule {
  /**
   * @return {*}
   */
  payload () {
    const molecule = this.data();

    return molecule[ 'status' ] === 'rejected' ? {} : JSON.parse( molecule[ 'reasonPayload' ] );
  }
}
