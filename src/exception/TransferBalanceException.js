import BaseException from './BaseException';


export default class TransferBalanceException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Insufficient balance to make transfer', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'TransferBalanceException';

  }

}
