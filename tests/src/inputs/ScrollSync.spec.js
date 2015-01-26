var test       = require('tape');
var Time       = require('../../helpers/Time');
Time.set(0);
var ScrollSync = require('../../../src/inputs/ScrollSync');

test('ScrollSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof ScrollSync, 'function', 'ScrollSync should be a function');
    });

    t.test('start event', function(t) {
        t.plan(1);
        Time.set(0);
        var scrollSync = new ScrollSync();
        scrollSync.on('start', function() {
            t.pass('scrollSync should emit start event');
        });
        scrollSync._eventInput.emit('mousewheel', {
            preventDefault: function() {},
            clientX: 50,
            clientY: 100,
            offsetX: 3,
            offsetY: 100
        });
    });
    
    t.test('update event', function(t) {
        t.plan(2);
        Time.set(0);
        var scrollSync = new ScrollSync();
        scrollSync.on('update', function() {
            t.pass('scrollSync should emit update event');
        });
        scrollSync._eventInput.emit('mousewheel', {
            preventDefault: function() {},
            clientX: 50,
            clientY: 100,
            offsetX: 3,
            offsetY: 100
        });
        scrollSync._eventInput.emit('mousewheel', {
            preventDefault: function() {},
            clientX: 50,
            clientY: 100,
            offsetX: 3,
            offsetY: 130
        });
    });

    t.test('end event', function(t) {
        t.plan(1);
        Time.set(0);
        var scrollSync = new ScrollSync();
        scrollSync.on('end', function() {
            t.pass('scrollSync should emit end event');
        });
        scrollSync._eventInput.emit('mousewheel', {
            preventDefault: function() {},
            clientX: 50,
            clientY: 100,
            offsetX: 3,
            offsetY: 100
        });
        Time.set(1);
        scrollSync._eventInput.emit('mousewheel', {
            preventDefault: function() {},
            clientX: 50,
            clientY: 100,
            offsetX: 3,
            offsetY: 130
        });
        Time.set(500);
    });
});
