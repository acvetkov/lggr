
import createJoinFormatter from '../../src/formatters/join';

describe('join formatter', function () {
    it('should join log arguments', function () {
        var format = createJoinFormatter();
        var result = format('m', 'p', ['str', undefined, 123, [1, 2], {a: 1}]);
        assert.deepEqual(result, ['str undefined 123 [1,2] {"a":1}']);
    });

    it('should use custom delimiter', function () {
        var format = createJoinFormatter('#');
        var result = format('m', 'p', ['str', undefined, 123, [1, 2], {a: 1}]);
        assert.deepEqual(result, ['str#undefined#123#[1,2]#{"a":1}']);
    });
});
