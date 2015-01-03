define(function(require, exports, module) {
    function listener(event) {
        event.stopPropagation();
        return false;
    }

    var eventNames = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];

    function mute(eventName) {
        window.addEventListener(eventName, listener, true);
    }

    function unmute(eventName) {
        window.removeEventListener(eventName, listener, true);
    }

    function enable() {
        eventNames.forEach(mute);
    }

    function disable() {
        eventNames.forEach(unmute);
    }

    module.exports = {
        enable: enable,
        disable: disable
    };

    /* TODO Remove initial enable call when deprecation is complete */
    enable();
});
