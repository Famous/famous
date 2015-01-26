var test         = require('tape');
var EventHandler = require('../../../src/core/EventHandler');
var EventEmitter = require('../../../src/core/EventEmitter');

test('EventHandler', function(t) {
    t.test('constructor', function(t) {
        t.equal(typeof EventHandler, 'function', 'EventHandler should be a function');

        t.doesNotThrow(function() {
            new EventHandler();
        }, 'EventHandler constructor should not throw an error');

        t.end();
    });

    t.test('EventEmitter methods', function(t) {
        var eventHandler = new EventHandler();
        var eventEmitter = new EventEmitter();
        for (var prop in eventEmitter) {
            if (typeof prop === 'function') {
                t.ok(eventHandler[prop], 'EventEmitter should have all methods of EventEmitter, including ' + prop);
            }
        }
        t.end();
    });

    t.test('setInputHandler method', function(t) {
        t.plan(2);
        t.equal(typeof EventHandler.setInputHandler, 'function', 'EventHandler.setInputHandler should be a function');

        var inputHandler = new EventHandler();
        var eventHandler = new EventHandler();

        EventHandler.setInputHandler(inputHandler, eventHandler);

        var exampleEvent = {};
        eventHandler.on('boom', function(actualEvent) {
            t.equal(actualEvent, exampleEvent, 'EventHandler.setInputHandler should bind the object\'s trigger method to the handler');
        });

        inputHandler.trigger('boom', exampleEvent);
    });

    t.test('setOutputHandler method', function(t) {
        t.plan(2);
        t.equal(typeof EventHandler.setOutputHandler, 'function', 'EventHandler.setOutputHandler should be a function');

        var outputHandler = new EventHandler();
        var receivingEventHandler = new EventHandler();

        EventHandler.setOutputHandler(receivingEventHandler, outputHandler);

        var exampleEvent = {};
        receivingEventHandler.on('boom', function(actualEvent) {
            t.equal(actualEvent, exampleEvent, 'EventHandler.setOutputHandler should bind the object\'s output handler functions method to the handler');
        });

        outputHandler.pipe(receivingEventHandler);
        outputHandler.trigger('boom', exampleEvent);
    });

    t.test('pipe method', function(t) {
        t.plan(3);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.pipe, 'function', 'eventHandler.pipe should be a function');

        var receivingEventHandler = new EventHandler();
        var emittingEventHandler = new EventHandler();

        emittingEventHandler.pipe(receivingEventHandler);

        var exampleEvent = {};
        receivingEventHandler.on('boom', function(receivedEvent) {
            t.equal(receivedEvent, exampleEvent, 'eventHandler.pipe should forward all events to downstream eventHandlers');
        });
        emittingEventHandler.emit('boom', exampleEvent);

        var pipedEventHandler = new EventHandler();
        var returnValue = eventHandler.pipe(pipedEventHandler);
        t.equal(returnValue, pipedEventHandler, 'eventHandler.pipe should be chainable');
    });

    t.test('unpipe method', function(t) {
        t.plan(2);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.unpipe, 'function', 'eventHandler.unpipe should be a function');

        var receivingEventHandler = new EventHandler();
        var emittingEventHandler = new EventHandler();

        emittingEventHandler.pipe(receivingEventHandler);
        emittingEventHandler.unpipe(receivingEventHandler);

        receivingEventHandler.on('boom', function() {
            t.fail('eventHandler.unpipe should reverse eventHandler.pipe');
        });

        emittingEventHandler.emit('boom');

        var eventHandler2 = new EventHandler();
        eventHandler.pipe(eventHandler2);
        var returnValue = eventHandler.unpipe(eventHandler2);
        t.equal(returnValue, eventHandler2, 'eventHandler.unpipe should be chainable');
    });

    t.test('emit method', function(t) {
        t.plan(3);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.emit, 'function', 'eventHandler.emit should be a function');

        var exampleEvent = {};

        eventHandler.on('boom', function(receivedEvent) {
            t.equal(receivedEvent, exampleEvent, 'eventHandler.emit listener function should receive emitted event');
        });

        eventHandler.emit('boom', exampleEvent);

        var returnValue = eventHandler.emit('test', {});
        t.equal(returnValue, eventHandler, 'eventHandler.emit should be chainable');
    });

    t.test('trigger method', function(t) {
        t.plan(2);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.trigger, 'function', 'eventHandler.trigger should be a function');
        t.equal(eventHandler.trigger, eventHandler.emit, 'eventHandler.trigger should be an alias of eventHandler.emit');
    });

    t.test('on method', function(t) {
        t.plan(5);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.on, 'function', 'eventHandler.on should be a function');

        var events = [];

        for (var i = 0; i < 3; i++) {
            events[i] = {};
            eventHandler.on('event' + i, t.equal.bind(t, events[i]));
        }

        for (i = 0; i < 3; i++) {
            eventHandler.emit('event' + i, events[i]);
        }

        var returnValue = eventHandler.on('test', function() {});
        t.equal(returnValue, eventHandler, 'eventHandler.on should be chainable');
    });

    t.test('addListener method', function(t) {
        t.plan(2);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.addListener, 'function', 'eventHandler.addListener should be a function');
        t.equal(eventHandler.addListener, eventHandler.on, 'eventHandler.addListener should be an alias of eventHandler.on');
    });

    t.test('subscribe method', function(t) {
        t.plan(3);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.subscribe, 'function', 'eventHandler.subscribe should be a function');

        var fromEventHandler = new EventHandler();
        var toEventHandler = new EventHandler();
        toEventHandler.subscribe(fromEventHandler);

        var exampleEvent = {};
        toEventHandler.on('boom', function(actualEvent) {
            t.equal(actualEvent, exampleEvent, 'eventHandler.subscribe should receive all events emitted on subscribed eventHandlers');
        });
        fromEventHandler.emit('boom', exampleEvent);

        var returnValue = eventHandler.subscribe(new EventHandler());
        t.equal(returnValue, eventHandler, 'eventHandler.subscribe should be chainable');
    });

    t.test('unsubscribe method', function(t) {
        t.plan(2);
        var eventHandler = new EventHandler();
        t.equal(typeof eventHandler.unsubscribe, 'function', 'eventHandler.unsubscribe should be a function');

        var fromEventHandler = new EventHandler();
        var toEventHandler = new EventHandler();

        fromEventHandler.on('boom', function() {
            t.fail('eventHandler.unsubscribe should reverse eventHandler.subscribe');
        });

        fromEventHandler.subscribe(toEventHandler);
        fromEventHandler.unsubscribe(toEventHandler);
        toEventHandler.emit('boom');

        var returnValue = eventHandler.unsubscribe(new EventHandler());
        t.equal(returnValue, eventHandler, 'eventHandler.unsubscribe should be chainable');
    });
});
