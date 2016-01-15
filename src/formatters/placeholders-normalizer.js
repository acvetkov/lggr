/**
 * Normalizes placeholders for console writer
 */

/**
 * @param {Object} [placeholders] - {placeholder: normalPlaceholder} map
 */
export default function create(placeholders = {}) {
    const regList = createRegExpList(placeholders);

    /**
     * @param {String} method
     * @param {String} [prefix]
     * @param {Array<*>} args
     * @returns {Array<*>}
     */
    return function formatPlaceholdersNormalizer(method, prefix, args) {
        return normalizePlaceholders(args, regList);
    };
}

/**
 * @param {Object} placeholders
 * @returns {Array<{regExp: RegExp, normalPlaceholder: String}>}
 */
function createRegExpList(placeholders) {
    return Object.keys(placeholders).map(placeholder => {
        return {
            normalPlaceholder: placeholders[placeholder],
            regExp: new RegExp(`%${placeholder}`, 'g')
        };
    });
}

/**
 * @param {Array<*>} args
 * @param {Array<{regExp: RegExp, normalPlaceholder: String}>} regList
 * @returns {Array<*>}
 */
function normalizePlaceholders(args, regList) {
    if (typeof args[0] === 'string') {
        regList.forEach(item => {
            args[0] = args[0].replace(item.regExp, `%${item.normalPlaceholder}`);
        });
    }
    return args;
}
