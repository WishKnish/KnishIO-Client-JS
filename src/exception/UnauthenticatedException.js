import BaseException from './BaseException';

/**
 *
 */
export default class UnauthenticatedException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'Unauthenticated.', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'UnauthenticatedException';

  }

}