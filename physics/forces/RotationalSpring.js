/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

//TODO: test inheritance
define(function(require, exports, module) {
    var Spring = require('./Spring');

    /**
     *  A force that rotates a physics body back to target Euler angles.
     *  Just as a spring translates a body to a particular X, Y, Z, location,
     *  a rotational spring rotates a body to a particular X, Y, Z Euler angle.
     *      Note: there is no physical agent that does this in the "real world"
     *
     *  @class RotationalSpring
     *  @constructor
     *  @extends Spring
     *  @param {Object} options options to set on drag
     */
    function RotationalSpring(options) {
        Spring.call(this, options);
    }

    RotationalSpring.prototype = Object.create(Spring.prototype);
    RotationalSpring.prototype.constructor = RotationalSpring;

    RotationalSpring.DEFAULT_OPTIONS = Spring.DEFAULT_OPTIONS;
    RotationalSpring.FORCE_FUNCTIONS = Spring.FORCE_FUNCTIONS;

    /**
     * Adds a torque force to a physics body's torque accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply torque to.
     */
    RotationalSpring.prototype.applyForce = function applyForce(targets) {
        var force        = this.force;
        var options      = this.options;
        var disp         = this.disp;

        var stiffness    = options.stiffness;
        var damping      = options.damping;
        var restLength   = options.length;
        var anchor       = options.anchor;

        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];

            disp.set(anchor.sub(target.orientation));
            var dist = disp.norm() - restLength;

            if (dist === 0) return;

            //if dampingRatio specified, then override strength and damping
            var m      = target.mass;
            stiffness *= m;
            damping   *= m;

            force.set(disp.normalize(stiffness * this.forceFunction(dist, this.options.lMax)));

            if (damping) force.set(force.add(target.angularVelocity.mult(-damping)));

            target.applyTorque(force);
        }
    };

    /**
     * Calculates the potential energy of the rotational spring.
     *
     * @method getEnergy
     * @param {Body} target The physics body attached to the spring
     */
    RotationalSpring.prototype.getEnergy = function getEnergy(target) {
        var options     = this.options;
        var restLength  = options.length;
        var anchor      = options.anchor;
        var strength    = options.stiffness;

        var dist = anchor.sub(target.orientation).norm() - restLength;
        return 0.5 * strength * dist * dist;
    };

    module.exports = RotationalSpring;
});
