/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {

    var RAND = Math.random;

    function _randomFloat(min,max) {
        return min + RAND() * (max - min);
    }

    function _randomInteger(min,max) {
        return (min + RAND() * (max - min + 1)) >> 0;
    }

    /**
     * Very simple uniform random number generator library wrapping Math.random().
     *
     * @class Random
     * @static
     */
    var Random = {};

    /**
     * Get single random integer between min and max (inclusive), or array
     *   of size dim if specified.
     *
     * @method integer
     *
     * @param {Number} min lower bound, default 0
     * @param {Number} max upper bound, default 1
     * @param {Number} dim (optional) dimension of output array, if specified
     * @return {number | array<number>} random integer, or optionally, an array of random integers
     */
    Random.integer = function integer(min,max,dim) {
        min = (min !== undefined) ? min : 0;
        max = (max !== undefined) ? max : 1;
        if (dim !== undefined) {
            var result = [];
            for (var i = 0; i < dim; i++) result.push(_randomInteger(min,max));
            return result;
        }
        else return _randomInteger(min,max);
    };

    /**
     * Get single random float between min and max (inclusive), or array
     *   of size dim if specified
     *
     * @method range
     *
     * @param {Number} min lower bound, default 0
     * @param {Number} max upper bound, default 1
     * @param {Number} [dim] dimension of output array, if specified
     * @return {Number} random float, or optionally an array
     */
    Random.range = function range(min,max,dim) {
        min = (min !== undefined) ? min : 0;
        max = (max !== undefined) ? max : 1;
        if (dim !== undefined) {
            var result = [];
            for (var i = 0; i < dim; i++) result.push(_randomFloat(min,max));
            return result;
        }
        else return _randomFloat(min,max);
    };

    /**
     * Return random number among the set {-1 ,1}
     *
     * @method sign
     *
     * @param {Number} prob probability of returning 1, default 0.5
     * @return {Number} random sign (-1 or 1)
     */
    Random.sign = function sign(prob) {
        prob = (prob !== undefined) ? prob : 0.5;
        return (RAND() < prob) ? 1 : -1;
    };

    /**
     * Return random boolean value, true or false.
     *
     * @method bool
     *
     * @param {Number} prob probability of returning true, default 0.5
     * @return {Boolean} random boolean
     */
    Random.bool = function bool(prob) {
        prob = (prob !== undefined) ? prob : 0.5;
        return RAND() < prob;
    };

    module.exports = Random;
});
