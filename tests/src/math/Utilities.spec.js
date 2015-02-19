var test      = require('tape');
var Utilities = require('../../../src/math/Utilities');

test('Utilities', function(t) {
    t.test('clamp method', function(t) {
        t.equal(typeof Utilities.clamp, 'function', 'Utilities.clamp should be a function');

        t.equal(Utilities.clamp(1, [1, 5]), 1, 'Utilities.clamp should clamp value using [1, 5]');
        t.equal(Utilities.clamp(2, [1, 5]), 2, 'Utilities.clamp should clamp value using [1, 5]');
        t.equal(Utilities.clamp(-1, [1, 5]), 1, 'Utilities.clamp should clamp value using [1, 5]');
        t.equal(Utilities.clamp(6, [1, 5]), 5, 'Utilities.clamp should clamp value using [1, 5]');
        t.equal(Utilities.clamp(5, [1, 5]), 5, 'Utilities.clamp should clamp value using [1, 5]');
        t.equal(Utilities.clamp(4, [1, 5]), 4, 'Utilities.clamp should clamp value using [1, 5]');

        t.end();
    });
    
    t.test('length method', function(t) {
        t.equal(typeof Utilities.length, 'function', 'Utilities.length should be a function');

        t.equal(Utilities.length([0, 0, 0]), 0, 'Utilities.length should return Euclidean length of numerical array');
        t.equal(Utilities.length([1, 1, 1]), Math.sqrt(3), 'Utilities.length should return Euclidean length of numerical array');
        t.equal(Utilities.length([1, 2, 3]), Math.sqrt(1+4+9), 'Utilities.length should return Euclidean length of numerical array');
        t.equal(Utilities.length([0, 1, 2]), Math.sqrt(1+4), 'Utilities.length should return Euclidean length of numerical array');
        t.equal(Utilities.length([4, 5, 0]), Math.sqrt(16+25), 'Utilities.length should return Euclidean length of numerical array');
        t.equal(Utilities.length([4, 0, 0]), 4, 'Utilities.length should return Euclidean length of numerical array');
        
        t.end();
    });
});
