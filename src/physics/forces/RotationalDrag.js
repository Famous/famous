/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Drag = require('./Drag');

    /**
     * Rotational drag is a force that opposes angular velocity.
     *   Attach it to a physics body to slow down its rotation.
     *
     * @class RotationalDrag
     * @constructor
     * @extends Force
     * @param {Object} options options to set on drag
     */
    function RotationalDrag(options) {
        Drag.call(this, options);
    }

    RotationalDrag.prototype = Object.create(Drag.prototype);
    RotationalDrag.prototype.constructor = RotationalDrag;

    RotationalDrag.DEFAULT_OPTIONS = Drag.DEFAULT_OPTIONS;
    RotationalDrag.FORCE_FUNCTIONS = Drag.FORCE_FUNCTIONS;

    /**
     * @property Repulsion.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    RotationalDrag.FORCE_FUNCTIONS = {

        /**
         * A drag force proprtional to the angular velocity
         * @attribute LINEAR
         * @type Function
         * @param {Vector} angularVelocity
         * @return {Vector} drag force
         */
        LINEAR : function(angularVelocity) {
            return angularVelocity;
        },

        /**
         * A drag force proprtional to the square of the angular velocity
         * @attribute QUADRATIC
         * @type Function
         * @param {Vector} angularVelocity
         * @return {Vector} drag force
         */
        QUADRATIC : function(angularVelocity) {
            return angularVelocity.mult(angularVelocity.norm());
        }
    };

    /**
     * Adds a rotational drag force to a physics body's torque accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply drag force to.
     */
    RotationalDrag.prototype.applyForce = function applyForce(targets) {
        var strength       = this.options.strength;
        var forceFunction  = this.options.forceFunction;
        var force          = this.force;

        //TODO: rotational drag as function of inertia

        var index;
        var particle;

        for (index = 0; index < targets.length; index++) {
            particle = targets[index];
            forceFunction(particle.angularVelocity).mult(-100*strength).put(force);
            particle.applyTorque(force);
        }
    };

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param {Objects} options
     */
    RotationalDrag.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    module.exports = RotationalDrag;
});
