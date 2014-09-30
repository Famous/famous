/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Force = require('./Force');

    /**
     * Drag is a force that opposes velocity. Attach it to the physics engine
     * to slow down a physics body in motion.
     *
     * @class Drag
     * @constructor
     * @extends Force
     * @param {Object} options options to set on drag
     */
    function Drag(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        Force.call(this);
    }

    Drag.prototype = Object.create(Force.prototype);
    Drag.prototype.constructor = Drag;

    /**
     * @property Drag.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    Drag.FORCE_FUNCTIONS = {

        /**
         * A drag force proportional to the velocity
         * @attribute LINEAR
         * @type Function
         * @param {Vector} velocity
         * @return {Vector} drag force
         */
        LINEAR : function(velocity) {
            return velocity;
        },

        /**
         * A drag force proportional to the square of the velocity
         * @attribute QUADRATIC
         * @type Function
         * @param {Vector} velocity
         * @return {Vector} drag force
         */
        QUADRATIC : function(velocity) {
            return velocity.mult(velocity.norm());
        }
    };

    /**
     * @property Drag.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Drag.DEFAULT_OPTIONS = {

        /**
         * The strength of the force
         *    Range : [0, 0.1]
         * @attribute strength
         * @type Number
         * @default 0.01
         */
        strength : 0.01,

        /**
         * The type of opposing force
         * @attribute forceFunction
         * @type Function
         */
        forceFunction : Drag.FORCE_FUNCTIONS.LINEAR
    };

    /**
     * Adds a drag force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply drag force to.
     */
    Drag.prototype.applyForce = function applyForce(targets) {
        var strength        = this.options.strength;
        var forceFunction   = this.options.forceFunction;
        var force           = this.force;
        var index;
        var particle;

        for (index = 0; index < targets.length; index++) {
            particle = targets[index];
            forceFunction(particle.velocity).mult(-strength).put(force);
            particle.applyForce(force);
        }
    };

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param {Objects} options
     */
    Drag.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    module.exports = Drag;
});
