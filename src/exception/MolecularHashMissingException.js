import BaseException from './BaseException';


export default class MolecularHashMissingException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'The molecular hash is missing', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'MolecularHashMissingException';

  }

}
