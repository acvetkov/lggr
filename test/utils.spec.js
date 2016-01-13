
import * as utils from '../src/utils';
import Replacer from '../src/replacer';

describe('utils', function () {
    describe('appendPrefix', function () {
        var tests = [{
            prefix: 'prefix',
            args: [123, '123'],
            result: ['prefix', 123, '123']
        }, {
            prefix: 'test',
            args: [{a: 123}, '123'],
            result: ['test', {a: 123}, '123']
        }, {
            prefix: null,
            args: [123, '123'],
            result: [123, '123']
        }, {
            prefix: 'hello',
            args: ['world', 123],
            result: ['hello: world', 123]
        }];

        it('should append prefix to args', function () {
            tests.forEach(data => {
                var actual = utils.appendPrefix(data.prefix, data.args);
                assert.deepEqual(actual, data.result);
            });
        });
    });

    describe('replacePlaceholders', function () {
        var replacer = new Replacer();

        it('should replace placeholders if first args item is string', function () {
            var args = ['hello, %s! %i and %o', 'world', 1, {a: {b: 123}}];
            var actual = utils.replacePlaceholders(replacer, args);
            assert.deepEqual(actual, ['hello, world! 1 and {\n \"a\": {\n  \"b\": 123\n }\n}']);
        });

        it('should not replace placeholders it first args item is not string', function () {
            var args = [123, 'hello, %! %i and %o', 'world', 1, {a: {b: 123}}];
            var actual = utils.replacePlaceholders(replacer, args);
            assert.deepEqual(actual, [123, 'hello, %! %i and %o', 'world', 1, {a: {b: 123}}]);

            var args2 = [{a: 123}, '%! %i and %o', 'w', 1, {a: {b: 123}}];
            var actual2 = utils.replacePlaceholders(replacer, args2);
            assert.deepEqual(actual2, [{a: 123}, '%! %i and %o', 'w', 1, {a: {b: 123}}]);
        });
    });

    describe('shallowCopyObject', function () {
        var object = {
            a: {b: {c: 111}},
            d: {e: [1, 2, 3], f: 'fff'},
            g: ['str', 111],
            w: 321,
            z: '123'
        };

        var copy = utils.shallowCopyObject(object);

        assert.notStrictEqual(copy, object);
        Object.keys(copy).forEach(key => {
            var copySub = copy[key];
            var parentSub = object[key];
            if (typeof parentSub === 'object') {
                assert.notStrictEqual(copySub, parentSub, `check object key: "${key}"`);
            } else {
                assert.strictEqual(copySub, parentSub, `check primitive key: "${key}"`);
            }
        });
    });

    describe('toString', function () {
        it('should stringify arguments', function () {
            var args = [123, ['12', {a: 44}], {c: 'd'}];
            var result = utils.toString(args);
            assert.strictEqual(result, '123 ["12",{"a":44}] {"c":"d"}');
        });

        it('should write undefined for empty list', function () {
            var args = [];
            var result = utils.toString(args);
            assert.strictEqual(result, 'undefined');
        });

        it('should write undefined for undefined elements', function () {
            var args = [{a: 1}, undefined, 123, null];
            var result = utils.toString(args);
            assert.strictEqual(result, '{"a":1} undefined 123 null');
        });
    });

    describe('combineFormatters', function () {
        it('should combine formatters', function () {
            var formatter1 = {
                format: function (method, prefix, args) {
                    return args.join(' ');
                }
            };
            var formatter2 = {
                format: function (method, prefix, args) {
                    return [method, prefix].concat(args);
                }
            };
            var formatter3 = {
                format: function (method, prefix, args) {
                    return args.join('|');
                }
            };
            var combinedFormatter = utils.combineFormatters(
                [formatter1, formatter2, formatter3]
            );
            var args = [123, '123'];
            var result = combinedFormatter.format('method', 'prefix', args);
            assert.strictEqual(result, 'method|prefix|123 123');
        });
    });

});
