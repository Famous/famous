/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
define(function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Handles piped in two-finger touch events to change position via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events with
     *   position, velocity, touch ids, and distance between fingers.
     *
     * @class PinchSync
     * @extends TwoFingerSync
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function PinchSync(options) {
        TwoFingerSync.call(this);

        this.options = Object.create(PinchSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._displacement = 0;
        this._previousDistance = 0;
    }

    PinchSync.prototype = Object.create(TwoFingerSync.prototype);
    PinchSync.prototype.constructor = PinchSync;

    PinchSync.DEFAULT_OPTIONS = {
        scale : 1
    };

    PinchSync.prototype._startUpdate = function _startUpdate(event) {
        this._previousDistance = TwoFingerSync.calculateDistance(this.posA, this.posB);
        this._displacement = 0;

        this._eventOutput.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._dist,
            center: TwoFingerSync.calculateCenter(this.posA, this.posB)
        });
    };

    PinchSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var currDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
        var center = TwoFingerSync.calculateCenter(this.posA, this.posB);

        var scale = this.options.scale;
        var delta = scale * (currDist - this._previousDistance);
        var velocity = delta / diffTime;

        this._previousDistance = currDist;
        this._displacement += delta;

        this._eventOutput.emit('update', {
            delta : delta,
            velocity: velocity,
            distance: currDist,
            displacement: this._displacement,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    PinchSync.prototype.getOptions = function getOptions() {
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
    PinchSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    module.exports = PinchSync;
});
