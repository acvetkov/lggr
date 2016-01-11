/**
 * Replaces string placeholders
 */

const REG_EXP = /%(.)/gm;

const OPTIONS = {
    limitStringLength: 300,
    nanString: 'NaN'
};

export default class Replacer {
    /**
     * @param {Object} [options]
     * @param {Object} [options.formats]
     * @param {RegExp} [options.regExp]
     * @param {Number} [options.limitStringLength]
     * @param {String} [options.nanString]
     */
    constructor (options = {}) {
        options = Object.assign({}, OPTIONS, options);
        this._formats = options.formats || createDefaultFormats(options);
        this._limitStringLength = options.limitStringLength;
        this._nanString = options.nanString;
        this._regExp = REG_EXP;
    }

    /**
     * @param {String} string
     * @param {*} data
     * @returns {String}
     */
    replace (string, data) {
        var placeholderIndex = -1;
        return string.replace(this._regExp, (total, match) => {
            placeholderIndex += 1;
            return this._formatItem(match, data[placeholderIndex]);
        });
    }

    /**
     * @param {String} placeholder
     * @param {Function} formatter
     */
    addPlaceholder (placeholder, formatter) {
        this._formats[placeholder] = formatter;
    }

    /**
     * @param {String} placeholder
     */
    removePlaceholder (placeholder) {
        if (this._formats[placeholder]) {
            delete this._formats[placeholder];
        }
    }

    /**
     * @param {String} placeholder
     * @param {*} item
     * @returns {String|null}
     */
    _formatItem (placeholder, item) {
        var formatter = this._formats[placeholder];
        return formatter ? formatter(item) : `%${placeholder}`;
    }
}

/**
 * @param {Object} options
 * @returns {Object}
 */
function createDefaultFormats(options) {
    return {
        o: formatJSON,
        j: formatJSON,
        s: formatString,
        l: formatLimitedString.bind(null, options.limitStringLength),
        i: formatIntegerNumber.bind(null, options.nanString),
        d: formatIntegerNumber.bind(null, options.nanString),
        f: formatFloatNumber.bind(null, options.nanString),
        '%': () => '%'
    };
}

/**
 * @param {*} data
 * @returns {String}
 */
function formatString(data) {
    return String(data);
}

/**
 * @param {Number} limitStringLength
 * @param {*} data
 * @returns {String}
 */
function formatLimitedString(limitLength, data) {
    return String(data).substr(0, limitLength);
}

/**
 * @param {String} nanString
 * @param {*} data
 * @returns {String}
 */
function formatIntegerNumber(nanString, data) {
    return typeof data === 'number' ?
        String(Math.floor(data)) : nanString;
}

/**
 * @param {String} nanString
 * @param {*} data
 * @returns {String}
 */
function formatFloatNumber(nanString, data) {
    return typeof data === 'number' ?
        String(Number(data)) : nanString;
}

/**
 * @param {*} data
 * @returns {String}
 */
function formatJSON(data) {
    try {
        return JSON.stringify(data || '', null, 1);
    } catch (e) {
        return '';
    }
}
