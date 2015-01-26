var test      = require('tape');
var Time      = require('../../helpers/Time');
Time.set(0);
var ScaleSync = require('../../../src/inputs/ScaleSync');

test('ScaleSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof ScaleSync, 'function', 'ScaleSync should be a function');
    });

    t.test('start event', function(t) {
        t.plan(5);
        Time.set(0);
        var scaleSync = new ScaleSync();
        scaleSync.posA = [1, 2];
        scaleSync.posB = [3, 4];
        scaleSync.touchAId = 4;
        scaleSync.touchBId = 5;
        // Low-level eventing functionality is being tested in TwoFingerSync.spec.js
        scaleSync.on('start', function(actualEvent) {
            t.equal(actualEvent.count, 2);
            t.deepEqual(actualEvent.touches, [4, 5]);
            // tested in TwoFingerSync
            t.equal(Array.isArray(actualEvent.center), true);
            t.equal(typeof actualEvent.distance, 'number');
            t.pass('scaleSync should emit update event');
        });
        scaleSync._startUpdate({
            touches: [scaleSync.posA, scaleSync.posB]
        });
    });
    
    t.test('update event', function(t) {
        t.plan(1);
        Time.set(0);
        var scaleSync = new ScaleSync();
        scaleSync.posA = [1, 2];
        scaleSync.posB = [3, 4];
        scaleSync.touchAId = 4;
        scaleSync.touchBId = 5;
        scaleSync.on('update', function() {
            t.pass('scaleSync should emit update event');
        });
        scaleSync._moveUpdate(200, {});
    });

    // t.test('end event', function(t) {
    //     t.plan(1);
    //     Time.set(0);
    //     var scaleSync = new ScaleSync();
    //     scaleSync.on('end', function() {
    //         t.pass('scaleSync should emit end event');
    //     });
    //     scaleSync._eventInput.emit('mousewheel', {
    //         preventDefault: function() {},
    //         clientX: 50,
    //         clientY: 100,
    //         offsetX: 3,
    //         offsetY: 100
    //     });
    //     Time.set(1);
    //     scaleSync._eventInput.emit('mousewheel', {
    //         preventDefault: function() {},
    //         clientX: 50,
    //         clientY: 100,
    //         offsetX: 3,
    //         offsetY: 130
    //     });
    //     Time.set(500);
    // });
});
