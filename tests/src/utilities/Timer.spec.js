var test   = require('tape');
var Time   = require('../../helpers/Time');
var Timer  = require('../../../src/utilities/Timer');
var Engine = require('../../../src/core/Engine');

// The following tests are integration tests.
// Unit tests would require implementing a mock for Engine and Date.

test('Timer', function(t) {
    t.test('setTimeout method', function(t) {
        t.test('basic', function(t) {
            Time.reset();

            t.plan(3);
            t.equal(typeof Timer.setTimeout, 'function', 'Timer.setTimeout should be a function');

            var startedAt = Date.now();

            Timer.setTimeout(function() {
                var now = Date.now();
                var diff = now - startedAt;
                t.ok(diff < 650);
                t.ok(diff > 450);
            }, 500);
        });
        t.test('clear method', function(t) {
            t.plan(1);
            var timer = Timer.setTimeout(function() {
                t.fail();
            }, 100);

            t.doesNotThrow(function() {
                Timer.clear(timer);
            });
            t.end();
        });
    });

    t.test('setInterval method', function(t) {
        t.test('basic', function(t) {
            t.plan(9);
            Time.reset();
            t.equal(typeof Timer.setInterval, 'function', 'Timer.setInterval should be a function');

            var lastCallAt = Date.now();
            var count = 0;

            var timer = Timer.setInterval(function() {
                var now = Date.now();
                var diff = now - lastCallAt;
                t.ok(diff < 530);
                t.ok(diff > 430);
                lastCallAt = now;
                if (count++ === 3) {
                    Timer.clear(timer);
                }
            }, 500);
        });

        t.test('clear method', function(t) {
            var timer = Timer.setInterval(function() {
                t.fail();
            }, 100);

            Timer.clear(timer);
            t.end();
        });
    });

    t.test('debounce method', function(t) {
        t.plan(3);
        Time.reset();
        t.equal(typeof Timer.debounce, 'function', 'Timer.debounce should be a function');

        var fn = Timer.debounce(function() {
            t.pass();
        }, 100);

        fn();
        fn();

        Timer.setTimeout(function() {
            fn();
        }, 120);
    });

    t.test('after method', function(t) {
        Time.reset();
        t.equal(typeof Timer.after, 'function', 'Timer.after should be a function');
        var i = 0;
        Engine.on('prerender', function() {
            i++;
        });
        Timer.after(function() {
            t.equal(i, 10, 'Timer.after invoked function after ' + i + ' Engine ticks');
            t.end();
        }, 10);
    });

    t.test('every method', function(t) {
        Time.reset();
        t.equal(typeof Timer.every, 'function', 'Timer.every should be a function');
        var ticks = 0;
        var engineListener = Engine.on('postrender', function() {
            ticks++;
        });
        var invokedCount = 0;
        var timer = Timer.every(function() {
            invokedCount++;
            t.equal(invokedCount*10, ticks, 'Timer.every should be called on the ' + ticks + '. Engine tick');
            if (invokedCount === 3) {
                Timer.clear(timer);
                Engine.removeListener(engineListener);
                t.end();
            }
        }, 10);
    });
});
