/**
 * Utility methods and helpers
 */

/**
 * @param {Replacer} replacer
 * @param {Array<*>} args
 * @returns {Array<*>}
 */
export function replacePlaceholders(replacer, args) {
    if (typeof args[0] === 'string') {
        return [replacer.replace(args[0], args.slice(1))];
    }
    return args;
}

/**
 * @param {Object} object
 * @returns {Object}
 */
export function shallowCopyObject(object) {
    return Object.keys(object).reduce((result, key) => {
        var subObject = object[key];
        if (Array.isArray(subObject)) {
            result[key] = subObject.slice();
        } else if (typeof subObject === 'function') {
            result[key] = subObject.bind(object);
        } else if (typeof subObject === 'object') {
            result[key] = Object.assign({}, subObject);
        } else {
            result[key] = subObject;
        }
        return result;
    }, {});
}

/**
 * @param {Array<*>} args
 * @returns {String}
 */
export function toString(args, delimiter = ' ') {
    if (args.length === 0) {
        return 'undefined';
    }
    return args.map(item => {
        if (item === undefined) {
            return 'undefined';
        }
        if (typeof item === 'string') {
            return item;
        }
        return stringify(item);
    }).join(delimiter);
}

/**
 * @param {*} item
 * @returns {String}
 */
function stringify(item) {
    try {
        return JSON.stringify(item);
    } catch (e) {
        return String(item);
    }
}

/**
 * Returns new formatter that combines all passed formatters.
 * Each next formatter in list gets result from previous formatter.
 * @param {Array<Function>} formatters
 * @returns {Function}
 */
export function combineFormatters(formatters) {
    return function (method, prefix, args) {
        return formatters.reduce((formattedArgs, format) => {
            return format(method, prefix, formattedArgs);
        }, args);
    };
}

/**
 * @param {Object} data
 * @returns {Object}
 */
export function identity(data) {
    return data;
}
