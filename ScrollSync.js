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
     * @param {function} legacyGetter position getter function (deprecated)
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.direction] Pay attention to x changes (ScrollSync.DIRECTION_X),
     *   y changes (ScrollSync.DIRECTION_Y) or both (undefined)
     * @param {Number} [options.minimumEndSpeed] End speed calculation floors at this number, in pixels per ms
     * @param {boolean} [options.rails] whether to snap position calculations to nearest axis
     * @param {Number | Array.Number} [options.scale] scale outputs in by scalar or pair of scalars
     * @param {Number} [options.stallTime] reset time for velocity calculation in ms
     */
    function ScrollSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        this.options = {
            direction: undefined,
            minimumEndSpeed: Infinity,
            rails: false,
            scale: 1,
            stallTime: 50,
            lineHeight: 40
        };

        if (options) this.setOptions(options);
        else this.setOptions(this.options);

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            slip     : true
        };

        this.input = new EventHandler();
        this.output = new EventHandler();

        EventHandler.setInputHandler(this, this.input);
        EventHandler.setOutputHandler(this, this.output);

        this._prevTime = undefined;
        this._prevVel = undefined;
        this.input.on('mousewheel', _handleMove.bind(this));
        this.input.on('wheel', _handleMove.bind(this));
        this.inProgress = false;

        this._loopBound = false;
    }

    ScrollSync.DIRECTION_X = 0;
    ScrollSync.DIRECTION_Y = 1;

    function _newFrame() {
        var now = Date.now();
        if (this.inProgress && now - this._prevTime > this.options.stallTime) {
            var pos = (this.options.direction === undefined)
                ? this._legacyPositionGetter ? this._legacyPositionGetter : [0,0]
                : this._legacyPositionGetter ? this._legacyPositionGetter : 0;

            this.inProgress = false;
            var finalVel = 0;

            if (Math.abs(this._prevVel) >= this.options.minimumEndSpeed) finalVel = this._prevVel;

            var payload = this._payload;
            payload.position = pos;
            payload.velocity = finalVel;
            payload.slip = true;

            this.output.emit('end', payload);
        }
    }

    function _handleMove(event) {
        event.preventDefault();
        if (!this.inProgress) {
            this.inProgress = true;
            this.output.emit('start', {slip: true});
            if (!this._loopBound) {
                Engine.on('prerender', _newFrame.bind(this));
                this._loopBound = true;
            }
        }

        var prevTime = this._prevTime || Date.now();
        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

        if (event.deltaMode === 1) { // units in lines, not pixels
            diffX *= this.options.lineHeight;
            diffY *= this.options.lineHeight;
        }

        var currTime = Date.now();

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, 8); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var prevPos;
        var scale = this.options.scale;
        var nextPos;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollSync.DIRECTION_X) {
            prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
            nextDelta = scale * diffX;
            nextPos = prevPos + nextDelta;
            nextVel = scale * velX;
        }
        else if (this.options.direction === ScrollSync.DIRECTION_Y) {
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
        payload.slip     = true;

        this.output.emit('update', payload);

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
