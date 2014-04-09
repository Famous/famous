/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');

    /**
     * Handles piped in two-finger touch events to increase or decrease scale via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, distance, and scale factor.
     *   Useful for determining a scaling factor from initial two-finger touch.
     *
     * @class ScaleSync
     * @extends TwoFingerSync
     * @constructor
     * @param {function} legacyGetter position getter object (deprecated)
     * @param {Object} options default options overrides
     */
    function ScaleSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        TwoFingerSync.call(this, this._legacyPositionGetter, options);
        this._startDist = 0;
        this._prevScale = 1;
        this.input.on('pipe', _reset.bind(this));
    }

    ScaleSync.prototype = Object.create(TwoFingerSync.prototype);
    ScaleSync.prototype.constructor = ScaleSync;

    function _calcDist(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.sqrt(diffX * diffX + diffY * diffY);
    }

    function _reset() {
        this.touchAId = undefined;
        this.touchBId = undefined;
    }

    // handles initial touch of two fingers
    ScaleSync.prototype._startUpdate = function _startUpdate(event) {
        this._prevScale = 1;
        this._startDist = _calcDist(this.posA, this.posB);
        this._vel = 0;
        this.output.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._startDist
        });
    };

    // handles movement of two fingers
    ScaleSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var currDist = _calcDist(this.posA, this.posB);
        var currScale = currDist / this._startDist;
        var diffScale = currScale - this._prevScale;
        var veloScale = diffScale / diffTime;

        var prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
        var scale = this.options.scale;

        this.output.emit('update', {
            delta : diffScale,
            position: prevPos + scale*diffScale,
            velocity: scale*veloScale,
            touches: [this.touchAId, this.touchBId],
            distance: currDist
        });

        this._prevScale = currScale;
        this._vel = veloScale;
    };

    /**
     * See TwoFingerSync.setOptions
     * @method setOptions
     */

    /**
     * See TwoFingerSync.getOptions
     * @method getOptions
     */

    module.exports = ScaleSync;
});
