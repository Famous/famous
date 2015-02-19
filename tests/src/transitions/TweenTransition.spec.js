var test            = require('tape');
var Time            = require('../../helpers/Time');
Time.set(0);
var TweenTransition = require('../../../src/transitions/TweenTransition');

test('TweenTransition', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof TweenTransition, 'function', 'TweenTransition should be a function');

        var args = [undefined, 2, [1, 2], [1, 2, 3]];

        t.doesNotThrow(function() {
            args.forEach(function(arg) {
                new TweenTransition(arg);
            });
        }, 'TweenTransition constructor should not throw an error');
        t.end();
    });

    t.test('registerCurve, getCurve, getCurves, unregisterCurve methods', function(t) {
        t.equal(typeof TweenTransition.registerCurve, 'function', 'TweenTransition.registerCurve should be a function');
        t.equal(typeof TweenTransition.getCurve, 'function', 'TweenTransition.getCurve should be a function');
        t.equal(typeof TweenTransition.getCurves, 'function', 'TweenTransition.getCurves should be a function');
        t.equal(typeof TweenTransition.unregisterCurve, 'function', 'TweenTransition.unregisterCurve should be a function');

        var fns = [function(t) {
            return t;
        }, function(t) {
            return Math.pow(t, 2);
        }];

        fns.forEach(function(fn, i) {
            TweenTransition.registerCurve('fn ' + i, fn);
        });

        fns.forEach(function(fn, i) {
            t.equal(TweenTransition.getCurve('fn ' + i), fn);
        });

        var registeredCurves = TweenTransition.getCurves();
        t.equal(typeof registeredCurves, 'object');
        fns.forEach(function(fn, i) {
            t.equal(registeredCurves['fn ' + i], fn);
        });

        fns.forEach(function(fn, i) {
            TweenTransition.unregisterCurve('fn ' + i);
        });

        fns.forEach(function(fn, i) {
            t.throws(function() {
                TweenTransition.getCurve('fn ' + i);
            }, /not registered/);
        });

        t.end();
    });

    t.test('getCurve method: default curves should be registered', function(t) {
        var defaultCurves = 'linear easeIn easeOut easeInOut easeOutBounce spring'.split(' ');
        defaultCurves.forEach(function(curveName) {
            t.equal(typeof TweenTransition.getCurve(curveName), 'function');
        });
        t.end();
    });

    t.test('set and get methods', function(t) {
        t.plan(4);
        var tweenTransition = new TweenTransition();
        t.equal(typeof tweenTransition.set, 'function', 'tweenTransition.set should be a function');
        t.equal(typeof tweenTransition.get, 'function', 'tweenTransition.get should be a function');

        Time.set(0);
        tweenTransition.set(1);
        t.equal(tweenTransition.get(1), 1);

        tweenTransition.set(1, { duration: 500 });

        Time.set(500);
        t.equal(tweenTransition.get(1), 1);
    });

    t.test('get method with time as argument', function(t) {
        t.plan(4);
        Time.set(0);
        var tweenTransition = new TweenTransition();
        tweenTransition.set(1, { duration: 200 });
        Time.set(100);
        t.equal(tweenTransition.get(), 100/200);
        t.equal(tweenTransition.get(100), 100/200);
        Time.set(150);
        t.equal(tweenTransition.get(), 150/200);
        t.equal(tweenTransition.get(150), 150/200);
    });

    t.test('isActive method', function(t) {
        t.plan(4);
        Time.set(0);
        var tweenTransition = new TweenTransition();
        t.equal(typeof tweenTransition.isActive, 'function', 'tweenTransition.isActive should be a function');

        tweenTransition.set(0);
        tweenTransition.set(1, { duration: 500 });
        t.ok(tweenTransition.isActive());

        Time.set(100);
        t.equal(tweenTransition.isActive(), true);
        
        Time.set(700);    
        tweenTransition.reset();
        t.equal(tweenTransition.isActive(), false);
    });

    t.test('reset method', function(t) {
        t.plan(2);
        var tweenTransition = new TweenTransition();
        t.equal(typeof tweenTransition.reset, 'function', 'tweenTransition.reset should be a function');

        tweenTransition.set(1, { duratio: 500 });
        tweenTransition.reset();
        t.equal(tweenTransition.get(), undefined);
    });

    t.test('halt method', function(t) {
        t.plan(2);
        Time.set(0);
        var tweenTransition = new TweenTransition();
        t.equal(typeof tweenTransition.halt, 'function', 'tweenTransition.halt should be a function');
        tweenTransition.set([0, 0, 0]);
        tweenTransition.set([1, 2, 3], { duration: 100 });
        Time.set(50);
        tweenTransition.halt();
        var value1 = tweenTransition.get();
        var value2 = tweenTransition.get();
        t.deepEqual(value1, value2);
    });

    t.test('getVelocity method', function(t) {
        t.plan(2);
        var tweenTransition = new TweenTransition();
        t.equal(typeof tweenTransition.getVelocity, 'function', 'tweenTransition.getVelocity should be a function');
        t.equal(tweenTransition.getVelocity(), undefined, 'tweenTransition velocity should default to undefined');
    });

    t.test('setOptions method', function(t) {
        t.test('exists', function(t) {
            t.plan(1);
            var tweenTransition = new TweenTransition();
            t.equal(typeof tweenTransition.setOptions, 'function', 'tweenTransition.setOptions should be a function');
        });

        t.test('curve option', function(t) {
            t.plan(1);
            Time.set(0);
            var tweenTransition = new TweenTransition();
            tweenTransition.setOptions({
                curve: function() {
                    return 0.1234;
                }
            });
            tweenTransition.set(1, { duration: 20 });
            Time.set(10);
            t.equal(tweenTransition.get(), 0.1234);
        });

        t.test('duration option', function(t) {
            t.plan(2);
            Time.set(0);
            var tweenTransition = new TweenTransition();
            tweenTransition.setOptions({ duration: 1000 });
            tweenTransition.set(1, {});
            Time.set(500);
            t.equal(tweenTransition.get(), 0.5);

            Time.set(1000);
            t.equal(tweenTransition.get(), 1);
        });

        t.test('speed option', function(t) {
            t.plan(1);
            Time.set(0);
            var tweenTransition = new TweenTransition();
            tweenTransition.setOptions({ speed: 0.0001 });

            tweenTransition.set(0);
            tweenTransition.set(1, {
                curve: function(t) { return t; },
                duration: 1000
            });

            Time.set(1);
            t.equal(tweenTransition.get(), 0.0001);
        });
    });

    t.test('customCurve method', function(t) {
        t.plan(1);
        t.equal(typeof TweenTransition.customCurve, 'function', 'TweenTransition.customCurve should be a function');
    });

    t.test('halt method', function(t) {
        t.plan(2);
        Time.set(0);
        var tweenTransition = new TweenTransition();
        t.equal(typeof tweenTransition.halt, 'function', 'tweenTransition.halt should be a function');
        tweenTransition.set(1, { duration: 500 });
        Time.set(250);
        tweenTransition.halt();
        Time.set(1000);
        t.equal(tweenTransition.get(), 0.5);
    });
});
