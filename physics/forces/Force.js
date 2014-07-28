/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Vector = require('famous/math/Vector');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Force base class.
     *
     * @class Force
     * @uses EventHandler
     * @constructor
     */
    function Force(force) {
        this.force = new Vector(force);
        this._energy = 0.0;
        this._eventOutput = null;
    }

    /**
     * Basic setter for options
     *
     * @method setOptions
     * @param options {Objects}
     */
    Force.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds a force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param body {Body}
     */
    Force.prototype.applyForce = function applyForce(body) {
        body.applyForce(this.force);
    };

    /**
     * Getter for a force's potential energy.
     *
     * @method getEnergy
     * @return energy {Number}
     */
    Force.prototype.getEnergy = function getEnergy() {
        return this._energy;
    };

    /*
     * Setter for a force's potential energy.
     *
     * @method setEnergy
     * @param energy {Number}
     */
    Force.prototype.setEnergy = function setEnergy(energy) {
        this._energy = energy;
    };

    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Force.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };
    Force.prototype.addListener = function addListener() {
        _createEventOutput.call(this);
        return this.addListener.apply(this, arguments);
    };
    Force.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };
    Force.prototype.removeListener = function removeListener() {
        return this.removeListener.apply(this, arguments);
    };
    Force.prototype.unpipe = function unpipe() {
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Force;
});
