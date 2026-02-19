import BaseException from '../../../exception/BaseException.js'

export default class RuleArgumentException extends BaseException {
  /**
   * Class constructor
   *
   * @param {string} message
   * @param {string|null} fileName
   * @param {number|null} lineNumber
   */
  constructor (message = 'An incorrect argument!', fileName = null, lineNumber = null) {
    super(message, fileName, lineNumber)
    this.name = 'RuleArgumentException'
  }
}
