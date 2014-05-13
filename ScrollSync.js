/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Engine = require('famous/core/Engine');

    /**
     * Handles piped in mousewheel events.
     *   Emits 'start', 'update', and 'end' events with payloads including:
     *   delta: change since last position,
     *   position: accumulated deltas,
     *   velocity: speed of change in pixels per ms,
     *   slip: true (unused).
     *
     *   Can be used as delegate of GenericSync.
     *
     * @class ScrollSync
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.direction] Pay attention to x changes (ScrollSync.DIRECTION_X),
     *   y changes (ScrollSync.DIRECTION_Y) or both (undefined)
     * @param {Number} [options.minimumEndSpeed] End speed calculation floors at this number, in pixels per ms
     * @param {boolean} [options.rails] whether to snap position calculations to nearest axis
     * @param {Number | Array.Number} [options.scale] scale outputs in by scalar or pair of scalars
     * @param {Number} [options.stallTime] reset time for velocity calculation in ms
     */
    function ScrollSync(options) {
        this.options = Object.create(ScrollSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            slip     : true
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._position = (this.options.direction === undefined) ? [0,0] : 0;
        this._prevTime = undefined;
        this._prevVel = undefined;
        this._eventInput.on('mousewheel', _handleMove.bind(this));
        this._eventInput.on('wheel', _handleMove.bind(this));
        this._inProgress = false;
        this._loopBound = false;
    }

    ScrollSync.DEFAULT_OPTIONS = {
        direction: undefined,
        minimumEndSpeed: Infinity,
        rails: false,
        scale: 1,
        stallTime: 50,
        lineHeight: 40
    };

    ScrollSync.DIRECTION_X = 0;
    ScrollSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    var _now = Date.now;

    function _newFrame() {
        if (this._inProgress && (_now() - this._prevTime) > this.options.stallTime) {
            this._position = (this.options.direction === undefined) ? [0,0] : 0;
            this._inProgress = false;

            var finalVel = (Math.abs(this._prevVel) >= this.options.minimumEndSpeed)
                ? this._prevVel
                : 0;

            var payload = this._payload;
            payload.position = this._position;
            payload.velocity = finalVel;
            payload.slip = true;

            this._eventOutput.emit('end', payload);
        }
    }

    function _handleMove(event) {
        event.preventDefault();

        if (!this._inProgress) {
            this._inProgress = true;

            payload = this._payload;
            payload.slip = true;
            payload.position = this._position;
            payload.clientX = event.clientX;
            payload.clientY = event.clientY;
            payload.offsetX = event.offsetX;
            payload.offsetY = event.offsetY;
            this._eventOutput.emit('start', payload);
            if (!this._loopBound) {
                Engine.on('prerender', _newFrame.bind(this));
                this._loopBound = true;
            }
        }

        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

        if (event.deltaMode === 1) { // units in lines, not pixels
            diffX *= this.options.lineHeight;
            diffY *= this.options.lineHeight;
        }

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === ScrollSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;
        payload.slip     = true;

        this._eventOutput.emit('update', payload);

        this._prevTime = currTime;
        this._prevVel = nextVel;
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    ScrollSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.minimimEndSpeed] If final velocity smaller than this, round down to 0.
     * @param {Number} [options.stallTime] ms of non-motion before 'end' emitted
     * @param {Number} [options.rails] whether to constrain to nearest axis.
     * @param {Number} [options.direction] ScrollSync.DIRECTION_X, DIRECTION_Y -
     *    pay attention to one specific direction.
     * @param {Number} [options.scale] constant factor to scale velocity output
     */
    ScrollSync.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.minimumEndSpeed !== undefined) this.options.minimumEndSpeed = options.minimumEndSpeed;
        if (options.rails !== undefined) this.options.rails = options.rails;
        if (options.scale !== undefined) this.options.scale = options.scale;
        if (options.stallTime !== undefined) this.options.stallTime = options.stallTime;
    };

    module.exports = ScrollSync;
});
