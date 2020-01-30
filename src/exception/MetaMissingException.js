import BaseException from './BaseException';


export default class MetaMissingException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Empty meta data.', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'MetaMissingException';

  }

}
