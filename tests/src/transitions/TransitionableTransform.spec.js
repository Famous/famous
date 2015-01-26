var test                    = require('tape');
var Time                    = require('../../helpers/Time');
Time.set(0);
var TransitionableTransform = require('../../../src/transitions/TransitionableTransform');
var deepRound               = require('../../helpers/deepRound');

test('TransitionableTransform', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof TransitionableTransform, 'function', 'TransitionableTransform should be a function');

        t.doesNotThrow(function() {
            new TransitionableTransform();
        }, 'TransitionableTransform constructor should not throw an error');

        var transitionableTransform = new TransitionableTransform();
        t.deepEqual(transitionableTransform.get(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], 'transitionableTransform should default to identity transform matrix');

        t.end();
    }); 

    t.test('setTranslate method', function(t) {
        t.plan(3);
        var transitionableTransform = new TransitionableTransform();
        t.equal(typeof transitionableTransform.setTranslate, 'function', 'transitionableTransform.setTranslate should be a function');

        var callback = function() {
            t.pass('transitionableTransform.setTranslate should accept and invoke callback function');
        };

        Time.set(0);
        transitionableTransform.setTranslate([1, 2, 3]);
        t.deepEqual(transitionableTransform.get(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1], 'transitionableTransform.setTranslate should correctly build the transform matrix');
        transitionableTransform.setTranslate([4, 5, 6], { duration: 50 }, callback);
        Time.set(100);
        t.deepEqual(transitionableTransform.get(), [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 4, 5, 6, 1], 'transitionableTransform.setTranslate should correctly build the transform matrix');
    });

    t.test('setScale method', function(t) {
        t.plan(3);
        var transitionableTransform = new TransitionableTransform();
        t.equal(typeof transitionableTransform.setScale, 'function', 'transitionableTransform.setScale should be a function');

        var callback = function() {
            t.pass('transitionableTransform.setScale should accept and invoke callback function');
        };

        Time.set(0);
        transitionableTransform.setScale([1, 2, 3]);
        t.deepEqual(transitionableTransform.get(), [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1], 'transitionableTransform.setScale should correctly build the transform matrix');
        transitionableTransform.setScale([4, 5, 6], { duration: 50 }, callback);
        Time.set(100);
        t.deepEqual(transitionableTransform.get(), [4, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 0, 0, 0, 0, 1], 'transitionableTransform.setScale should correctly build the transform matrix');
    });

    t.test('setRotate method', function(t) {
        t.plan(3);
        var transitionableTransform = new TransitionableTransform();
        t.equal(typeof transitionableTransform.setRotate, 'function', 'transitionableTransform.setRotate should be a function');

        var callback = function() {
            t.pass('transitionableTransform.setRotate should accept and invoke callback function');
        };

        Time.set(0);
        transitionableTransform.setRotate([Math.PI, Math.PI*0.5, Math.PI*0.3]);
        t.deepEqual(deepRound(transitionableTransform.get()), deepRound([3.599146639029984e-17, -0.8090169943749472, 0.5877852522924734, 0, -4.9538003630854574e-17, -0.5877852522924734, -0.8090169943749472, 0, 1, -7.498798913309288e-33, -6.123233995736766e-17, 0, 0, 0, 0, 1]), 'transitionableTransform.setRotate should correctly build the transform matrix');
        transitionableTransform.setRotate([4, 5, 6], { duration: 100 }, callback);
        Time.set(200);
        t.deepEqual(deepRound(transitionableTransform.get()), deepRound([ 0.27236400192809523, 0.8794493702846053, -0.39036733413507296, 0, 0.07925961087140347, -0.4248328058013977, -0.9017954320129513, 0, -0.9589242746631385, 0.21467624978306993, -0.18541397800826864, 0, 0, 0, 0, 1 ]), 'transitionableTransform.setRotate should correctly build the transform matrix');
    });

    t.test('setDefaultTransition method', function(t) {
        t.plan(1);
        var transitionableTransform = new TransitionableTransform();
        t.equal(typeof transitionableTransform.setDefaultTransition, 'function', 'transitionableTransform.setDefaultTransition should be a function');
    });

    t.test('integration test: get method with multiple transitions', function(t) {
        t.test('exist', function(t) {
            t.plan(1);
            var transitionableTransform = new TransitionableTransform();
            t.equal(typeof transitionableTransform.get, 'function', 'transitionableTransform.get should be a function');
        });

        t.test('rotate and translate', function(t) {
            t.plan(1);
            var transitionableTransform = new TransitionableTransform();
            Time.set(0);
            transitionableTransform.setRotate([0, 0, Math.PI], { duration: 500 });
            transitionableTransform.setTranslate([100, 100, 100], { duration: 600 });
            Time.set(600);
            t.deepEqual(deepRound(transitionableTransform.get()), deepRound([ -1, 1.2246467991473532e-16, 0, 0, -1.2246467991473532e-16, -1, 0, 0, 0, 0, 1, 0, 100, 100, 100, 1 ]));
        });
        
        t.test('scale and translate', function(t) {
            t.plan(1);
            var transitionableTransform = new TransitionableTransform();
            Time.set(0);
            transitionableTransform.setScale([0.2, 0.4, 0.5], { duration: 500 });
            transitionableTransform.setTranslate([100, 100, 100], { duration: 500 });
            Time.set(500);
            t.deepEqual(deepRound(transitionableTransform.get()), deepRound([0.2, 0, 0, 0, 0, 0.4, 0, 0, 0, 0, 0.5, 0, 100, 100, 100, 1]));
        });
    });
});
