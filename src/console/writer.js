/**
 * Writes formatted arguments to console;
 */

export default class ConsoleWriter {
    constructor () {
        this._console = console ? console : {};
    }

    /**
     * @param {String} method
     * @param {String} prefix
     * @param {Array<*>} formattedArgs
     */
    write (method, prefix, formattedArgs) {
        if (this._console[method]) {
            this._console[method](...formattedArgs);
        }
    }
}
