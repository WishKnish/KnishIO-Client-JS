import BaseException from './BaseException';


export default class BalanceInsufficientException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Insufficient balance for requested transfer', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'BalanceInsufficientException';

  }

}
