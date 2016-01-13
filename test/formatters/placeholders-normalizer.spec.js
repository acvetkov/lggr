
import createPlaceholdersNormalizer from '../../src/formatters/placeholders-normalizer';

describe('console normalizer', function () {
    it('should normalize placeholders and append prefix', function () {
        var format = createPlaceholdersNormalizer({
            l: 's',
            j: 'o'
        });
        var result = format(
            'log', 'prefix',
            ['hello %j, %l: %s', {a: 1}, 't1', 't2']
        );
        assert.deepEqual(
            result,
            ['hello %o, %s: %s', {a: 1}, 't1', 't2']
        );
    });
});
