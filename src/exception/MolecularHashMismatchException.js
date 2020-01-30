import BaseException from './BaseException';


export default class MolecularHashMismatchException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'The molecular hash does not match', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'MolecularHashMismatchException';

  }

}
