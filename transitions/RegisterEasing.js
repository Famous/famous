define(function(require, exports, module) {
    var Easing = require('./Easing');
    var TweenTransition = require('./TweenTransition');

    /**
     * Helper function to register easing curves globally in an application.
     * To use this, all you must do is require this in.
     *
     * @example
     *  // Anywhere in your application, typically in app.js
     *  var RegisterEasing = require('registries/Easing');
     *
     *  // Allows transitions as follows:
     *  myModifier.setTransform(Transform.identity, {
     *    curve: 'outExpo', // as a string, not direct reference to Easing.outExpo.
     *    duration: 500
     *  });
     *
     * @class RegisterEasing
     * @protected
     *
     */
    function getKeys(obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    function getAvailableTransitionCurves() {
        var keys = getKeys(Easing);
        var curves = {};
        for (var i = 0; i < keys.length; i++) {
            curves[keys[i]] = Easing[keys[i]];
        }
        return curves;
    }

    function registerKeys () {
        var curves = getAvailableTransitionCurves();
        for (var key in curves) {
            TweenTransition.registerCurve(key, curves[key]);
        }
    }

    registerKeys();
});
