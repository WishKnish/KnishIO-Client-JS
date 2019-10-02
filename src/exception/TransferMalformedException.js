import BaseException from './BaseException';


export default class TransferMalformedException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Token transfer atoms are malformed', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'TransferMalformedException';

  }

}
