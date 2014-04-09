/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var TouchTracker = require('./TouchTracker');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Handles piped in touch events. Emits 'start', 'update', and 'events'
     *   events with position, velocity, acceleration, and touch id.
     *   Useful for dealing with inputs on touch devices.
     *
     *
     * @class TouchSync
     * @constructor
     * @param {function} legacyGetter position getter function (deprecated)
     * @param {Object} options default options overrides
     */
    function TouchSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        this.output = new EventHandler();
        this.touchTracker = new TouchTracker();

        this.options = {
            direction: undefined,
            rails: false,
            scale: 1
        };

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            count    : 0,
            touch    : undefined
        };

        if (options) this.setOptions(options);
        else this.setOptions(this.options);

        EventHandler.setOutputHandler(this, this.output);
        EventHandler.setInputHandler(this, this.touchTracker);

        this.touchTracker.on('trackstart', _handleStart.bind(this));
        this.touchTracker.on('trackmove', _handleMove.bind(this));
        this.touchTracker.on('trackend', _handleEnd.bind(this));
    }

    TouchSync.DIRECTION_X = 0;
    TouchSync.DIRECTION_Y = 1;

    function _clearPayload() {
        var payload = this._payload;
        payload.position = null;
        payload.velocity = null;
        payload.clientX  = undefined;
        payload.clientY  = undefined;
        payload.count    = undefined;
        payload.touch    = undefined;
    }

    // handle 'trackstart'
    function _handleStart(data) {
        _clearPayload.call(this);

        var payload = this._payload;
        payload.count = data.count;
        payload.touch = data.identifier;

        this.output.emit('start', payload);
    }

    // handle 'trackmove'
    function _handleMove(data) {
        var history = data.history;
        var prevTime = history[history.length - 2].timestamp;
        var currTime = history[history.length - 1].timestamp;
        var prevTouch = history[history.length - 2].touch;
        var currTouch = history[history.length - 1].touch;

        var diffX = currTouch.pageX - prevTouch.pageX;
        var diffY = currTouch.pageY - prevTouch.pageY;

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, 8); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var prevPos;
        var nextPos;
        var nextVel;
        var nextDelta;

        if (this.options.direction === TouchSync.DIRECTION_X) {
            prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
            nextDelta = scale * diffX;
            nextPos = prevPos + nextDelta;
            nextVel = scale * velX;
        }
        else if (this.options.direction === TouchSync.DIRECTION_Y) {
            prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
            nextDelta = scale * diffY;
            nextPos = prevPos + nextDelta;
            nextVel = scale * velY;
        }
        else {
            prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : [0,0];
            nextDelta = [scale * diffX, scale * diffY];
            nextPos = [prevPos[0] + nextDelta[0], prevPos[1] + nextDelta[1]];
            nextVel = [scale * velX, scale * velY];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.position = nextPos;
        payload.velocity = nextVel;
        payload.clientX  = data.touch.clientX;
        payload.clientY  = data.touch.clientY;
        payload.count    = data.count;
        payload.touch    = data.touch.identifier;

        this.output.emit('update', payload);
    }

    // handle 'trackend'
    function _handleEnd(data) {
        var nextVel = (this.options.direction !== undefined) ? 0 : [0, 0];
        var history = data.history;
        var count = data.count;
        if (history.length > 1) {
            var prevTime = history[history.length - 2].timestamp;
            var currTime = history[history.length - 1].timestamp;
            var prevTouch = history[history.length - 2].touch;
            var currTouch = history[history.length - 1].touch;
            var diffX = currTouch.pageX - prevTouch.pageX;
            var diffY = currTouch.pageY - prevTouch.pageY;

            if (this.options.rails) {
                if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
                else diffX = 0;
            }

            var diffTime = Math.max(currTime - prevTime, 1); // minimum tick time
            var velX = diffX / diffTime;
            var velY = diffY / diffTime;
            var scale = this.options.scale;

            if (this.options.direction === TouchSync.DIRECTION_X) nextVel = scale * velX;
            else if (this.options.direction === TouchSync.DIRECTION_Y) nextVel = scale * velY;
            else nextVel = [scale * velX, scale * velY];
        }

        var payload = this._payload;
        payload.velocity = nextVel;
        payload.clientX  = data.clientX;
        payload.clientY  = data.clientY;
        payload.count    = count;
        payload.touch    = data.touch.identifier;

        this.output.emit('end', payload);
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.rails] whether to constrain to nearest axis.
     * @param {Number} [options.direction] TouchSync.DIRECTION_X, DIRECTION_Y -
     *    pay attention to one specific direction.
     * @param {Number} [options.scale] constant factor to scale velocity output
     */
    TouchSync.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.rails !== undefined) this.options.rails = options.rails;
        if (options.scale !== undefined) this.options.scale = options.scale;
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    TouchSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    module.exports = TouchSync;
});
