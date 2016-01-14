/**
 * Formats arguments for console writer
 */

import Replacer from '../utils/replacer';
import * as utils from '../utils';

/**
 * @param {Replacer} replacer
 */
export default function create(replacer = new Replacer()) {
    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} [args]
     * @returns {Array<*>}
     */
    return function formatPlaceholders(method, prefix, args) {
        return utils.replacePlaceholders(replacer, args);
    };
}
