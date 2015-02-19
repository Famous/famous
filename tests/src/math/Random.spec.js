var test    = require('tape');
window.Math = require('../../helpers/MockMath');
var Random  = require('../../../src/math/Random');

test('Random', function(t) {
    t.test('integer method', function(t) {
        t.equal(typeof Random.integer, 'function', 'Random.integer should be a function');

        var max;
        for (var min = -10; min < 20; min++) {
            for (var add = 0; add < 10; add++) {
                max = min + add;
                var random = Random.integer(min, max);
                t.ok(random >= min && random <= max, 'Random.integer should return random number (' + random + ') [' + min + ';' + max + ']');
            }
        }

        var i;
        var min = 2;
        var max = 9;
        var desiredMatches = [2, 3, 4, 5, 6, 7, 8, 9];
        var actualMatches = {};
        for (i = 0; i < 100; i++) {
            var rand = Random.integer(min, max);
            actualMatches[rand] = true;
        }

        t.deepEqual(Object.keys(actualMatches).map(function(n) {
            return parseFloat(n);
        }).sort(), desiredMatches);

        for (i = 0; i < 100; i++) {
            if (Random.range(0, 10) % 1 === 1) {
                t.fail('Random.integer should return ints');
            }
        }

        t.end();
    });
    
    t.test('range method', function(t) {
        t.equal(typeof Random.range, 'function', 'Random.range should be a function');

        for (var i = 0; i < 100; i++) {
            if (Random.range(0, 10) % 1 === 0) {
                t.fail('Random.range should return floats');
            }
        }

        t.end();
    });
    
    t.test('sign method', function(t) {
        t.equal(typeof Random.sign, 'function', 'Random.sign should be a function');

        var n = 1000;

        for (var probability = 0; probability < 1; probability += 0.1) {
            var sum = 0;
            for (var j = 0; j < n; j++) {
                var random = Random.sign(probability);
                if (random !== -1 && random !== 1) {
                    t.fail('Random.sign should return {-1; 1}, but returned ' + random);
                }

                if (random === -1) random = 0;
                sum += random;
            }
            t.equal(Math.round((sum/n)*10), Math.round(probability*10), 'Random.sign should return 1 with probability ' + probability);
        }

        t.end();
    });
    
    t.test('bool method', function(t) {
        t.equal(typeof Random.bool, 'function', 'Random.bool should be a function');
        var returnedTrue = false;
        var returnedFalse = false;

        for (var i = 0; i < 200; i++) {
            var random = Random.bool();
            if (random === true) {
                returnedTrue = true;
            } else if (random === false) {
                returnedFalse = true;
            } else {
                t.fail('Random.bool should only return true and false');
            }
        }

        t.ok(returnedTrue, 'Random.bool should have returned true');
        t.ok(returnedFalse, 'Random.bool should have returned false');
        t.end();
    });
});

