/**
 * Formats arguments for console writer
 */

import Replacer from '../replacer';
import * as utils from '../utils';

export default class ConsoleFormatter {
    /**
     * @param {Object} [options]
     * @param {Replacer} [options.replacer]
     */
    constructor (options = {}) {
        this._replacer = options.replacer || new Replacer();
    }

    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} [args]
     * @returns {Array<*>}
     */
    format (method, prefix, args) {
        args = utils.appendPrefix(prefix, args);
        return utils.replacePlaceholders(this._replacer, args);
    }
}
