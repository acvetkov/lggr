/**
 * Joins log arguments with passed delimiter
 * Returns array with one element - joined string
 */

import {toString} from '../utils';

/**
 * @param {String} delimiter
 */
export default function create(delimiter) {
    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} args
     * @returns {Array<String>}
     */
    return function formatJoin(method, prefix, args) {
        return [toString(args, delimiter)];
    };
}
