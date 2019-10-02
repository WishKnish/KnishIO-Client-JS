import BaseException from './BaseException';


export default class SignatureMismatchException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'OTS mismatch', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'SignatureMismatchException';

  }

}
