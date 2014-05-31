/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     *  Allows for two circular bodies to collide and bounce off each other.
     *
     *  @class Constraint
     *  @constructor
     *  @uses EventHandler
     *  @param options {Object}
     */
    function Constraint() {
        this.options = this.options || {};
        this._energy = 0.0;
        this._eventOutput = null;
    }

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Constraint.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds an impulse to a physics body's velocity due to the constraint
     *
     * @method applyConstraint
     */
    Constraint.prototype.applyConstraint = function applyConstraint() {};

    /**
     * Getter for energy
     *
     * @method getEnergy
     * @return energy {Number}
     */
    Constraint.prototype.getEnergy = function getEnergy() {
        return this._energy;
    };

    /**
     * Setter for energy
     *
     * @method setEnergy
     * @param energy {Number}
     */
    Constraint.prototype.setEnergy = function setEnergy(energy) {
        this._energy = energy;
    };

    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Constraint.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };
    Constraint.prototype.addListener = function addListener() {
        _createEventOutput.call(this);
        return this.addListener.apply(this, arguments);
    };
    Constraint.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };
    Constraint.prototype.removeListener = function removeListener() {
        return this.removeListener.apply(this, arguments);
    };
    Constraint.prototype.unpipe = function unpipe() {
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Constraint;
});
