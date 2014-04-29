/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Particle = require('./Particle');
    var Transform = require('famous/core/Transform');
    var Vector = require('famous/math/Vector');
    var Quaternion = require('famous/math/Quaternion');
    var Matrix = require('famous/math/Matrix');

    /**
     * A unit controlled by the physics engine which extends the zero-dimensional
     * Particle to include geometry. In addition to maintaining the state
     * of a Particle its state includes orientation, angular velocity
     * and angular momentum and responds to torque forces.
     *
     * @class Body
     * @extends Particle
     * @constructor
     */
    function Body(options) {
        Particle.call(this, options);
        options = options || {};

        this.orientation     = new Quaternion();
        this.angularVelocity = new Vector();
        this.angularMomentum = new Vector();
        this.torque          = new Vector();

        if (options.orientation)     this.orientation.set(options.orientation);
        if (options.angularVelocity) this.angularVelocity.set(options.angularVelocity);
        if (options.angularMomentum) this.angularMomentum.set(options.angularMomentum);
        if (options.torque)          this.torque.set(options.torque);

        this.setMomentsOfInertia();

        this.angularVelocity.w = 0;        //quaternify the angular velocity

        //registers
        this.pWorld = new Vector();        //placeholder for world space position
    }

    Body.DEFAULT_OPTIONS = Particle.DEFAULT_OPTIONS;
    Body.DEFAULT_OPTIONS.orientation = [0,0,0,1];
    Body.DEFAULT_OPTIONS.angularVelocity = [0,0,0];

    Body.AXES = Particle.AXES;
    Body.SLEEP_TOLERANCE = Particle.SLEEP_TOLERANCE;
    Body.INTEGRATOR = Particle.INTEGRATOR;

    Body.prototype = Object.create(Particle.prototype);
    Body.prototype.constructor = Body;

    Body.prototype.isBody = true;

    Body.prototype.setMass = function setMass() {
        Particle.prototype.setMass.apply(this, arguments);
        this.setMomentsOfInertia();
    };

    /**
     * Setter for moment of inertia, which is necessary to give proper
     * angular inertia depending on the geometry of the body.
     *
     * @method setMomentsOfInertia
     */
    Body.prototype.setMomentsOfInertia = function setMomentsOfInertia() {
        this.inertia = new Matrix();
        this.inverseInertia = new Matrix();
    };

    /**
     * Update the angular velocity from the angular momentum state.
     *
     * @method updateAngularVelocity
     */
    Body.prototype.updateAngularVelocity = function updateAngularVelocity() {
        this.angularVelocity.set(this.inverseInertia.vectorMultiply(this.angularMomentum));
    };

    /**
     * Determine world coordinates from the local coordinate system. Useful
     * if the Body has rotated in space.
     *
     * @method toWorldCoordinates
     * @param localPosition {Vector} local coordinate vector
     * @return global coordinate vector {Vector}
     */
    Body.prototype.toWorldCoordinates = function toWorldCoordinates(localPosition) {
        return this.pWorld.set(this.orientation.rotateVector(localPosition));
    };

    /**
     * Calculates the kinetic and intertial energy of a body.
     *
     * @return energy {Number}
     */
    Body.prototype.getEnergy = function getEnergy() {
        return Particle.prototype.getEnergy.call(this)
            + 0.5 * this.inertia.vectorMultiply(this.angularVelocity).dot(this.angularVelocity);
    };

    /**
     * Extends Particle.reset to reset orientation, angular velocity
     * and angular momentum.
     *
     * @param [p] {Array|Vector} position
     * @param [v] {Array|Vector} velocity
     * @param [q] {Array|Quaternion} orientation
     * @param [L] {Array|Vector} angular momentum
     */
    Body.prototype.reset = function reset(p, v, q, L) {
        Particle.prototype.reset.call(this, p, v);
        this.angularVelocity.clear();
        this.setOrientation(q || [1,0,0,0]);
        this.setAngularMomentum(L || [0,0,0]);
    };

    /**
     * Setter for orientation
     *
     * @param q {Array|Quaternion} orientation
     */
    Body.prototype.setOrientation = function setOrientation(q) {
        this.orientation.set(q);
    };

    /**
     * Setter for angular velocity
     *
     * @param w {Array|Vector} angular velocity
     */
    Body.prototype.setAngularVelocity = function setAngularVelocity(w) {
        this.wake();
        this.angularVelocity.set(w);
    };

    /**
     * Setter for angular momentum
     *
     * @param L {Array|Vector} angular momentum
     */
    Body.prototype.setAngularMomentum = function setAngularMomentum(L) {
        this.wake();
        this.angularMomentum.set(L);
    };

    /**
     * Extends Particle.applyForce with an optional argument
     * to apply the force at an off-centered location, resulting in a torque.
     *
     * @method applyForce
     * @param force {Vector} force
     * @param [location] {Vector} off-center location on the body
     */
    Body.prototype.applyForce = function applyForce(force, location) {
        Particle.prototype.applyForce.call(this, force);
        if (location !== undefined) this.applyTorque(location.cross(force));
    };

    /**
     * Applied a torque force to a body, inducing a rotation.
     *
     * @method applyTorque
     * @param torque {Vector} torque
     */
    Body.prototype.applyTorque = function applyTorque(torque) {
        this.wake();
        this.torque.set(this.torque.add(torque));
    };

    /**
     * Extends Particle.getTransform to include a rotational component
     * derived from the particle's orientation.
     *
     * @method getTransform
     * @return transform {Transform}
     */
    Body.prototype.getTransform = function getTransform() {
        return Transform.thenMove(
            this.orientation.getTransform(),
            Transform.getTranslate(Particle.prototype.getTransform.call(this))
        );
    };

    /**
     * Extends Particle._integrate to also update the rotational states
     * of the body.
     *
     * @method getTransform
     * @protected
     * @param dt {Number} delta time
     */
    Body.prototype._integrate = function _integrate(dt) {
        Particle.prototype._integrate.call(this, dt);
        this.integrateAngularMomentum(dt);
        this.updateAngularVelocity(dt);
        this.integrateOrientation(dt);
    };

    /**
     * Updates the angular momentum via the its integrator.
     *
     * @method integrateAngularMomentum
     * @param dt {Number} delta time
     */
    Body.prototype.integrateAngularMomentum = function integrateAngularMomentum(dt) {
        Body.INTEGRATOR.integrateAngularMomentum(this, dt);
    };

    /**
     * Updates the orientation via the its integrator.
     *
     * @method integrateOrientation
     * @param dt {Number} delta time
     */
    Body.prototype.integrateOrientation = function integrateOrientation(dt) {
        Body.INTEGRATOR.integrateOrientation(this, dt);
    };

    module.exports = Body;
});
