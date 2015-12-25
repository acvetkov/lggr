
const OPTIONS = {
    regExp: /%(.)/gm,
    limitStringLength: 300,
    nanString: 'NaN'
};

export default class Replacer {
    constructor (options = {}) {
        options = Object.assign({}, options, OPTIONS);
        this._formats = options.formats || createDefaultFormats(options);
        this._regExp = options.regExp;
        this._limitStringLength = options.limitStringLength;
        this._nanString = options.nanString;
    }

    replace (string, data) {
        var placeholderIndex = -1;
        return string.replace(this._regExp, (total, match) => {
            placeholderIndex += 1;
            return this._formatItem(match, data[placeholderIndex]);
        });
    }

    addPlaceholder (placeholder, formatter) {
        this._formats[placeholder] = formatter;
    }

    removePlaceholder (placeholder) {
        if (this._formats[placeholder]) {
            delete this._formats[placeholder];
        }
    }

    _formatItem (placeholder, item) {
        var formatter = this._formats[placeholder];
        return formatter ? formatter(item) : null;
    }
}

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

function formatString(data) {
    return String(data);
}

function formatLimitedString(limitLength, data) {
    return String(data).substr(0, limitLength);
}

function formatIntegerNumber(nanString, data) {
    return typeof data === 'number' ?
        String(Math.floor(data)) : nanString;
}

function formatFloatNumber(nanString, data) {
    return typeof data === 'number' ?
        String(Number(data)) : nanString;
}

function formatJSON(data) {
    return JSON.stringify(data || '', null, 1);
}

function identity(data) {
    return data;
}
