var test               = require('tape');
var MultipleTransition = require('../../../src/transitions/MultipleTransition');
var MockTransitionable = require('../../helpers/MockTransitionable');

test('MultipleTransition', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof MultipleTransition, 'function', 'MultipleTransition should be a function');
    });

    t.test('get method', function(t) {
        t.plan(2);
        var multipleTransition = new MultipleTransition(MockTransitionable);
        t.equal(typeof multipleTransition.get, 'function', 'multipleTransition.get should be a function');

        var mockTransitionable = new MockTransitionable(MockTransitionable);

        multipleTransition.set([1, 2, 3], mockTransitionable, function() {
            t.deepEqual(multipleTransition.get(), [1, 2, 3], 'multipleTransition.set should set final state');
        });
    });
    
    t.test('set method', function(t) {
        t.test('exists', function(t) {
            t.plan(1);
            var multipleTransition = new MultipleTransition(MockTransitionable);
            t.equal(typeof multipleTransition.set, 'function', 'multipleTransition.set should be a function');
        });

        t.test('array endState', function(t) {
            t.plan(3);
            var multipleTransition = new MultipleTransition(MockTransitionable);
            var mockTransitionable1 = new MockTransitionable();
            multipleTransition.set([0, 0, 0], mockTransitionable1, function() {
                t.pass('multipleTransition.set should call callback function after transition is complete');
            });

            var mockTransitionable2 = new MockTransitionable(MockTransitionable);
            multipleTransition.set([1, 2, 3], mockTransitionable2, function() {
                t.deepEqual(multipleTransition.get(), [1, 2, 3], 'multipleTransition.set should call callback after final state has been set');
                t.pass('multipleTransition.set should work with consecutive states');
            });
        });

        // TODO Uncomment when #594 is merged in
        // t.test('number endState', function(t) {
        //     t.plan(2);
        //     var multipleTransition = new MultipleTransition(MockTransitionable);

        //     var mockTransitionable = new MockTransitionable();
        //     multipleTransition.set([0, 0, 1]);
        //     multipleTransition.set(9, mockTransitionable, function() {
        //         t.deepEqual(multipleTransition.get(), [9, 9, 9], 'multipleTransition.set should call callback after final state has been set');
        //         t.pass('multipleTransition.set should work with consecutive states');
        //     });        
        // });
    });
    
    t.test('reset method', function(t) {
        t.plan(1);
        var multipleTransition = new MultipleTransition(MockTransitionable);
        t.equal(typeof multipleTransition.reset, 'function', 'multipleTransition.reset should be a function');

        // TODO Uncomment when #594 is merged in
        // multipleTransition.set([1, 2, 3]);
        // multipleTransition.reset([3, 4, 5]);
        // t.deepEqual(multipleTransition.get(), [3, 4, 5], 'multipleTransition.reset should reset to given startState');
    });
});
