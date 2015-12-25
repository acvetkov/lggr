
import Replacer from '../replacer';
import WebFile from './file.js';

const OPTIONS = {
    fileName: 'debug.log',
    maxSize: 5 * 1024 * 1024 // 5 Mb
};

export default class WebFileTransport {
    constructor (options = {}) {
        options = Object.assign({}, OPTIONS, options);
        this._replacer = new Replacer();
        this._logFile = new WebFile(options);
    }

    write (method, formattedString) {
        this._logFile.push(formattedString);
    }

    format (method, args) {
        var date = new Date().toISOString();
        var formattedString = `${date} ${method} `;
        if (typeof args[0] === 'string') {
             formattedString += this._replacer.replace(args[0], args.slice(1));
        }
        return formattedString;
    }
}
