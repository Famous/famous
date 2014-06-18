/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {

    /**
     * Three-element floating point vector.
     *
     * @class Vector
     * @constructor
     *
     * @param {number} x x element value
     * @param {number} y y element value
     * @param {number} z z element value
     */
    function Vector(x,y,z) {
        if (arguments.length === 1) this.set(x);
        else {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
        return this;
    }

    var _register = new Vector(0,0,0);

    /**
     * Add this element-wise to another Vector, element-wise.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method add
     * @param {Vector} v addend
     * @return {Vector} vector sum
     */
    Vector.prototype.add = function add(v) {
        return _setXYZ.call(_register,
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        );
    };

    /**
     * Subtract another vector from this vector, element-wise.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method sub
     * @param {Vector} v subtrahend
     * @return {Vector} vector difference
     */
    Vector.prototype.sub = function sub(v) {
        return _setXYZ.call(_register,
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    };

    /**
     * Scale Vector by floating point r.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method mult
     *
     * @param {number} r scalar
     * @return {Vector} vector result
     */
    Vector.prototype.mult = function mult(r) {
        return _setXYZ.call(_register,
            r * this.x,
            r * this.y,
            r * this.z
        );
    };

    /**
     * Scale Vector by floating point 1/r.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method div
     *
     * @param {number} r scalar
     * @return {Vector} vector result
     */
    Vector.prototype.div = function div(r) {
        return this.mult(1 / r);
    };

    /**
     * Given another vector v, return cross product (v)x(this).
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method cross
     * @param {Vector} v Left Hand Vector
     * @return {Vector} vector result
     */
    Vector.prototype.cross = function cross(v) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var vx = v.x;
        var vy = v.y;
        var vz = v.z;

        return _setXYZ.call(_register,
            z * vy - y * vz,
            x * vz - z * vx,
            y * vx - x * vy
        );
    };

    /**
     * Component-wise equality test between this and Vector v.
     * @method equals
     * @param {Vector} v vector to compare
     * @return {boolean}
     */
    Vector.prototype.equals = function equals(v) {
        return (v.x === this.x && v.y === this.y && v.z === this.z);
    };

    /**
     * Rotate clockwise around x-axis by theta radians.
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method rotateX
     * @param {number} theta radians
     * @return {Vector} rotated vector
     */
    Vector.prototype.rotateX = function rotateX(theta) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return _setXYZ.call(_register,
            x,
            y * cosTheta - z * sinTheta,
            y * sinTheta + z * cosTheta
        );
    };

    /**
     * Rotate clockwise around y-axis by theta radians.
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method rotateY
     * @param {number} theta radians
     * @return {Vector} rotated vector
     */
    Vector.prototype.rotateY = function rotateY(theta) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return _setXYZ.call(_register,
            z * sinTheta + x * cosTheta,
            y,
            z * cosTheta - x * sinTheta
        );
    };

    /**
     * Rotate clockwise around z-axis by theta radians.
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method rotateZ
     * @param {number} theta radians
     * @return {Vector} rotated vector
     */
    Vector.prototype.rotateZ = function rotateZ(theta) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        return _setXYZ.call(_register,
            x * cosTheta - y * sinTheta,
            x * sinTheta + y * cosTheta,
            z
        );
    };

    /**
     * Return dot product of this with a second Vector
     * @method dot
     * @param {Vector} v second vector
     * @return {number} dot product
     */
    Vector.prototype.dot = function dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    /**
     * Return squared length of this vector
     * @method normSquared
     * @return {number} squared length
     */
    Vector.prototype.normSquared = function normSquared() {
        return this.dot(this);
    };

    /**
     * Return length of this vector
     * @method norm
     * @return {number} length
     */
    Vector.prototype.norm = function norm() {
        return Math.sqrt(this.normSquared());
    };

    /**
     * Scale Vector to specified length.
     *   If length is less than internal tolerance, set vector to [length, 0, 0].
     *   Note: This sets the internal result register, so other references to that vector will change.
     * @method normalize
     *
     * @param {number} length target length, default 1.0
     * @return {Vector}
     */
    Vector.prototype.normalize = function normalize(length) {
        if (arguments.length === 0) length = 1;
        var norm = this.norm();

        if (norm > 1e-7) return _setFromVector.call(_register, this.mult(length / norm));
        else return _setXYZ.call(_register, length, 0, 0);
    };

    /**
     * Make a separate copy of the Vector.
     *
     * @method clone
     *
     * @return {Vector}
     */
    Vector.prototype.clone = function clone() {
        return new Vector(this);
    };

    /**
     * True if and only if every value is 0 (or falsy)
     *
     * @method isZero
     *
     * @return {boolean}
     */
    Vector.prototype.isZero = function isZero() {
        return !(this.x || this.y || this.z);
    };

    function _setXYZ(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    function _setFromArray(v) {
        return _setXYZ.call(this,v[0],v[1],v[2] || 0);
    }

    function _setFromVector(v) {
        return _setXYZ.call(this, v.x, v.y, v.z);
    }

    function _setFromNumber(x) {
        return _setXYZ.call(this,x,0,0);
    }

    /**
     * Set this Vector to the values in the provided Array or Vector.
     *
     * @method set
     * @param {object} v array, Vector, or number
     * @return {Vector} this
     */
    Vector.prototype.set = function set(v) {
        if (v instanceof Array)    return _setFromArray.call(this, v);
        if (v instanceof Vector)   return _setFromVector.call(this, v);
        if (typeof v === 'number') return _setFromNumber.call(this, v);
    };

    Vector.prototype.setXYZ = function(x,y,z) {
        return _setXYZ.apply(this, arguments);
    };

    Vector.prototype.set1D = function(x) {
        return _setFromNumber.call(this, x);
    };

    /**
     * Put result of last internal register calculation in specified output vector.
     *
     * @method put
     * @param {Vector} v destination vector
     * @return {Vector} destination vector
     */

    Vector.prototype.put = function put(v) {
        if (this === _register) _setFromVector.call(v, _register);
        else _setFromVector.call(v, this);
    };

    /**
     * Set this vector to [0,0,0]
     *
     * @method clear
     */
    Vector.prototype.clear = function clear() {
        return _setXYZ.call(this,0,0,0);
    };

    /**
     * Scale this Vector down to specified "cap" length.
     *   If Vector shorter than cap, or cap is Infinity, do nothing.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method cap
     * @return {Vector} capped vector
     */
    Vector.prototype.cap = function cap(cap) {
        if (cap === Infinity) return _setFromVector.call(_register, this);
        var norm = this.norm();
        if (norm > cap) return _setFromVector.call(_register, this.mult(cap / norm));
        else return _setFromVector.call(_register, this);
    };

    /**
     * Return projection of this Vector onto another.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method project
     * @param {Vector} n vector to project upon
     * @return {Vector} projected vector
     */
    Vector.prototype.project = function project(n) {
        return n.mult(this.dot(n));
    };

    /**
     * Reflect this Vector across provided vector.
     *   Note: This sets the internal result register, so other references to that vector will change.
     *
     * @method reflectAcross
     * @param {Vector} n vector to reflect across
     * @return {Vector} reflected vector
     */
    Vector.prototype.reflectAcross = function reflectAcross(n) {
        n.normalize().put(n);
        return _setFromVector(_register, this.sub(this.project(n).mult(2)));
    };

    /**
     * Convert Vector to three-element array.
     *
     * @method get
     * @return {array<number>} three-element array
     */
    Vector.prototype.get = function get() {
        return [this.x, this.y, this.z];
    };

    Vector.prototype.get1D = function() {
        return this.x;
    };

    module.exports = Vector;

});
