/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Force = require('./Force');
    var Vector = require('famous/math/Vector');

    /**
     *  A force that moves a physics body to a location with a spring motion.
     *    The body can be moved to another physics body, or an anchor point.
     *
     *  @class VectorField
     *  @constructor
     *  @extends Force
     *  @param {Object} options options to set on drag
     */
    function VectorField(options) {
        Force.call(this);

        this.options = Object.create(VectorField.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.evaluation = new Vector();
    }

    VectorField.prototype = Object.create(Force.prototype);
    VectorField.prototype.constructor = VectorField;

    /**
     * @property Spring.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    VectorField.FIELDS = {
        /**
         * Constant force, e.g., gravity
         * @attribute CONSTANT
         * @type Function
         * @param v {Vector}        Current position of physics body
         * @param options {Object}  The direction of the force
         *      Pass a {direction : Vector} into the VectorField options
         * @return {Number} unscaled force
         */
        CONSTANT : function(v, options) {
            return options.direction.put(this.evaluation);
        },

        /**
         * Linear force
         * @attribute LINEAR
         * @type Function
         * @param v {Vector} Current position of physics body
         * @return {Vector} unscaled force
         */
        LINEAR : function(v) {
            return v.put(this.evaluation);
        },

        /**
         * Radial force, e.g., Hookean spring
         * @attribute RADIAL
         * @type Function
         * @param v {Vector} Current position of physics body
         * @return {Vector} unscaled force
         */
        RADIAL : function(v) {
            return v.mult(-1).put(this.evaluation);
        },

        /**
         * Spherical force
         * @attribute SPHERE_ATTRACTOR
         * @type Function
         * @param v {Vector}        Current position of physics body
         * @param options {Object}  An object with the radius of the sphere
         *      Pass a {radius : Number} into the VectorField options
         * @return {Vector} unscaled force
         */
        SPHERE_ATTRACTOR : function(v, options) {
            var norm = v.norm();
            return v.mult((options.radius - norm) / norm).put(this.evaluation);
        },

        /**
         * Point attractor force, e.g., Hookean spring with an anchor
         * @attribute POINT_ATTRACTOR
         * @type Function
         * @param v {Vector}        Current position of physics body
         * @param options {Object}  And object with the position of the attractor
         *      Pass a {position : Vector} into the VectorField options
         * @return {Vector} unscaled force
         */
        POINT_ATTRACTOR : function(v, options) {
            return options.position.sub(v).put(this.evaluation);
        }
    };

    /**
     * @property VectorField.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    VectorField.DEFAULT_OPTIONS = {

        /**
         * The strength of the force
         *    Range : [0, 10]
         * @attribute strength
         * @type Number
         * @default 1
         */
        strength : 1,

        /**
         * Type of vectorfield
         *    Range : [0, 100]
         * @attribute field
         * @type Function
         */
        field : VectorField.FIELDS.CONSTANT
    };

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param {Objects} options
     */
    VectorField.prototype.setOptions = function setOptions(options) {
        if (options.strength !== undefined) this.options.strength = options.strength;
        if (options.field !== undefined) {
            this.options.field = options.field;
            _setFieldOptions.call(this, this.options.field);
        }
    };

    function _setFieldOptions(field) {
        var FIELDS = VectorField.FIELDS;

        switch (field) {
            case FIELDS.CONSTANT:
                if (!this.options.direction) this.options.direction = new Vector(0,1,0);
                break;
            case FIELDS.POINT_ATTRACTOR:
                if (!this.options.position) this.options.position = new Vector(0,0,0);
                break;
            case FIELDS.SPHERE_ATTRACTOR:
                if (!this.options.radius) this.options.radius = 1;
                break;
        }
    }

    function _evaluate(v) {
        return this.options.field.call(this, v, this.options);
    }

    /**
     * Adds the VectorField's force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.body} Array of bodies to apply force to.
     */
    VectorField.prototype.applyForce = function applyForce(targets) {
        var force = this.force;
        var strength = this.options.strength;

        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            _evaluate.call(this, target.position)
                .mult(target.mass * strength)
                .put(force);
            target.applyForce(force);
        }
    };

    module.exports = VectorField;
});
