import BaseException from './BaseException';


export default class DecryptException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Error during decryption.', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'DecryptException';

  }

}
