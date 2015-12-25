# How It Works

```javascript
var logger = require('logger');

// simple usage
var moduleNameLogger = logger('moudle-name');
moduleNameLogger.log('Hello, %s! I am %i years old!', 'world', 142);
moduleNameLogger.error('Hello, %s! I am %i years old!', 'world', 142);
moduleNameLogger.warn('Hello, %s! I am %i years old!', 'world', 142);
moduleNameLogger.info('Hello, %s! I am %i years old!', 'world', 142);

var otherLogger = logger('some-prefix');
otherLogger.info('Hi, %o', {world: 'Earth', age: 9999999999})

// advanced usage
var myLog = new logger('my-log', {
    methods: ['log', 'warn', 'yield']
    transports: [
        {wire: someWriteMethod, format: someFormatMethod},
        {wire: otherWriteMethod}
    ],
    defaultFormat: defaultFormatMethod
})
myLog.yield('This', 'need', [{special: true}, 'format']);
```
