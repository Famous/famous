var test      = require('tape');
var PinchSync = require('../../../src/inputs/PinchSync');

test('PinchSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof PinchSync, 'function', 'PinchSync should be a function');
    });

    t.test('start event', function(t) {
        t.plan(2);
        var pinchSync = new PinchSync();
        var expectedEvent = {
            count: 2,
            touches: [1, 2],
            distance: 0,
            center: [1, 0],
            target: undefined
        };
        pinchSync.on('start', function(event) {
            t.deepEqual(event, expectedEvent);
            t.pass('pinchSync should emit start event');
        });
        pinchSync.posA = [0, 0];
        pinchSync.touchAId = 1;
        pinchSync.posB = [2, 0];
        pinchSync.touchBId = 2;

        pinchSync._startUpdate({
            touches: [{}, {}]
        });
    });

    t.test('update event', function(t) {
        t.plan(2);
        var pinchSync = new PinchSync();
        var expectedEvent = {
            delta: 1,
            velocity: 0.01,
            distance: 3,
            displacement: 1,
            center: [1.5, 0],
            touches: [1, 2],
            target: undefined
        };
        pinchSync.on('update', function(event) {
            t.deepEqual(event, expectedEvent);
            t.pass('pinchSync should emit update event');
        });
        pinchSync.posA = [0, 0];
        pinchSync.touchAId = 1;
        pinchSync.posB = [2, 0];
        pinchSync.touchBId = 2;

        pinchSync._startUpdate({
            touches: [{}, {}]
        });

        pinchSync.posA = [0, 0];
        pinchSync.posB = [3, 0];

        pinchSync._moveUpdate(100, {});
    });
});
