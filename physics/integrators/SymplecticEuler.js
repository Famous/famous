/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var OptionsManager = require('famous/core/OptionsManager');

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
    function SymplecticEuler(options) {
        this.options = Object.create(SymplecticEuler.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    /**
     * @property SymplecticEuler.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    SymplecticEuler.DEFAULT_OPTIONS = {

        /**
         * The maximum velocity of a physics body
         *      Range : [0, Infinity]
         * @attribute velocityCap
         * @type Number
         */

        velocityCap : undefined,

        /**
         * The maximum angular velocity of a physics body
         *      Range : [0, Infinity]
         * @attribute angularVelocityCap
         * @type Number
         */
        angularVelocityCap : undefined
    };

    /*
     * Setter for options
     *
     * @method setOptions
     * @param {Object} options
     */
    SymplecticEuler.prototype.setOptions = function setOptions(options) {
        this._optionsManager.patch(options);
    };

    /*
     * Getter for options
     *
     * @method getOptions
     * @return {Object} options
     */
    SymplecticEuler.prototype.getOptions = function getOptions() {
        return this._optionsManager.value();
    };

    /*
     * Updates the velocity of a physics body from its accumulated force.
     *      v <- v + dt * f / m
     *
     * @method integrateVelocity
     * @param {Body} physics body
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integrateVelocity = function integrateVelocity(body, dt) {
        var v = body.velocity;
        var w = body.inverseMass;
        var f = body.force;

        if (f.isZero()) return;

        v.add(f.mult(dt * w)).put(v);
        f.clear();
    };

    /*
     * Updates the position of a physics body from its velocity.
     *      p <- p + dt * v
     *
     * @method integratePosition
     * @param {Body} physics body
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integratePosition = function integratePosition(body, dt) {
        var p = body.position;
        var v = body.velocity;

        if (this.options.velocityCap) v.cap(this.options.velocityCap).put(v);
        p.add(v.mult(dt)).put(p);
    };

    /*
     * Updates the angular momentum of a physics body from its accumuled torque.
     *      L <- L + dt * t
     *
     * @method integrateAngularMomentum
     * @param {Body} physics body (except a particle)
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integrateAngularMomentum = function integrateAngularMomentum(body, dt) {
        var L = body.angularMomentum;
        var t = body.torque;

        if (t.isZero()) return;

        if (this.options.angularVelocityCap) t.cap(this.options.angularVelocityCap).put(t);
        L.add(t.mult(dt)).put(L);
        t.clear();
    };

    /*
     * Updates the orientation of a physics body from its angular velocity.
     *      q <- q + dt/2 * q * w
     *
     * @method integrateOrientation
     * @param {Body} physics body (except a particle)
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integrateOrientation = function integrateOrientation(body, dt) {
        var q = body.orientation;
        var w = body.angularVelocity;

        if (w.isZero()) return;
        q.add(q.multiply(w).scalarMultiply(0.5 * dt)).put(q);
//        q.normalize.put(q);
    };

    module.exports = SymplecticEuler;
});
