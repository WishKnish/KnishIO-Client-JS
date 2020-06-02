import BaseException from './BaseException';


export default class NegativeMeaningException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Negative meaning', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'NegativeMeaningException';

  }

}
