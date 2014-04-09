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
     * Helper to PinchSync, RotateSync, and ScaleSync.  Generalized handling of
     *   two-finger touch events.
     *   This class is meant to be overridden and not used directly.
     *
     * @class TwoFingerSync
     * @constructor
     * @param {function} legacyGetter position getter object (deprecated)
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function TwoFingerSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        this.options = {
            scale: 1
        };

        if (options) this.setOptions(options);
        else this.setOptions(this.options);

        this.input = new EventHandler();
        this.output = new EventHandler();

        EventHandler.setInputHandler(this, this.input);
        EventHandler.setOutputHandler(this, this.output);

        this.touchAEnabled = false;
        this.touchAId = 0;
        this.posA = null;
        this.timestampA = 0;
        this.touchBEnabled = false;
        this.touchBId = 0;
        this.posB = null;
        this.timestampB = 0;

        this.input.on('touchstart', this.handleStart.bind(this));
        this.input.on('touchmove', this.handleMove.bind(this));
        this.input.on('touchend', this.handleEnd.bind(this));
        this.input.on('touchcancel', this.handleEnd.bind(this));
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    TwoFingerSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.scale] scale velocity by this factor
     */
    TwoFingerSync.prototype.setOptions = function setOptions(options) {
        if (options.scale !== undefined) this.options.scale = options.scale;
    };

    // private
    TwoFingerSync.prototype.handleStart = function handleStart(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (!this.touchAEnabled) {
                this.touchAId = touch.identifier;
                this.touchAEnabled = true;
                this.posA = [touch.pageX, touch.pageY];
                this.timestampA = Date.now();
            }
            else if (!this.touchBEnabled) {
                this.touchBId = touch.identifier;
                this.touchBEnabled = true;
                this.posB = [touch.pageX, touch.pageY];
                this.timestampB = Date.now();
                this._startUpdate(event);
            }
        }
    };

    // private
    TwoFingerSync.prototype.handleMove = function handleMove(event) {
        if (!(this.touchAEnabled && this.touchBEnabled)) return;
        var prevTimeA = this.timestampA;
        var prevTimeB = this.timestampB;
        var diffTime;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === this.touchAId) {
                this.posA = [touch.pageX, touch.pageY];
                this.timestampA = Date.now();
                diffTime = this.timestampA - prevTimeA;
            }
            else if (touch.identifier === this.touchBId) {
                this.posB = [touch.pageX, touch.pageY];
                this.timestampB = Date.now();
                diffTime = this.timestampB - prevTimeB;
            }
        }
        // This is meant to be overridden in
        if (diffTime) this._moveUpdate(diffTime);
    };

    // private
    TwoFingerSync.prototype.handleEnd = function handleEnd(event) {
        var pos = (this.options.direction === undefined)
            ? this._legacyPositionGetter ? this._legacyPositionGetter : [0,0]
            : this._legacyPositionGetter ? this._legacyPositionGetter : 0;
        var scale = this.options.scale;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === this.touchAId || touch.identifier === this.touchBId) {
                if (this.touchAEnabled && this.touchBEnabled) this.output.emit('end', {
                    position: pos,
                    velocity: scale*this._vel,
                    touches: [this.touchAId, this.touchBId],
                    angle: this._angle
                });

                this.touchAEnabled = false;
                this.touchAId = 0;
                this.touchBEnabled = false;
                this.touchBId = 0;
            }
        }
    };

    module.exports = TwoFingerSync;
});
