var test               = require('tape');
var Accumulator        = require('../../../src/inputs/Accumulator');
var EventHandler       = require('../../../src/core/EventHandler');
var MockTransitionable = require('../../helpers/MockTransitionable');

test('Accumulator', function(t) {
    t.test('constructor', function(t) {
        t.plan(2);
        t.equal(typeof Accumulator, 'function', 'Accumulator should be a function');
        var accumulator = new Accumulator(4);
        t.equal(accumulator.get(), 4, 'Accumulator should set initial state');
    });

    t.test('get method', function(t) {
        t.plan(1);
        var accumulator = new Accumulator(4);
        t.equal(typeof accumulator.get, 'function', 'accumulator.get should be a function');
    });

    t.test('set method', function(t) {
        t.plan(3);
        var accumulator = new Accumulator();
        t.equal(typeof accumulator.set, 'function', 'accumulator.set should be a function');

        accumulator.set([1, 2, 3]);
        t.deepEqual(accumulator.get(), [1, 2, 3]);
        accumulator.set([-1, -2, -3]);
        t.deepEqual(accumulator.get(), [-1, -2, -3]);
    });

    t.test('pipe state', function(t) {
        t.test('Number', function(t) {
            t.plan(3);
            var accumulatorNumber = new Accumulator(0, 'boom');

            var eventHandler = new EventHandler();
            eventHandler.pipe(accumulatorNumber);

            eventHandler.emit('boom', { delta: 3 });
            t.equal(accumulatorNumber.get(), 3);
            eventHandler.emit('boom', { delta: 5 });
            t.equal(accumulatorNumber.get(), 8);
            eventHandler.emit('boom', { delta: -8 });
            t.equal(accumulatorNumber.get(), 0, 'accumulator should work with negative delta values');
        });
        
        // TODO Uncomment when #570 is merged in
        // t.test('Array', function(t) {
        //     t.plan(2);
        //     var accumulatorArray = new Accumulator([0, 0, 0], 'boom');

        //     var eventHandler = new EventHandler();
        //     eventHandler.pipe(accumulatorArray);

        //     eventHandler.emit('boom', { delta: [3, 5, 9.3] });
        //     t.deepEqual(accumulatorArray.get(), [3, 5, 9.3]);
        //     eventHandler.emit('boom', { delta: [1, 3, 0.7] });
        //     t.deepEqual(accumulatorArray.get(), [4, 8, 10]);
        // });

        // t.test('Transitionable', function(t) {
        //     t.plan(2);
        //     var mockTransitionable = new MockTransitionable([1, 2, 3, 4, 5]);
        //     var accumulatorTransitionable = new Accumulator(mockTransitionable, 'boom');

        //     var eventHandler = new EventHandler();
        //     eventHandler.pipe(accumulatorTransitionable);

        //     eventHandler.emit('boom', { delta: [1, 2, 3, 4, 5] });
        //     t.deepEqual(accumulatorTransitionable.get(), [2, 4, 6, 8, 10]);
        //     eventHandler.emit('boom', { delta: [-2, -4, -6, -8, -10] });
        //     t.deepEqual(accumulatorTransitionable.get(), [0, 0, 0, 0, 0]);
        // });
    });
});
