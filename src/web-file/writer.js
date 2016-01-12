/**
 * Writer for web file
 */

import WebFile from './file.js';

export default class WebFileWriter {
    /**
     * @param {WebFile} [file]
     * @param {Object} [options] - options for WebFile constructor
     */
    constructor (file, options) {
        this._file = file || new WebFile(options);
    }

    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<String>} formattedArgs
     */
    write (method, prefix, formattedArgs) {
        this._file.push(formattedArgs[0]);
    }
}
