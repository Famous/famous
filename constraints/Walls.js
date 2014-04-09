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
    var Wall = require('./Wall');
    var Vector = require('famous/math/Vector');

    /**
     *  Walls combines one or more Wall primitives and exposes a simple API to
     *  interact with several walls at once. A common use case would be to set up
     *  a bounding box for a physics body, that would collide with each side.
     *
     *  @class Walls
     *  @constructor
     *  @extends Constraint
     *  @uses Wall
     *  @param options {Object}
     */
    function Walls(options) {
        this.options = Object.create(Walls.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);
        _createComponents.call(this, options.sides || this.options.sides);

        Constraint.call(this);
    }

    Walls.prototype = Object.create(Constraint.prototype);
    Walls.prototype.constructor = Walls;
    /**
     * @property Walls.ON_CONTACT
     * @type Object
     * @extends Wall.ON_CONTACT
     * @static
     */
    Walls.ON_CONTACT = Wall.ON_CONTACT;
    /**
     * @property Walls.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Walls.DEFAULT_OPTIONS = {
        /**
         * An array of sides e.g., [Walls.LEFT, Walls.TOP]
         *
         * @type Array
         * @attribute sides
         * @default [Walls.LEFT, Walls.RIGHT, Walls.TOP, Walls.BOTTOM];
         */
        sides : Walls.TWO_DIMENSIONAL,

        /**
         * The size of the bounding box of the walls
         *
         * @attribute size
         * @type Array
         * @default [window.innerWidth, window.innerHeight, 0]
         */
        size : [window.innerWidth, window.innerHeight, 0],

        /**
         * The center of the wall relative to the size
         *
         * @attribute origin
         * @type Array
         * @default [.5, .5, .5]
         */
        origin : [.5, .5, .5],

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
         * The energy ratio lost in a collision (0 = stick, 1 = elastic)
         *    Range : [0, 1]
         *
         * @attribute restitution
         * @type Number
         * @default 0.5
         */
        restitution : 0.5,

        /**
         * How to handle collision against the wall
         *
         * @attribute onContact
         * @type Number
         */
        onContact : Walls.ON_CONTACT.REFLECT
    };

    /**
     * An enumeration of common types of walls
     *    LEFT, RIGHT, TOP, BOTTOM, FRONT, BACK
     *    TWO_DIMENSIONAL, THREE_DIMENSIONAL
     *
     * @property Walls.SIDES
     * @type Object
     * @final
     * @static
     */
    Walls.SIDES = {
        LEFT   : 0,
        RIGHT  : 1,
        TOP    : 2,
        BOTTOM : 3,
        FRONT  : 4,
        BACK   : 5,
        TWO_DIMENSIONAL : [0, 1, 2, 3],
        THREE_DIMENSIONAL : [0, 1, 2, 3, 4, 5]
    };

    var _SIDE_NORMALS = {
        0 : new Vector(1, 0, 0),
        1 : new Vector(-1, 0, 0),
        2 : new Vector(0, 1, 0),
        3 : new Vector(0,-1, 0),
        4 : new Vector(0, 0, 1),
        5 : new Vector(0, 0,-1)
    };

    function _getDistance(side, size, origin) {
        var distance;
        var SIDES = Walls.SIDES;
        switch (parseInt(side)) {
            case SIDES.LEFT:
                distance = size[0] * origin[0];
                break;
            case SIDES.TOP:
                distance = size[1] * origin[1];
                break;
            case SIDES.FRONT:
                distance = size[2] * origin[2];
                break;
            case SIDES.RIGHT:
                distance = size[0] * (1 - origin[0]);
                break;
            case SIDES.BOTTOM:
                distance = size[1] * (1 - origin[1]);
                break;
            case SIDES.BACK:
                distance = size[2] * (1 - origin[2]);
                break;
        }
        return distance;
    }

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Walls.prototype.setOptions = function setOptions(options) {
        var resizeFlag = false;
        if (options.restitution !== undefined) _setOptionsForEach.call(this, {restitution : options.restitution});
        if (options.drift !== undefined) _setOptionsForEach.call(this, {drift : options.drift});
        if (options.slop !== undefined) _setOptionsForEach.call(this, {slop : options.slop});
        if (options.onContact !== undefined) _setOptionsForEach.call(this, {onContact : options.onContact});
        if (options.size !== undefined) resizeFlag = true;
        if (options.sides !== undefined) this.options.sides = options.sides;
        if (options.origin !== undefined) resizeFlag = true;
        if (resizeFlag) this.setSize(options.size, options.origin);
    };

    function _createComponents(sides) {
        this.components = {};
        var components = this.components;

        for (var i = 0; i < sides.length; i++) {
            var side = sides[i];
            components[i] = new Wall({
                normal   : _SIDE_NORMALS[side].clone(),
                distance : _getDistance(side, this.options.size, this.options.origin)
            });
        }
    }

    /*
     * Setter for size.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Walls.prototype.setSize = function setSize(size, origin) {
        origin = origin || this.options.origin;
        if (origin.length < 3) origin[2] = 0.5;

        this.forEach(function(wall, side) {
            var d = _getDistance(side, size, origin);
            wall.setOptions({distance : d});
        });

        this.options.size   = size;
        this.options.origin = origin;
    };

    function _setOptionsForEach(options) {
        this.forEach(function(wall) {
            wall.setOptions(options);
        });
        for (var key in options) this.options[key] = options[key];
    }

    /**
     * Adds an impulse to a physics body's velocity due to the walls constraint
     *
     * @method applyConstraint
     * @param targets {Array.Body}  Array of bodies to apply the constraint to
     * @param source {Body}         The source of the constraint
     * @param dt {Number}           Delta time
     */
    Walls.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        this.forEach(function(wall) {
            wall.applyConstraint(targets, source, dt);
        });
    };

    /**
     * Apply a method to each wall making up the walls
     *
     * @method applyConstraint
     * @param fn {Function}  Function that takes in a wall as its first parameter
     */
    Walls.prototype.forEach = function forEach(fn) {
        for (var key in this.sides) fn(this.sides[key], key);
    };

    /**
     * Rotates the walls by an angle in the XY-plane
     *
     * @method applyConstraint
     * @param angle {Function}
     */
    Walls.prototype.rotateZ = function rotateZ(angle) {
        this.forEach(function(wall) {
            var n = wall.options.normal;
            n.rotateZ(angle).put(n);
        });
    };

    /**
     * Rotates the walls by an angle in the YZ-plane
     *
     * @method applyConstraint
     * @param angle {Function}
     */
    Walls.prototype.rotateX = function rotateX(angle) {
        this.forEach(function(wall) {
            var n = wall.options.normal;
            n.rotateX(angle).put(n);
        });
    };

    /**
     * Rotates the walls by an angle in the XZ-plane
     *
     * @method applyConstraint
     * @param angle {Function}
     */
    Walls.prototype.rotateY = function rotateY(angle) {
        this.forEach(function(wall) {
            var n = wall.options.normal;
            n.rotateY(angle).put(n);
        });
    };

    module.exports = Walls;
});
