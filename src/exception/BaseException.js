export default class BaseException extends TypeError {

  /**
   * @param {string|null} message
   * @param {string} fileName
   * @param {number} lineNumber
   */
  constructor ( message = null, fileName, lineNumber )
  {

    super( message, fileName, lineNumber );

    if ( null === message ) {

      throw new this( 'Unknown ' + this.constructor.name );

    }

    this.name = 'BaseException';

  }

  /**
   * @returns {string}
   */
  toString ()
  {

    return `${ this.name }: ${ this.message }.\nStack:\n${ this.stack }`;

  }

}
