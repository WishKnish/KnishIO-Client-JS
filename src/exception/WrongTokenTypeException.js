import BaseException from './BaseException';


export default class WrongTokenTypeException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Wrong type of token for this isotope', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'WrongTokenTypeException';

  }

}