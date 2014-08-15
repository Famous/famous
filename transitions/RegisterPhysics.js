define(function(require, exports, module) {
    var Transitionable   = require('./Transitionable');
    var SpringTransition = require('./SpringTransition');
    var SnapTransition   = require('./SnapTransition');
    var WallTransition   = require('./WallTransition');

    Transitionable.registerMethod('spring', SpringTransition);
    Transitionable.registerMethod('snap', SnapTransition);
    Transitionable.registerMethod('wall', WallTransition);
});
