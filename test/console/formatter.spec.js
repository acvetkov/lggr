
import ConsoleFormatter from '../../src/console/formatter';
import Replacer from '../../src/replacer';

describe('console formatter', function () {
    it('should create instance with format method', function () {
        var formatter = new ConsoleFormatter();
        assert.isFunction(formatter.format);
    });

    it('should format arguments', function () {
        var formatter = new ConsoleFormatter();
        var result = null;

        result = formatter.format('log', 'p', ['a %s %i', 'b', 1.2]);
        assert.deepEqual(result, ['p: a b 1']);

        result = formatter.format('log', 'p', ['obj: %o', {a: 123}]);
        assert.deepEqual(result, ['p: obj: {\n "a": 123\n}']);

        result = formatter.format('log', 'p', [1, 'a %s %i', 'b', 1.2]);
        assert.deepEqual(result, ['p', 1, 'a %s %i', 'b', 1.2]);
    });

    it('should create instance with custom replacer', function () {
        var replacer = new Replacer();
        replacer.addPlaceholder('q', data => `qqq = ${data}`);
        var formatter = new ConsoleFormatter({replacer: replacer});

        var result = formatter.format('log', 'p', ['a %q', 'test']);
        assert.deepEqual(result, ['p: a qqq = test']);
    });
});
