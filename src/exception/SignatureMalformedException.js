import BaseException from './BaseException';


export default class SignatureMalformedException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'OTS malformed', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'SignatureMalformedException';

  }

}
