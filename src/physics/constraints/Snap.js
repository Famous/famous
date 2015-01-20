/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('../../math/Vector');

    /**
     *  A spring constraint is like a spring force, except that it is always
     *    numerically stable (even for low periods), at the expense of introducing
     *    damping (even with dampingRatio set to 0).
     *
     *    Use this if you need fast spring-like behavior, e.g., snapping
     *
     *  @class Snap
     *  @constructor
     *  @extends Constraint
     *  @param {Options} [options] An object of configurable options.
     *  @param {Number} [options.period] The amount of time in milliseconds taken for one complete oscillation when there is no damping. Range : [150, Infinity]
     *  @param {Number} [options.dampingRatio] Additional damping of the spring. Range : [0, 1]. At 0 this spring will still be damped, at 1 the spring will be critically damped (the spring will never oscillate)
     *  @param {Number} [options.length] The rest length of the spring. Range: [0, Infinity].
     *  @param {Array} [options.anchor] The location of the spring's anchor, if not another physics body.
     *
     */
    function Snap(options) {
        Constraint.call(this);

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.pDiff  = new Vector();
        this.vDiff  = new Vector();
        this.impulse1 = new Vector();
        this.impulse2 = new Vector();
    }

    Snap.prototype = Object.create(Constraint.prototype);
    Snap.prototype.constructor = Snap;

    Snap.DEFAULT_OPTIONS = {
        period : 300,
        dampingRatio : 0.1,
        length : 0,
        anchor : undefined
    };

    /** const */ var pi = Math.PI;

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects} options
     */
    Snap.prototype.setOptions = function setOptions(options) {
        if (options.anchor !== undefined) {
            if (options.anchor   instanceof Vector) this.options.anchor = options.anchor;
            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
            if (options.anchor   instanceof Array)  this.options.anchor = new Vector(options.anchor);
        }
        if (options.length !== undefined) this.options.length = options.length;
        if (options.dampingRatio !== undefined) this.options.dampingRatio = options.dampingRatio;
        if (options.period !== undefined) this.options.period = options.period;
        Constraint.prototype.setOptions.call(this, options);
    };

    /**
     * Calculates energy of spring
     *
     * @method getEnergy
     * @param targets {Body} target physics body
     * @param source {Body} source physics body
     * @return energy {Number}
     */
    Snap.prototype.getEnergy = function getEnergy(targets, source) {
        var options     = this.options;
        var restLength  = options.length;
        var anchor      = options.anchor || source.position;
        var strength    = Math.pow(2 * pi / options.period, 2);

        var energy = 0.0;
        for (var i = 0; i < targets.length; i++){
            var target = targets[i];
            var dist = anchor.sub(target.position).norm() - restLength;
            energy += 0.5 * strength * dist * dist;
        }
        return energy;
    };

    /**
     * Adds a spring impulse to a physics body's velocity due to the constraint
     *
     * @method applyConstraint
     * @param targets {Array.Body}  Array of bodies to apply the constraint to
     * @param source {Body}         The source of the constraint
     * @param dt {Number}           Delta time
     */
    Snap.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var options      = this.options;
        var pDiff        = this.pDiff;
        var vDiff        = this.vDiff;
        var impulse1     = this.impulse1;
        var impulse2     = this.impulse2;
        var length       = options.length;
        var anchor       = options.anchor || source.position;
        var period       = options.period;
        var dampingRatio = options.dampingRatio;

        for (var i = 0; i < targets.length ; i++) {
            var target = targets[i];

            var p1 = target.position;
            var v1 = target.velocity;
            var m1 = target.mass;
            var w1 = target.inverseMass;

            pDiff.set(p1.sub(anchor));
            var dist = pDiff.norm() - length;
            var effMass;

            if (source) {
                var w2 = source.inverseMass;
                var v2 = source.velocity;
                vDiff.set(v1.sub(v2));
                effMass = 1 / (w1 + w2);
            }
            else {
                vDiff.set(v1);
                effMass = m1;
            }

            var gamma;
            var beta;

            if (this.options.period === 0) {
                gamma = 0;
                beta = 1;
            }
            else {
                var k = 4 * effMass * pi * pi / (period * period);
                var c = 4 * effMass * pi * dampingRatio / period;

                beta  = dt * k / (c + dt * k);
                gamma = 1 / (c + dt*k);
            }

            var antiDrift = beta/dt * dist;
            pDiff.normalize(-antiDrift)
                .sub(vDiff)
                .mult(dt / (gamma + dt/effMass))
                .put(impulse1);

            // var n = new Vector();
            // n.set(pDiff.normalize());
            // var lambda = -(n.dot(vDiff) + antiDrift) / (gamma + dt/effMass);
            // impulse2.set(n.mult(dt*lambda));

            target.applyImpulse(impulse1);

            if (source) {
                impulse1.mult(-1).put(impulse2);
                source.applyImpulse(impulse2);
            }
        }
    };

    module.exports = Snap;
});
