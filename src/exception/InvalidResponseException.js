import BaseException from './BaseException';


export default class InvalidResponseException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'GraphQL did not provide a valid response.', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'InvalidResponseException';

  }

}
