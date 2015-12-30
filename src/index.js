/**
 * Entry point of logger package
 * Exports method for loggers creation
 */

import Logger from './logger';
import Replacer from './replacer';
import ConsoleWriter from './console/writer';
import ConsoleFormatter from './console/formatter';
// import WebFileTransport from './web-file';

export {
    Logger as default,
    Replacer,
    ConsoleWriter,
    ConsoleFormatter
};
