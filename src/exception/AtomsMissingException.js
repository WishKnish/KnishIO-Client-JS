import BaseException from './BaseException';


export default class AtomsMissingException extends BaseException {

    /**
     * @param {string} message
     * @param {string} fileName
     * @param {number} lineNumber
     */
    constructor ( message = 'The molecule does not contain atoms', fileName, lineNumber )
    {

        super( message, fileName, lineNumber );
        this.name = 'AtomsMissingException';

    }

}
