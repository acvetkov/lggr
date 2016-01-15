/**
 * Writer for web file
 */

import WebFile from '../utils/web-file';

/**
 * @param {WebFile} [file]
 * @param {Object} [options] - options for WebFile constructor
 */
export default function create(file, options) {
    var webFile = file || new WebFile(options);

    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<String>} formattedArgs
     */
    return function writeWebFile(method, prefix, formattedArgs) {
        webFile.push(formattedArgs[0]);
    };
}
