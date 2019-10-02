import BaseException from './BaseException';


export default class TransferUnbalancedException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Token transfer atoms are unbalanced', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'TransferUnbalancedException';

  }

}
