
/**
 * @param {String} prefix
 * @param {Array<*>} args
 * @returns {Array<*>}
 */
export function appendPrefix(prefix, args) {
    if (!prefix) {
        return args;
    }
    if (typeof args[0] === 'string') {
        return [`${prefix}: ${args[0]}`].concat(args.slice(1));
    } else {
        return [prefix].concat(args);
    }
}

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
export function toString(args) {
    if (args.length === 0) {
        return 'undefined';
    }
    return args.map(item => {
        if (item === undefined) {
            return 'undefined';
        }
        try {
            return JSON.stringify(item);
        } catch (e) {
            return String(item);
        }
    }).join(' ');
}
