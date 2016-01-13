/**
 * Writes formatted arguments to console;
 */

export default function create() {
    var apply = Function.prototype.apply;
    var _console = console ? console : {};

    /**
     * @param {String} method
     * @param {String} prefix
     * @param {Array<*>} formattedArgs
     */
    return function writeConsole(method, prefix, formattedArgs) {
        if (_console[method]) {
            // do not call apply directly on console methods (IE)
            apply.call(_console[method], _console, formattedArgs);
        }
    };
}
