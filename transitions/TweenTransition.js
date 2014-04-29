/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {

    /**
     *
     * A state maintainer for a smooth transition between
     *    numerically-specified states.  Example numeric states include floats or
     *    Transfornm objects.
     *
     *    An initial state is set with the constructor or set(startValue). A
     *    corresponding end state and transition are set with set(endValue,
     *    transition). Subsequent calls to set(endValue, transition) begin at
     *    the last state. Calls to get(timestamp) provide the _interpolated state
     *    along the way.
     *
     *   Note that there is no event loop here - calls to get() are the only way
     *    to find out state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class TweenTransition
     * @constructor
     *
     * @param {Object} options TODO
     *    beginning state
     */
    function TweenTransition(options) {
        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._startTime = 0;
        this._startValue = 0;
        this._updateTime = 0;
        this._endValue = 0;
        this._curve = undefined;
        this._duration = 0;
        this._active = false;
        this._callback = undefined;
        this.state = 0;
        this.velocity = undefined;
    }

    /**
     * Transition curves mapping independent variable t from domain [0,1] to a
     *    range within [0,1]. Includes functions 'linear', 'easeIn', 'easeOut',
     *    'easeInOut', 'easeOutBounce', 'spring'.
     *
     * @property {object} Curve
     * @final
     */
    TweenTransition.Curves = {
        linear: function(t) {
            return t;
        },
        easeIn: function(t) {
            return t*t;
        },
        easeOut: function(t) {
            return t*(2-t);
        },
        easeInOut: function(t) {
            if (t <= 0.5) return 2*t*t;
            else return -2*t*t + 4*t - 1;
        },
        easeOutBounce: function(t) {
            return t*(3 - 2*t);
        },
        spring: function(t) {
            return (1 - t) * Math.sin(6 * Math.PI * t) + t;
        }
    };

    TweenTransition.SUPPORTS_MULTIPLE = true;
    TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.Curves.linear,
        duration: 500,
        speed: 0 /* considered only if positive */
    };

    var registeredCurves = {};

    /**
     * Add "unit" curve to internal dictionary of registered curves.
     *
     * @method registerCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @param {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     * @return {boolean} false if key is taken, else true
     */
    TweenTransition.registerCurve = function registerCurve(curveName, curve) {
        if (!registeredCurves[curveName]) {
            registeredCurves[curveName] = curve;
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Remove object with key "curveName" from internal dictionary of registered
     *    curves.
     *
     * @method unregisterCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {boolean} false if key has no dictionary value
     */
    TweenTransition.unregisterCurve = function unregisterCurve(curveName) {
        if (registeredCurves[curveName]) {
            delete registeredCurves[curveName];
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Retrieve function with key "curveName" from internal dictionary of
     *    registered curves. Default curves are defined in the
     *    TweenTransition.Curves array, where the values represent
     *    unitCurve functions.
     *
     * @method getCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurve = function getCurve(curveName) {
        return registeredCurves[curveName];
    };

    /**
     * Retrieve all available curves.
     *
     * @method getCurves
     *
     * @static
     *
     * @return {object} curve functions of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurves = function getCurves() {
        return registeredCurves;
    };

     // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }

    function _clone(obj) {
        if (obj instanceof Object) {
            if (obj instanceof Array) return obj.slice(0);
            else return Object.create(obj);
        }
        else return obj;
    }

    // Fill in missing properties in "transition" with those in defaultTransition, and
    //   convert internal named curve to function object, returning as new
    //   object.
    function _normalize(transition, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        if (defaultTransition.duration) result.duration = defaultTransition.duration;
        if (defaultTransition.speed) result.speed = defaultTransition.speed;
        if (transition instanceof Object) {
            if (transition.duration !== undefined) result.duration = transition.duration;
            if (transition.curve) result.curve = transition.curve;
            if (transition.speed) result.speed = transition.speed;
        }
        if (typeof result.curve === 'string') result.curve = TweenTransition.getCurve(result.curve);
        return result;
    }

    /**
     * Set internal options, overriding any default options.
     *
     * @method setOptions
     *
     *
     * @param {Object} options options object
     * @param {Object} [options.curve] function mapping [0,1] to [0,1] or identifier
     * @param {Number} [options.duration] duration in ms
     * @param {Number} [options.speed] speed in pixels per ms
     */
    TweenTransition.prototype.setOptions = function setOptions(options) {
        if (options.curve !== undefined) this.options.curve = options.curve;
        if (options.duration !== undefined) this.options.duration = options.duration;
        if (options.speed !== undefined) this.options.speed = options.speed;
    };

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endValue
     *    end state to which we _interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    TweenTransition.prototype.set = function set(endValue, transition, callback) {
        if (!transition) {
            this.reset(endValue);
            if (callback) callback();
            return;
        }

        this._startValue = _clone(this.get());
        transition = _normalize(transition, this.options);
        if (transition.speed) {
            var startValue = this._startValue;
            if (startValue instanceof Object) {
                var variance = 0;
                for (var i in startValue) variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
                transition.duration = Math.sqrt(variance) / transition.speed;
            }
            else {
                transition.duration = Math.abs(endValue - startValue) / transition.speed;
            }
        }

        this._startTime = Date.now();
        this._endValue = _clone(endValue);
        this._startVelocity = _clone(transition.velocity);
        this._duration = transition.duration;
        this._curve = transition.curve;
        this._active = true;
        this._callback = callback;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startValue
     *    starting state
     * @param {number} startVelocity
     *    starting velocity
     */
    TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        this.state = _clone(startValue);
        this.velocity = _clone(startVelocity);
        this._startTime = 0;
        this._duration = 0;
        this._updateTime = 0;
        this._startValue = this.state;
        this._startVelocity = this.velocity;
        this._endValue = this.state;
        this._active = false;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     *
     * @returns {Number} velocity
     */
    TweenTransition.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    _interpolated to this point in time.
     */
    TweenTransition.prototype.get = function get(timestamp) {
        this.update(timestamp);
        return this.state;
    };

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity;
        var eps = 1e-7;
        var speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++)
                velocity[i] = speed * (current[i] - start[i]) / duration;
        }
        else velocity = speed * (current - start) / duration;
        return velocity;
    }

    function _calculateState(start, end, t) {
        var state;
        if (start instanceof Array) {
            state = [];
            for (var i = 0; i < start.length; i++)
                state[i] = _interpolate(start[i], end[i], t);
        }
        else state = _interpolate(start, end, t);
        return state;
    }

    /**
     * Update internal state to the provided timestamp. This may invoke the last
     *    callback and begin a new action.
     *
     * @method update
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     */
    TweenTransition.prototype.update = function update(timestamp) {
        if (!this._active) {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }
            return;
        }

        if (!timestamp) timestamp = Date.now();
        if (this._updateTime >= timestamp) return;
        this._updateTime = timestamp;

        var timeSinceStart = timestamp - this._startTime;
        if (timeSinceStart >= this._duration) {
            this.state = this._endValue;
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
            this._active = false;
        }
        else if (timeSinceStart < 0) {
            this.state = this._startValue;
            this.velocity = this._startVelocity;
        }
        else {
            var t = timeSinceStart / this._duration;
            this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
        }
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     *
     * @return {boolean}
     */
    TweenTransition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     *
     */
    TweenTransition.prototype.halt = function halt() {
        this.reset(this.get());
    };

    // Register all the default curves
    TweenTransition.registerCurve('linear', TweenTransition.Curves.linear);
    TweenTransition.registerCurve('easeIn', TweenTransition.Curves.easeIn);
    TweenTransition.registerCurve('easeOut', TweenTransition.Curves.easeOut);
    TweenTransition.registerCurve('easeInOut', TweenTransition.Curves.easeInOut);
    TweenTransition.registerCurve('easeOutBounce', TweenTransition.Curves.easeOutBounce);
    TweenTransition.registerCurve('spring', TweenTransition.Curves.spring);

    TweenTransition.customCurve = function customCurve(v1, v2) {
        v1 = v1 || 0; v2 = v2 || 0;
        return function(t) {
            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
        };
    };

    module.exports = TweenTransition;
});
