var test         = require('tape');
var Engine       = require('../../../src/core/Engine');
var Context      = require('../../../src/core/Context');
var EventHandler = require('../../../src/core/EventHandler');

test('Engine', function(t) {
	t.test('pipe and unpipe method', function(t) {
		t.plan(3);
		t.equal(typeof Engine.pipe, 'function', 'Engine.pipe should be a function');
		t.equal(typeof Engine.unpipe, 'function', 'Engine.unpipe should be a function');

		var eventHandler = new EventHandler();
		eventHandler.on('prerender', function() {
			t.pass('Engine should pipe prerender event through all downstream eventHandlers');
			Engine.unpipe(eventHandler);
		});

		Engine.pipe(eventHandler);
	});

	t.test('on method', function(t) {
		t.equal(typeof Engine.on, 'function', 'Engine.on should be a function');

		Engine.on('blabla', function() {
			t.pass('Engine.on should invoke function when event is has been emitted');
		});

		Engine.emit('blabla');

		t.end();
	});

	t.test('emit method', function(t) {
		t.equal(typeof Engine.emit, 'function', 'Engine.emit should be a function');

		t.test('prerender and postrender event', function(t) {
			t.plan(3);
			var invokedPrerender = false;
			var invokedPostrender = false;
			var onPrerender = function() {
				if (invokedPrerender) return;
				t.pass('Engine should emit \'prerender\' event');
				invokedPrerender = true;
				Engine.removeListener(onPrerender);
			};
			var onPostrender = function() {
				if (invokedPostrender) return;
				t.pass('Engine should emit \'postrender\' event');
				t.ok(invokedPrerender, 'Engine should emit prerender event before postrender event');
				invokedPostrender = true;
				Engine.removeListener(onPostrender);
			};
			Engine.on('prerender', onPrerender);
			Engine.on('postrender', onPostrender);
		});

		t.plan('resize event', function(t) {
			t.plan(1);
			var onresize = function() {
				t.pass('Engine should emit resize event on window resize');
				Engine.removeListener(onresize);
			};
			Engine.on('resize', onresize);
			window.onresize();
		});

		t.end();
	});

	t.test('removeListener method', function(t) {
		t.equal(typeof Engine.removeListener, 'function', 'Engine.removeListener should be a function');
		t.end();
	});

	t.test('getFPS method', function(t) {
		t.equal(typeof Engine.getFPS, 'function', 'Engine.getFPS should be a function');

		t.equal(typeof Engine.getFPS(), 'number', 'Engine.getFPS should return number');
		t.end();
	});

	// t.test('setFPSCap method', function(t) {
	// 	t.plan(2);
	// 	t.equal(typeof Engine.setFPSCap, 'function', 'Engine.setFPSCap should be a function');

	// 	Engine.setFPSCap(10);

	// 	setTimeout(function() {
	// 		t.ok((10 - Engine.getFPS()) < 3, 'Engine.setFPSCap should set the maximum framerate of what Engine.getFPS() returns');
	// 		Engine.removeFPSCap();
	// 	}, 1000);
	// });

	// t.test('removeFPSCap method', function(t) {
	// 	t.plan(1);
	// 	Engine.setFPSCap(10);
	// 	setTimeout(function() {
	// 		Engine.removeFPSCap();
	// 		setTimeout(function() {
	// 			t.notEqual(Engine.getFPS(), 10, 'Engine.removeFPSCap should remove previously set FPS cap');
	// 		}, 1000);
	// 	}, 1000);
	// });

	t.test('getOptions method', function(t) {
		t.equal(typeof Engine.getOptions, 'function', 'Engine.getOptions should be a function');
		Engine.setOptions({ bla: 'blub' });
		t.equal(Engine.getOptions().bla, 'blub', 'Engine.getOptions should return previously via setOptions set options');
		t.end();
	});

	t.test('setOptions method', function(t) {
		t.equal(typeof Engine.setOptions, 'function', 'Engine.setOptions should be a function');

		t.doesNotThrow(function() {
			Engine.setOptions({ bla: 'blub' });
		});

		t.end();
	});

	t.test('createContext method', function(t) {
		t.equal(typeof Engine.createContext, 'function', 'Engine.createContext should be a function');

		var c1 = Engine.createContext();
		t.ok(c1 instanceof Context, 'Engine.createContext should return Context');

		var el = document.createElement('div');
		var c2 = new Context(el);
		t.ok(c2 instanceof Context, 'Engine.createContext should return Context when being passed a DOM element');

		Engine.deregisterContext(c1);
		Engine.deregisterContext(c2);

		t.end();
	});

	t.test('registerContext method', function(t) {
		t.equal(typeof Engine.registerContext, 'function', 'Engine.registerContext should be a function');

		// Context is private. The only way to get an instance of Context is through the Engine.

		var context = Engine.createContext();
		t.equal(Engine.getContexts().length, 1, 'Engine.registerContext should result into one more context being available through getContexts()');

		Engine.deregisterContext(context);
		t.equal(Engine.getContexts().length, 0, 'Deregistering the context in order to obtain an instance of Context without using the private constructor');

		Engine.registerContext(context);
		t.equal(Engine.getContexts().length, 1, 'Engine.registerContext should result into one more context being available through getContexts()');

		Engine.deregisterContext(context);

		t.end();
	});

	t.test('deregisterContext method', function(t) {
		t.equal(typeof Engine.deregisterContext, 'function', 'Engine.deregisterContext should be a function');

		var context = Engine.createContext();
		t.equal(Engine.getContexts().length, 1, 'Engine.deregisterContext needs one context before it can be deregistered');

		Engine.deregisterContext(context);
		t.equal(Engine.getContexts().length, 0, 'Engine.deregisterContext should result into one less context to be returned by getContexts');

		t.end();
	});

	t.test('getContexts method', function(t) {
		t.equal(typeof Engine.getContexts, 'function', 'Engine.getContexts should be a function');

		var c1 = Engine.createContext();
		var c2 = Engine.createContext();
		var c3 = Engine.createContext();

		t.equal(Engine.getContexts()[0], c1);
		t.equal(Engine.getContexts()[1], c2);
		t.equal(Engine.getContexts()[2], c3);

		Engine.deregisterContext(c1);
		Engine.deregisterContext(c2);
		Engine.deregisterContext(c3);

		t.end();
	});

	t.test('nextTick method', function(t) {
		t.plan(2);
		t.equal(typeof Engine.nextTick, 'function', 'Engine.nextTick should be a function');

		Engine.nextTick(function() {
			t.pass('Engine.nextTick invoked function');
		});
	});

	t.test('defer method', function(t) {
		t.plan(2);
		t.equal(typeof Engine.defer, 'function', 'Engine.defer should be a function');

		Engine.defer(function() {
			t.pass('Engine.nextTick invoked function');
		});
	});
});
