# How It Works

```javascript
import {Logger, ConsoleWriter, ConsoleFormatter, FileFriter, FileFormatter} from 'logger';

var options = {
    methods: ['log', 'info', 'warn', 'error'],
    writers: {
        console: new ConsoleWriter(),
        file: new FileFriter()
    },
    formatters: {
        console: new ConsoleFormatter(),
        file: new FileFormatter()
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
```
