
import Logger from '../src/logger';
import {combineFormatters} from '../src/utils';
import createPlaceholdersFormatter from '../src/formatters/placeholders';
import createPrefixFormatter from '../src/formatters/prefix';
import createMethodFormatter from '../src/formatters/method';
import createJoinFormatter from '../src/formatters/join';

var sandbox = sinon.sandbox.create();

describe('Logger', function () {
    beforeEach(function () {
        this.format1 = combineFormatters([
            createPlaceholdersFormatter(),
            createPrefixFormatter(prefix => prefix ? `${prefix}:` : ''),
            createMethodFormatter(method => method.toUpperCase()),
            createJoinFormatter()
        ]);
        this.format2 = combineFormatters([
            createJoinFormatter(' - ')
        ]);

        this.write1 = sandbox.spy();
        this.write2 = sandbox.spy();
    });

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
            var logger = new Logger('prefix', {
                methods: ['log'],
                writers: {console: this.write1},
                formatters: {console: this.format1},
                levels: {console: ['log']}
            });
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
        });

        it('should write to passed writer without prefix', function () {
            var logger = new Logger(null, {
                methods: ['log'],
                writers: {console: this.write1},
                formatters: {console: this.format1},
                levels: {console: ['log']}
            });
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledWith(this.write1, 'log', null, ['LOG  Hello, world!']);
        });

        it('should write to passed writer without formatter', function () {
            var logger = new Logger(null, {
                methods: ['log'],
                writers: {console: this.write1},
                formatters: {},
                levels: {console: ['log']}
            });
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledWith(this.write1, 'log', null, ['Hello, %s!', 'world']);
        });

        it('should write to passed writer without levels', function () {
            var logger = new Logger('prefix', {
                methods: ['log'],
                writers: {console: this.write1},
                formatters: {console: this.format1},
                levels: {}
            });
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
        });

        it('should write to several passed writers with appropriate levels', function () {
            var logger = new Logger('prefix', {
                methods: ['log', 'error'],
                writers: {console: this.write1, file: this.write2},
                formatters: {console: this.format1, file: this.format2},
                levels: {console: ['error'], file: ['log', 'error']}
            });

            logger.error('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(this.write1, 'error', 'prefix', ['ERROR prefix: Hello, world!']);
            assert.calledWith(this.write2, 'error', 'prefix', ['Hello, %s! - world']);
            sandbox.reset();

            logger.log('Hello', 'again', 'world', 111);
            assert.notCalled(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(
                this.write2, 'log', 'prefix',
                ['Hello - again - world - 111']
            );
        });

    });

    describe('setLevels', function () {
        it('should set levels to writer', function () {
            var logger = new Logger('prefix', {
                methods: ['log', 'info', 'error'],
                writers: {console: this.write1},
                formatters: {console: this.format1},
                levels: {console: ['error']}
            });

            logger.log('Hello, %s!', 'world');
            logger.info('Hello, %s!', 'world');
            assert.notCalled(this.write1);

            logger.setLevels('console', ['log', 'info']);
            logger.log('Hello, %s!', 'world');
            logger.info('Hello, %s!', 'world');
            logger.error('Hello, %s!', 'world');
            assert.calledTwice(this.write1);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
            assert.calledWith(this.write1, 'info', 'prefix', ['INFO prefix: Hello, world!']);
        });
    });

    describe('add/remove Writer/Formatter', function () {
        it('should add writer and formatter to logger', function () {
            var logger = new Logger('prefix', {
                methods: ['log', 'info'],
                writers: {console: this.write1},
                formatters: {console: this.format1},
                levels: {console: ['log']}
            });

            logger.addWriter('file', this.write2);
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
            assert.calledWith(this.write2, 'log', 'prefix', ['Hello, %s!', 'world']);
            sandbox.reset();

            logger.addFormatter('file', this.format2);
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
            assert.calledWith(this.write2, 'log', 'prefix', ['Hello, %s! - world']);
        });

        it('should remove writer and formatter from logger', function () {
            var logger = new Logger('prefix', {
                methods: ['log', 'info'],
                writers: {console: this.write1, file: this.write2},
                formatters: {console: this.format1, file: this.format2},
                levels: {console: ['log']}
            });

            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
            assert.calledWith(this.write2, 'log', 'prefix', ['Hello, %s! - world']);
            sandbox.reset();

            logger.removeFormatter('file');
            logger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(this.write1, 'log', 'prefix', ['LOG prefix: Hello, world!']);
            assert.calledWith(this.write2, 'log', 'prefix', ['Hello, %s!', 'world']);
            sandbox.reset();

            logger.removeWriter('console');
            logger.log('Hello, %s!', 'world');
            assert.notCalled(this.write1);
            assert.calledOnce(this.write2);
            assert.calledWith(this.write2, 'log', 'prefix', ['Hello, %s!', 'world']);
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
            var logger = new Logger('prefix', {
                methods: ['log'],
                writers: {console: this.write1},
                formatters: {},
                levels: {}
            });

            var clonedLogger = logger.clone('p');
            logger.setLevels('console', ['log']);
            logger.addFormatter('console', this.format1);
            clonedLogger.log('Hello, %s!', 'world');
            assert.calledOnce(this.write1);
            assert.calledWith(this.write1, 'log', 'p', ['LOG p: Hello, world!']);
        });

        it('should not sync options in direction clone->parent', function () {
            var logger = new Logger('parent-prefix', {
                methods: ['log', 'error'],
                writers: {console: this.write1},
                formatters: {},
                levels: {console: ['error']}
            });

            var clonedLogger = logger.clone('clone-prefix');
            clonedLogger.setLevels('console', ['log', 'error']);
            clonedLogger.addFormatter('console', this.format1);
            clonedLogger.addWriter('file', this.write2);

            logger.log('Hello, %s!', 'world');
            assert.notCalled(this.write1);
            assert.notCalled(this.write2);

            logger.setLevels('console', ['log']);
            logger.log('Hello, %s!', 'world');
            assert.notCalled(this.write2);
            assert.calledOnce(this.write1);
            assert.calledWith(
                this.write1, 'log', 'parent-prefix',
                ['Hello, %s!', 'world']
            );
        });

        it('should call custom constructor', function () {
            var spy = sandbox.spy();
            class NewLogger extends Logger {
                constructor (prefix, options) {
                    super(prefix, options);
                    spy();
                }
            }
            var newLogger = new NewLogger('prefix', {
                methods: [], writers: {}, formatters: {}, levels: {}
            });
            assert.calledOnce(spy);

            newLogger.clone('new prefix');
            assert.calledTwice(spy);
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
            var logger = new Logger('parent-prefix', {
                methods: ['log'],
                writers: {console: this.write1},
                formatters: {},
                levels: {console: ['error']}
            });

            var forkedLogger = logger.fork('fork-prefix');
            forkedLogger.setLevels('console', ['error', 'warn']);
            forkedLogger.setLevels('file', ['error', 'warn']);
            forkedLogger.addFormatter('console', this.format1);
            forkedLogger.addWriter('file', this.write2);

            logger.log('Hello, %s!', 'world');
            assert.notCalled(this.write1);

            logger.setLevels('console', ['log']);

            forkedLogger.log('Hello, %s!', 'world');
            assert.notCalled(this.write1);
            assert.notCalled(this.write1);
        });

        it('should call custom constructor', function () {
            var spy = sandbox.spy();
            class NewLogger extends Logger {
                constructor (prefix, options) {
                    super(prefix, options);
                    spy();
                }
            }
            var newLogger = new NewLogger('prefix', {
                methods: [], writers: {}, formatters: {}, levels: {}
            });
            assert.calledOnce(spy);

            newLogger.fork('new prefix');
            assert.calledTwice(spy);
        });

        it('should fall back to Logger in case of absence of custom constructor', function () {
            var spy = sandbox.spy();
            var NewLogger = function (prefix, options) {
                Logger.call(this, prefix, options);
                spy();
            };
            badExtend(Logger, NewLogger);
            var newLogger = new NewLogger('prefix', {
                methods: [], writers: {}, formatters: {}, levels: {}
            });
            assert.calledOnce(spy);
            assert.strictEqual(newLogger.constructor, Logger);

            var forkedLogger = newLogger.fork('new prefix');
            assert.calledOnce(spy);
            assert.notInstanceOf(forkedLogger, NewLogger);
            assert.instanceOf(forkedLogger, Logger);
        });
    });
});

/**
 * Add parent prototype to child
 * without setting appropriate constructor to child prototype
 * @param {Object} Parent
 * @param {Object} Child
 */
function badExtend(Parent, Child) {
    var Foo = function () {};
    Foo.prototype = Parent.prototype;
    Child.prototype = new Foo();
}
