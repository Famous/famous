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

    /**
     * Handles piped in mouse drag events. Outputs an object with two
     *   properties, position and velocity.
     *   Emits 'start', 'update' and 'end' events with DOM event passthroughs,
     *   with position, velocity, and a delta key.
     * @class MouseSync
     * @constructor
     * @param {function} legacyGetter position getter object (deprecated)
     * @param {Object} options default options overrides
     */
    function MouseSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        this.options =  {
            direction: undefined,
            rails: false,
            scale: 1,
            stallTime: 50,
            propogate: true  //events piped to document on mouseleave
        };

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            offsetX  : undefined,
            offsetY  : undefined
        };

        if (options) this.setOptions(options);
        else this.setOptions(this.options);

        this.input = new EventHandler();
        this.output = new EventHandler();

        EventHandler.setInputHandler(this, this.input);
        EventHandler.setOutputHandler(this, this.output);

        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._prevVel = undefined;

        this.input.on('mousedown', _handleStart.bind(this));
        this.input.on('mousemove', _handleMove.bind(this));
        this.input.on('mouseup', _handleEnd.bind(this));

        if (this.options.propogate) this.input.on('mouseleave', _handleLeave.bind(this));
        else this.input.on('mouseleave', _handleEnd.bind(this));
    }

    MouseSync.DIRECTION_X = 0;
    MouseSync.DIRECTION_Y = 1;

    function _clearPayload() {
        var payload = this._payload;
        payload.delta    = null;
        payload.position = null;
        payload.velocity = null;
        payload.clientX  = undefined;
        payload.clientY  = undefined;
        payload.offsetX  = undefined;
        payload.offsetY  = undefined;
    }

    function _handleStart(event) {
        event.preventDefault(); // prevent drag
        _clearPayload.call(this);

        var x = event.clientX;
        var y = event.clientY;

        this._prevCoord = [x, y];
        this._prevTime = Date.now();
        this._prevVel = (this.options.direction !== undefined) ? 0 : [0, 0];

        var payload = this._payload;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this.output.emit('start', payload);
    }

    function _handleMove(event) {
        if (!this._prevCoord) return;

        var prevCoord = this._prevCoord;
        var prevTime = this._prevTime;

        var x = event.clientX;
        var y = event.clientY;

        var currCoord = [x, y];

        var currTime = Date.now();

        var diffX = currCoord[0] - prevCoord[0];
        var diffY = currCoord[1] - prevCoord[1];

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

        if (this.options.direction === MouseSync.DIRECTION_X) {
            prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
            nextDelta = scale * diffX;
            nextPos = prevPos + nextDelta;
            nextVel = scale * velX;
        }
        else if (this.options.direction === MouseSync.DIRECTION_Y) {
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
        payload.clientX  = x;
        payload.clientY  = y;
        payload.offsetX  = event.offsetX;
        payload.offsetY  = event.offsetY;

        this.output.emit('update', payload);

        this._prevCoord = currCoord;
        this._prevTime = currTime;
        this._prevVel = nextVel;
    }

    function _handleEnd(event) {
        if (!this._prevCoord) return;

        var prevTime = this._prevTime;
        var currTime = Date.now();

        if (currTime - prevTime > this.options.stallTime)
            this._prevVel = (this.options.direction === undefined) ? [0, 0] : 0;

        var payload = this._payload;
        payload.velocity = this._prevVel;
        payload.clientX  = event.clientX;
        payload.clientY  = event.clientY;
        payload.offsetX  = event.offsetX;
        payload.offsetY  = event.offsetY;

        this.output.emit('end', payload);

        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._prevVel = undefined;
    }

    // handle 'mouseup' and 'mousemove'
    function _handleLeave(event) {
        if (!this._prevCoord) return;

        var boundMove = _handleMove.bind(this);
        var boundEnd = function(event) {
            _handleEnd.call(this, event);
            document.removeEventListener('mousemove', boundMove);
            document.removeEventListener('mouseup', boundEnd);
        }.bind(this);

        document.addEventListener('mousemove', boundMove);
        document.addEventListener('mouseup', boundEnd);
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    MouseSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.stallTime] ms update gap until we consider velocity to be 0.
     * @param {Number} [options.rails] whether to constrain to nearest axis.
     * @param {Number} [options.direction] MouseSync.DIRECTION_X, DIRECTION_Y -
     *    pay attention only to one specific direction.
     * @param {Number} [options.scale] constant factor to scale velocity output
     */
    MouseSync.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.rails !== undefined) this.options.rails = options.rails;
        if (options.scale !== undefined) this.options.scale = options.scale;
        if (options.stallTime !== undefined) this.options.stallTime = options.stallTime;
        if (options.propogate !== undefined) this.options.propogate = options.propogate;
    };

    module.exports = MouseSync;
});
