var test         = require('tape');
var Time         = require('../../helpers/Time');
var Touch        = require('../../helpers/Touch');
Time.set(0);
var TouchTracker = require('../../../src/inputs/TouchTracker');

test('TouchTracker', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof TouchTracker, 'function', 'TwoFingerSync should be a function');        
    });

    t.test('trackstart event', function(t) {
        t.plan(2);
        var touchTracker = new TouchTracker({});
        touchTracker.on('trackstart', function() {
            t.pass('touchtracker should emit trackstart event');
        });
        touchTracker.eventInput.emit('touchstart', {
            changedTouches: [new Touch(0, 0, 4), new Touch(1, 3, 1)],
            touches: [new Touch(0, 0, 2)]
        });
    });

    t.test('trackmove event', function(t) {
        t.plan(2);
        var touchTracker = new TouchTracker({});
        Time.set(400);
        touchTracker.on('trackmove', function(event) {
            t.equal(event.timestamp, 400);
            t.pass('touchtracker should emit trackmove event');
        });
        touchTracker.eventInput.emit('touchstart', {
            changedTouches: [new Touch(0, 0, 1)],
            touches: []
        });
        touchTracker.eventInput.emit('touchmove', {
            changedTouches: [new Touch(1, 2, 1)],
            touches: [new Touch(1, 2, 5)]
        });
        Time.set(0);
    });

    t.test('trackend event', function(t) {
        t.plan(1);
        var touchTracker = new TouchTracker({});
        touchTracker.on('trackend', function() {
            t.pass('touchtracker should emit trackend event');
        });
        touchTracker.eventInput.emit('touchstart', {
            changedTouches: [new Touch(1, 2, 5)],
            touches: []
        });
        touchTracker.eventInput.emit('touchend', {
            changedTouches: [new Touch(1, 2, 5)],
            touches: []
        });
    });
});
