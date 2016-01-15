
import createConsoleWriter from '../../src/writers/console';

var sandbox = sinon.sandbox.create();

describe('console writer', function () {
    afterEach(() => {
        sandbox.restore();
    });

    it('should write to global console', function () {
        var write = createConsoleWriter();
        var args = ['test', 1, 2, {a: 'b'}];

        var logStub = sandbox.stub(console, 'log');
        var warnStub = sandbox.stub(console, 'warn');
        var errorStub = sandbox.stub(console, 'error');

        write('log', 'prefix', args);
        write('warn', 'prefix', args);
        write('error', 'prefix', args);

        assert.calledOnce(logStub);
        assert.calledOnce(warnStub);
        assert.calledOnce(errorStub);

        assert.calledWith(logStub, ...args);
        assert.calledWith(warnStub, ...args);
        assert.calledWith(errorStub, ...args);
    });
});
