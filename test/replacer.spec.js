
import Replacer from '../src/utils/replacer';

describe('replacer', function () {
    describe('replace', function () {
        it('should replace without arguments', function () {
            var replacer = new Replacer();
            var str = replacer.replace('Hello, %s! It is %s', []);
            assert.strictEqual(str, 'Hello, undefined! It is undefined');
        });

        it('should replace strings', function () {
            var replacer = new Replacer();
            var str = replacer.replace('Hello, %s! It is %s', ['world', 'Stepan']);
            assert.strictEqual(str, 'Hello, world! It is Stepan');
        });

        it('should replace limited strings', function () {
            var replacer = new Replacer();
            var longString = new Array(350).join('a');
            var limitedString = new Array(301).join('a');
            var str = replacer.replace('Long: %l!', [longString]);
            assert.strictEqual(str, `Long: ${limitedString}!`);
        });

        it('should replace limited strings with specified length', function () {
            var replacer = new Replacer({limitStringLength: 15});
            var longString = new Array(350).join('a');
            var limitedString = new Array(16).join('a');
            var str = replacer.replace('Long: %l!', [longString]);
            assert.strictEqual(str, `Long: ${limitedString}!`);
        });

        it('should replace numbers', function () {
            var replacer = new Replacer();
            var str = replacer.replace('int:%i|int:%d|float:%f', [1.11, 1.99, 3.33]);
            assert.strictEqual(str, 'int:1|int:1|float:3.33');
        });

        it('should write NaN in case of bad numbers', function () {
            var replacer = new Replacer();
            var str = replacer.replace('int:%i|int:%d|float:%f', ['h', 1.99, /rrr/g]);
            assert.strictEqual(str, 'int:NaN|int:1|float:NaN');
        });

        it('should write custom NaN strings in case of bad numbers', function () {
            var replacer = new Replacer({nanString: 'NOOO'});
            var str = replacer.replace('int:%i|int:%d|float:%f', ['h', 1.99, /rrr/g]);
            assert.strictEqual(str, 'int:NOOO|int:1|float:NOOO');
        });

        it('should replace objects', function () {
            var replacer = new Replacer();
            var object1 = {a: 'b'};
            var object2 = {a: {b: 'c'}, d: [1, '2']};
            var str = replacer.replace('Object: %j; again: %o', [object1, object2]);
            var expected = 'Object: {\n "a": "b"\n}; again: {\n "a": {\n  "b": "c"\n },\n "d": [\n  1,\n  "2"\n ]\n}';
            assert.strictEqual(str, expected);
        });

        it('should write json parse errors', function () {
            var replacer = new Replacer();
            var object = {a: 'b'};
            object.c = object;
            var str = replacer.replace('Bad Object: %o', [object]);
            var expected = 'Bad Object: TypeError: Converting circular structure to JSON';
            assert.strictEqual(str, expected);
        });

        it('should not replace unknown placeholders', function () {
            var replacer = new Replacer();
            var str = replacer.replace('1 %u, 2 %k', ['h', 1.99]);
            assert.strictEqual(str, '1 %u, 2 %k');
        });

        it('should replace %% with %', function () {
            var replacer = new Replacer();
            var str1 = replacer.replace('Hello, %%', []);
            var str2 = replacer.replace('Hello, %%%', []);
            var str3 = replacer.replace('Hello, %%%%', []);
            assert.strictEqual(str1, 'Hello, %');
            assert.strictEqual(str2, 'Hello, %%');
            assert.strictEqual(str3, 'Hello, %%');
        });
    });

    describe('addPlaceholder', function () {
        it('should add placeholder and replace it', function () {
            var replacer = new Replacer();
            var no = replacer.replace('test %u%u%u', ['A', 'B', 'C']);
            assert.strictEqual(no, 'test %u%u%u');
            replacer.addPlaceholder('u', data => data);
            var yes = replacer.replace('test %u%u%u', ['A', 'B', 'C']);
            assert.strictEqual(yes, 'test ABC');
        });
    });

    describe('removePlaceholder', function () {
        it('should remove placeholder and does not replace it anymore', function () {
            var replacer = new Replacer();
            var yes = replacer.replace('test %s%s%s', ['A', 'B', 'C']);
            assert.strictEqual(yes, 'test ABC');
            replacer.removePlaceholder('s');
            var no = replacer.replace('test %s%s%s', ['A', 'B', 'C']);
            assert.strictEqual(no, 'test %s%s%s');
        });
    });
});
