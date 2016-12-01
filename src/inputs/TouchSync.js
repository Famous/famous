/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
define(function(require, exports, module) {
    var TouchTracker = require('./TouchTracker');
    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Handles piped in touch events. Emits 'start', 'update', and 'events'
     *   events with delta, position, velocity, acceleration, clientX, clientY, count, and touch id.
     *   Useful for dealing with inputs on touch devices. Designed to be used either as standalone, or
     *   included in a GenericSync.
     *
     * @class TouchSync
     * @constructor
     *
     * @example
     *   var Surface = require('../core/Surface');
     *   var TouchSync = require('../inputs/TouchSync');
     *
     *   var surface = new Surface({ size: [100, 100] });
     *   var touchSync = new TouchSync();
     *   surface.pipe(touchSync);
     *
     *   touchSync.on('start', function (e) { // react to start });
     *   touchSync.on('update', function (e) { // react to update });
     *   touchSync.on('end', function (e) { // react to end });*
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.velocitySampleLength] {Number}  Number of previous frames to check velocity against.
     * @param [options.scale] {Number}       constant factor to scale velocity output
     * @param [options.touchLimit] {Number}  touchLimit upper bound for emitting events based on number of touches
     * @param [options.rotateAngle] {Number}  rotateAngle Angle on z axis rotate to translate touches to
     */
    function TouchSync(options) {
        this.options =  Object.create(TouchSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker({
            touchLimit: this.options.touchLimit
        });

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', _handleStart.bind(this));
        this._touchTracker.on('trackmove', _handleMove.bind(this));
        this._touchTracker.on('trackend', _handleEnd.bind(this));

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            count    : 0,
            touch    : undefined
        };

        this._position = null; // to be deprecated
    }

    TouchSync.DEFAULT_OPTIONS = {
        direction: undefined,
        rails: false,
        touchLimit: 1,
        velocitySampleLength: 10,
        scale: 1,
        rotateAngle: false
    };

    TouchSync.DIRECTION_X = 0;
    TouchSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    /**
     *  Triggered by trackstart.
     *  @method _handleStart
     *  @private
     */
    function _handleStart(data) {
        var velocity;
        var delta;
        if (this.options.direction !== undefined){
            this._position = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            this._position = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touch = data.identifier;

        this._eventOutput.emit('start', payload);
    }

    /**
     *  Triggered by trackmove.
     *  @method _handleMove
     *  @private
     */
    function _handleMove(data) {
        var history = data.history;

        var currHistory = history[history.length - 1];
        var prevHistory = history[history.length - 2];

        var distantHistory = history[history.length - this.options.velocitySampleLength] ?
          history[history.length - this.options.velocitySampleLength] :
          history[history.length - 2];

        var distantTime = distantHistory.timestamp;
        var currTime = currHistory.timestamp;

        var diffX = currHistory.x - prevHistory.x;
        var diffY = currHistory.y - prevHistory.y;

        var velDiffX = currHistory.x - distantHistory.x;
        var velDiffY = currHistory.y - distantHistory.y;

        if (this.options.rotateAngle && typeof this.options.rotateAngle === 'number') {
            // Translate coordinates based on an absolute center of the screen
            var absoluteCenter = [window.innerWidth/2, window.innerHeight/2];

            var currPrime = _calcCoordsByAngle([currHistory.x, currHistory.y], this.options.rotateAngle, absoluteCenter);
            var prevPrime = _calcCoordsByAngle([prevHistory.x, prevHistory.y], this.options.rotateAngle, absoluteCenter);
            var distPrime = _calcCoordsByAngle([distantHistory.x, distantHistory.y], this.options.rotateAngle, absoluteCenter);

            diffX = currPrime.x - prevPrime.x;
            diffY = currPrime.y - prevPrime.y;

            velDiffX = currPrime.x - distPrime.x;
            velDiffY = currPrime.y - distPrime.y;

        }

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;

            if (Math.abs(velDiffX) > Math.abs(velDiffY)) velDiffY = 0;
            else velDiffX = 0;
        }

        var diffTime = Math.max(currTime - distantTime, MINIMUM_TICK_TIME);

        var velX = velDiffX / diffTime;
        var velY = velDiffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === TouchSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === TouchSync.DIRECTION_Y) {
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
        payload.clientX  = data.x;
        payload.clientY  = data.y;
        payload.count    = data.count;
        payload.touch    = data.identifier;

        this._eventOutput.emit('update', payload);
    }

    /**
     *  Triggered by trackend.
     *  @method _handleEnd
     *  @private
     */
    function _handleEnd(data) {
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    /**
     *  Takes a set of absolute coordinates
     *  as an array and an angle which
     *  determines a new set of absolute
     *  coordinates at the applied rotation.
     *  See: http://math.stackexchange.com/questions/384186/calculate-new-positon-of-rectangle-corners-based-on-angle
     *  @method _calcCoordsByAngle
     *  @param {Array} oldCoords An [x,y] set of coordinates
     *  @param {number} phi The angle to move by
     *  @param {Array} absoluteCenter The absolute center of the screen
     *  @return {Array} The newly converted coordinates
     */
    function _calcCoordsByAngle(oldCoords, phi, absoluteCenter) {
        oldCoords[0] = oldCoords[0] - absoluteCenter[0];
        oldCoords[1] = oldCoords[1] - absoluteCenter[1];

        var newCoords = {};
        var xPrime = (oldCoords[0] * Math.cos(-phi)) - (oldCoords[1] * Math.sin(-phi));
        var yPrime = (oldCoords[1] * Math.cos(-phi)) + (oldCoords[0] * Math.sin(-phi));

        newCoords.x = xPrime + absoluteCenter[0];
        newCoords.y = yPrime + absoluteCenter[1];

        return newCoords;
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    TouchSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
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
