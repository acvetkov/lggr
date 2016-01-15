
import createPrefixFormatter from '../../src/formatters/prefix';
import createPlaceholdersFormatter from '../../src/formatters/placeholders';
import createMethodFormatter from '../../src/formatters/method';
import createJoinFormatter from '../../src/formatters/join';

import {combineFormatters} from '../../src/utils';

describe('combined formatter', function () {
    it('should format arguments', function () {
        var format = combineFormatters([
            createPlaceholdersFormatter(),
            createPrefixFormatter(prefix => `${prefix}:`),
            createMethodFormatter(method => method.toUpperCase()),
            createJoinFormatter()
        ]);
        var result;

        result = format('log', 'p', ['a %s %i', 'b', 1.2]);
        assert.deepEqual(result, ['LOG p: a b 1']);

        result = format('log', 'p', ['obj: %o', {a: 123}]);
        assert.deepEqual(result, ['LOG p: obj: {\n "a": 123\n}']);

        result = format('log', 'p', [1, 'a %s %i', 'b', 1.2]);
        assert.deepEqual(result, ['LOG p: 1 a %s %i b 1.2']);

        result = format('log', 'p', [{a: [1, 2]}, undefined, null]);
        assert.deepEqual(result, ['LOG p: {"a":[1,2]} undefined null']);
    });
});
