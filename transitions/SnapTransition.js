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
    var Spring = require('famous/physics/constraints/Snap');
    var Vector = require('famous/math/Vector');

    /**
     * SnapTransition is a method of transitioning between two values (numbers,
     * or arrays of numbers). It is similar to SpringTransition except
     * the transition can be much faster and always has a damping effect.
     *
     * @class SnapTransition
     * @constructor
     *
     * @param [state=0] {Number|Array} Initial state
     */
    function SnapTransition(state) {
        state = state || 0;

        this.endState  = new Vector(state);
        this.initState = new Vector();

        this._dimensions       = 1;
        this._restTolerance    = 1e-10;
        this._absRestTolerance = this._restTolerance;
        this._callback         = undefined;

        this.PE       = new PE();
        this.particle = new Particle();
        this.spring   = new Spring({anchor : this.endState});

        this.PE.addBody(this.particle);
        this.PE.attach(this.spring, this.particle);
    }

    SnapTransition.SUPPORTS_MULTIPLE = 3;

    /**
     * @property SnapTransition.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    SnapTransition.DEFAULT_OPTIONS = {

        /**
         * The amount of time in milliseconds taken for one complete oscillation
         * when there is no damping
         *    Range : [0, Infinity]
         *
         * @attribute period
         * @type Number
         * @default 100
         */
        period : 100,

        /**
         * The damping of the snap.
         *    Range : [0, 1]
         *
         * @attribute dampingRatio
         * @type Number
         * @default 0.2
         */
        dampingRatio : 0.2,

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

    function _wake() {
        this.PE.wake();
    }

    function _sleep() {
        this.PE.sleep();
    }

    function _setParticlePosition(p) {
        this.particle.position.set(p);
    }

    function _setParticleVelocity(v) {
        this.particle.velocity.set(v);
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

    function _setupDefinition(definition) {
        var defaults = SnapTransition.DEFAULT_OPTIONS;
        if (definition.period === undefined)       definition.period       = defaults.period;
        if (definition.dampingRatio === undefined) definition.dampingRatio = defaults.dampingRatio;
        if (definition.velocity === undefined)     definition.velocity     = defaults.velocity;

        //setup spring
        this.spring.setOptions({
            period       : definition.period,
            dampingRatio : definition.dampingRatio
        });

        //setup particle
        _setParticleVelocity.call(this, definition.velocity);
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

    /**
     * Resets the state and velocity
     *
     * @method reset
     *
     * @param state {Number|Array}      State
     * @param [velocity] {Number|Array} Velocity
     */
    SnapTransition.prototype.reset = function reset(state, velocity) {
        this._dimensions = (state instanceof Array)
            ? state.length
            : 0;

        this.initState.set(state);
        _setParticlePosition.call(this, state);
        _setTarget.call(this, state);
        if (velocity) _setParticleVelocity.call(this, velocity);
        _setCallback.call(this, undefined);
    };

    /**
     * Getter for velocity
     *
     * @method getVelocity
     *
     * @return velocity {Number|Array}
     */
    SnapTransition.prototype.getVelocity = function getVelocity() {
        return _getParticleVelocity.call(this);
    };

    /**
     * Setter for velocity
     *
     * @method setVelocity
     *
     * @return velocity {Number|Array}
     */
    SnapTransition.prototype.setVelocity = function setVelocity(velocity) {
        this.call(this, _setParticleVelocity(velocity));
    };

    /**
     * Detects whether a transition is in progress
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    SnapTransition.prototype.isActive = function isActive() {
        return !this.PE.isSleeping();
    };

    /**
     * Halt the transition
     *
     * @method halt
     */
    SnapTransition.prototype.halt = function halt() {
        this.set(this.get());
    };

    /**
     * Get the current position of the transition
s     *
     * @method get
     *
     * @return state {Number|Array}
     */
    SnapTransition.prototype.get = function get() {
        _update.call(this);
        return _getParticlePosition.call(this);
    };

    /**
     * Set the end position and transition, with optional callback on completion.
     *
     * @method set
     *
     * @param state {Number|Array}      Final state
     * @param [definition] {Object}     Transition definition
     * @param [callback] {Function}     Callback
     */
    SnapTransition.prototype.set = function set(state, definition, callback) {
        if (!definition) {
            this.reset(state);
            if (callback) callback();
            return;
        }

        this._dimensions = (state instanceof Array)
            ? state.length
            : 0;

        _wake.call(this);
        _setupDefinition.call(this, definition);
        _setTarget.call(this, state);
        _setCallback.call(this, callback);
    };

    module.exports = SnapTransition;
});
