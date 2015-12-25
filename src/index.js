
import Logger from './logger';
import ConsoleTransport from './console';
import WebFileTransport from './web-file';
import Replacer from './replacer';

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
