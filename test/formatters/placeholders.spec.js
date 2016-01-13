
import createPlaceholdersFromatter from '../../src/formatters/placeholders';
import Replacer from '../../src/replacer';

describe('placeholders formatter', function () {
    it('should replace placeholders', function () {
        var format = createPlaceholdersFromatter();
        var result = format(
            'm', 'p',
            ['a %s, %i, %f, %o', 'str', 1.2, 2.34, {a: [1, 's']}]
        );
        assert.deepEqual(result, ['a str, 1, 2.34, {\n "a": [\n  1,\n  "s"\n ]\n}']);
    });

    it('should use custom replacer', function () {
        var replacer = new Replacer({
            formats: {
                a: data => `A-${data}-A`,
                b: data => `b(${data})`
            }
        });
        var format = createPlaceholdersFromatter(replacer);
        var result = format(
            'm', 'p',
            ['test %a, %b', 'op', 'arg']
        );
        assert.deepEqual(result, ['test A-op-A, b(arg)']);
    });

});
