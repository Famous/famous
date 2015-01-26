var test   = require('tape');
var Easing = require('../../../src/transitions/Easing');

test('Easing', function(t) {
    var expectedMethods = ['inBack', 'inBounce', 'inCirc', 'inCubic', 'inElastic', 'inExpo', 'inOutBack', 'inOutBounce', 'inOutCirc', 'inOutCubic', 'inOutElastic', 'inOutExpo', 'inOutQuad', 'inOutQuart', 'inOutQuint', 'inOutSine', 'inQuad', 'inQuart', 'inQuint', 'inSine', 'outBack', 'outBounce', 'outCirc', 'outCubic', 'outElastic', 'outExpo', 'outQuad', 'outQuart', 'outQuint', 'outSine'];

    for (var i = 0; i < expectedMethods.length; i++) {
        var methodName = expectedMethods[i];
        t.equal(typeof Easing[methodName], 'function', 'Easing.' + methodName + ' should be a function');

        t.equal(Math.round(Easing[methodName](0)*1000)/1000, 0, 'Easing.' + methodName + ' should start with 0');
        t.equal(Math.round(Easing[methodName](1)*1000)/1000, 1, 'Easing.' + methodName + ' should end with 1');
    }

    t.end();
});
