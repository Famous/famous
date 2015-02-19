var test  = require('tape');
var Time  = require('../../helpers/Time');
Time.set(0);
var Touch = require('../../helpers/Touch');

// From the W3C spec:
// Some user agents implement an initTouchEvent method as part of the
// TouchEvent interface. When this method is available, scripts can use it
// to initialize the properties of a TouchEvent object, including its
// TouchList properties (which can be initialized with values returned
// from createTouchList). The initTouchEvent method is not yet
// standardized, but it may appear in some form in a future specification.

// For now, we're using CustomEvent for initializing touch events, since the
// API for dispatching TouchEvent is not (yet) widely supported (especially not)
// in Firefox.

require('../../../src/inputs/FastClick');

function emitTouchEvent(type, target, changedTouches) {
    var e = new CustomEvent('touch' + type, {
        bubbles: true,
        cancelable: true,
    });
    
    e.changedTouches = changedTouches.slice();
    target.dispatchEvent(e);
}

test('FastClick', function(t) {
    t.test('touchstart and touchend event', function(t) {
        t.plan(1);
        var target = document.createElement('div');
        document.body.appendChild(target);
        target.addEventListener('click', t.pass.bind('FastClick should emit click event'));
        var changedTouches = [Touch(1, 4, 1)];

        Time.set(1);
        emitTouchEvent('start', target, changedTouches);
        Time.set(2);
        emitTouchEvent('end', target, changedTouches);
    });

    t.test('clickThreshold', function(t) {
        t.plan(3);
        var target = document.createElement('div');
        document.body.appendChild(target);
        target.addEventListener('click', t.pass.bind('FastClick should have a clickThreshold of 300ms'));
        var changedTouches = [Touch(1, 4, 1)];

        // Edge case: Both events happen at the same time
        Time.set(1);
        emitTouchEvent('start', target, changedTouches);
        emitTouchEvent('end', target, changedTouches);

        Time.set(1);
        emitTouchEvent('start', target, changedTouches);
        Time.set(2);
        emitTouchEvent('end', target, changedTouches);

        Time.set(1);
        emitTouchEvent('start', target, changedTouches);
        Time.set(300);
        emitTouchEvent('end', target, changedTouches);

        // should not work
        Time.set(1);
        emitTouchEvent('start', target, changedTouches);
        Time.set(301);
        emitTouchEvent('end', target, changedTouches);
    });

    t.test('touchmove event', function(t) {
        t.test('clear potentialClicks', function(t) {
            var target = document.createElement('div');
            document.body.appendChild(target);

            target.addEventListener('click', t.fail.bind('FastClick should clear potentialClicks on touchmove'));

            Time.set(1);
            var changedTouches = [Touch(1, 4, 1)];
            emitTouchEvent('start', target, changedTouches);
            changedTouches = [];
            emitTouchEvent('move', target, changedTouches);
            emitTouchEvent('end', target, changedTouches);

            t.end();
        });

        t.test('emit click', function(t) {
            t.plan(1);
            var target = document.createElement('div');
            document.body.appendChild(target);

            target.addEventListener('click', t.pass.bind('FastClick should emit click event'));
            Time.set(2);
            var changedTouches = [Touch(1, 4, 1)];
            emitTouchEvent('start', target, changedTouches);
            emitTouchEvent('move', target, []);
            emitTouchEvent('end', target, changedTouches);
        });
    });
});