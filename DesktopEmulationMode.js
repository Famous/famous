define(function(require, exports, module) {
    var hasTouch = 'ontouchstart' in window;

    function kill(type) {
        window.addEventListener(type, function(event) {
            event.stopPropagation();
            return false;
        }, true);
    }

    if (hasTouch) {
        kill('mousedown');
        kill('mousemove');
        kill('mouseup');
        kill('mouseleave');
    }
});
