var test      = require('tape');
var Time      = require('../../helpers/Time');
Time.set(0);
var TouchSync = require('../../../src/inputs/TouchSync');

test('TouchSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof TouchSync, 'function', 'TouchSync should be a function');
    });

    t.test('start event', function(t) {
        t.plan(1);
        var touchSync = new TouchSync();

        touchSync.on('start', function() {
            t.pass('touchSync should emit start event');
        });

        touchSync._touchTracker.eventOutput.emit('trackstart', {
            count: 1,
            identifier: 1,
            x: 4,
            y: 5
        });
    });

    t.test('update event', function(t) {
        t.plan(1);
        var touchSync = new TouchSync();

        touchSync.on('update', function() {
            t.pass('touchSync should emit update event');
        });

        touchSync._touchTracker.eventOutput.emit('trackstart', {
            count: 1,
            identifier: 1,
            x: 4,
            y: 5
        });

        touchSync._touchTracker.eventOutput.emit('trackmove', {
            history: [{}, {}]
        });
    });
    
    t.test('end event', function(t) {
        t.plan(1);
        var touchSync = new TouchSync();

        touchSync.on('end', function() {
            t.pass('touchSync should emit end event');
        });

        touchSync._touchTracker.eventOutput.emit('trackstart', {
            count: 1,
            identifier: 1,
            x: 4,
            y: 5
        });

        touchSync._touchTracker.eventOutput.emit('trackend', {
        });
    });
});
