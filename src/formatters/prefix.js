/**
 * Appends prefix to log arguments
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
    return function formatPrefix(method, prefix, args) {
        var mutatedPrefix = mutator(prefix);
        if (mutatedPrefix) {
            return [mutatedPrefix].concat(args);
        }
        return args;
    };
}
