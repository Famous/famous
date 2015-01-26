var test       = require('tape');
var RotateSync = require('../../../src/inputs/RotateSync');

test('RotateSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof RotateSync, 'function', 'RotateSync should be a function');
    });

    t.test('start event', function(t) {
        t.plan(2);
        var rotateSync = new RotateSync();
        var expectedEvent = {
            count: 2,
            angle: 0,
            center: [1, 1],
            touches: [1, 2],
            target: undefined
        };
        rotateSync.on('start', function(event) {
            t.deepEqual(event, expectedEvent);
            t.pass('rotateSync should emit start event');
        });
        rotateSync.posA = [0, 0];
        rotateSync.touchAId = 1;
        rotateSync.posB = [2, 2];
        rotateSync.touchBId = 2;

        rotateSync._startUpdate({
            touches: [{}, {}]
        });
    });

    t.test('update event', function(t) {
        t.plan(2);
        var rotateSync = new RotateSync();

        var expectedEvent = {
            delta: 0,
            velocity: 0,
            angle: 0,
            center: [1.5, 1.5],
            touches: [1, 2],
            target: undefined
        };
        rotateSync.on('update', function(event) {
            t.deepEqual(event, expectedEvent);
            t.pass('rotateSync should emit update event');
        });

        rotateSync.posA = [0, 0];
        rotateSync.touchAId = 1;
        rotateSync.posB = [1, 1];
        rotateSync.touchBId = 2;
        rotateSync._startUpdate({
            touches: [{}, {}]
        });

        rotateSync.posA = [1, 1];
        rotateSync.touchAId = 1;
        rotateSync.posB = [2, 2];
        rotateSync.touchBId = 2;
        rotateSync._moveUpdate(100, {});
    });
});
