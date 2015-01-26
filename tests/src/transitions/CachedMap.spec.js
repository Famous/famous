var test      = require('tape');
var CachedMap = require('../../../src/transitions/CachedMap');

test('CachedMap', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof CachedMap, 'function', 'CachedMap should be a function');

        t.doesNotThrow(function() {
            new CachedMap();
        }, void 0, 'CachedMap constructor should not throw an error when invoked without arguments')
        
        t.doesNotThrow(function() {
            var noop = function () {};
            new CachedMap(noop);
        }, void 0, 'CachedMap constructor should not throw an error when invoked with mapping function')

        t.end();
    });

    t.test('create method', function(t) {
        t.equal(typeof CachedMap.create, 'function', 'CachedMap.create should be a function');

        var createdByCreate = CachedMap.create();
        t.equal(typeof createdByCreate, 'function', 'CachedMap.create should return get function');

        t.end();
    });

    t.test('get method', function(t) {
        t.plan(5);
        var cachedMap = new CachedMap();
        t.equal(typeof cachedMap.get, 'function', 'cachedMap.get should be a function');

        var callMeTwice = function(input) {
            t.pass('CachedMap called function once for input ' + input);
        };

        var get = CachedMap.create(function(input) {
            callMeTwice(input);
            return input*2;
        });

        t.equal(get(1), 2);
        t.equal(get(2), 4);
    });
});
