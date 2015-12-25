
export default class Logger {
    constructor (options = {}) {
        this._prefix = options.prefix;
        this._transports = options.transports;
        this._levels = new Map();
        this._defaultFormat = options.defaultFormat;
        this._createMethods(options.methods);
    }

    message (method, ...args) {
        this._filterTransports(method)
            .forEach(transport => {
                var format = this._getFromatter(transport);
                var formatted = format(method, this._prefix, args);
                transport.write(method, formatted);
            });
    }

    setLevels (transport, levels) {
        this._levels.set(transport, levels);
    }

    addTransport (transport) {
        if (this._transports.indexOf(transport) === -1) {
            this._transports.push(transport);
        }
    }

    removeTransport (transport) {
        var index = this._transports.indexOf(transport);
        if (index !== -1) {
            this._transports.splice(index, 1);
        }
    }

    _createMethods (methods) {
        methods.forEach(method => {
            this[method] = this.message.bind(this, method);
        });
    }

    _filterTransports (method) {
        return this._transports.filter(transport => {
            return isMethodAllowed(method, this._levels.get(transport));
        });
    }

    _getFromatter (transport) {
        return transport.format ?
            transport.format.bind(transport) : this._defaultFormat;
    }
}

function isMethodAllowed(method, levels) {
    if (Array.isArray(levels)) {
        return levels.indexOf(method) !== -1;
    }
    return true;
}
