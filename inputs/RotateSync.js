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
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, and angle.
     *   Useful for determining a rotation factor from initial two-finger touch.
     *
     * @class RotateSync
     * @extends TwoFingerSync
     * @constructor
     * @param {function} legacyGetter position getter object (deprecated)
     * @param {Object} options default options overrides
     */
    function RotateSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = arguments[0];
            options = arguments[1];
        }
        else {
            this._legacyPositionGetter = null;
            options = arguments[0];
        }

        TwoFingerSync.call(this, this._legacyPositionGetter, options);
        this._angle = 0;
    }

    RotateSync.prototype = Object.create(TwoFingerSync.prototype);
    RotateSync.prototype.constructor = RotateSync;

    function _calcAngle(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.atan2(diffY, diffX);
    }

    RotateSync.prototype._startUpdate = function _startUpdate(event) {
        this._angle = _calcAngle(this.posA, this.posB);
        this.output.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            angle: this._angle
        });
    };

    RotateSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var currAngle = _calcAngle(this.posA, this.posB);
        var diffTheta = currAngle - this._angle;
        var velTheta = diffTheta / diffTime;

        var prevPos = this._legacyPositionGetter ? this._legacyPositionGetter() : 0;
        var scale = this.options.scale;

        this.output.emit('update', {
            delta : diffTheta,
            position: prevPos + scale*diffTheta,
            velocity: scale*velTheta,
            touches: [this.touchAId, this.touchBId],
            angle: currAngle
        });

        this._angle = currAngle;
    };

    /**
     * See TwoFingerSync.setOptions
     * @method setOptions
     */

    /**
     * See TwoFingerSync.getOptions
     * @method getOptions
     */
    module.exports = RotateSync;
});
