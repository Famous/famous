/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var PE = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var Vector = require('famous/math/Vector');

    /**
     * SpringTransition is a method of transitioning between two values (numbers,
     * or arrays of numbers) with a bounce. The transition will overshoot the target
     * state depending on the parameters of the transition.
     *
     * @class SpringTransition
     * @constructor
     *
     * @param {Number|Array} [state=0] Initial state
     */
    function SpringTransition(state) {
        state = state || 0;
        this.endState  = new Vector(state);
        this.initState = new Vector();

        this._dimensions       = undefined;
        this._restTolerance    = 1e-10;
        this._absRestTolerance = this._restTolerance;
        this._callback         = undefined;

        this.PE       = new PE();
        this.spring   = new Spring({anchor : this.endState});
        this.particle = new Particle();

        this.PE.addBody(this.particle);
        this.PE.attach(this.spring, this.particle);
    }

    SpringTransition.SUPPORTS_MULTIPLE = 3;

    /**
     * @property SpringTransition.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    SpringTransition.DEFAULT_OPTIONS = {

        /**
         * The amount of time in milliseconds taken for one complete oscillation
         * when there is no damping
         *    Range : [0, Infinity]
         *
         * @attribute period
         * @type Number
         * @default 300
         */
        period : 300,

        /**
         * The damping of the snap.
         *    Range : [0, 1]
         *    0 = no damping, and the spring will oscillate forever
         *    1 = critically damped (the spring will never oscillate)
         *
         * @attribute dampingRatio
         * @type Number
         * @default 0.5
         */
        dampingRatio : 0.5,

        /**
         * The initial velocity of the transition.
         *
         * @attribute velocity
         * @type Number|Array
         * @default 0
         */
        velocity : 0
    };

    function _getEnergy() {
        return this.particle.getEnergy() + this.spring.getEnergy(this.particle);
    }

    function _setParticlePosition(p) {
        this.particle.setPosition(p);
    }

    function _setParticleVelocity(v) {
        this.particle.setVelocity(v);
    }

    function _getParticlePosition() {
        return (this._dimensions === 0)
            ? this.particle.getPosition1D()
            : this.particle.getPosition();
    }

    function _getParticleVelocity() {
        return (this._dimensions === 0)
            ? this.particle.getVelocity1D()
            : this.particle.getVelocity();
    }

    function _setCallback(callback) {
        this._callback = callback;
    }

    function _wake() {
        this.PE.wake();
    }

    function _sleep() {
        this.PE.sleep();
    }

    function _update() {
        if (this.PE.isSleeping()) {
            if (this._callback) {
                var cb = this._callback;
                this._callback = undefined;
                cb();
            }
            return;
        }

        if (_getEnergy.call(this) < this._absRestTolerance) {
            _setParticlePosition.call(this, this.endState);
            _setParticleVelocity.call(this, [0,0,0]);
            _sleep.call(this);
        }
    }

    function _setupDefinition(definition) {
        var defaults = SpringTransition.DEFAULT_OPTIONS;
        if (definition.period === undefined)       definition.period       = defaults.period;
        if (definition.dampingRatio === undefined) definition.dampingRatio = defaults.dampingRatio;
        if (definition.velocity === undefined)     definition.velocity     = defaults.velocity;

        if (definition.period < 150) {
            definition.period = 150;
            console.warn('The period of a SpringTransition is capped at 150 ms. Use a SnapTransition for faster transitions');
        }

        //setup spring
        this.spring.setOptions({
            period       : definition.period,
            dampingRatio : definition.dampingRatio
        });

        //setup particle
        _setParticleVelocity.call(this, definition.velocity);
    }

    function _setAbsoluteRestTolerance() {
        var distance = this.endState.sub(this.initState).normSquared();
        this._absRestTolerance = (distance === 0)
            ? this._restTolerance
            : this._restTolerance * distance;
    }

    function _setTarget(target) {
        this.endState.set(target);
        _setAbsoluteRestTolerance.call(this);
    }

    /**
     * Resets the position and velocity
     *
     * @method reset
     *
     * @param {Number|Array.Number} pos positional state
     * @param {Number|Array} vel velocity
     */
    SpringTransition.prototype.reset = function reset(pos, vel) {
        this._dimensions = (pos instanceof Array)
            ? pos.length
            : 0;

        this.initState.set(pos);
        _setParticlePosition.call(this, pos);
        _setTarget.call(this, pos);
        if (vel) _setParticleVelocity.call(this, vel);
        _setCallback.call(this, undefined);
    };

    /**
     * Getter for velocity
     *
     * @method getVelocity
     *
     * @return {Number|Array} velocity
     */
    SpringTransition.prototype.getVelocity = function getVelocity() {
        return _getParticleVelocity.call(this);
    };

    /**
     * Setter for velocity
     *
     * @method setVelocity
     *
     * @return {Number|Array} velocity
     */
    SpringTransition.prototype.setVelocity = function setVelocity(v) {
        this.call(this, _setParticleVelocity(v));
    };

    /**
     * Detects whether a transition is in progress
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    SpringTransition.prototype.isActive = function isActive() {
        return !this.PE.isSleeping();
    };

    /**
     * Halt the transition
     *
     * @method halt
     */
    SpringTransition.prototype.halt = function halt() {
        this.set(this.get());
    };

    /**
     * Get the current position of the transition
     *
     * @method get
     *
     * @return {Number|Array} state
     */
    SpringTransition.prototype.get = function get() {
        _update.call(this);
        return _getParticlePosition.call(this);
    };

    /**
     * Set the end position and transition, with optional callback on completion.
     *
     * @method set
     *
     * @param  {Number|Array} endState Final state
     * @param {Object}  definition  Transition definition
     * @param  {Function} callback Callback
     */
    SpringTransition.prototype.set = function set(endState, definition, callback) {
        if (!definition) {
            this.reset(endState);
            if (callback) callback();
            return;
        }

        this._dimensions = (endState instanceof Array)
            ? endState.length
            : 0;

        _wake.call(this);
        _setupDefinition.call(this, definition);
        _setTarget.call(this, endState);
        _setCallback.call(this, callback);
    };

    module.exports = SpringTransition;
});
