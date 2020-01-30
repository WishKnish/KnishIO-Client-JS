import BaseException from './BaseException';


export default class AtomIndexException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'There is an atom without an index', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'AtomIndexException';

  }

}
