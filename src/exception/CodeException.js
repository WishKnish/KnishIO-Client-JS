import BaseException from './BaseException';

export default class CodeException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Code exception', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'CodeException';

  }

}
