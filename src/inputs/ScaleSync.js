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
     * Handles piped in two-finger touch events to increase or decrease scale via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, distance, and scale factor.
     *   Useful for determining a scaling factor from initial two-finger touch.
     *
     * @class ScaleSync
     * @extends TwoFingerSync
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function ScaleSync(options) {
        TwoFingerSync.call(this);

        this.options = Object.create(ScaleSync.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._scaleFactor = 1;
        this._startDist = 0;
        this._eventInput.on('pipe', _reset.bind(this));
    }

    ScaleSync.prototype = Object.create(TwoFingerSync.prototype);
    ScaleSync.prototype.constructor = ScaleSync;

    ScaleSync.DEFAULT_OPTIONS = {
        scale : 1
    };

    function _reset() {
        this.touchAId = undefined;
        this.touchBId = undefined;
    }

    // handles initial touch of two fingers
    ScaleSync.prototype._startUpdate = function _startUpdate(event) {
        this._scaleFactor = 1;
        this._startDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
        this._eventOutput.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._startDist,
            center: TwoFingerSync.calculateCenter(this.posA, this.posB)
        });
    };

    // handles movement of two fingers
    ScaleSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var scale = this.options.scale;

        var currDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
        var center = TwoFingerSync.calculateCenter(this.posA, this.posB);

        var delta = (currDist - this._startDist) / this._startDist;
        var newScaleFactor = Math.max(1 + scale * delta, 0);
        var veloScale = (newScaleFactor - this._scaleFactor) / diffTime;

        this._eventOutput.emit('update', {
            delta : delta,
            scale: newScaleFactor,
            velocity: veloScale,
            distance: currDist,
            center : center,
            touches: [this.touchAId, this.touchBId]
        });

        this._scaleFactor = newScaleFactor;
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    ScaleSync.prototype.getOptions = function getOptions() {
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
    ScaleSync.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    module.exports = ScaleSync;
});
