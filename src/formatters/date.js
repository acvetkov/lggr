/**
 * Appends date to log arguments
 */

/**
 * @param {Function} [createDate]
 */
export default function create(createDate = createDatePart) {
    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} args
     * @returns {Array<String>}
     */
    return function formatDate(method, prefix, args) {
        return [createDate(), ...args];
    };
}

/**
 * @returns {String}
 */
function createDatePart() {
    return new Date().toISOString();
}
