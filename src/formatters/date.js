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
 * Returns current timezone date in ISO format
 * @returns {String}
 */
function createDatePart() {
    const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    const dateWithReversedOffset = new Date(Date.now() - timeZoneOffset);

    return dateWithReversedOffset.toISOString().slice(0, -1); // remove Zulu timezone abbreviation
}
