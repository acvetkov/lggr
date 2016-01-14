
import createPrefixFormatter from '../../src/formatters/prefix';

describe('prefix formatter', function () {
    it('should append prefix to args', function () {
        var format = createPrefixFormatter();
        var result = format('m', 'p', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['p', '%i, %o', 1, {a: 1}]);

        format = createPrefixFormatter();
        result = format('m', null, ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, [null, '%i, %o', 1, {a: 1}]);

        result = format('m', undefined, ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, [undefined, '%i, %o', 1, {a: 1}]);

        result = format('m', '', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['', '%i, %o', 1, {a: 1}]);
    });

    it('should use custom mutator', function () {
        var format = createPrefixFormatter(prefix => prefix.toUpperCase());
        var result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['PR', '%i, %o', 1, {a: 1}]);

        format = createPrefixFormatter(() => '');
        result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, ['', '%i, %o', 1, {a: 1}]);

        format = createPrefixFormatter(() => null);
        result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, [null, '%i, %o', 1, {a: 1}]);

        format = createPrefixFormatter(() => undefined);
        result = format('m', 'pr', ['%i, %o', 1, {a: 1}]);
        assert.deepEqual(result, [undefined, '%i, %o', 1, {a: 1}]);
    });
});
