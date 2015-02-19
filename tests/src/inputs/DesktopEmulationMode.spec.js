
var test = require('tape');

// PhantomJS doesn't support MouseEvent
function _createEvent(eventName) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(eventName, true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    return evt;
}

function enable() {
    require('../../../src/inputs/DesktopEmulationMode');
}

var EVENT_NAMES = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];

test('DesktopEmulationMode', function(t) {
    t.test('default', function(t) {
        t.plan(4);
        var element = document.createElement('div');
        document.body.appendChild(element);

        var listeners = [];

        EVENT_NAMES.forEach(function(eventName) {
            var listener = t.pass.bind(t, eventName);
            listeners.push(listener);
            window.addEventListener(eventName, listener);
        });

        EVENT_NAMES.forEach(function(eventName) {
            element.dispatchEvent(_createEvent(eventName));
        });

        EVENT_NAMES.forEach(function(eventName, i) {
            window.removeEventListener(eventName, listeners[i]);
        });
    });

    t.test('enabled', function(t) {
        window.ontouchstart = true;
        var element = document.createElement('div');
        document.body.appendChild(element);

        enable();

        var listeners = [];

        EVENT_NAMES.forEach(function(eventName) {
            var listener = t.fail.bind(t, eventName);
            listeners.push(listener);
            document.body.addEventListener(eventName, listener);
        });

        EVENT_NAMES.forEach(function(eventName) {
            document.body.dispatchEvent(_createEvent(eventName));
        });

        EVENT_NAMES.forEach(function(eventName, i) {
            document.body.removeEventListener(eventName, listeners[i]);
        });

        t.end();
        window.ontouchstart = false;
    });
});
