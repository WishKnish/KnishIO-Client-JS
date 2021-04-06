import BaseException from './BaseException';

/**
 * Generic code exception
 */
export default class BatchIdException extends BaseException {
  /**
   * @param {string|null} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor ( message = 'Incorrect BatchId', fileName = null, lineNumber = null ) {

    super( message, fileName, lineNumber );
    this.name = 'BatchIdException';

  }
}