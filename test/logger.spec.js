
import logger from '../src/index';
import ConsoleTransport from '../src/console';
// import WebFileTransport from '../src/web-file';

var sandbox = sinon.sandbox.create();

describe('Logger', function () {
    afterEach(function () {
        sandbox.restore();
    });

    it('should write to default transport', function () {
        var defaultLogger = logger();
        var spy = sandbox.spy(logger.defaultOptions.transports[0], 'write');
        defaultLogger.log('Hello, %s!', 'world');
        assert.calledOnce(spy);
        assert.calledWith(spy, 'log', ['Hello, %s!', 'world']);
    });

    it('should write to default transport with prefix', function () {
        var defaultLogger = logger('test-prefix');
        var spy = sandbox.spy(logger.defaultOptions.transports[0], 'write');
        defaultLogger.log('Hello, %s!', 'world');
        assert.calledOnce(spy);
        assert.calledWith(spy, 'log', ['test-prefix: Hello, %s!', 'world']);
    });

    it('should write to specified transport and format placeholders', function () {
        var transport = new ConsoleTransport();
        transport.replacePlaceholders = true;
        var spy = sandbox.spy(transport, 'write');
        var consoleLogger = logger(null, {transports: [transport]});

        consoleLogger.log('Hello, %s!', 'world');
        assert.calledOnce(spy);
        assert.calledWith(spy, 'log', 'Hello, world!');

        consoleLogger.error('Hello, %s! I am %i ye%srs old', 'world', 45.1, 'a');
        assert.calledTwice(spy);
        assert.calledWith(spy, 'error', 'Hello, world! I am 45 years old');
    });

    it('should write to multiple transports', function () {
        var transport1 = new ConsoleTransport();
        var transport2 = new ConsoleTransport();
        transport2.replacePlaceholders = true;
        sandbox.spy(transport1, 'write');
        sandbox.spy(transport2, 'write');

        var consoleLogger = logger(null, {transports: [transport1, transport2]});

        consoleLogger.log('Hello, %s!', 'world');
        assert.calledOnce(transport1.write);
        assert.calledOnce(transport2.write);
        assert.calledWith(transport1.write, 'log', ['Hello, %s!', 'world']);
        assert.calledWith(transport2.write, 'log', 'Hello, world!');
    });
});
