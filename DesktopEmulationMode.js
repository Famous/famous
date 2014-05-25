define(function(require, exports, module) {
    var isTouch = 'ontouchstart' in window;

    function kill(type){
        window.addEventListener(type, function(event){
            event.stopPropagation();
            return false;
        }, true);
    }

    if (isTouch) {
        kill('mousedown');
        kill('mousemove');
        kill('mouseup');
        kill('mouseleave');
    }
});