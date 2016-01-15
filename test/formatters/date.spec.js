
import createDateFormatter from '../../src/formatters/date';

describe('date formatter', function () {
    beforeEach(function () {
        this.time = sinon.useFakeTimers();
    });

    afterEach(function () {
        this.time.reset();
    });

    it('should append date to args', function () {
        var format = createDateFormatter();

        var result = format('m', 'p', ['test %s', 'str']);
        assert.deepEqual(result, ['1970-01-01T00:00:00.000Z', 'test %s', 'str']);

        this.time.tick(1000000);

        result = format('m', 'p', ['test %s', 'str']);
        assert.deepEqual(result, ['1970-01-01T00:16:40.000Z', 'test %s', 'str']);
    });

    it('should use custom createDate method', function () {
        var format = createDateFormatter(() => '1984');
        var result = format('m', 'p', ['test %s', 'str']);
        assert.deepEqual(result, ['1984', 'test %s', 'str']);

        this.time.tick(1000000);

        result = format('m', 'p', ['test %s', 'str']);
        assert.deepEqual(result, ['1984', 'test %s', 'str']);
    });
});
