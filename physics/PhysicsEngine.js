/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * The Physics Engine is responsible for mediating Bodies and their
     * interaction with forces and constraints. The Physics Engine handles the
     * logic of adding and removing bodies, updating their state of the over
     * time.
     *
     * @class PhysicsEngine
     * @constructor
     * @param optoins {Object} options
     */
    function PhysicsEngine(options) {
        this.options = Object.create(PhysicsEngine.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._particles      = [];   //list of managed particles
        this._bodies         = [];   //list of managed bodies
        this._agents         = {};   //hash of managed agents
        this._forces         = [];   //list of IDs of agents that are forces
        this._constraints    = [];   //list of IDs of agents that are constraints

        this._buffer         = 0.0;
        this._timestamp      = 17;
        this._minTimeStep    = 1000 / 120;
        this._maxTimestep    = 17;
        this._prevTime       = now();
        this._isSleeping     = false;
        this._eventHandler   = null;
        this._currAgentId    = 0;
        this._hasBodies      = false;
    }

    /**
     * @property PhysicsEngine.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    PhysicsEngine.DEFAULT_OPTIONS = {

        /**
         * The number of iterations the engine takes to resolve constraints
         * @attribute constraintSteps
         * @type Number
         */
        constraintSteps : 1,

        /**
         * The energy threshold before the Engine stops updating
         * @attribute sleepTolerance
         * @type Number
         */
        sleepTolerance  : 1e-7
    };

    var now = (function() {
        return Date.now;
    })();

    /**
     * Options setter
     * @method setOptions
     * @param options {Object}
     */
    PhysicsEngine.prototype.setOptions = function setOptions(opts) {
        for (var key in opts) if (this.options[key]) this.options[key] = opts[key];
    };

    /**
     * Method to add a physics body to the engine. Necessary to update the
     * body over time.
     *
     * @method addBody
     * @param body {Body}
     * @return body {Body}
     */
    PhysicsEngine.prototype.addBody = function addBody(body) {
        body._engine = this;
        if (body.isBody) {
            this._bodies.push(body);
            this._hasBodies = true;
        }
        else this._particles.push(body);
        return body;
    };

    /**
     * Remove a body from the engine. Detaches body from all forces and
     * constraints.
     *
     * @method removeBody
     * @param body {Body}
     */
    PhysicsEngine.prototype.removeBody = function removeBody(body) {
        var array = (body.isBody) ? this._bodies : this._particles;
        var index = array.indexOf(body);
        if (index > -1) {
            for (var i = 0; i < Object.keys(this._agents); i++) this.detachFrom(i, body);
            array.splice(index,1);
        }
        if (this.getBodies().length === 0) this._hasBodies = false;
    };

    function _mapAgentArray(agent) {
        if (agent.applyForce)      return this._forces;
        if (agent.applyConstraint) return this._constraints;
    }

    function _attachOne(agent, targets, source) {
        if (targets === undefined) targets = this.getParticlesAndBodies();
        if (!(targets instanceof Array)) targets = [targets];

        this._agents[this._currAgentId] = {
            agent   : agent,
            targets : targets,
            source  : source
        };

        _mapAgentArray.call(this, agent).push(this._currAgentId);
        return this._currAgentId++;
    }

    /**
     * Attaches a force or constraint to a Body. Returns an AgentId of the
     * attached agent which can be used to detach the agent.
     *
     * @method attach
     * @param agent {Agent|Array.Agent} A force, constraint, or array of them.
     * @param [targets=All] {Body|Array.Body} The Body or Bodies affected by the agent
     * @param [source] {Body} The source of the agent
     * @return AgentId {Number}
     */
    PhysicsEngine.prototype.attach = function attach(agents, targets, source) {
        if (agents instanceof Array) {
            var agentIDs = [];
            for (var i = 0; i < agents.length; i++)
                agentIDs[i] = _attachOne.call(this, agents[i], targets, source);
            return agentIDs;
        }
        else return _attachOne.call(this, agents, targets, source);
    };

    /**
     * Append a body to the targets of a previously defined physics agent.
     *
     * @method attachTo
     * @param agentID {AgentId} The agentId of a previously defined agent
     * @param target {Body} The Body affected by the agent
     */
    PhysicsEngine.prototype.attachTo = function attachTo(agentID, target) {
        _getBoundAgent.call(this, agentID).targets.push(target);
    };

    /**
     * Undoes PhysicsEngine.attach. Removes an agent and its associated
     * effect on its affected Bodies.
     *
     * @method detach
     * @param agentID {AgentId} The agentId of a previously defined agent
     */
    PhysicsEngine.prototype.detach = function detach(id) {
        // detach from forces/constraints array
        var agent = this.getAgent(id);
        var agentArray = _mapAgentArray.call(this, agent);
        var index = agentArray.indexOf(id);
        agentArray.splice(index,1);

        // detach agents array
        delete this._agents[id];
    };

    /**
     * Remove a single Body from a previously defined agent.
     *
     * @method detach
     * @param agentID {AgentId} The agentId of a previously defined agent
     * @param target {Body} The body to remove from the agent
     */
    PhysicsEngine.prototype.detachFrom = function detachFrom(id, target) {
        var boundAgent = _getBoundAgent.call(this, id);
        if (boundAgent.source === target) this.detach(id);
        else {
            var targets = boundAgent.targets;
            var index = targets.indexOf(target);
            if (index > -1) targets.splice(index,1);
        }
    };

    /**
     * A convenience method to give the Physics Engine a clean slate of
     * agents. Preserves all added Body objects.
     *
     * @method detachAll
     */
    PhysicsEngine.prototype.detachAll = function detachAll() {
        this._agents        = {};
        this._forces        = [];
        this._constraints   = [];
        this._currAgentId   = 0;
    };

    function _getBoundAgent(id) {
        return this._agents[id];
    }

    /**
     * Returns the corresponding agent given its agentId.
     *
     * @method getAgent
     * @param id {AgentId}
     */
    PhysicsEngine.prototype.getAgent = function getAgent(id) {
        return _getBoundAgent.call(this, id).agent;
    };

    /**
     * Returns all particles that are currently managed by the Physics Engine.
     *
     * @method getParticles
     * @return particles {Array.Particles}
     */
    PhysicsEngine.prototype.getParticles = function getParticles() {
        return this._particles;
    };

    /**
     * Returns all bodies, except particles, that are currently managed by the Physics Engine.
     *
     * @method getBodies
     * @return bodies {Array.Bodies}
     */
    PhysicsEngine.prototype.getBodies = function getBodies() {
        return this._bodies;
    };

    /**
     * Returns all bodies that are currently managed by the Physics Engine.
     *
     * @method getBodies
     * @return bodies {Array.Bodies}
     */
    PhysicsEngine.prototype.getParticlesAndBodies = function getParticlesAndBodies() {
        return this.getParticles().concat(this.getBodies());
    };

    /**
     * Iterates over every Particle and applies a function whose first
     * argument is the Particle
     *
     * @method forEachParticle
     * @param fn {Function} Function to iterate over
     * @param [dt] {Number} Delta time
     */
    PhysicsEngine.prototype.forEachParticle = function forEachParticle(fn, dt) {
        var particles = this.getParticles();
        for (var index = 0, len = particles.length; index < len; index++)
            fn.call(this, particles[index], dt);
    };

    /**
     * Iterates over every Body that isn't a Particle and applies
     * a function whose first argument is the Body
     *
     * @method forEachBody
     * @param fn {Function} Function to iterate over
     * @param [dt] {Number} Delta time
     */
    PhysicsEngine.prototype.forEachBody = function forEachBody(fn, dt) {
        if (!this._hasBodies) return;
        var bodies = this.getBodies();
        for (var index = 0, len = bodies.length; index < len; index++)
            fn.call(this, bodies[index], dt);
    };

    /**
     * Iterates over every Body and applies a function whose first
     * argument is the Body
     *
     * @method forEach
     * @param fn {Function} Function to iterate over
     * @param [dt] {Number} Delta time
     */
    PhysicsEngine.prototype.forEach = function forEach(fn, dt) {
        this.forEachParticle(fn, dt);
        this.forEachBody(fn, dt);
    };

    function _updateForce(index) {
        var boundAgent = _getBoundAgent.call(this, this._forces[index]);
        boundAgent.agent.applyForce(boundAgent.targets, boundAgent.source);
    }

    function _updateForces() {
        for (var index = this._forces.length - 1; index > -1; index--)
            _updateForce.call(this, index);
    }

    function _updateConstraint(index, dt) {
        var boundAgent = this._agents[this._constraints[index]];
        return boundAgent.agent.applyConstraint(boundAgent.targets, boundAgent.source, dt);
    }

    function _updateConstraints(dt) {
        var iteration = 0;
        while (iteration < this.options.constraintSteps) {
            for (var index = this._constraints.length - 1; index > -1; index--)
                _updateConstraint.call(this, index, dt);
            iteration++;
        }
    }

    function _updateVelocities(particle, dt) {
        particle.integrateVelocity(dt);
    }

    function _updateAngularVelocities(body, dt) {
        body.integrateAngularMomentum(dt);
        body.updateAngularVelocity();
    }

    function _updateOrientations(body, dt) {
        body.integrateOrientation(dt);
    }

    function _updatePositions(particle, dt) {
        particle.integratePosition(dt);
        particle.emit('update', particle);
    }

    function _integrate(dt) {
        _updateForces.call(this, dt);
        this.forEach(_updateVelocities, dt);
        this.forEachBody(_updateAngularVelocities, dt);
        _updateConstraints.call(this, dt);
        this.forEachBody(_updateOrientations, dt);
        this.forEach(_updatePositions, dt);
    }

    function _getEnergyParticles() {
        var energy = 0.0;
        var particleEnergy = 0.0;
        this.forEach(function(particle) {
            particleEnergy = particle.getEnergy();
            energy += particleEnergy;
            if (particleEnergy < particle.sleepTolerance) particle.sleep();
        });
        return energy;
    }

    function _getEnergyForces() {
        var energy = 0;
        for (var index = this._forces.length - 1; index > -1; index--)
            energy += this._forces[index].getEnergy() || 0.0;
        return energy;
    }

    function _getEnergyConstraints() {
        var energy = 0;
        for (var index = this._constraints.length - 1; index > -1; index--)
            energy += this._constraints[index].getEnergy() || 0.0;
        return energy;
    }

    /**
     * Calculates the kinetic energy of all Body objects and potential energy
     * of all attached agents.
     *
     * TODO: implement.
     * @method getEnergy
     * @return energy {Number}
     */
    PhysicsEngine.prototype.getEnergy = function getEnergy() {
        return _getEnergyParticles.call(this) + _getEnergyForces.call(this) + _getEnergyConstraints.call(this);
    };

    /**
     * Updates all Body objects managed by the physics engine over the
     * time duration since the last time step was called.
     *
     * @method step
     */
    PhysicsEngine.prototype.step = function step() {
//        if (this.getEnergy() < this.options.sleepTolerance) {
//            this.sleep();
//            return;
//        };

        //set current frame's time
        var currTime = now();

        //milliseconds elapsed since last frame
        var dtFrame = currTime - this._prevTime;

        this._prevTime = currTime;

        if (dtFrame < this._minTimeStep) return;
        if (dtFrame > this._maxTimeStep) dtFrame = this._maxTimestep;

        //robust integration
//        this._buffer += dtFrame;
//        while (this._buffer > this._timestep){
//            _integrate.call(this, this._timestep);
//            this._buffer -= this._timestep;
//        };
//        _integrate.call(this, this._buffer);
//        this._buffer = 0.0;
        _integrate.call(this, this._timestamp);

//        this.emit('update', this);
    };

    /**
     * Tells whether the Physics Engine is sleeping or awake.
     * @method isSleeping
     * @return {Boolean}
     */
    PhysicsEngine.prototype.isSleeping = function isSleeping() {
        return this._isSleeping;
    };

    /**
     * Stops the Physics Engine from updating. Emits an 'end' event.
     * @method sleep
     */
    PhysicsEngine.prototype.sleep = function sleep() {
        this.emit('end', this);
        this._isSleeping = true;
    };

    /**
     * Starts the Physics Engine from updating. Emits an 'start' event.
     * @method wake
     */
    PhysicsEngine.prototype.wake = function wake() {
        this._prevTime = now();
        this.emit('start', this);
        this._isSleeping = false;
    };

    PhysicsEngine.prototype.emit = function emit(type, data) {
        if (this._eventHandler === null) return;
        this._eventHandler.emit(type, data);
    };

    PhysicsEngine.prototype.on = function on(event, fn) {
        if (this._eventHandler === null) this._eventHandler = new EventHandler();
        this._eventHandler.on(event, fn);
    };

    module.exports = PhysicsEngine;
});
