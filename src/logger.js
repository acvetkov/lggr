/**
 * Logger class.
 * Contains actual log methods and logic for transports/levels managing
 */

export default class Logger {
    /**
     * @param {Object} [options]
     * @param {String} options.prefix
     * @param {Array<String>} options.methods
     * @param {Array<{write: Function, format: Function}>} options.transports
     * @param {Function} defaultFormat
     */
    constructor (options = {}) {
        this._prefix = options.prefix;
        this._transports = options.transports;
        this._levels = new Map();
        this._defaultFormat = options.defaultFormat;
        this._createMethods(options.methods);
    }

    /**
     * @param {String} method
     * @param {Array<*>} args
     */
    message (method, ...args) {
        this._filterTransports(method)
            .forEach(transport => {
                var format = this._getFromatter(transport);
                var formatted = format(method, this._prefix, args);
                transport.write(method, formatted);
            });
    }

    /**
     * @param {Object} transport
     * @param {Array<String>} levels
     */
    setLevels (transport, levels) {
        this._levels.set(transport, levels);
    }

    /**
     * @param {Object} transport
     */
    addTransport (transport) {
        if (this._transports.indexOf(transport) === -1) {
            this._transports.push(transport);
        }
    }

    /**
     * @param {Object} transport
     */
    removeTransport (transport) {
        var index = this._transports.indexOf(transport);
        if (index !== -1) {
            this._transports.splice(index, 1);
        }
    }

    /**
     * @param {Array<String>} methods
     */
    _createMethods (methods) {
        methods.forEach(method => {
            this[method] = this.message.bind(this, method);
        });
    }

    /**
     * @param {String} method
     * @returns {Array<Object>}
     */
    _filterTransports (method) {
        return this._transports.filter(transport => {
            return isMethodAllowed(method, this._levels.get(transport));
        });
    }

    /**
     * @param {Object} transport
     * @returns {Function}
     */
    _getFromatter (transport) {
        return transport.format ?
            transport.format.bind(transport) : this._defaultFormat;
    }
}

/**
 * @param {String} method
 * @param {Array<String>} levels
 * @returns {Boolean}
 */
function isMethodAllowed(method, levels) {
    if (Array.isArray(levels)) {
        return levels.indexOf(method) !== -1;
    }
    return true;
}
