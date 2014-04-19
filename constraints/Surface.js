/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('famous/math/Vector');

    /**
     *  A constraint that keeps a physics body on a given implicit surface
     *    regardless of other physical forces are applied to it.
     *
     *  @class Surface
     *  @constructor
     *  @extends Constraint
     *  @param options {Object}
     */
    function Surface(options) {
        this.options = Object.create(Surface.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this.J = new Vector();
        this.impulse  = new Vector();

        Constraint.call(this);
    }

    Surface.prototype = Object.create(Constraint.prototype);
    Surface.prototype.constructor = Surface;

    /**
     * @property Surface.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Surface.DEFAULT_OPTIONS = {

        /**
         * An implicitly defined surface f(x,y,z) = 0 that body is constrained to
         *   e.g. function(x,y,z) { x*x + y*y + z*z - r*r }
         *   corresponds to a sphere of radius r pixels
         *
         * @attribute equation
         * @type Function
         */
        equation : undefined,

        /**
         * The spring-like reaction when the constraint is violated
         * @attribute period
         * @type Number
         * @default 0
         */
        period : 0,

        /**
         * The damping-like reaction when the constraint is violated
         * @attribute dampingRatio
         * @type Number
         * @default 0
         */
        dampingRatio : 0
    };

    /** @const */ var epsilon = 1e-7;
    /** @const */ var pi = Math.PI;

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects}
     */
    Surface.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds a surface impulse to a physics body.
     *
     * @method applyConstraint
     * @param targets {Array.Body} Array of bodies to apply force to.
     * @param source {Body} Not applicable
     * @param dt {Number} Delta time
     */
    Surface.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var impulse = this.impulse;
        var J       = this.J;
        var options = this.options;

        var f = options.equation;
        var dampingRatio = options.dampingRatio;
        var period = options.period;

        for (var i = 0; i < targets.length; i++) {
            var particle = targets[i];

            var v = particle.velocity;
            var p = particle.position;
            var m = particle.mass;

            var gamma;
            var beta;

            if (period === 0) {
                gamma = 0;
                beta = 1;
            }
            else {
                var c = 4 * m * pi * dampingRatio / period;
                var k = 4 * m * pi * pi / (period * period);

                gamma = 1 / (c + dt*k);
                beta  = dt*k / (c + dt*k);
            }

            var x = p.x;
            var y = p.y;
            var z = p.z;

            var f0  = f(x, y, z);
            var dfx = (f(x + epsilon, p, p) - f0) / epsilon;
            var dfy = (f(x, y + epsilon, p) - f0) / epsilon;
            var dfz = (f(x, y, p + epsilon) - f0) / epsilon;
            J.setXYZ(dfx, dfy, dfz);

            var antiDrift = beta/dt * f0;
            var lambda = -(J.dot(v) + antiDrift) / (gamma + dt * J.normSquared() / m);

            impulse.set(J.mult(dt*lambda));
            particle.applyImpulse(impulse);
        }
    };

    module.exports = Surface;
});
