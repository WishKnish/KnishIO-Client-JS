import BaseException from './BaseException';


export default class TransferMismatchedException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Token transfer slugs are mismached', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'TransferMismatchedException';

  }

}
