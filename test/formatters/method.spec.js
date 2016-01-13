
import createMethodFormatter from '../../src/formatters/method';

describe('method formatter', function () {
    it('should append method to args', function () {
        var format = createMethodFormatter();
        var result = format('m', 'p', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['m', '%i, %o', 1, {a: 1}]);
    });

    it('should use custom mutator', function () {
        var format = createMethodFormatter(method => `[${method}]->`);
        var result = format('m', 'p', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['[m]->', '%i, %o', 1, {a: 1}]);
    });

    it('should not append empty mutaded method', function () {
        var format = createMethodFormatter(() => '');
        var result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['%i, %o', 1, {a: 1}]);

        format = createMethodFormatter(() => null);
        result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['%i, %o', 1, {a: 1}]);

        format = createMethodFormatter(() => undefined);
        result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['%i, %o', 1, {a: 1}]);
    });
});
