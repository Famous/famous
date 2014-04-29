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
     * Handles piped in two-finger touch events to change position via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events with
     *   position, velocity, touch ids, and distance between fingers.
     *
     * @class PinchSync
     * @extends TwoFingerSync
     * @constructor
     * @param {function} legacyGetter position getter object (deprecated)
     * @param {Object} options default options overrides
     */
    function PinchSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        TwoFingerSync.call(this, this._legacyPositionGetter, options);
        this._dist = undefined;
    }

    PinchSync.prototype = Object.create(TwoFingerSync.prototype);
    PinchSync.prototype.constructor = PinchSync;

    function _calcDist(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.sqrt(diffX * diffX + diffY * diffY);
    }

    PinchSync.prototype._startUpdate = function _startUpdate(event) {
        this._dist = _calcDist(this.posA, this.posB);
        this.output.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._dist
        });
    };

    PinchSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var currDist = _calcDist(this.posA, this.posB);
        var diffZ = currDist - this._dist;
        var veloZ = diffZ / diffTime;

        var prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
        var scale = this.options.scale;

        this.output.emit('update', {
            delta : diffZ,
            position: prevPos + scale*diffZ,
            velocity: scale*veloZ,
            touches: [this.touchAId, this.touchBId],
            distance: currDist
        });

        this._dist = currDist;
    };

    /**
     * See TwoFingerSync.setOptions
     * @method setOptions
     */

    /**
     * See TwoFingerSync.getOptions
     * @method getOptions
     */

    module.exports = PinchSync;
});
