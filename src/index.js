/**
 * Entry point of logger package
 */

import Logger from './logger';
import Replacer from './replacer';
import ConsoleWriter from './console/writer';
import ConsoleFormatter from './console/formatter';
import ConsoleNormalizer from './console/normalizer';
import WebFileFormatter from './web-file/formatter';
import WebFileWriter from './web-file/writer';
import WebFile from './web-file/file';

export {
    Logger,
    Replacer,
    ConsoleWriter,
    ConsoleFormatter,
    ConsoleNormalizer,
    WebFileWriter,
    WebFileFormatter,
    WebFile
};
