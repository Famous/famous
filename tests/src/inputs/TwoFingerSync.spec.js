// This is a [Testcase Superclass](http://xunitpatterns.com/Testcase%20Superclass.html)

var test          = require('tape');
var Time          = require('../../helpers/Time');
Time.set(100);
var Touch         = require('../../helpers/Touch');
var TwoFingerSync = require('../../../src/inputs/TwoFingerSync');

test('TwoFingerSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof TwoFingerSync, 'function', 'TwoFingerSync should be a function');
    });

    t.test('calculateAngle function', function(t) {
        t.plan(5);
        t.equal(typeof TwoFingerSync.calculateAngle, 'function', 'TwoFingerSync.calculateAngle should be a function');
        t.equal(TwoFingerSync.calculateAngle([0, 0], [-Math.PI, 0]), Math.PI);
        t.equal(TwoFingerSync.calculateAngle([0, 0], [1, 1]), Math.PI*0.25);
        t.equal(TwoFingerSync.calculateAngle([0, 0], [1, -1]), -Math.PI*0.25);
        t.equal(TwoFingerSync.calculateAngle([0, 0], [0, 0]), 0);
    });

    t.test('calculateDistance function', function(t) {
        t.plan(5);
        t.equal(typeof TwoFingerSync.calculateDistance, 'function', 'TwoFingerSync.calculateDistance should be a function');
        t.equal(TwoFingerSync.calculateDistance([0, 0], [1, 1]), Math.sqrt(2));
        t.equal(TwoFingerSync.calculateDistance([0, 0], [0, 0]), 0);
        t.equal(TwoFingerSync.calculateDistance([-1, 0], [0, 0]), 1);
        t.equal(TwoFingerSync.calculateDistance([0, 0], [1, 2]), Math.sqrt(5));
    });

    t.test('calculateCenter function', function(t) {
        t.plan(4);
        t.equal(typeof TwoFingerSync.calculateCenter, 'function', 'TwoFingerSync.calculateCenter should be a function');
        t.deepEqual(TwoFingerSync.calculateCenter([0, 0], [2, 2]), [1, 1]);
        t.deepEqual(TwoFingerSync.calculateCenter([0, 0], [1, 1]), [0.5, 0.5]);
        t.deepEqual(TwoFingerSync.calculateCenter([1, 1], [2, 3]), [1.5, 2]);
    });

    t.test('_startUpdate call', function(t) {
        t.plan(10);

        var twoFingerSync = new TwoFingerSync();
        t.equal(twoFingerSync._startUpdate, undefined, 'twoFingerSync._startUpdate should be protected');
        twoFingerSync._startUpdate = function() {
            t.pass('twoFingerSync should call _startUpdate function on start event');
            t.equal(twoFingerSync.touchAId, 1, 'twoFingerSync should set protected properties on start');
            t.equal(twoFingerSync.touchBId, 2, 'twoFingerSync should set protected properties on start');
            t.equal(twoFingerSync.touchAEnabled, true, 'twoFingerSync should set protected properties on start');
            t.equal(twoFingerSync.touchBEnabled, true, 'twoFingerSync should set protected properties on start');
            t.deepEqual(twoFingerSync.posA, [1, 2], 'twoFingerSync should set protected properties on start');
            t.deepEqual(twoFingerSync.posB, [4, 5], 'twoFingerSync should set protected properties on start');
            t.equal(twoFingerSync.timestampA, 3, 'twoFingerSync should set protected properties on start');
            t.equal(twoFingerSync.timestampA, 3, 'twoFingerSync should set protected properties on start');
        };

        Time.set(3);
        twoFingerSync._eventInput.emit('touchstart', {
            changedTouches: [new Touch(1, 2, 1), new Touch(4, 5, 2)]
        });
    });

    t.test('_moveUpdate call', function(t) {
        t.plan(11);

        var twoFingerSync = new TwoFingerSync();
        t.equal(twoFingerSync._moveUpdate, undefined, 'twoFingerSync._endUpdate should be protected');
        twoFingerSync._startUpdate = function() {};
        twoFingerSync._moveUpdate = function(diffTime) {
            t.pass('twoFingerSync should call _moveUpdate function on move event');
            t.equal(diffTime, 100, 'twoFingerSync should set protected properties on move');
            t.equal(twoFingerSync.touchAId, 1, 'twoFingerSync should set protected properties on move');
            t.equal(twoFingerSync.touchBId, 2, 'twoFingerSync should set protected properties on move');
            t.equal(twoFingerSync.touchAEnabled, true, 'twoFingerSync should set protected properties on move');
            t.equal(twoFingerSync.touchBEnabled, true, 'twoFingerSync should set protected properties on move');
            t.deepEqual(twoFingerSync.posA, [2, 3], 'twoFingerSync should set protected properties on move');
            t.deepEqual(twoFingerSync.posB, [5, 6], 'twoFingerSync should set protected properties on move');
            t.equal(twoFingerSync.timestampA, 100, 'twoFingerSync should set protected properties on move');
            t.equal(twoFingerSync.timestampB, 100, 'twoFingerSync should set protected properties on move');
        };

        Time.set(0);
        twoFingerSync._eventInput.emit('touchstart', {
            changedTouches: [new Touch(1, 1, 1), new Touch(4, 5, 2)]
        });

        Time.set(100);
        twoFingerSync._eventInput.emit('touchmove', {
            changedTouches: [new Touch(2, 3, 1), new Touch(5, 6, 2)]
        });
    });

    t.test('end event', function(t) {
        t.plan(20);
        var twoFingerSync = new TwoFingerSync();
        twoFingerSync._startUpdate = function(){ };
        twoFingerSync._moveUpdate = function(){ };

        twoFingerSync.on('end', function(event) {
            t.pass('twoFingerSync should emit end event on touchend and touchcancel');
            setTimeout(function() {
                t.equal(twoFingerSync.touchAEnabled, false, 'twoFingerSync should set protected properties after end event has been emitted');
                t.equal(twoFingerSync.touchBEnabled, false, 'twoFingerSync should set protected properties after end event has been emitted');
                t.equal(twoFingerSync.touchAId, 0, 'twoFingerSync should set protected properties after end event has been emitted');
                t.equal(twoFingerSync.touchBId, 0, 'twoFingerSync should set protected properties after end event has been emitted');
            }, 1);
            t.notEqual(twoFingerSync.touchAEnabled, false, 'twoFingerSync should set protected properties after end event has been emitted');
            t.notEqual(twoFingerSync.touchBEnabled, false, 'twoFingerSync should set protected properties after end event has been emitted');
            t.notEqual(twoFingerSync.touchAId, 0, 'twoFingerSync should set protected properties after end event has been emitted');
            t.notEqual(twoFingerSync.touchBId, 0, 'twoFingerSync should set protected properties after end event has been emitted');
            t.deepEqual(event.touches, [1, 2]);
        });

        Time.set(0);
        twoFingerSync._eventInput.emit('touchstart', {
            changedTouches: [new Touch(1, 1, 1), new Touch(4, 5, 2)]
        });

        Time.set(100);
        twoFingerSync._eventInput.emit('touchend', {
            changedTouches: [new Touch(1, 1, 1), new Touch(4, 5, 2)]
        });

        Time.set(200);
        twoFingerSync._eventInput.emit('touchstart', {
            changedTouches: [new Touch(1, 1, 1), new Touch(4, 5, 2)]
        });

        Time.set(300);
        twoFingerSync._eventInput.emit('touchcancel', {
            changedTouches: [new Touch(1, 1, 1), new Touch(4, 5, 2)]
        });
    });
});
