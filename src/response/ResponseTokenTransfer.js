import ResponseMolecule from "./ResponseMolecule";


export default class ResponseTokenTransfer extends ResponseMolecule {

  payload () {
    const result = {
      'reason': null,
      'status': null,
    },
      data = this.data();

    result.reason = typeof data.reason === 'undefined' ? 'Invalid response from server' : data.reason;
    result.status = typeof data.status === 'undefined' ? 'rejected' : data.status;

    return result;
  }
}