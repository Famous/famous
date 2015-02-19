var test      = require('tape');
var Time      = require('../../helpers/Time');
Time.set(0);
var MouseSync = require('../../../src/inputs/MouseSync');

test('MouseSync', function(t) {
    t.test('constructor', function(t) {
        t.plan(1);
        t.equal(typeof MouseSync, 'function', 'MouseSync should be a function');
    });

    t.test('start event', function(t) {
        t.test('basic', function() {
            // preventDefault will be called twice
            t.plan(5);

            var expectedEvent = {
                delta: [0, 0],
                position: [0, 0],
                velocity: [0, 0],
                clientX: 100,
                clientY: 50,
                offsetX: 15,
                offsetY: 2,
                target: undefined
            };

            var mouseSync = new MouseSync();
            mouseSync.on('start', function(event) {
                t.deepEqual(event, expectedEvent);
                t.pass('mouseSync should emit start event');
            });

            Time.set(0);
            mouseSync._eventInput.emit('mousedown', {
                preventDefault: function() {
                    t.pass('mouseSync should preventDefault by default');
                },
                clientX: 100,
                clientY: 50,
                offsetX: 15,
                offsetY: 2
            });
        });
        t.test('preventDefault option', function(t) {
            var mouseSync = new MouseSync({preventDefault: false});

            mouseSync._eventInput.emit('mousedown', {
                preventDefault: function() {
                    t.fail('mouseSync should use preventDefault option');
                },
                clientX: 100,
                clientY: 50,
                offsetX: 15,
                offsetY: 2
            });
            t.end();
        });
    });
    
    t.test('update event', function(t) {
        t.plan(2);
        var expectedEvent = {
            delta: [0,0],
            position: [0,0],
            velocity: [0,0],
            clientX: 100,
            clientY: 50,
            offsetX: 5,
            offsetY: 10,
            target: undefined
        };

        var mouseSync = new MouseSync({preventDefault: false});
        mouseSync.on('update', function(event) {
            t.deepEqual(event, expectedEvent);
            t.pass('mouseSync should emit update event');
        });

        Time.set(100);
        mouseSync._eventInput.emit('mousedown', {
            clientX: 100,
            clientY: 50,
            offsetX: 15,
            offsetY: 2
        });

        Time.set(300);
        mouseSync._eventInput.emit('mousemove', {
            clientX: 100,
            clientY: 50,
            offsetX: 5,
            offsetY: 10
        });
    });

    t.test('end event', function(t) {
        t.plan(2);
        var expectedEvent = {
            delta: [0,0],
            position: [0,0],
            velocity: [0,0],
            clientX: 100,
            clientY: 50,
            offsetX: 5,
            offsetY: 10,
            target: undefined
        };

        var mouseSync = new MouseSync({preventDefault: false});
        mouseSync.on('end', function(event) {
            t.deepEqual(event, expectedEvent);
            t.pass('mouseSync should emit end event');
        });

        Time.set(100);
        mouseSync._eventInput.emit('mousedown', {
            clientX: 100,
            clientY: 50,
            offsetX: 15,
            offsetY: 2
        });

        Time.set(300);
        mouseSync._eventInput.emit('mousemove', {
            clientX: 100,
            clientY: 50,
            offsetX: 5,
            offsetY: 10
        });
        
        Time.set(600);
        mouseSync._eventInput.emit('mouseup', {});
    });
});
