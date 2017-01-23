/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
define(function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');
    var SyncUtils = require('./SyncUtils');

    /**
     * Handles piped in mouse drag events. Outputs an object with the position delta from last frame, position from start,
     * current velocity averaged out over the velocitySampleLength (set via options), clientX, clientY, offsetX, and offsetY.
     *
     * Emits 'start', 'update' and 'end' events. Designed to be used either as a standalone MouseSync, or as part of a
     * GenericSync.
     *
     * @class MouseSync
     * @constructor
     *
     * @example
     *   var Surface = require('../core/Surface');
     *   var MouseSync = require('../inputs/MouseSync');
     *
     *   var surface = new Surface({ size: [100, 100] });
     *   var mouseSync = new MouseSync();
     *   surface.pipe(mouseSync);
     *
     *   mouseSync.on('start', function (e) { // react to start });
     *   mouseSync.on('update', function (e) { // react to update });
     *   mouseSync.on('end', function (e) { // react to end });
     *
     * @param [options] {Object}                An object of the following configurable options.
     * @param [options.clickThreshold] {Number} Absolute distance from click origin that will still trigger a click.
     * @param [options.direction] {Number}      Read from a particular axis. Valid options are: undefined, 0 or 1. 0 corresponds to x, and 1 to y. Default is undefined, which allows both x and y.
     * @param [options.rails] {Boolean}         Read from axis with the greatest differential.
     * @param [options.velocitySampleLength] {Number}  Number of previous frames to check velocity against.
     * @param [options.propogate] {Boolean}     Add a listener to document on mouseleave. This allows drag events to continue across the entire page.
     */
    function MouseSync(options) {
        this.options =  Object.create(MouseSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('mousedown', _handleStart.bind(this));
        this._eventInput.on('mousemove', _handleMove.bind(this));
        this._eventInput.on('mouseup', _handleEnd.bind(this));

        if (this.options.propogate) this._eventInput.on('mouseleave', _handleLeave.bind(this));
        else this._eventInput.on('mouseleave', _handleEnd.bind(this));

        if (this.options.clickThreshold) {
            window.addEventListener('click', function(event) {
                if (Math.sqrt(Math.pow(this._displacement[0], 2) + Math.pow(this._displacement[1], 2)) > this.options.clickThreshold) {
                    event.stopPropagation();
                }
            }.bind(this), true);
        }

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : 0,
            clientY  : 0,
            offsetX  : 0,
            offsetY  : 0
        };

        this._positionHistory = [];
        this._position = null;      // to be deprecated
        this._down = false;
        this._moved = false;
        this._displacement = [0,0];
        this._documentActive = false;
    }

    MouseSync.DEFAULT_OPTIONS = {
        clickThreshold: undefined,
        direction: undefined,
        rails: false,
        scale: 1,
        propogate: true,  // events piped to document on mouseleave
        velocitySampleLength: 10,
        timeSampleDuration: 400,
        preventDefault: true
    };

    MouseSync.DIRECTION_X = 0;
    MouseSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    /**
     *  Triggered by mousedown.
     *
     *  @method _handleStart
     *  @private
     */
    function _handleStart(event) {
        var delta;
        var velocity;
        if (this.options.preventDefault) event.preventDefault(); // prevent drag

        var x = event.clientX;
        var y = event.clientY;
        var currTime = Date.now();

        this._down = true;
        this._move = false;

        if (this.options.direction !== undefined) {
            this._position = 0;
            delta = 0;
            velocity = 0;
        }
        else {
            this._position = [0, 0];
            delta = [0, 0];
            velocity = [0, 0];
        }

        if (this.options.clickThreshold) {
            this._displacement = [0,0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        });
        this._eventOutput.emit('start', payload);
        this._documentActive = false;
    }

    /**
     *  Triggered by mousemove.
     *
     *  @method _handleMove
     *  @private
     */
    function _handleMove(event) {
        if (this._positionHistory.length === 0) return;
        var payload = calculatePayload.call(this, event);
        this._eventOutput.emit('update', payload);
        this._move = true;
    }

    /**
     *  Triggered by mouseup on the element or document body if propagation is enabled, or
     *  mouseleave if propagation is off.
     *
     *  @method _handleEnd
     *  @private
     */
    function _handleEnd(event) {
        if (!this._down) return;
        var payload = calculatePayload.call(this, event);
        this._eventOutput.emit('end', payload);
        this._down = false;
        this._move = false;
        this._positionHistory = [];
    }

    /**
     *  Switches the mousemove listener to the document body, if propagation is enabled.
     *  @method _handleLeave
     *  @private
     */
    function _handleLeave(event) {
        if (!this._down || !this._move) return;

        if (!this._documentActive) {
          var boundMove = _handleMove.bind(this);
          var boundEnd = function(event) {
              _handleEnd.call(this, event);
              document.removeEventListener('mousemove', boundMove);
              document.removeEventListener('mouseup', boundEnd);
          }.bind(this);
          document.addEventListener('mousemove', boundMove);
          document.addEventListener('mouseup', boundEnd);
          this._documentActive = true;
        }
    }

    /**
     *  Calculates the data to send to listeners.
     *  @method calculatePayload
     *  @private
     */
    function calculatePayload (event) {
        var payload = this._payload;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        var x = event.clientX;
        var y = event.clientY;

        var currTime = Date.now();

        var lastPos = this._positionHistory[this._positionHistory.length - 1];
        var diffX = (x * scale) - lastPos.clientPosition[0];
        var diffY = (y * scale) - lastPos.clientPosition[1];

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }
        if (this.options.direction === MouseSync.DIRECTION_X) {
            nextDelta = diffX;
            this._position += nextDelta;
        }
        else if (this.options.direction === MouseSync.DIRECTION_Y) {
            nextDelta = diffY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [diffX, diffY];
            this._position[0] += diffX;
            this._position[1] += diffY;
        }

        if (this.options.clickThreshold !== false) {
            this._displacement[0] += diffX;
            this._displacement[1] += diffY;
        }

        payload.delta    = nextDelta;
        payload.position = this._position;
        payload.clientX  = x;
        payload.clientY  = y;
        payload.offsetX  = event.offsetX;
        payload.offsetY  = event.offsetY;

        if (this._positionHistory.length === this.options.velocitySampleLength) {
            this._positionHistory.shift();
        }

        this._positionHistory.push({
            position: payload.position.slice ? payload.position.slice(0) : payload.position,
            clientPosition: [x, y],
            timestamp: currTime
        });

        // Calculate velocity
        var lastPositionHistory = SyncUtils.getTimeHistoryPosition(this._positionHistory, this.options.timeSampleDuration);
        var diffTime = Math.max(currTime - lastPositionHistory.timestamp, MINIMUM_TICK_TIME); // minimum tick time

        if (this.options.direction !== undefined) {
            nextVel = scale * (this._position - lastPositionHistory.position) / diffTime;
        }
        else {
            nextVel = [
                scale * (this._position[0] - lastPositionHistory.position[0]) / diffTime,
                scale * (this._position[1] - lastPositionHistory.position[1]) / diffTime
            ];
        }

        payload.velocity = nextVel;

        return payload;
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
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.propogate] {Boolean}  add listened to document on mouseleave
     */
    MouseSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    module.exports = MouseSync;
});
