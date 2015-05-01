/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Vector = require('../../math/Vector');

    /**
     * Ordinary Differential Equation (ODE) Integrator.
     * Manages updating a physics body's state over time.
     *
     *  p = position, v = velocity, m = mass, f = force, dt = change in time
     *
     *      v <- v + dt * f / m
     *      p <- p + dt * v
     *
     *  q = orientation, w = angular velocity, L = angular momentum
     *
     *      L <- L + dt * t
     *      q <- q + dt/2 * q * w
     *
     * @class SymplecticEuler
     * @constructor
     * @param {Object} options Options to set
     */
    var SymplecticEuler = {};

    /*
     * Calculates the change in velocity of a physics body from its accumulated force.
     *      dt * f / m
     *
     * @method integrateVelocity
     * @param {Vector} f external force
     * @param {Number} w inverse mass
     * @param {Number} dt delta time
     * @return {Vector} delta or null if no force
     */
    SymplecticEuler.integrateVelocity = function integrateVelocity(f, w, dt) {
        if (f.isZero()) return null;

        var delta = new Vector();
        f.mult(dt * w).put(delta);
        return delta;
    };

    /*
     * Calculates the change in position of a physics body from its velocity.
     *      dt * v
     *
     * @method integratePosition
     * @param {Vector} v body velocity
     * @param {Number} dt delta time
     * @return {Vector} delta
     */
    SymplecticEuler.integratePosition = function integratePosition(v, dt) {
        var delta = new Vector();
        v.mult(dt).put(delta);
        return delta;
    };

    /*
     * Calculates the change in angular momentum of a physics body from its accumuled torque.
     *      dt * t
     *
     * @method integrateAngularMomentum
     * @param {Vector} t body torque
     * @param {Number} dt delta time
     * @return {Vector} delta or null if no torque
     */
    SymplecticEuler.integrateAngularMomentum = function integrateAngularMomentum(t, dt) {
        if (t.isZero()) return null;

        var delta = new Vector();
        t.mult(dt).put(delta);
        return delta;
    };

    /*
     * Calculates the change in orientation of a physics body from its angular velocity.
     *      dt/2 * q * w
     *
     * @method integrateOrientation
     * @param {Matrix} q body orientation
     * @param {Matrix} w body angular velocity
     * @param {Number} dt delta time
     * @return {Vector} delta or null if no angular velocity
     */
    SymplecticEuler.integrateOrientation = function integrateOrientation(q, w, dt) {
        if (w.isZero()) return null;

        var delta = new Vector();
        q.multiply(w).scalarMultiply(0.5 * dt).put(delta);
        return delta;
    };

    module.exports = SymplecticEuler;
});
