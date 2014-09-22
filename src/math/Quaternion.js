/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Matrix = require('./Matrix');

    /**
     * @class Quaternion
     * @constructor
     *
     * @param {Number} w
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     */
    function Quaternion(w,x,y,z) {
        if (arguments.length === 1) this.set(w);
        else {
            this.w = (w !== undefined) ? w : 1;  //Angle
            this.x = (x !== undefined) ? x : 0;  //Axis.x
            this.y = (y !== undefined) ? y : 0;  //Axis.y
            this.z = (z !== undefined) ? z : 0;  //Axis.z
        }
        return this;
    }

    var register = new Quaternion(1,0,0,0);

    /**
     * Doc: TODO
     * @method add
     * @param {Quaternion} q
     * @return {Quaternion}
     */
    Quaternion.prototype.add = function add(q) {
        return register.setWXYZ(
            this.w + q.w,
            this.x + q.x,
            this.y + q.y,
            this.z + q.z
        );
    };

    /*
     * Docs: TODO
     *
     * @method sub
     * @param {Quaternion} q
     * @return {Quaternion}
     */
    Quaternion.prototype.sub = function sub(q) {
        return register.setWXYZ(
            this.w - q.w,
            this.x - q.x,
            this.y - q.y,
            this.z - q.z
        );
    };

    /**
     * Doc: TODO
     *
     * @method scalarDivide
     * @param {Number} s
     * @return {Quaternion}
     */
    Quaternion.prototype.scalarDivide = function scalarDivide(s) {
        return this.scalarMultiply(1/s);
    };

    /*
     * Docs: TODO
     *
     * @method scalarMultiply
     * @param {Number} s
     * @return {Quaternion}
     */
    Quaternion.prototype.scalarMultiply = function scalarMultiply(s) {
        return register.setWXYZ(
            this.w * s,
            this.x * s,
            this.y * s,
            this.z * s
        );
    };

    /*
     * Docs: TODO
     *
     * @method multiply
     * @param {Quaternion} q
     * @return {Quaternion}
     */
    Quaternion.prototype.multiply = function multiply(q) {
        //left-handed coordinate system multiplication
        var x1 = this.x;
        var y1 = this.y;
        var z1 = this.z;
        var w1 = this.w;
        var x2 = q.x;
        var y2 = q.y;
        var z2 = q.z;
        var w2 = q.w || 0;

        return register.setWXYZ(
            w1*w2 - x1*x2 - y1*y2 - z1*z2,
            x1*w2 + x2*w1 + y2*z1 - y1*z2,
            y1*w2 + y2*w1 + x1*z2 - x2*z1,
            z1*w2 + z2*w1 + x2*y1 - x1*y2
        );
    };

    var conj = new Quaternion(1,0,0,0);

    /*
     * Docs: TODO
     *
     * @method rotateVector
     * @param {Vector} v
     * @return {Quaternion}
     */
    Quaternion.prototype.rotateVector = function rotateVector(v) {
        conj.set(this.conj());
        return register.set(this.multiply(v).multiply(conj));
    };

    /*
     * Docs: TODO
     *
     * @method inverse
     * @return {Quaternion}
     */
    Quaternion.prototype.inverse = function inverse() {
        return register.set(this.conj().scalarDivide(this.normSquared()));
    };

    /*
     * Docs: TODO
     *
     * @method negate
     * @return {Quaternion}
     */
    Quaternion.prototype.negate = function negate() {
        return this.scalarMultiply(-1);
    };

    /*
     * Docs: TODO
     *
     * @method conj
     * @return {Quaternion}
     */
    Quaternion.prototype.conj = function conj() {
        return register.setWXYZ(
             this.w,
            -this.x,
            -this.y,
            -this.z
        );
    };

    /*
     * Docs: TODO
     *
     * @method normalize
     * @param {Number} length
     * @return {Quaternion}
     */
    Quaternion.prototype.normalize = function normalize(length) {
        length = (length === undefined) ? 1 : length;
        return this.scalarDivide(length * this.norm());
    };

    /*
     * Docs: TODO
     *
     * @method makeFromAngleAndAxis
     * @param {Number} angle
     * @param {Vector} v
     * @return {Quaternion}
     */
    Quaternion.prototype.makeFromAngleAndAxis = function makeFromAngleAndAxis(angle, v) {
        //left handed quaternion creation: theta -> -theta
        var n  = v.normalize();
        var ha = angle*0.5;
        var s  = -Math.sin(ha);
        this.x = s*n.x;
        this.y = s*n.y;
        this.z = s*n.z;
        this.w = Math.cos(ha);
        return this;
    };

    /*
     * Docs: TODO
     *
     * @method setWXYZ
     * @param {Number} w
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @return {Quaternion}
     */
    Quaternion.prototype.setWXYZ = function setWXYZ(w,x,y,z) {
        register.clear();
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    };

    /*
     * Docs: TODO
     *
     * @method set
     * @param {Array|Quaternion} v
     * @return {Quaternion}
     */
    Quaternion.prototype.set = function set(v) {
        if (v instanceof Array) {
            this.w = 0;
            this.x = v[0];
            this.y = v[1];
            this.z = v[2];
        }
        else {
            this.w = v.w;
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
        if (this !== register) register.clear();
        return this;
    };

    /**
     * Docs: TODO
     *
     * @method put
     * @param {Quaternion} q
     * @return {Quaternion}
     */
    Quaternion.prototype.put = function put(q) {
        q.set(register);
    };

    /**
     * Doc: TODO
     *
     * @method clone
     * @return {Quaternion}
     */
    Quaternion.prototype.clone = function clone() {
        return new Quaternion(this);
    };

    /**
     * Doc: TODO
     *
     * @method clear
     * @return {Quaternion}
     */
    Quaternion.prototype.clear = function clear() {
        this.w = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    };

    /**
     * Doc: TODO
     *
     * @method isEqual
     * @param {Quaternion} q
     * @return {Boolean}
     */
    Quaternion.prototype.isEqual = function isEqual(q) {
        return q.w === this.w && q.x === this.x && q.y === this.y && q.z === this.z;
    };

    /**
     * Doc: TODO
     *
     * @method dot
     * @param {Quaternion} q
     * @return {Number}
     */
    Quaternion.prototype.dot = function dot(q) {
        return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
    };

    /**
     * Doc: TODO
     *
     * @method normSquared
     * @return {Number}
     */
    Quaternion.prototype.normSquared = function normSquared() {
        return this.dot(this);
    };

    /**
     * Doc: TODO
     *
     * @method norm
     * @return {Number}
     */
    Quaternion.prototype.norm = function norm() {
        return Math.sqrt(this.normSquared());
    };

    /**
     * Doc: TODO
     *
     * @method isZero
     * @return {Boolean}
     */
    Quaternion.prototype.isZero = function isZero() {
        return !(this.x || this.y || this.z);
    };

    /**
     * Doc: TODO
     *
     * @method getTransform
     * @return {Transform}
     */
    Quaternion.prototype.getTransform = function getTransform() {
        var temp = this.normalize(1);
        var x = temp.x;
        var y = temp.y;
        var z = temp.z;
        var w = temp.w;

        //LHC system flattened to column major = RHC flattened to row major
        return [
            1 - 2*y*y - 2*z*z,
                2*x*y - 2*z*w,
                2*x*z + 2*y*w,
            0,
                2*x*y + 2*z*w,
            1 - 2*x*x - 2*z*z,
                2*y*z - 2*x*w,
            0,
                2*x*z - 2*y*w,
                2*y*z + 2*x*w,
            1 - 2*x*x - 2*y*y,
            0,
            0,
            0,
            0,
            1
        ];
    };

    var matrixRegister = new Matrix();

    /**
     * Doc: TODO
     *
     * @method getMatrix
     * @return {Transform}
     */
    Quaternion.prototype.getMatrix = function getMatrix() {
        var temp = this.normalize(1);
        var x = temp.x;
        var y = temp.y;
        var z = temp.z;
        var w = temp.w;

        //LHC system flattened to row major
        return matrixRegister.set([
            [
                1 - 2*y*y - 2*z*z,
                    2*x*y + 2*z*w,
                    2*x*z - 2*y*w
            ],
            [
                    2*x*y - 2*z*w,
                1 - 2*x*x - 2*z*z,
                    2*y*z + 2*x*w
            ],
            [
                    2*x*z + 2*y*w,
                    2*y*z - 2*x*w,
                1 - 2*x*x - 2*y*y
            ]
        ]);
    };

    var epsilon = 1e-5;

    /**
     * Doc: TODO
     *
     * @method slerp
     * @param {Quaternion} q
     * @param {Number} t
     * @return {Transform}
     */
    Quaternion.prototype.slerp = function slerp(q, t) {
        var omega;
        var cosomega;
        var sinomega;
        var scaleFrom;
        var scaleTo;

        cosomega = this.dot(q);
        if ((1.0 - cosomega) > epsilon) {
            omega       = Math.acos(cosomega);
            sinomega    = Math.sin(omega);
            scaleFrom   = Math.sin((1.0 - t) * omega) / sinomega;
            scaleTo     = Math.sin(t * omega) / sinomega;
        }
        else {
            scaleFrom   = 1.0 - t;
            scaleTo     = t;
        }
        return register.set(this.scalarMultiply(scaleFrom/scaleTo).add(q).multiply(scaleTo));
    };

    module.exports = Quaternion;

});
