
import Replacer from '../replacer';

export default class ConsoleTransport {
    constructor (replacer = createReplacer()) {
        this.replacePlaceholders = false;
        this._replacer = replacer;
        this._console = console ? console : createFakeConsole();
    }

    write (method, formattedArgs) {
        if (!this._console[method]) {
            return;
        }
        if (Array.isArray(formattedArgs)) {
            this._console[method](...formattedArgs);
        } else {
            this._console[method](formattedArgs);
        }
    }

    format (method, prefix, args) {
        if (prefix) {
            args = appendPrefix(prefix, args);
        }
        if (this.replacePlaceholders) {
            return replacePlaceholders(this._replacer, args);
        }
        return args;
    }
}

function createFakeConsole() {
    var empty = function () {};
    var methods = ['log', 'info', 'warn', 'error'];
    return methods.reduce((result, method) => {
        result[method] = empty;
        return result;
    }, {});
}

function appendPrefix(prefix, args) {
    if (typeof args[0] === 'string') {
        args[0] = `${prefix}: ${args[0]}`;
    } else {
        args.unshift(prefix);
    }
    return args;
}

function replacePlaceholders(replacer, args) {
    if (typeof args[0] === 'string') {
        return replacer.replace(args[0], args.slice(1));
    }
    return args;
}

function createReplacer() {
    return new Replacer();
}
