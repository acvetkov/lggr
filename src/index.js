/**
 * Entry point of logger package
 */

import Logger from './logger';
import Replacer from './utils/replacer';

import createConsoleWriter from './writers/console';
import createWebFileWriter from './writers/web-file';

import createDateFormatter from './formatters/date';
import createMethodFormatter from './formatters/method';
import createPrefixFormatter from './formatters/prefix';
import createPlaceholdersFormatter from './formatters/placeholders';
import createNormalFormatter from './formatters/placeholders-normalizer';
import createJoinFormatter from './formatters/join';
import createJoinFirstFormatter from './formatters/join-first';

import WebFile from './utils/web-file';
import * as utils from './utils';

var combineFormatters = utils.combineFormatters;

export {
    Logger,
    Replacer,
    WebFile,

    createConsoleWriter,
    createWebFileWriter,

    createDateFormatter,
    createMethodFormatter,
    createPrefixFormatter,
    createPlaceholdersFormatter,
    createNormalFormatter,
    createJoinFormatter,
    createJoinFirstFormatter,

    combineFormatters,
    utils
};
