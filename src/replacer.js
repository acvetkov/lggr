/**
 * Replaces string placeholders
 */

const OPTIONS = {
    regExp: /%(.)/gm,
    limitStringLength: 300,
    nanString: 'NaN'
};

export default class Replacer {
    /**
     * @param {Object} [options]
     * @param {RegExp} options.regExp
     * @param {Number} options.limitStringLength
     * @param {nanString} options.String
     */
    constructor (options = {}) {
        options = Object.assign({}, options, OPTIONS);
        this._formats = options.formats || createDefaultFormats(options);
        this._regExp = options.regExp;
        this._limitStringLength = options.limitStringLength;
        this._nanString = options.nanString;
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
        return formatter ? formatter(item) : null;
    }
}

/**
 * @param {Object} options
 * @returns {Object}
 */
function createDefaultFormats(options) {
    return {
        i: formatIntegerNumber.bind(null, options.nanString),
        d: formatIntegerNumber.bind(null, options.nanString),
        f: formatFloatNumber.bind(null, options.nanString),
        o: formatJSON,
        j: formatJSON,
        l: formatLimitedString.bind(null, options.limitStringLength),
        s: formatString,
        '%': identity
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
        return JSON.stringify(data, null, 1);
    } catch (e) {
        return '';
    }
}

/**
 * @param {*} data
 * @returns {*}
 */
function identity(data) {
    return data;
}
