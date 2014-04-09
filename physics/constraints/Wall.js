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
     *  A wall describes an infinite two-dimensional plane that physics bodies
     *    can collide with. To define a wall, you must give it a distance (from
     *    the center of the physics engine's origin, and a normal defining the plane
     *    of the wall.
     *
     *    (wall)
     *      |
     *      | (normal)     (origin)
     *      | --->            *
     *      |
     *      |    (distance)
     *      ...................
     *            (100px)
     *
     *      e.g., Wall({normal : [1,0,0], distance : 100})
     *      would be a wall 100 pixels to the left, whose normal points right
     *
     *  @class Wall
     *  @constructor
     *  @extends Constraint
     *  @param options {Object}
     */
    function Wall(options) {
        this.options = Object.create(Wall.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.diff = new Vector();
        this.impulse = new Vector();

        Constraint.call(this);
    }

    Wall.prototype = Object.create(Constraint.prototype);
    Wall.prototype.constructor = Wall;

    /**
     * @property Wall.ON_CONTACT
     * @type Object
     * @protected
     * @static
     */
    Wall.ON_CONTACT = {

        /**
         * Physical bodies bounce off the wall
         * @attribute REFLECT
         */
        REFLECT : 0,

        /**
         * Physical bodies are unaffected. Usecase is to fire events on contact.
         * @attribute SILENT
         */
        SILENT : 1
    };

    /**
     * @property Wall.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Wall.DEFAULT_OPTIONS = {

        /**
         * The energy ratio lost in a collision (0 = stick, 1 = elastic)
         *    Range : [0, 1]
         *
         * @attribute restitution
         * @type Number
         * @default 0.5
         */
        restitution : 0.5,

        /**
         * Baumgarte stabilization parameter.
         *    Makes constraints "loosely" (0) or "tightly" (1) enforced
         *    Range : [0, 1]
         *
         * @attribute drift
         * @type Number
         * @default 0.5
         */
        drift : 0.5,

        /**
         * Amount of penetration in pixels to ignore before collision event triggers
         *
         * @attribute slop
         * @type Number
         * @default 0
         */
        slop : 0,

        /**
         * The normal direction to the wall
         *
         * @attribute normal
         * @type Array
         * @required
         */
        normal : [1, 0, 0],

        /**
         * The distance from the origin that the wall is placed
         *
         * @attribute distance
         * @type Number
         * @required
         */
        distance : 0,

        /**
         * How to handle collision against the wall
         *
         * @attribute onContact
         * @type Number
         */
        onContact : Wall.ON_CONTACT.REFLECT
    };

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Wall.prototype.setOptions = function setOptions(options) {
        if (options.normal !== undefined) {
            if (options.normal instanceof Vector) this.options.normal = options.normal.clone();
            if (options.normal instanceof Array)  this.options.normal = new Vector(options.normal);
        }
        if (options.restitution !== undefined) this.options.restitution = options.restitution;
        if (options.drift !== undefined) this.options.drift = options.drift;
        if (options.slop !== undefined) this.options.slop = options.slop;
        if (options.distance !== undefined) this.options.distance = options.distance;
        if (options.onContact !== undefined) this.options.onContact = options.onContact;
    };

    function _getNormalVelocity(n, v) {
        return v.dot(n);
    }

    function _getDistanceFromOrigin(p) {
        var n = this.options.normal;
        var d = this.options.distance;
        return p.dot(n) + d;
    }

    function _onEnter(particle, overlap, dt) {
        var p = particle.position;
        var v = particle.velocity;
        var m = particle.mass;
        var n = this.options.normal;
        var action = this.options.onContact;
        var restitution = this.options.restitution;
        var impulse = this.impulse;

        var drift = this.options.drift;
        var slop = -this.options.slop;
        var gamma = 0;

        if (this._eventOutput) {
            var data = {particle : particle, wall : this, overlap : overlap, normal : n};
            this._eventOutput.emit('preCollision', data);
            this._eventOutput.emit('collision', data);
        }

        switch (action) {
            case Wall.ON_CONTACT.REFLECT:
                var lambda = (overlap < slop)
                    ? -((1 + restitution) * n.dot(v) + drift / dt * (overlap - slop)) / (m * dt + gamma)
                    : -((1 + restitution) * n.dot(v)) / (m * dt + gamma);

                impulse.set(n.mult(dt * lambda));
                particle.applyImpulse(impulse);
                particle.setPosition(p.add(n.mult(-overlap)));
                break;
        }

        if (this._eventOutput) this._eventOutput.emit('postCollision', data);
    }

    function _onExit(particle, overlap, dt) {
        var action = this.options.onContact;
        var p = particle.position;
        var n = this.options.normal;

        if (action === Wall.ON_CONTACT.REFLECT) {
            particle.setPosition(p.add(n.mult(-overlap)));
        }
    }

    /**
     * Adds an impulse to a physics body's velocity due to the wall constraint
     *
     * @method applyConstraint
     * @param targets {Array.Body}  Array of bodies to apply the constraint to
     * @param source {Body}         The source of the constraint
     * @param dt {Number}           Delta time
     */
    Wall.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var n = this.options.normal;

        for (var i = 0; i < targets.length; i++) {
            var particle = targets[i];
            var p = particle.position;
            var v = particle.velocity;
            var r = particle.radius || 0;

            var overlap = _getDistanceFromOrigin.call(this, p.add(n.mult(-r)));
            var nv = _getNormalVelocity.call(this, n, v);

            if (overlap <= 0) {
                if (nv < 0) _onEnter.call(this, particle, overlap, dt);
                else        _onExit.call(this, particle, overlap, dt);
            }
        }
    };

    module.exports = Wall;
});
