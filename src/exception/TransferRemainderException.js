import BaseException from './BaseException';


export default class TransferRemainderException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Invalid remainder provided', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'TransferRemainderException';

  }

}
