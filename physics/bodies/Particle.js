/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Vector = require('../../math/Vector');
    var Transform = require('../../core/Transform');
    var EventHandler = require('../../core/EventHandler');
    var Integrator = require('../integrators/SymplecticEuler');

    /**
     * A point body that is controlled by the Physics Engine. A particle has
     *   position and velocity states that are updated by the Physics Engine.
     *   Ultimately, a particle is a special type of modifier, and can be added to
     *   the Famo.us Scene Graph like any other modifier.
     *
     * @class Particle
     * @uses EventHandler
     * @extensionfor Body
     *
     * @param [options] {Options}           An object of configurable options.
     * @param [options.position] {Array}    The position of the particle.
     * @param [options.velocity] {Array}    The velocity of the particle.
     * @param [options.mass] {Number}       The mass of the particle.
     */
     function Particle(options) {
        options = options || {};
        var defaults = Particle.DEFAULT_OPTIONS;

        // registers
        this.position = new Vector();
        this.velocity = new Vector();
        this.force = new Vector();

        // state variables
        this._engine = null;
        this._isSleeping = true;
        this._eventOutput = null;

        // set scalars
        this.mass = (options.mass !== undefined)
            ? options.mass
            : defaults.mass;

        this.inverseMass = 1 / this.mass;

        // set vectors
        this.setPosition(options.position || defaults.position);
        this.setVelocity(options.velocity || defaults.velocity);
        this.force.set(options.force || [0,0,0]);

        this.transform = Transform.identity.slice();

        // cached _spec
        this._spec = {
            size : [true, true],
            target : {
                transform : this.transform,
                origin : [0.5, 0.5],
                target : null
            }
        };
    }

    Particle.DEFAULT_OPTIONS = {
        position : [0, 0, 0],
        velocity : [0, 0, 0],
        mass : 1
    };

    //Catalogue of outputted events
    var _events = {
        start : 'start',
        update : 'update',
        end : 'end'
    };

    // Cached timing function
    var now = Date.now;

    /**
     * @attribute isBody
     * @type Boolean
     * @static
     */
    Particle.prototype.isBody = false;

    /**
     * Determines if particle is active
     *
     * @method isActive
     * @return {Boolean}
     */
    Particle.prototype.isActive = function isActive() {
        return !this._isSleeping;
    };

    /**
     * Stops the particle from updating
     *
     * @method sleep
     */
    Particle.prototype.sleep = function sleep() {
        if (this._isSleeping) return;
        this.emit(_events.end, this);
        this._isSleeping = true;
    };

    /**
     * Starts the particle update
     *
     * @method wake
     */
    Particle.prototype.wake = function wake() {
        if (!this._isSleeping) return;
        this.emit(_events.start, this);
        this._isSleeping = false;
        this._prevTime = now();
        if (this._engine) this._engine.wake();
    };

    /**
     * Basic setter for position
     *
     * @method setPosition
     * @param position {Array|Vector}
     */
    Particle.prototype.setPosition = function setPosition(position) {
        this.position.set(position);
    };

    /**
     * 1-dimensional setter for position
     *
     * @method setPosition1D
     * @param x {Number}
     */
    Particle.prototype.setPosition1D = function setPosition1D(x) {
        this.position.x = x;
    };

    /**
     * Basic getter function for position
     *
     * @method getPosition
     * @return position {Array}
     */
    Particle.prototype.getPosition = function getPosition() {
        this._engine.step();
        return this.position.get();
    };

    /**
     * 1-dimensional getter for position
     *
     * @method getPosition1D
     * @return value {Number}
     */
    Particle.prototype.getPosition1D = function getPosition1D() {
        this._engine.step();
        return this.position.x;
    };

    /**
     * Basic setter function for velocity Vector
     *
     * @method setVelocity
     * @function
     */
    Particle.prototype.setVelocity = function setVelocity(velocity) {
        this.velocity.set(velocity);
        if (!(velocity[0] === 0 && velocity[1] === 0 && velocity[2] === 0))
            this.wake();
    };

    /**
     * 1-dimensional setter for velocity
     *
     * @method setVelocity1D
     * @param x {Number}
     */
    Particle.prototype.setVelocity1D = function setVelocity1D(x) {
        this.velocity.x = x;
        if (x !== 0) this.wake();
    };

    /**
     * Basic getter function for velocity Vector
     *
     * @method getVelocity
     * @return velocity {Array}
     */
    Particle.prototype.getVelocity = function getVelocity() {
        return this.velocity.get();
    };

    /**
     * Basic setter function for force Vector
     *
     * @method setForce
     * @return force {Array}
     */
    Particle.prototype.setForce = function setForce(force) {
        this.force.set(force);
        this.wake();
    };

    /**
     * 1-dimensional getter for velocity
     *
     * @method getVelocity1D
     * @return velocity {Number}
     */
    Particle.prototype.getVelocity1D = function getVelocity1D() {
        return this.velocity.x;
    };

    /**
     * Basic setter function for mass quantity
     *
     * @method setMass
     * @param mass {Number} mass
     */
    Particle.prototype.setMass = function setMass(mass) {
        this.mass = mass;
        this.inverseMass = 1 / mass;
    };

    /**
     * Basic getter function for mass quantity
     *
     * @method getMass
     * @return mass {Number}
     */
    Particle.prototype.getMass = function getMass() {
        return this.mass;
    };

    /**
     * Reset position and velocity
     *
     * @method reset
     * @param position {Array|Vector}
     * @param velocity {Array|Vector}
     */
    Particle.prototype.reset = function reset(position, velocity) {
        this.setPosition(position || [0,0,0]);
        this.setVelocity(velocity || [0,0,0]);
    };

    /**
     * Add force vector to existing internal force Vector
     *
     * @method applyForce
     * @param force {Vector}
     */
    Particle.prototype.applyForce = function applyForce(force) {
        if (force.isZero()) return;
        this.force.add(force).put(this.force);
        this.wake();
    };

    /**
     * Add impulse (change in velocity) Vector to this Vector's velocity.
     *
     * @method applyImpulse
     * @param impulse {Vector}
     */
    Particle.prototype.applyImpulse = function applyImpulse(impulse) {
        if (impulse.isZero()) return;
        var velocity = this.velocity;
        velocity.add(impulse.mult(this.inverseMass)).put(velocity);
    };

    /**
     * Update a particle's velocity from its force accumulator
     *
     * @method integrateVelocity
     * @param dt {Number} Time differential
     */
    Particle.prototype.integrateVelocity = function integrateVelocity(dt) {
        Integrator.integrateVelocity(this, dt);
    };

    /**
     * Update a particle's position from its velocity
     *
     * @method integratePosition
     * @param dt {Number} Time differential
     */
    Particle.prototype.integratePosition = function integratePosition(dt) {
        Integrator.integratePosition(this, dt);
    };

    /**
     * Update the position and velocity of the particle
     *
     * @method _integrate
     * @protected
     * @param dt {Number} Time differential
     */
    Particle.prototype._integrate = function _integrate(dt) {
        this.integrateVelocity(dt);
        this.integratePosition(dt);
    };

    /**
     * Get kinetic energy of the particle.
     *
     * @method getEnergy
     * @function
     */
    Particle.prototype.getEnergy = function getEnergy() {
        return 0.5 * this.mass * this.velocity.normSquared();
    };

    /**
     * Generate transform from the current position state
     *
     * @method getTransform
     * @return Transform {Transform}
     */
    Particle.prototype.getTransform = function getTransform() {
        this._engine.step();

        var position = this.position;
        var transform = this.transform;

        transform[12] = position.x;
        transform[13] = position.y;
        transform[14] = position.z;
        return transform;
    };

    /**
     * The modify interface of a Modifier
     *
     * @method modify
     * @param target {Spec}
     * @return Spec {Spec}
     */
    Particle.prototype.modify = function modify(target) {
        var _spec = this._spec.target;
        _spec.transform = this.getTransform();
        _spec.target = target;
        return this._spec;
    };

    // private
    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Particle.prototype.emit = function emit(type, data) {
        if (!this._eventOutput) return;
        this._eventOutput.emit(type, data);
    };

    Particle.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };

    Particle.prototype.removeListener = function removeListener() {
        _createEventOutput.call(this);
        return this.removeListener.apply(this, arguments);
    };

    Particle.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };

    Particle.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Particle;
});
