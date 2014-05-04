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

    var _now = Date.now;

    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        };
    }

    function _handleStart(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var data = _timestampTouch(touch, event, null);
            this.eventOutput.emit('trackstart', data);
            if (!this.selective && !this.touchHistory[touch.identifier]) this.track(data);
        }
    }

    function _handleMove(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data);
                this.eventOutput.emit('trackmove', data);
            }
        }
    }

    function _handleEnd(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.eventOutput.emit('trackend', data);
                delete this.touchHistory[touch.identifier];
            }
        }
    }

    function _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i];
            this.eventOutput.emit('trackend', {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history
            });
            delete this.touchHistory[i];
        }
    }

    /**
     * Helper to TouchSync – tracks piped in touch events, organizes touch
     *   events by ID, and emits track events back to TouchSync.
     *   Emits 'trackstart', 'trackmove', and 'trackend' events upstream.
     *
     * @class TouchTracker
     * @constructor
     * @param {Boolean} selective if false, save state for each touch.
     */
    function TouchTracker(selective) {
        this.selective = selective;
        this.touchHistory = {};

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('touchstart', _handleStart.bind(this));
        this.eventInput.on('touchmove', _handleMove.bind(this));
        this.eventInput.on('touchend', _handleEnd.bind(this));
        this.eventInput.on('touchcancel', _handleEnd.bind(this));
        this.eventInput.on('unpipe', _handleUnpipe.bind(this));
    }

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    TouchTracker.prototype.track = function track(data) {
        this.touchHistory[data.identifier] = [data];
    };

    module.exports = TouchTracker;
});
