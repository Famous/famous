/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

//TODO: test options manager
define(function(require, exports, module) {
    var Force = require('./Force');
    var Vector = require('famous/math/Vector');

    /**
     *  Repulsion is a force that repels (attracts) bodies away (towards)
     *    each other. A repulsion of negative strength is attractive.
     *
     *  @class Repulsion
     *  @constructor
     *  @extends Force
     *  @param {Object} options overwrites default options
     */
    function Repulsion(options) {
        this.options = Object.create(Repulsion.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.disp  = new Vector();

        Force.call(this);
    }

    Repulsion.prototype = Object.create(Force.prototype);
    Repulsion.prototype.constructor = Repulsion;
    /**
     * @property Repulsion.DECAY_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    Repulsion.DECAY_FUNCTIONS = {

        /**
         * A linear decay function
         * @attribute LINEAR
         * @type Function
         * @param {Number} r distance from the source body
         * @param {Number} cutoff the effective radius of influence
         */
        LINEAR : function(r, cutoff) {
            return Math.max(1 - (1 / cutoff) * r, 0);
        },

        /**
         * A Morse potential decay function (http://en.wikipedia.org/wiki/Morse_potential)
         * @attribute MORSE
         * @type Function
         * @param {Number} r distance from the source body
         * @param {Number} cutoff the minimum radius of influence
         */
        MORSE : function(r, cutoff) {
            var r0 = (cutoff === 0) ? 100 : cutoff;
            var rShifted = r + r0 * (1 - Math.log(2)); //shift by x-intercept
            return Math.max(1 - Math.pow(1 - Math.exp(rShifted/r0 - 1), 2), 0);
        },

        /**
         * An inverse distance decay function
         * @attribute INVERSE
         * @type Function
         * @param {Number} r distance from the source body
         * @param {Number} cutoff a distance shift to avoid singularities
         */
        INVERSE : function(r, cutoff) {
            return 1 / (1 - cutoff + r);
        },

        /**
         * An inverse squared distance decay function
         * @attribute GRAVITY
         * @type Function
         * @param {Number} r distance from the source body
         * @param {Number} cutoff a distance shift to avoid singularities
         */
        GRAVITY : function(r, cutoff) {
            return 1 / (1 - cutoff + r*r);
        }
    };

    /**
     * @property Repulsion.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Repulsion.DEFAULT_OPTIONS = {

        /**
         * The strength of the force
         *    Range : [0, 100]
         * @attribute strength
         * @type Number
         * @default 1
         */
        strength : 1,

        /**
         * The location of the force, if not another physics body
         *
         * @attribute anchor
         * @type Number
         * @default 0.01
         * @optional
         */
        anchor : undefined,

        /**
         * The range of the repulsive force
         * @attribute radii
         * @type Array
         * @default [0, Infinity]
         */
        range : [0, Infinity],

        /**
         * A normalization for the force to avoid singularities at the origin
         * @attribute cutoff
         * @type Number
         * @default 0
         */
        cutoff : 0,

        /**
         * The maximum magnitude of the force
         *    Range : [0, Infinity]
         * @attribute cap
         * @type Number
         * @default Infinity
         */
        cap : Infinity,

        /**
         * The type of decay the repulsive force should have
         * @attribute decayFunction
         * @type Function
         */
        decayFunction : Repulsion.DECAY_FUNCTIONS.GRAVITY
    };

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param {Objects} options
     */
    Repulsion.prototype.setOptions = function setOptions(options) {
        if (options.anchor !== undefined) {
            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
            if (options.anchor   instanceof Array)  this.options.anchor = new Vector(options.anchor);
            delete options.anchor;
        }
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds a drag force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body}  Array of bodies to apply force to
     * @param source {Body}         The source of the force
     */
    Repulsion.prototype.applyForce = function applyForce(targets, source) {
        var options     = this.options;
        var force       = this.force;
        var disp        = this.disp;

        var strength    = options.strength;
        var anchor      = options.anchor || source.position;
        var cap         = options.cap;
        var cutoff      = options.cutoff;
        var rMin        = options.range[0];
        var rMax        = options.range[1];
        var decayFn     = options.decayFunction;

        if (strength === 0) return;

        for (var index in targets) {
            var particle = targets[index];

            if (particle === source) continue;

            var m1 = particle.mass;
            var p1 = particle.position;

            disp.set(p1.sub(anchor));
            var r = disp.norm();

            if (r < rMax && r > rMin) {
                force.set(disp.normalize(strength * m1 * decayFn(r, cutoff)).cap(cap));
                particle.applyForce(force);
            }
        }

    };

    module.exports = Repulsion;
});
