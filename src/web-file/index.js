
import Replacer from '../replacer';
import WebFile from './file.js';

const OPTIONS = {
    fileName: 'debug.log',
    maxSize: 5 * 1024 * 1024 // 5 Mb
};

export default class WebFileTransport {
    constructor (options = {}) {
        options = Object.assign({}, OPTIONS, options);
        this._replacer = options.replacer || new Replacer();
        this._logFile = options.webFile || new WebFile(options);
    }

    write (method, formattedString) {
        this._logFile.push(formattedString);
    }

    format (method, prefix = '', args = []) {
        var date = new Date().toISOString();
        var formattedString = `${date} ${method} ${prefix}:`;
        if (typeof args[0] === 'string') {
            formattedString += this._replacer.replace(args[0], args.slice(1));
        }
        return formattedString;
    }
}
