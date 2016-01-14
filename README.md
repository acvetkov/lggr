## Example
```javascript
import * as lggr from 'lggr';

var webFile = new lggr.WebFile({
    fileName: 'debug.log',
    oldFileName: 'debug-old.log',
    maxSize: 5 * 1024 * 1024
});

var webFileFormatter = lggr.combineFormatters([
    lggr.createPlaceholdersFormatter(),
    lggr.createPrefixFormatter(prefix => `-[${prefix}]-`),
    lggr.createMethodFormatter(method => method.toUpperCase()),
    lggr.createDateFormatter(),
    lggr.createJoinFormatter(' # ')
]);

var consoleFormatter = lggr.combineFormatters([
    lggr.createNormalFormatter({j: 'o', l: 's'}),
    lggr.createPrefixFormatter(),
    lggr.createJoinFirstFormatter(2, '|')
]);

var options = {
    methods: ['log', 'info', 'warn', 'error'],
    writers: {
        console: lggr.createConsoleWriter(),
        file: lggr.createWebFileWriter(webFile)
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
logger.addFormatter('file', lggr.createDateFormatter())

// this methods are applied only to otherLogger
otherLogger.setLevels('console', ['error', 'warn'])
otherLogger.addFormatter('file', someOtherFormatterMethod)

var forkedLogger = logger.fork('forked-prefix');

// you can change forkedLogger options only by calling methods of forkedLogger itself
forkedLogger.setLevels('console', ['warn'])

```
