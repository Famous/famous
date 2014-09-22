/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('../../core/EventHandler');

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
        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Constraint.prototype.setOptions = function setOptions(options) {
        this._eventOutput.emit('change', options);
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
        return 0.0;
    };

    module.exports = Constraint;
});
