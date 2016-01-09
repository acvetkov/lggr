
import ConsoleWriter from '../../src/console/writer';

var sandbox = sinon.sandbox.create();

describe('console writer', function () {
    it('should create instance with write method', function () {
        var writer = new ConsoleWriter();
        assert.isFunction(writer.write);
    });

    it('should write to global console', function () {
        var writer = new ConsoleWriter();
        var args = ['test', 1, 2, {a: 'b'}];

        var logStub = sandbox.stub(console, 'log');
        var warnStub = sandbox.stub(console, 'warn');
        var errorStub = sandbox.stub(console, 'error');

        writer.write('log', 'prefix', args);
        writer.write('warn', 'prefix', args);
        writer.write('error', 'prefix', args);

        assert.calledOnce(logStub);
        assert.calledOnce(warnStub);
        assert.calledOnce(errorStub);

        assert.calledWith(logStub, ...args);
        assert.calledWith(warnStub, ...args);
        assert.calledWith(errorStub, ...args);
    });
});
