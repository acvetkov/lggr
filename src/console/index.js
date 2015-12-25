
import Replacer from '../replacer';

export default class ConsoleTransport {
    constructor (options = {}) {
        this.replacePlaceholders = false;
        this._replacer = options.replacer || new Replacer();
        this._console = console ? console : {};
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
