# How It Works

```javascript
import {Logger, ConsoleWriter, ConsoleFormatter, WebFileWriter, WebFileFormatter} from 'logger';

var options = {
    methods: ['log', 'info', 'warn', 'error'],
    writers: {
        console: new ConsoleWriter(),
        file: new WebFileWriter()
    },
    formatters: {
        console: new ConsoleFormatter(),
        file: new WebFileFormatter()
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
logger.addFormatter('file', new ConsoleFormatter())

// this methods are applied only to otherLogger
otherLogger.setLevels('console', ['error', 'warn'])
otherLogger.addFormatter('file', new SomeOtherFormatter())

// you can change forkedLogger options only by calling methods of forkedLogger itself
var forkedLogger = logger.fork('forked-prefix');
```
