import ResponseMolecule from "./ResponseMolecule";

export default class ResponseAuthentication extends ResponseMolecule {
  /**
   * @return {*}
   */
  payload () {
    const molecule = this.data();

    return !molecule || molecule[ 'status' ] === 'rejected' ? {} : JSON.parse( molecule[ 'reasonPayload' ] );
  }
}
