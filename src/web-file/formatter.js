/**
 * Formatter for web file
 */

import Replacer from '../replacer';
import toString from '../utils';

export default class WebFileFormatter {
    /**
     * @param {Replacer} [replacer]
     */
    constructor (replacer) {
        this._replacer = replacer || new Replacer();
    }

    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} args
     * @returns {Array<String>}
     */
    format (method, prefix, args = []) {
        var formattedString = createFirstPart(method, prefix);
        if (typeof args[0] === 'string') {
            formattedString += this._replacer.replace(args[0], args.slice(1));
        } else {
            formattedString += toString(args);
        }
        return [formattedString];
    }
}

/**
 * @param {String} method
 * @param {String} [prefix]
 * @returns {String}
 */
function createFirstPart(method, prefix) {
    var parts = [createDatePart(), method.toUpperCase()];
    parts.push(prefix ? `${prefix}: ` : ': ');
    return parts.join(' ');
}

/**
 * @returns {String}
 */
function createDatePart() {
    return new Date().toISOString();
}
