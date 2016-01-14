/**
 * Adds method to log arguments
 */

import {identity} from '../utils';

/**
 * @param {Function} [mutator] - method to change prefix
 */
export default function create(mutator = identity) {
    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} args
     * @returns {Array<String>}
     */
    return function formatMethod(method, prefix, args) {
        return [mutator(method)].concat(args);
    };
}
