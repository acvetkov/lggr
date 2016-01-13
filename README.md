# Example
```javascript
import {
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

    combineFormatters
} from 'logger';
// You can also just write "import * as logModule from 'logger'"

var webFile = new WebFile({
    fileName: 'debug.log',
    oldFileName: 'debug-old.log',
    maxSize: 5 * 1024 * 1024
});

var webFileFormatter = combineFormatters([
    createPlaceholdersFormatter(),
    createPrefixFormatter(prefix => `-[${prefix}]-`),
    createMethodFormatter(method => method.toUpperCase()),
    createDateFormatter(),
    createJoinFormatter(' # ')
]);

var consoleFormatter = combineFormatters([
    createNormalFormatter({j: 'o', l: 's'}),
    createPrefixFormatter(),
    createJoinFirstFormatter(2, '|')
]);

var options = {
    methods: ['log', 'info', 'warn', 'error'],
    writers: {
        console: createConsoleWriter(),
        file: createWebFileWriter(webFile)
    },
    formatters: {
        console: consoleFormatter,
        file: webFileFormatter
    },
    levels: {
        console: ['warn', 'error'],
        file: ['log', 'info', 'warn', 'error']
    }
};

var logger = new Logger('log-prefix', options);

logger.log('Hello, %s! I am %i years old!', 'world', 142);
logger.error('Hello, %s! I am %i years old!', 'world', 142);
logger.warn('Hello, %s! I am %i years old!', 'world', 142);
logger.info('Hello, %s! I am %i years old!', 'world', 142);

var otherLogger = logger.clone('other-log-prefix');
otherLogger.info('Hi, %o', {world: 'Earth', age: 9999999999})

// this methods are applied to both logger and otherLogger
// (and to any other clones of logger and clones of otherLogger and clones of clones of...)
logger.setLevels('console', ['log'])
logger.addFormatter('file', createDateFormatter())

// this methods are applied only to otherLogger
otherLogger.setLevels('console', ['error', 'warn'])
otherLogger.addFormatter('file', someOtherFormatterMethod)

var forkedLogger = logger.fork('forked-prefix');

// you can change forkedLogger options only by calling methods of forkedLogger itself
forkedLogger.setLevels('console', ['warn'])

```
