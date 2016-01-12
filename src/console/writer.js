/**
 * Writes formatted arguments to console;
 */

var apply = Function.prototype.apply;

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
            // do not call apply directly on console methods (IE)
            apply.call(this._console[method], this._console, formattedArgs);
        }
    }
}
