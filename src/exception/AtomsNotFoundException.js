export default class AtomsNotFoundException extends TypeError {
    /**
     * @param {string} message
     * @param {string} fileName
     * @param {number} lineNumber
     */
    constructor ( message = 'The molecule does not contain atoms', fileName, lineNumber )
    {
        super( message, fileName, lineNumber );
        this.name = 'AtomsNotFoundException';
    }

    /**
     * @returns {string}
     */
    toString ()
    {
        return `${ this.name }: ${ this.message }.\nStack:\n${ this.stack }`;
    }
}