
import createJoinFirstFormatter from '../../src/formatters/join-first';

describe('join-first formatter', function () {
    it('should join specified amount of log arguments', function () {
        var format = createJoinFirstFormatter(2);
        var result = format('m', 'p', ['str', undefined, 123, [1, 2], {a: 1}]);
        assert.deepEqual(result, ['str undefined', 123, [1, 2], {a: 1}]);

        format = createJoinFirstFormatter(3);
        result = format('m', 'p', ['str', {a: 1}, '%o, %o', [1, 2], {a: 1}]);
        assert.deepEqual(result, ['str {"a":1} %o, %o', [1, 2], {a: 1}]);
    });

    it('should use custom delimiter', function () {
        var format = createJoinFirstFormatter(3, '#');
        var result = format('m', 'p', ['str', undefined, 123, [1, 2], {a: 1}]);
        assert.deepEqual(result, ['str#undefined#123', [1, 2], {a: 1}]);
    });
});
