import BaseException from './BaseException';


export default class TransferToSelfException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Sender and recipient(s) cannot be the same', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'TransferToSelfException';

  }

}
