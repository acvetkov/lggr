/**
 * Joins specified amount of log arguments with passed delimiter
 */

import {toString} from '../utils';

/**
 * @param {String} delimiter
 */
export default function create(count, delimiter) {
    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} args
     * @returns {Array<String>}
     */
    return function formatJoinFirst(method, prefix, args) {
        return [
            toString(args.slice(0, count), delimiter)
        ].concat(args.slice(count));
    };
}
