/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var PE = require('../physics/PhysicsEngine');
    var Particle = require('../physics/bodies/Particle');
    var Spring = require('../physics/forces/Spring');
    var Wall = require('../physics/constraints/Wall');
    var Vector = require('../math/Vector');

    /**
     * WallTransition is a method of transitioning between two values (numbers,
     *   or arrays of numbers) with a bounce. Unlike a SpringTransition
     *   The transition will not overshoot the target, but bounce back against it.
     *   The behavior of the bounce is specified by the transition options.
     *
     * @class WallTransition
     * @constructor
     *
     * @param {Number|Array} [state=0] Initial state
     */
    function WallTransition(state) {
        state = state || 0;

        this.endState  = new Vector(state);
        this.initState = new Vector();

        this.spring = new Spring({anchor : this.endState});
        this.wall   = new Wall();

        this._restTolerance = 1e-10;
        this._dimensions = 1;
        this._absRestTolerance = this._restTolerance;
        this._callback = undefined;

        this.PE = new PE();
        this.particle = new Particle();

        this.PE.addBody(this.particle);
        this.PE.attach([this.wall, this.spring], this.particle);
    }

    WallTransition.SUPPORTS_MULTIPLE = 3;

    /**
     * @property WallTransition.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    WallTransition.DEFAULT_OPTIONS = {

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
        velocity : 0,

        /**
         * The percentage of momentum transferred to the wall
         *
         * @attribute restitution
         * @type Number
         * @default 0.5
         */
        restitution : 0.5
    };

    function _getEnergy() {
        return this.particle.getEnergy() + this.spring.getEnergy([this.particle]);
    }

    function _setAbsoluteRestTolerance() {
        var distance = this.endState.sub(this.initState).normSquared();
        this._absRestTolerance = (distance === 0)
            ? this._restTolerance
            : this._restTolerance * distance;
    }

    function _wake() {
        this.PE.wake();
    }

    function _sleep() {
        this.PE.sleep();
    }

    function _setTarget(target) {
        this.endState.set(target);

        var dist = this.endState.sub(this.initState).norm();

        this.wall.setOptions({
            distance : this.endState.norm(),
            normal : (dist === 0)
                ? this.particle.velocity.normalize(-1)
                : this.endState.sub(this.initState).normalize(-1)
        });

        _setAbsoluteRestTolerance.call(this);
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

    function _update() {
        if (this.PE.isSleeping()) {
            if (this._callback) {
                var cb = this._callback;
                this._callback = undefined;
                cb();
            }
            return;
        }
        var energy = _getEnergy.call(this);
        if (energy < this._absRestTolerance) {
            _sleep.call(this);
            _setParticlePosition.call(this, this.endState);
            _setParticleVelocity.call(this, [0,0,0]);
        }
    }

    function _setupDefinition(def) {
        var defaults = WallTransition.DEFAULT_OPTIONS;
        if (def.period === undefined) def.period = defaults.period;
        if (def.dampingRatio === undefined) def.dampingRatio = defaults.dampingRatio;
        if (def.velocity === undefined) def.velocity = defaults.velocity;
        if (def.restitution === undefined) def.restitution = defaults.restitution;

        //setup spring
        this.spring.setOptions({
            period : def.period,
            dampingRatio : def.dampingRatio
        });

        //setup wall
        this.wall.setOptions({
            restitution : def.restitution
        });

        //setup particle
        _setParticleVelocity.call(this, def.velocity);
    }

    /**
     * Resets the state and velocity
     *
     * @method reset
     *
     * @param {Number|Array}  state     State
     * @param  {Number|Array} [velocity] Velocity
     */
    WallTransition.prototype.reset = function reset(state, velocity) {
        this._dimensions = (state instanceof Array)
            ? state.length
            : 0;

        this.initState.set(state);
        _setParticlePosition.call(this, state);
        if (velocity) _setParticleVelocity.call(this, velocity);
        _setTarget.call(this, state);
        _setCallback.call(this, undefined);
    };

    /**
     * Getter for velocity
     *
     * @method getVelocity
     *
     * @return velocity {Number|Array}
     */
    WallTransition.prototype.getVelocity = function getVelocity() {
        return _getParticleVelocity.call(this);
    };

    /**
     * Setter for velocity
     *
     * @method setVelocity
     *
     * @return velocity {Number|Array}
     */
    WallTransition.prototype.setVelocity = function setVelocity(velocity) {
        this.call(this, _setParticleVelocity(velocity));
    };

    /**
     * Detects whether a transition is in progress
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    WallTransition.prototype.isActive = function isActive() {
        return !this.PE.isSleeping();
    };

    /**
     * Halt the transition
     *
     * @method halt
     */
    WallTransition.prototype.halt = function halt() {
        this.set(this.get());
    };

    /**
     * Getter
     *
     * @method get
     *
     * @return state {Number|Array}
     */
    WallTransition.prototype.get = function get() {
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
    WallTransition.prototype.set = function set(state, definition, callback) {
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

    module.exports = WallTransition;
});
