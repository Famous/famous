var test         = require('tape');
var EventEmitter = require('../../../src/core/EventEmitter');

test('EventEmitter', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof EventEmitter, 'function', 'EventEmitter should be a function');

        t.doesNotThrow(function() {
	        new EventEmitter();
        }, 'EventEmitter constructor should not throw an error');

        t.end();
    });

    t.test('emit method', function(t) {
        var eventEmitter = new EventEmitter();

        t.equal(typeof eventEmitter.emit, 'function', 'eventEmitter.emit should be a function');
        t.equal(eventEmitter.emit('test'), eventEmitter, 'eventEmitter.emit should be chainable');
        t.equal(eventEmitter.emit('test', {test: true}), eventEmitter, 'eventEmitter.emit should be chainable');

        t.equal(eventEmitter.emit('boom'), eventEmitter, 'eventEmitter.emit should be chainable');
    	t.end();
    });

    t.test('on method', function(t) {
    	t.plan(4);
        var eventEmitter = new EventEmitter();
        t.equal(typeof eventEmitter.on, 'function', 'eventEmitter.on should be a function');

        var referenceEvent = {test1: true, test2: {test3: true}};

        var listener = function(e) {
        	t.pass('eventEmitter should call listener function');
        	t.equal(e, referenceEvent, 'eventEmitter.on callback should retrieve correct event');
        };

        eventEmitter.on('test', listener);
        eventEmitter.emit('test', referenceEvent);
        t.equal(eventEmitter.on('boom', function() {}), eventEmitter, 'eventEmitter.on should be chainable');
        eventEmitter.removeListener(listener);
    });

    t.test('addListener method', function(t) {
        var eventEmitter = new EventEmitter();
        t.equal(typeof eventEmitter.addListener, 'function', 'eventEmitter.addListener should be a function');
        t.equal(eventEmitter.addListener, eventEmitter.on, 'eventEmitter.addListener should be alias of eventEmitter.on');
        t.end();
    });

    t.test('removeListener method', function(t) {
    	t.plan(3);
        var eventEmitter = new EventEmitter();
        t.equal(typeof eventEmitter.removeListener, 'function', 'eventEmitter.removeListener should be a function');

        var counter = 0;
        var listener = function() {
        	if (counter++ === 0) {
	        	t.pass('eventEmitter should invoke function once');
        	} else {
        		t.fail('eventEmitter.removeListener should remove listener function');
        	}
        };

        eventEmitter.on('test', listener);
        eventEmitter.emit('test');
        t.equal(eventEmitter.removeListener('boom', function() {}), eventEmitter, 'eventEmitter.removeListener should be chainable');
        eventEmitter.removeListener('test', listener);
    });

    t.test('bindThis method', function(t) {
    	t.plan(2);
        var eventEmitter = new EventEmitter();
        t.equal(typeof eventEmitter.bindThis, 'function', 'eventEmitter.bindThis should be a function');
    	var that = {
    		pass: function() {
    			t.pass('eventEmitter.bindThis should bind all listener functions to that');
    		}
    	};

    	var listener = function() {
    		this.pass();
    	};

    	eventEmitter.bindThis(that);
    	eventEmitter.on('test', listener);
    	eventEmitter.emit('test');
    	eventEmitter.removeListener('test', listener);
    });
});
