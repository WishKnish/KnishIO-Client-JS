import BaseException from "./BaseException";

export default class WalletShadowException extends BaseException {

  /**
   * @param {string} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = 'The shadow wallet does not exist', fileName, lineNumber )
  {

    super( message, fileName, lineNumber );
    this.name = 'WalletShadowException';
  }
}
