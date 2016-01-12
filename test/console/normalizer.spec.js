
import ConsoleNormalizer from '../../src/console/normalizer';

describe('console normalizer', function () {
    it('should create instance with format method', function () {
        var normalizer = new ConsoleNormalizer();
        assert.isFunction(normalizer.format);
    });

    it('should normalize placeholders and append prefix', function () {
        var normalizer = new ConsoleNormalizer({
            l: 's',
            j: 'o'
        });
        var result = normalizer.format(
            'log', 'prefix',
            ['hello %j, %l: %s', {a: 1}, 't1', 't2']
        );
        assert.deepEqual(
            result,
            ['prefix: hello %o, %s: %s', {a: 1}, 't1', 't2']
        );
    });
});
