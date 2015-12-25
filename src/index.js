/**
 * Entry point of logger package
 * Exports method for loggers creation
 */

import Logger from './logger';
import ConsoleTransport from './console';
import WebFileTransport from './web-file';
import Replacer from './replacer';

/**
 * @param {String} [prefix]
 * @param {Object} [options]
 * @param {Array<String>} options.methods
 * @param {Array<{write: Function, format: Function}>} options.transports
 * @param {Function} defaultFormat
 * @returns {Logger}
 */
function logger(prefix = null, options = {}) {
    options = Object.assign({prefix}, logger.defaultOptions, options);
    return new Logger(options);
}

var consoleTransport = new ConsoleTransport();

logger.defaultOptions = {
    methods: ['log', 'info', 'warn', 'error'],
    transports: [consoleTransport],
    defaultFormat: consoleTransport.format.bind(consoleTransport)
};

logger.Logger = Logger;
logger.Replacer = Replacer;
logger.ConsoleTransport = ConsoleTransport;
logger.WebFileTransport = WebFileTransport;

export default logger;
