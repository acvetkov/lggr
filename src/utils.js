
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
