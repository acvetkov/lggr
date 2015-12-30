
import Logger from '../src/logger';
import ConsoleWriter from '../src/console/writer';
import ConsoleFormatter from '../src/console/formatter';

var sandbox = sinon.sandbox.create();

describe('Logger', function () {
    afterEach(function () {
        sandbox.restore();
    });

    describe('constructor logic', function () {
        it('should trow error when required options are missing', function () {
            assert.throws(() => new Logger());
            assert.throws(() => new Logger(null, {}));
            assert.throws(() => new Logger(null, {methods: [], writers: {}}));
            assert.throws(() => new Logger(null, {writers: {}, formatters: {}, levels: {}}));
        });

        it('should create functions for passed methods', function () {
            var logger = new Logger('prefix', {
                methods: ['log', 'error', 'foo', 'bar'],
                writers: {},
                formatters: {},
                levels: {}
            });
            assert.isFunction(logger.log);
            assert.isFunction(logger.error);
            assert.isFunction(logger.foo);
            assert.isFunction(logger.bar);
        });
    });

    describe('logging logic', function () {
        it('should write to passed writer', function () {
            var writer = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('prefix', {
                methods: ['log'],
                writers: {console: writer},
                formatters: {console: formatter},
                levels: {console: ['log']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(formatSpy);
            assert.calledOnce(writeSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
        });

        it('should write to passed writer without formatter', function () {
            var writer = new ConsoleWriter();
            var logger = new Logger(null, {
                methods: ['log'],
                writers: {console: writer},
                formatters: {},
                levels: {console: ['log']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(writeSpy);
            assert.calledWith(writeSpy, 'log', null, ['Hello, %s!', 'world']);
        });

        it('should write to passed writer without levels', function () {
            var writer = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('prefix', {
                methods: ['log'],
                writers: {console: writer},
                formatters: {console: formatter},
                levels: {}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(formatSpy);
            assert.calledOnce(writeSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
        });

        it('should write to several passed writers with appropriate levels', function () {
            var writer = new ConsoleWriter();
            var writer2 = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('prefix', {
                methods: ['log', 'error'],
                writers: {console: writer, file: writer2},
                formatters: {console: formatter, file: formatter},
                levels: {console: ['error'], file: ['log', 'error']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var writeSpy2 = sandbox.spy(writer2, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');

            logger.error('Hello, %s!', 'world');
            assert.calledOnce(writeSpy);
            assert.calledOnce(writeSpy2);
            assert.calledTwice(formatSpy);
            assert.calledWith(formatSpy, 'error', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'error', 'prefix', ['prefix: Hello, world!']);
            assert.calledWith(writeSpy2, 'error', 'prefix', ['prefix: Hello, world!']);
            sandbox.reset();

            logger.log('Hello %s, %s%i!', 'again', 'world', 111);
            assert.notCalled(writeSpy);
            assert.calledOnce(writeSpy2);
            assert.calledOnce(formatSpy);
            assert.calledWith(formatSpy, 'log', 'prefix',
                              ['Hello %s, %s%i!', 'again', 'world', 111]);
            assert.calledWith(writeSpy2, 'log', 'prefix', ['prefix: Hello again, world111!']);
        });

    });

    describe('setLevels', function () {
        it('should set levels to writer', function () {
            var writer = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('prefix', {
                methods: ['log', 'info'],
                writers: {console: writer},
                formatters: {console: formatter},
                levels: {console: ['error']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');
            logger.log('Hello, %s!', 'world');
            assert.notCalled(formatSpy);
            assert.notCalled(writeSpy);

            logger.setLevels('console', ['log']);
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(formatSpy);
            assert.calledOnce(writeSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
        });
    });

    describe('add/remove Writer/Formatter', function () {
        it('should add writer and formatter to logger', function () {
            var writer = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var writer2 = new ConsoleWriter();
            var logger = new Logger('prefix', {
                methods: ['log', 'info'],
                writers: {console: writer},
                formatters: {console: formatter},
                levels: {console: ['log']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var writeSpy2 = sandbox.spy(writer2, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');

            logger.addWriter('file', writer2);
            logger.log('Hello, %s!', 'world');

            assert.calledOnce(writeSpy);
            assert.calledOnce(writeSpy2);
            assert.calledOnce(formatSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
            assert.calledWith(writeSpy2, 'log', 'prefix', ['Hello, %s!', 'world']);
            sandbox.reset();

            logger.addFormatter('file', formatter);
            logger.log('Hello, %s!', 'world');

            assert.calledOnce(writeSpy);
            assert.calledOnce(writeSpy2);
            assert.calledTwice(formatSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
            assert.calledWith(writeSpy2, 'log', 'prefix', ['prefix: Hello, world!']);
        });

        it('should remove writer and formatter from logger', function () {
            var writer = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var writer2 = new ConsoleWriter();
            var logger = new Logger('prefix', {
                methods: ['log', 'info'],
                writers: {console: writer, file: writer2},
                formatters: {console: formatter, file: formatter},
                levels: {console: ['log']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var writeSpy2 = sandbox.spy(writer2, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');

            logger.log('Hello, %s!', 'world');
            assert.calledOnce(writeSpy);
            assert.calledOnce(writeSpy2);
            assert.calledTwice(formatSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
            assert.calledWith(writeSpy2, 'log', 'prefix', ['prefix: Hello, world!']);
            sandbox.reset();

            logger.removeFormatter('file');
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(writeSpy);
            assert.calledOnce(writeSpy2);
            assert.calledOnce(formatSpy);
            assert.calledWith(formatSpy, 'log', 'prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'prefix', ['prefix: Hello, world!']);
            assert.calledWith(writeSpy2, 'log', 'prefix', ['Hello, %s!', 'world']);
            sandbox.reset();

            logger.removeWriter('console');
            logger.log('Hello, %s!', 'world');
            assert.notCalled(writeSpy);
            assert.notCalled(formatSpy);
            assert.calledOnce(writeSpy2);
            assert.calledWith(writeSpy2, 'log', 'prefix', ['Hello, %s!', 'world']);
        });
    });

    describe('clone', function () {
        it('should return new Logger instance', function () {
            var logger = new Logger('prefix', {
                methods: ['log'], writers: {}, formatters: {}, levels: {}
            });
            var otherLogger = logger.clone();
            assert.instanceOf(otherLogger, Logger);
        });

        it('should sync options in direction parent->clone', function () {
            var writer = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('prefix', {
                methods: ['log'],
                writers: {console: writer},
                formatters: {},
                levels: {}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');

            var clonedLogger = logger.clone('new-prefix');
            logger.setLevels('console', ['log']);
            logger.addFormatter('console', formatter);

            clonedLogger.log('Hello, %s!', 'world');
            assert.calledOnce(formatSpy);
            assert.calledOnce(writeSpy);
            assert.calledWith(formatSpy, 'log', 'new-prefix', ['Hello, %s!', 'world']);
            assert.calledWith(writeSpy, 'log', 'new-prefix', ['new-prefix: Hello, world!']);
        });

        it('should not sync options in direction clone->parent', function () {
            var writer = new ConsoleWriter();
            var writer2 = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('parent-prefix', {
                methods: ['log'],
                writers: {console: writer},
                formatters: {},
                levels: {console: ['error']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var writeSpy2 = sandbox.spy(writer2, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');

            var clonedLogger = logger.clone('clone-prefix');
            clonedLogger.setLevels('console', ['log', 'error']);
            clonedLogger.addFormatter('console', formatter);
            clonedLogger.addWriter('file', writer2);

            logger.log('Hello, %s!', 'world');
            assert.notCalled(writeSpy);
            assert.notCalled(formatSpy);
            logger.setLevels('console', ['log']);
            logger.log('Hello, %s!', 'world');
            assert.notCalled(formatSpy);
            assert.notCalled(writeSpy2);
            assert.calledOnce(writeSpy);
            assert.calledWith(writeSpy, 'log', 'parent-prefix', ['Hello, %s!', 'world']);
        });
    });

    describe('fork', function () {
        it('should return new Logger instance', function () {
            var logger = new Logger('prefix', {
                methods: ['log'], writers: {}, formatters: {}, levels: {}
            });
            var otherLogger = logger.fork();
            assert.instanceOf(otherLogger, Logger);
        });

        it('should not sync options', function () {
            var writer = new ConsoleWriter();
            var writer2 = new ConsoleWriter();
            var formatter = new ConsoleFormatter();
            var logger = new Logger('parent-prefix', {
                methods: ['log'],
                writers: {console: writer},
                formatters: {},
                levels: {console: ['error']}
            });
            var writeSpy = sandbox.spy(writer, 'write');
            var writeSpy2 = sandbox.spy(writer2, 'write');
            var formatSpy = sandbox.spy(formatter, 'format');

            var forkedLogger = logger.fork('fork-prefix');
            forkedLogger.setLevels('console', ['error', 'warn']);
            forkedLogger.setLevels('file', ['error', 'warn']);
            forkedLogger.addFormatter('console', formatter);
            forkedLogger.addWriter('file', writer2);

            logger.log('Hello, %s!', 'world');
            assert.notCalled(writeSpy);
            assert.notCalled(formatSpy);

            logger.setLevels('console', ['log']);
            logger.addWriter('console', ['log']);

            forkedLogger.log('Hello, %s!', 'world');
            assert.notCalled(formatSpy);
            assert.notCalled(writeSpy);
            assert.notCalled(writeSpy2);
        });
    });

});
