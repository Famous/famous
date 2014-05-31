/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Entity',['require','exports','module'],function(require, exports, module) {
    /**
     * A singleton that maintains a global registry of Surfaces.
     *   Private.
     *
     * @private
     * @static
     * @class Entity
     */

    var entities = [];

    /**
     * Get entity from global index.
     *
     * @private
     * @method get
     * @param {Number} id entity reigstration id
     * @return {Surface} entity in the global index
     */
    function get(id) {
        return entities[id];
    }

    /**
     * Overwrite entity in the global index
     *
     * @private
     * @method set
     * @param {Number} id entity reigstration id
     * @return {Surface} entity to add to the global index
     */
    function set(id, entity) {
        entities[id] = entity;
    }

    /**
     * Add entity to global index
     *
     * @private
     * @method register
     * @param {Surface} entity to add to global index
     * @return {Number} new id
     */
    function register(entity) {
        var id = entities.length;
        set(id, entity);
        return id;
    }

    /**
     * Remove entity from global index
     *
     * @private
     * @method unregister
     * @param {Number} id entity reigstration id
     */
    function unregister(id) {
        set(id, null);
    }

    module.exports = {
        register: register,
        unregister: unregister,
        get: get,
        set: set
    };
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Transform',['require','exports','module'],function(require, exports, module) {

    /**
     *  A high-performance static matrix math library used to calculate
     *    affine transforms on surfaces and other renderables.
     *    Famo.us uses 4x4 matrices corresponding directly to
     *    WebKit matrices (column-major order).
     *
     *    The internal "type" of a Matrix is a 16-long float array in
     *    row-major order, with:
     *    elements [0],[1],[2],[4],[5],[6],[8],[9],[10] forming the 3x3
     *          transformation matrix;
     *    elements [12], [13], [14] corresponding to the t_x, t_y, t_z
     *           translation;
     *    elements [3], [7], [11] set to 0;
     *    element [15] set to 1.
     *    All methods are static.
     *
     * @static
     *
     * @class Transform
     */
    var Transform = {};

    // WARNING: these matrices correspond to WebKit matrices, which are
    //    transposed from their math counterparts
    Transform.precision = 1e-6;
    Transform.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    /**
     * Multiply two or more Transform matrix types to return a Transform matrix.
     *
     * @method multiply4x4
     * @static
     * @param {Transform} a left Transform
     * @param {Transform} b right Transform
     * @return {Transform}
     */
    Transform.multiply4x4 = function multiply4x4(a, b) {
        return [
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
            a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
            a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
            a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
            a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
        ];
    };

    /**
     * Fast-multiply two or more Transform matrix types to return a
     *    Matrix, assuming bottom row on each is [0 0 0 1].
     *
     * @method multiply
     * @static
     * @param {Transform} a left Transform
     * @param {Transform} b right Transform
     * @return {Transform}
     */
    Transform.multiply = function multiply(a, b) {
        return [
            a[0] * b[0] + a[4] * b[1] + a[8] * b[2],
            a[1] * b[0] + a[5] * b[1] + a[9] * b[2],
            a[2] * b[0] + a[6] * b[1] + a[10] * b[2],
            0,
            a[0] * b[4] + a[4] * b[5] + a[8] * b[6],
            a[1] * b[4] + a[5] * b[5] + a[9] * b[6],
            a[2] * b[4] + a[6] * b[5] + a[10] * b[6],
            0,
            a[0] * b[8] + a[4] * b[9] + a[8] * b[10],
            a[1] * b[8] + a[5] * b[9] + a[9] * b[10],
            a[2] * b[8] + a[6] * b[9] + a[10] * b[10],
            0,
            a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12],
            a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13],
            a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14],
            1
        ];
    };

    /**
     * Return a Transform translated by additional amounts in each
     *    dimension. This is equivalent to the result of
     *
     *    Transform.multiply(Matrix.translate(t[0], t[1], t[2]), m).
     *
     * @method thenMove
     * @static
     * @param {Transform} m a Transform
     * @param {Array.Number} t floats delta vector of length 2 or 3
     * @return {Transform}
     */
    Transform.thenMove = function thenMove(m, t) {
        if (!t[2]) t[2] = 0;
        return [m[0], m[1], m[2], 0, m[4], m[5], m[6], 0, m[8], m[9], m[10], 0, m[12] + t[0], m[13] + t[1], m[14] + t[2], 1];
    };

    /**
     * Return a Transform atrix which represents the result of a transform matrix
     *    applied after a move. This is faster than the equivalent multiply.
     *    This is equivalent to the result of:
     *
     *    Transform.multiply(m, Transform.translate(t[0], t[1], t[2])).
     *
     * @method moveThen
     * @static
     * @param {Array.Number} v vector representing initial movement
     * @param {Transform} m matrix to apply afterwards
     * @return {Transform} the resulting matrix
     */
    Transform.moveThen = function moveThen(v, m) {
        if (!v[2]) v[2] = 0;
        var t0 = v[0] * m[0] + v[1] * m[4] + v[2] * m[8];
        var t1 = v[0] * m[1] + v[1] * m[5] + v[2] * m[9];
        var t2 = v[0] * m[2] + v[1] * m[6] + v[2] * m[10];
        return Transform.thenMove(m, [t0, t1, t2]);
    };

    /**
     * Return a Transform which represents a translation by specified
     *    amounts in each dimension.
     *
     * @method translate
     * @static
     * @param {Number} x x translation
     * @param {Number} y y translation
     * @param {Number} z z translation
     * @return {Transform}
     */
    Transform.translate = function translate(x, y, z) {
        if (z === undefined) z = 0;
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
    };

    /**
     * Return a Transform scaled by a vector in each
     *    dimension. This is a more performant equivalent to the result of
     *
     *    Transform.multiply(Transform.scale(s[0], s[1], s[2]), m).
     *
     * @method thenScale
     * @static
     * @param {Transform} m a matrix
     * @param {Array.Number} s delta vector (array of floats &&
     *    array.length == 3)
     * @return {Transform}
     */
    Transform.thenScale = function thenScale(m, s) {
        return [
            s[0] * m[0], s[1] * m[1], s[2] * m[2], 0,
            s[0] * m[4], s[1] * m[5], s[2] * m[6], 0,
            s[0] * m[8], s[1] * m[9], s[2] * m[10], 0,
            s[0] * m[12], s[1] * m[13], s[2] * m[14], 1
        ];
    };

    /**
     * Return a Transform which represents a scale by specified amounts
     *    in each dimension.
     *
     * @method scale
     * @static
     * @param {Number} x x scale factor
     * @param {Number} y y scale factor
     * @param {Number} z z scale factor
     * @return {Transform}
     */
    Transform.scale = function scale(x, y, z) {
        if (z === undefined) z = 1;
        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the x axis.
     *
     * @method rotateX
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateX = function rotateX(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [1, 0, 0, 0, 0, cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the y axis.
     *
     * @method rotateY
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateY = function rotateY(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, 0, -sinTheta, 0, 0, 1, 0, 0, sinTheta, 0, cosTheta, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents a clockwise
     *    rotation around the z axis.
     *
     * @method rotateZ
     * @static
     * @param {Number} theta radians
     * @return {Transform}
     */
    Transform.rotateZ = function rotateZ(theta) {
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        return [cosTheta, sinTheta, 0, 0, -sinTheta, cosTheta, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform which represents composed clockwise
     *    rotations along each of the axes. Equivalent to the result of
     *    Matrix.multiply(rotateX(phi), rotateY(theta), rotateZ(psi)).
     *
     * @method rotate
     * @static
     * @param {Number} phi radians to rotate about the positive x axis
     * @param {Number} theta radians to rotate about the positive y axis
     * @param {Number} psi radians to rotate about the positive z axis
     * @return {Transform}
     */
    Transform.rotate = function rotate(phi, theta, psi) {
        var cosPhi = Math.cos(phi);
        var sinPhi = Math.sin(phi);
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);
        var cosPsi = Math.cos(psi);
        var sinPsi = Math.sin(psi);
        var result = [
            cosTheta * cosPsi,
            cosPhi * sinPsi + sinPhi * sinTheta * cosPsi,
            sinPhi * sinPsi - cosPhi * sinTheta * cosPsi,
            0,
            -cosTheta * sinPsi,
            cosPhi * cosPsi - sinPhi * sinTheta * sinPsi,
            sinPhi * cosPsi + cosPhi * sinTheta * sinPsi,
            0,
            sinTheta,
            -sinPhi * cosTheta,
            cosPhi * cosTheta,
            0,
            0, 0, 0, 1
        ];
        return result;
    };

    /**
     * Return a Transform which represents an axis-angle rotation
     *
     * @method rotateAxis
     * @static
     * @param {Array.Number} v unit vector representing the axis to rotate about
     * @param {Number} theta radians to rotate clockwise about the axis
     * @return {Transform}
     */
    Transform.rotateAxis = function rotateAxis(v, theta) {
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        var verTheta = 1 - cosTheta; // versine of theta

        var xxV = v[0] * v[0] * verTheta;
        var xyV = v[0] * v[1] * verTheta;
        var xzV = v[0] * v[2] * verTheta;
        var yyV = v[1] * v[1] * verTheta;
        var yzV = v[1] * v[2] * verTheta;
        var zzV = v[2] * v[2] * verTheta;
        var xs = v[0] * sinTheta;
        var ys = v[1] * sinTheta;
        var zs = v[2] * sinTheta;

        var result = [
            xxV + cosTheta, xyV + zs, xzV - ys, 0,
            xyV - zs, yyV + cosTheta, yzV + xs, 0,
            xzV + ys, yzV - xs, zzV + cosTheta, 0,
            0, 0, 0, 1
        ];
        return result;
    };

    /**
     * Return a Transform which represents a transform matrix applied about
     * a separate origin point.
     *
     * @method aboutOrigin
     * @static
     * @param {Array.Number} v origin point to apply matrix
     * @param {Transform} m matrix to apply
     * @return {Transform}
     */
    Transform.aboutOrigin = function aboutOrigin(v, m) {
        var t0 = v[0] - (v[0] * m[0] + v[1] * m[4] + v[2] * m[8]);
        var t1 = v[1] - (v[0] * m[1] + v[1] * m[5] + v[2] * m[9]);
        var t2 = v[2] - (v[0] * m[2] + v[1] * m[6] + v[2] * m[10]);
        return Transform.thenMove(m, [t0, t1, t2]);
    };

    /**
     * Return a Transform representation of a skew transformation
     *
     * @method skew
     * @static
     * @param {Number} phi scale factor skew in the x axis
     * @param {Number} theta scale factor skew in the y axis
     * @param {Number} psi scale factor skew in the z axis
     * @return {Transform}
     */
    Transform.skew = function skew(phi, theta, psi) {
        return [1, 0, 0, 0, Math.tan(psi), 1, 0, 0, Math.tan(theta), Math.tan(phi), 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the x-direction
     *
     * @method skewX
     * @static
     * @param {Number} angle the angle between the top and left sides
     * @return {Transform}
     */
    Transform.skewX = function skewX(angle) {
        return [1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Return a Transform representation of a skew in the y-direction
     *
     * @method skewY
     * @static
     * @param {Number} angle the angle between the top and right sides
     * @return {Transform}
     */
    Transform.skewY = function skewY(angle) {
        return [1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    /**
     * Returns a perspective Transform matrix
     *
     * @method perspective
     * @static
     * @param {Number} focusZ z position of focal point
     * @return {Transform}
     */
    Transform.perspective = function perspective(focusZ) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, -1 / focusZ, 0, 0, 0, 1];
    };

    /**
     * Return translation vector component of given Transform
     *
     * @method getTranslate
     * @static
     * @param {Transform} m Transform
     * @return {Array.Number} the translation vector [t_x, t_y, t_z]
     */
    Transform.getTranslate = function getTranslate(m) {
        return [m[12], m[13], m[14]];
    };

    /**
     * Return inverse affine transform for given Transform.
     *   Note: This assumes m[3] = m[7] = m[11] = 0, and m[15] = 1.
     *   Will provide incorrect results if not invertible or preconditions not met.
     *
     * @method inverse
     * @static
     * @param {Transform} m Transform
     * @return {Transform}
     */
    Transform.inverse = function inverse(m) {
        // only need to consider 3x3 section for affine
        var c0 = m[5] * m[10] - m[6] * m[9];
        var c1 = m[4] * m[10] - m[6] * m[8];
        var c2 = m[4] * m[9] - m[5] * m[8];
        var c4 = m[1] * m[10] - m[2] * m[9];
        var c5 = m[0] * m[10] - m[2] * m[8];
        var c6 = m[0] * m[9] - m[1] * m[8];
        var c8 = m[1] * m[6] - m[2] * m[5];
        var c9 = m[0] * m[6] - m[2] * m[4];
        var c10 = m[0] * m[5] - m[1] * m[4];
        var detM = m[0] * c0 - m[1] * c1 + m[2] * c2;
        var invD = 1 / detM;
        var result = [
            invD * c0, -invD * c4, invD * c8, 0,
            -invD * c1, invD * c5, -invD * c9, 0,
            invD * c2, -invD * c6, invD * c10, 0,
            0, 0, 0, 1
        ];
        result[12] = -m[12] * result[0] - m[13] * result[4] - m[14] * result[8];
        result[13] = -m[12] * result[1] - m[13] * result[5] - m[14] * result[9];
        result[14] = -m[12] * result[2] - m[13] * result[6] - m[14] * result[10];
        return result;
    };

    /**
     * Returns the transpose of a 4x4 matrix
     *
     * @method transpose
     * @static
     * @param {Transform} m matrix
     * @return {Transform} the resulting transposed matrix
     */
    Transform.transpose = function transpose(m) {
        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
    };

    function _normSquared(v) {
        return (v.length === 2) ? v[0] * v[0] + v[1] * v[1] : v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    }
    function _norm(v) {
        return Math.sqrt(_normSquared(v));
    }
    function _sign(n) {
        return (n < 0) ? -1 : 1;
    }

    /**
     * Decompose Transform into separate .translate, .rotate, .scale,
     *    and .skew components.
     *
     * @method interpret
     * @static
     * @param {Transform} M transform matrix
     * @return {Object} matrix spec object with component matrices .translate,
     *    .rotate, .scale, .skew
     */
    Transform.interpret = function interpret(M) {

        // QR decomposition via Householder reflections
        //FIRST ITERATION

        //default Q1 to the identity matrix;
        var x = [M[0], M[1], M[2]];                // first column vector
        var sgn = _sign(x[0]);                     // sign of first component of x (for stability)
        var xNorm = _norm(x);                      // norm of first column vector
        var v = [x[0] + sgn * xNorm, x[1], x[2]];  // v = x + sign(x[0])|x|e1
        var mult = 2 / _normSquared(v);            // mult = 2/v'v

        //bail out if our Matrix is singular
        if (mult >= Infinity) {
            return {translate: Transform.getTranslate(M), rotate: [0, 0, 0], scale: [0, 0, 0], skew: [0, 0, 0]};
        }

        //evaluate Q1 = I - 2vv'/v'v
        var Q1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonals
        Q1[0]  = 1 - mult * v[0] * v[0];    // 0,0 entry
        Q1[5]  = 1 - mult * v[1] * v[1];    // 1,1 entry
        Q1[10] = 1 - mult * v[2] * v[2];    // 2,2 entry

        //upper diagonal
        Q1[1] = -mult * v[0] * v[1];        // 0,1 entry
        Q1[2] = -mult * v[0] * v[2];        // 0,2 entry
        Q1[6] = -mult * v[1] * v[2];        // 1,2 entry

        //lower diagonal
        Q1[4] = Q1[1];                      // 1,0 entry
        Q1[8] = Q1[2];                      // 2,0 entry
        Q1[9] = Q1[6];                      // 2,1 entry

        //reduce first column of M
        var MQ1 = Transform.multiply(Q1, M);

        //SECOND ITERATION on (1,1) minor
        var x2 = [MQ1[5], MQ1[6]];
        var sgn2 = _sign(x2[0]);                    // sign of first component of x (for stability)
        var x2Norm = _norm(x2);                     // norm of first column vector
        var v2 = [x2[0] + sgn2 * x2Norm, x2[1]];    // v = x + sign(x[0])|x|e1
        var mult2 = 2 / _normSquared(v2);           // mult = 2/v'v

        //evaluate Q2 = I - 2vv'/v'v
        var Q2 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];

        //diagonal
        Q2[5]  = 1 - mult2 * v2[0] * v2[0]; // 1,1 entry
        Q2[10] = 1 - mult2 * v2[1] * v2[1]; // 2,2 entry

        //off diagonals
        Q2[6] = -mult2 * v2[0] * v2[1];     // 2,1 entry
        Q2[9] = Q2[6];                      // 1,2 entry

        //calc QR decomposition. Q = Q1*Q2, R = Q'*M
        var Q = Transform.multiply(Q2, Q1);      //note: really Q transpose
        var R = Transform.multiply(Q, M);

        //remove negative scaling
        var remover = Transform.scale(R[0] < 0 ? -1 : 1, R[5] < 0 ? -1 : 1, R[10] < 0 ? -1 : 1);
        R = Transform.multiply(R, remover);
        Q = Transform.multiply(remover, Q);

        //decompose into rotate/scale/skew matrices
        var result = {};
        result.translate = Transform.getTranslate(M);
        result.rotate = [Math.atan2(-Q[6], Q[10]), Math.asin(Q[2]), Math.atan2(-Q[1], Q[0])];
        if (!result.rotate[0]) {
            result.rotate[0] = 0;
            result.rotate[2] = Math.atan2(Q[4], Q[5]);
        }
        result.scale = [R[0], R[5], R[10]];
        result.skew = [Math.atan2(R[9], result.scale[2]), Math.atan2(R[8], result.scale[2]), Math.atan2(R[4], result.scale[0])];

        //double rotation workaround
        if (Math.abs(result.rotate[0]) + Math.abs(result.rotate[2]) > 1.5 * Math.PI) {
            result.rotate[1] = Math.PI - result.rotate[1];
            if (result.rotate[1] > Math.PI) result.rotate[1] -= 2 * Math.PI;
            if (result.rotate[1] < -Math.PI) result.rotate[1] += 2 * Math.PI;
            if (result.rotate[0] < 0) result.rotate[0] += Math.PI;
            else result.rotate[0] -= Math.PI;
            if (result.rotate[2] < 0) result.rotate[2] += Math.PI;
            else result.rotate[2] -= Math.PI;
        }

        return result;
    };

    /**
     * Weighted average between two matrices by averaging their
     *     translation, rotation, scale, skew components.
     *     f(M1,M2,t) = (1 - t) * M1 + t * M2
     *
     * @method average
     * @static
     * @param {Transform} M1 f(M1,M2,0) = M1
     * @param {Transform} M2 f(M1,M2,1) = M2
     * @param {Number} t
     * @return {Transform}
     */
    Transform.average = function average(M1, M2, t) {
        t = (t === undefined) ? 0.5 : t;
        var specM1 = Transform.interpret(M1);
        var specM2 = Transform.interpret(M2);

        var specAvg = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: [0, 0, 0],
            skew: [0, 0, 0]
        };

        for (var i = 0; i < 3; i++) {
            specAvg.translate[i] = (1 - t) * specM1.translate[i] + t * specM2.translate[i];
            specAvg.rotate[i] = (1 - t) * specM1.rotate[i] + t * specM2.rotate[i];
            specAvg.scale[i] = (1 - t) * specM1.scale[i] + t * specM2.scale[i];
            specAvg.skew[i] = (1 - t) * specM1.skew[i] + t * specM2.skew[i];
        }
        return Transform.build(specAvg);
    };

    /**
     * Compose .translate, .rotate, .scale, .skew components into
     * Transform matrix
     *
     * @method build
     * @static
     * @param {matrixSpec} spec object with component matrices .translate,
     *    .rotate, .scale, .skew
     * @return {Transform} composed transform
     */
    Transform.build = function build(spec) {
        var scaleMatrix = Transform.scale(spec.scale[0], spec.scale[1], spec.scale[2]);
        var skewMatrix = Transform.skew(spec.skew[0], spec.skew[1], spec.skew[2]);
        var rotateMatrix = Transform.rotate(spec.rotate[0], spec.rotate[1], spec.rotate[2]);
        return Transform.thenMove(Transform.multiply(Transform.multiply(rotateMatrix, skewMatrix), scaleMatrix), spec.translate);
    };

    /**
     * Determine if two Transforms are component-wise equal
     *   Warning: breaks on perspective Transforms
     *
     * @method equals
     * @static
     * @param {Transform} a matrix
     * @param {Transform} b matrix
     * @return {boolean}
     */
    Transform.equals = function equals(a, b) {
        return !Transform.notEquals(a, b);
    };

    /**
     * Determine if two Transforms are component-wise unequal
     *   Warning: breaks on perspective Transforms
     *
     * @method notEquals
     * @static
     * @param {Transform} a matrix
     * @param {Transform} b matrix
     * @return {boolean}
     */
    Transform.notEquals = function notEquals(a, b) {
        if (a === b) return false;

        // shortci
        return !(a && b) ||
            a[12] !== b[12] || a[13] !== b[13] || a[14] !== b[14] ||
            a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2] ||
            a[4] !== b[4] || a[5] !== b[5] || a[6] !== b[6] ||
            a[8] !== b[8] || a[9] !== b[9] || a[10] !== b[10];
    };

    /**
     * Constrain angle-trio components to range of [-pi, pi).
     *
     * @method normalizeRotation
     * @static
     * @param {Array.Number} rotation phi, theta, psi (array of floats
     *    && array.length == 3)
     * @return {Array.Number} new phi, theta, psi triplet
     *    (array of floats && array.length == 3)
     */
    Transform.normalizeRotation = function normalizeRotation(rotation) {
        var result = rotation.slice(0);
        if (result[0] === Math.PI * 0.5 || result[0] === -Math.PI * 0.5) {
            result[0] = -result[0];
            result[1] = Math.PI - result[1];
            result[2] -= Math.PI;
        }
        if (result[0] > Math.PI * 0.5) {
            result[0] = result[0] - Math.PI;
            result[1] = Math.PI - result[1];
            result[2] -= Math.PI;
        }
        if (result[0] < -Math.PI * 0.5) {
            result[0] = result[0] + Math.PI;
            result[1] = -Math.PI - result[1];
            result[2] -= Math.PI;
        }
        while (result[1] < -Math.PI) result[1] += 2 * Math.PI;
        while (result[1] >= Math.PI) result[1] -= 2 * Math.PI;
        while (result[2] < -Math.PI) result[2] += 2 * Math.PI;
        while (result[2] >= Math.PI) result[2] -= 2 * Math.PI;
        return result;
    };

    /**
     * (Property) Array defining a translation forward in z by 1
     *
     * @property {array} inFront
     * @static
     * @final
     */
    Transform.inFront = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1e-3, 1];

    /**
     * (Property) Array defining a translation backwards in z by 1
     *
     * @property {array} behind
     * @static
     * @final
     */
    Transform.behind = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -1e-3, 1];

    module.exports = Transform;
});


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/SpecParser',['require','exports','module','./Transform'],function(require, exports, module) {
    var Transform = require('./Transform');

    /**
     *
     * This object translates the rendering instructions ("render specs")
     *   that renderable components generate into document update
     *   instructions ("update specs").  Private.
     *
     * @private
     * @class SpecParser
     * @constructor
     */
    function SpecParser() {
        this.result = {};
    }
    SpecParser._instance = new SpecParser();

    /**
     * Convert a render spec coming from the context's render chain to an
     *    update spec for the update chain. This is the only major entry point
     *    for a consumer of this class.
     *
     * @method parse
     * @static
     * @private
     *
     * @param {renderSpec} spec input render spec
     * @param {Object} context context to do the parse in
     * @return {Object} the resulting update spec (if no callback
     *   specified, else none)
     */
    SpecParser.parse = function parse(spec, context) {
        return SpecParser._instance.parse(spec, context);
    };

    /**
     * Convert a renderSpec coming from the context's render chain to an update
     *    spec for the update chain. This is the only major entrypoint for a
     *    consumer of this class.
     *
     * @method parse
     *
     * @private
     * @param {renderSpec} spec input render spec
     * @param {Context} context
     * @return {updateSpec} the resulting update spec
     */
    SpecParser.prototype.parse = function parse(spec, context) {
        this.reset();
        this._parseSpec(spec, context, Transform.identity);
        return this.result;
    };

    /**
     * Prepare SpecParser for re-use (or first use) by setting internal state
     *  to blank.
     *
     * @private
     * @method reset
     */
    SpecParser.prototype.reset = function reset() {
        this.result = {};
    };

    // Multiply matrix M by vector v
    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    var _originZeroZero = [0, 0];

    // From the provided renderSpec tree, recursively compose opacities,
    //    origins, transforms, and sizes corresponding to each surface id from
    //    the provided renderSpec tree structure. On completion, those
    //    properties of 'this' object should be ready to use to build an
    //    updateSpec.
    SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext) {
        var id;
        var target;
        var transform;
        var opacity;
        var origin;
        var align;
        var size;

        if (typeof spec === 'number') {
            id = spec;
            transform = parentContext.transform;
            align = parentContext.align || parentContext.origin;
            if (parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
            }
            this.result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _originZeroZero,
                align: parentContext.align || parentContext.origin || _originZeroZero,
                size: parentContext.size
            };
        }
        else if (!spec) { // placed here so 0 will be cached earlier
            return;
        }
        else if (spec instanceof Array) {
            for (var i = 0; i < spec.length; i++) {
                this._parseSpec(spec[i], parentContext, sizeContext);
            }
        }
        else {
            target = spec.target;
            transform = parentContext.transform;
            opacity = parentContext.opacity;
            origin = parentContext.origin;
            align = parentContext.align;
            size = parentContext.size;
            var nextSizeContext = sizeContext;

            if (spec.opacity !== undefined) opacity = parentContext.opacity * spec.opacity;
            if (spec.transform) transform = Transform.multiply(parentContext.transform, spec.transform);
            if (spec.origin) {
                origin = spec.origin;
                nextSizeContext = parentContext.transform;
            }
            if (spec.align) align = spec.align;
            if (spec.size) {
                var parentSize = parentContext.size;
                size = [
                    spec.size[0] !== undefined ? spec.size[0] : parentSize[0],
                    spec.size[1] !== undefined ? spec.size[1] : parentSize[1]
                ];
                if (parentSize) {
                    if (!align) align = origin;
                    if (align && (align[0] || align[1])) transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext));
                    if (origin && (origin[0] || origin[1])) transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                }
                nextSizeContext = parentContext.transform;
                origin = null;
                align = null;
            }

            this._parseSpec(target, {
                transform: transform,
                opacity: opacity,
                origin: origin,
                align: align,
                size: size
            }, nextSizeContext);
        }
    };

    module.exports = SpecParser;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/RenderNode',['require','exports','module','./Entity','./SpecParser'],function(require, exports, module) {
    var Entity = require('./Entity');
    var SpecParser = require('./SpecParser');

    /**
     * A wrapper for inserting a renderable component (like a Modifer or
     *   Surface) into the render tree.
     *
     * @class RenderNode
     * @constructor
     *
     * @param {Object} object Target renderable component
     */
    function RenderNode(object) {
        this._object = null;
        this._child = null;
        this._hasMultipleChildren = false;
        this._isRenderable = false;
        this._isModifier = false;

        this._resultCache = {};
        this._prevResults = {};

        this._childResult = null;

        if (object) this.set(object);
    }

    /**
     * Append a renderable to the list of this node's children.
     *   This produces a new RenderNode in the tree.
     *   Note: Does not double-wrap if child is a RenderNode already.
     *
     * @method add
     * @param {Object} child renderable object
     * @return {RenderNode} new render node wrapping child
     */
    RenderNode.prototype.add = function add(child) {
        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);
        if (this._child instanceof Array) this._child.push(childNode);
        else if (this._child) {
            this._child = [this._child, childNode];
            this._hasMultipleChildren = true;
            this._childResult = []; // to be used later
        }
        else this._child = childNode;

        return childNode;
    };

    /**
     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
     *
     * @method get
     *
     * @return {Ojbect} contained renderable object
     */
    RenderNode.prototype.get = function get() {
        return this._object || (this._hasMultipleChildren ? null : (this._child ? this._child.get() : null));
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(child) {
        this._childResult = null;
        this._hasMultipleChildren = false;
        this._isRenderable = child.render ? true : false;
        this._isModifier = child.modify ? true : false;
        this._object = child;
        this._child = null;
        if (child instanceof RenderNode) return child;
        else return this;
    };

    /**
     * Get render size of contained object.
     *
     * @method getSize
     * @return {Array.Number} size of this or size of single child.
     */
    RenderNode.prototype.getSize = function getSize() {
        var result = null;
        var target = this.get();
        if (target && target.getSize) result = target.getSize();
        if (!result && this._child && this._child.getSize) result = this._child.getSize();
        return result;
    };

    // apply results of rendering this subtree to the document
    function _applyCommit(spec, context, cacheStorage) {
        var result = SpecParser.parse(spec, context);
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            var childNode = Entity.get(id);
            var commitParams = result[id];
            commitParams.allocator = context.allocator;
            var commitResult = childNode.commit(commitParams);
            if (commitResult) _applyCommit(commitResult, context, cacheStorage);
            else cacheStorage[id] = commitParams;
        }
    }

    /**
     * Commit the content change from this node to the document.
     *
     * @private
     * @method commit
     * @param {Context} context render context
     */
    RenderNode.prototype.commit = function commit(context) {
        // free up some divs from the last loop
        var prevKeys = Object.keys(this._prevResults);
        for (var i = 0; i < prevKeys.length; i++) {
            var id = prevKeys[i];
            if (this._resultCache[id] === undefined) {
                var object = Entity.get(id);
                if (object.cleanup) object.cleanup(context.allocator);
            }
        }

        this._prevResults = this._resultCache;
        this._resultCache = {};
        _applyCommit(this.render(), context, this._resultCache);
    };

    /**
     * Generate a render spec from the contents of the wrapped component.
     *
     * @private
     * @method render
     *
     * @return {Object} render specification for the component subtree
     *    only under this node.
     */
    RenderNode.prototype.render = function render() {
        if (this._isRenderable) return this._object.render();

        var result = null;
        if (this._hasMultipleChildren) {
            result = this._childResult;
            var children = this._child;
            for (var i = 0; i < children.length; i++) {
                result[i] = children[i].render();
            }
        }
        else if (this._child) result = this._child.render();

        return this._isModifier ? this._object.modify(result) : result;
    };

    module.exports = RenderNode;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/EventEmitter',['require','exports','module'],function(require, exports, module) {
    /**
     * EventEmitter represents a channel for events.
     *
     * @class EventEmitter
     * @constructor
     */
    function EventEmitter() {
        this.listeners = {};
        this._owner = this;
    }

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventEmitter.prototype.emit = function emit(type, event) {
        var handlers = this.listeners[type];
        if (handlers) {
            for (var i = 0; i < handlers.length; i++) {
                handlers[i].call(this._owner, event);
            }
        }
        return this;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
   EventEmitter.prototype.on = function on(type, handler) {
        if (!(type in this.listeners)) this.listeners[type] = [];
        var index = this.listeners[type].indexOf(handler);
        if (index < 0) this.listeners[type].push(handler);
        return this;
    };

    /**
     * Alias for "on".
     * @method addListener
     */
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

   /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventEmitter} this
     */
    EventEmitter.prototype.removeListener = function removeListener(type, handler) {
        var index = this.listeners[type].indexOf(handler);
        if (index >= 0) this.listeners[type].splice(index, 1);
        return this;
    };

    /**
     * Call event handlers with this set to owner.
     *
     * @method bindThis
     *
     * @param {Object} owner object this EventEmitter belongs to
     */
    EventEmitter.prototype.bindThis = function bindThis(owner) {
        this._owner = owner;
    };

    module.exports = EventEmitter;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/EventHandler',['require','exports','module','./EventEmitter'],function(require, exports, module) {
    var EventEmitter = require('./EventEmitter');

    /**
     * EventHandler forwards received events to a set of provided callback functions.
     * It allows events to be captured, processed, and optionally piped through to other event handlers.
     *
     * @class EventHandler
     * @extends EventEmitter
     * @constructor
     */
    function EventHandler() {
        EventEmitter.apply(this, arguments);

        this.downstream = []; // downstream event handlers
        this.downstreamFn = []; // downstream functions

        this.upstream = []; // upstream event handlers
        this.upstreamListeners = {}; // upstream listeners
    }
    EventHandler.prototype = Object.create(EventEmitter.prototype);
    EventHandler.prototype.constructor = EventHandler;

    /**
     * Assign an event handler to receive an object's input events.
     *
     * @method setInputHandler
     * @static
     *
     * @param {Object} object object to mix trigger, subscribe, and unsubscribe functions into
     * @param {EventHandler} handler assigned event handler
     */
    EventHandler.setInputHandler = function setInputHandler(object, handler) {
        object.trigger = handler.trigger.bind(handler);
        if (handler.subscribe && handler.unsubscribe) {
            object.subscribe = handler.subscribe.bind(handler);
            object.unsubscribe = handler.unsubscribe.bind(handler);
        }
    };

    /**
     * Assign an event handler to receive an object's output events.
     *
     * @method setOutputHandler
     * @static
     *
     * @param {Object} object object to mix pipe, unpipe, on, addListener, and removeListener functions into
     * @param {EventHandler} handler assigned event handler
     */
    EventHandler.setOutputHandler = function setOutputHandler(object, handler) {
        if (handler instanceof EventHandler) handler.bindThis(object);
        object.pipe = handler.pipe.bind(handler);
        object.unpipe = handler.unpipe.bind(handler);
        object.on = handler.on.bind(handler);
        object.addListener = object.on;
        object.removeListener = handler.removeListener.bind(handler);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventHandler.prototype.emit = function emit(type, event) {
        EventEmitter.prototype.emit.apply(this, arguments);
        var i = 0;
        for (i = 0; i < this.downstream.length; i++) {
            if (this.downstream[i].trigger) this.downstream[i].trigger(type, event);
        }
        for (i = 0; i < this.downstreamFn.length; i++) {
            this.downstreamFn[i](type, event);
        }
        return this;
    };

    /**
     * Alias for emit
     * @method addListener
     */
    EventHandler.prototype.trigger = EventHandler.prototype.emit;

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    EventHandler.prototype.pipe = function pipe(target) {
        if (target.subscribe instanceof Function) return target.subscribe(this);

        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if (index < 0) downstreamCtx.push(target);

        if (target instanceof Function) target('pipe', null);
        else if (target.trigger) target.trigger('pipe', null);

        return target;
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    EventHandler.prototype.unpipe = function unpipe(target) {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(this);

        var downstreamCtx = (target instanceof Function) ? this.downstreamFn : this.downstream;
        var index = downstreamCtx.indexOf(target);
        if (index >= 0) {
            downstreamCtx.splice(index, 1);
            if (target instanceof Function) target('unpipe', null);
            else if (target.trigger) target.trigger('unpipe', null);
            return target;
        }
        else return false;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    EventHandler.prototype.on = function on(type, handler) {
        EventEmitter.prototype.on.apply(this, arguments);
        if (!(type in this.upstreamListeners)) {
            var upstreamListener = this.trigger.bind(this, type);
            this.upstreamListeners[type] = upstreamListener;
            for (var i = 0; i < this.upstream.length; i++) {
                this.upstream[i].on(type, upstreamListener);
            }
        }
        return this;
    };

    /**
     * Alias for "on"
     * @method addListener
     */
    EventHandler.prototype.addListener = EventHandler.prototype.on;

    /**
     * Listen for events from an upstream event handler.
     *
     * @method subscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    EventHandler.prototype.subscribe = function subscribe(source) {
        var index = this.upstream.indexOf(source);
        if (index < 0) {
            this.upstream.push(source);
            for (var type in this.upstreamListeners) {
                source.on(type, this.upstreamListeners[type]);
            }
        }
        return this;
    };

    /**
     * Stop listening to events from an upstream event handler.
     *
     * @method unsubscribe
     *
     * @param {EventEmitter} source source emitter object
     * @return {EventHandler} this
     */
    EventHandler.prototype.unsubscribe = function unsubscribe(source) {
        var index = this.upstream.indexOf(source);
        if (index >= 0) {
            this.upstream.splice(index, 1);
            for (var type in this.upstreamListeners) {
                source.removeListener(type, this.upstreamListeners[type]);
            }
        }
        return this;
    };

    module.exports = EventHandler;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/ElementAllocator',['require','exports','module'],function(require, exports, module) {

    /**
     * Internal helper object to Context that handles the process of
     *   creating and allocating DOM elements within a managed div.
     *   Private.
     *
     * @class ElementAllocator
     * @constructor
     * @private
     * @param {Node} container document element in which Famo.us content will be inserted
     */
    function ElementAllocator(container) {
        if (!container) container = document.createDocumentFragment();
        this.container = container;
        this.detachedNodes = {};
        this.nodeCount = 0;
    }

    /**
     * Move the document elements from their original container to a new one.
     *
     * @private
     * @method migrate
     *
     * @param {Node} container document element to which Famo.us content will be migrated
     */
    ElementAllocator.prototype.migrate = function migrate(container) {
        var oldContainer = this.container;
        if (container === oldContainer) return;

        if (oldContainer instanceof DocumentFragment) {
            container.appendChild(oldContainer);
        }
        else {
            while (oldContainer.hasChildNodes()) {
                container.appendChild(oldContainer.removeChild(oldContainer.firstChild));
            }
        }

        this.container = container;
    };

    /**
     * Allocate an element of specified type from the pool.
     *
     * @private
     * @method allocate
     *
     * @param {string} type type of element, e.g. 'div'
     * @return {Node} allocated document element
     */
    ElementAllocator.prototype.allocate = function allocate(type) {
        type = type.toLowerCase();
        if (!(type in this.detachedNodes)) this.detachedNodes[type] = [];
        var nodeStore = this.detachedNodes[type];
        var result;
        if (nodeStore.length > 0) {
            result = nodeStore.pop();
        }
        else {
            result = document.createElement(type);
            this.container.appendChild(result);
        }
        this.nodeCount++;
        return result;
    };

    /**
     * De-allocate an element of specified type to the pool.
     *
     * @private
     * @method deallocate
     *
     * @param {Node} element document element to deallocate
     */
    ElementAllocator.prototype.deallocate = function deallocate(element) {
        var nodeType = element.nodeName.toLowerCase();
        var nodeStore = this.detachedNodes[nodeType];
        nodeStore.push(element);
        this.nodeCount--;
    };

    /**
     * Get count of total allocated nodes in the document.
     *
     * @private
     * @method getNodeCount
     *
     * @return {Number} total node count
     */
    ElementAllocator.prototype.getNodeCount = function getNodeCount() {
        return this.nodeCount;
    };

    module.exports = ElementAllocator;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/utilities/Utility',['require','exports','module'],function(require, exports, module) {
    /**
     * This namespace holds standalone functionality.
     *  Currently includes name mapping for transition curves,
     *  name mapping for origin pairs, and the after() function.
     *
     * @class Utility
     * @static
     */
    var Utility = {};

    /**
     * Table of direction array positions
     *
     * @property {object} Direction
     * @final
     */
    Utility.Direction = {
        X: 0,
        Y: 1,
        Z: 2
    };

    /**
     * Return wrapper around callback function. Once the wrapper is called N
     *   times, invoke the callback function. Arguments and scope preserved.
     *
     * @method after
     *
     * @param {number} count number of calls before callback function invoked
     * @param {Function} callback wrapped callback function
     *
     * @return {function} wrapped callback with coundown feature
     */
    Utility.after = function after(count, callback) {
        var counter = count;
        return function() {
            counter--;
            if (counter === 0) callback.apply(this, arguments);
        };
    };

    /**
     * Load a URL and return its contents in a callback
     *
     * @method loadURL
     *
     * @param {string} url URL of object
     * @param {function} callback callback to dispatch with content
     */
    Utility.loadURL = function loadURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function onreadystatechange() {
            if (this.readyState === 4) {
                if (callback) callback(this.responseText);
            }
        };
        xhr.open('GET', url);
        xhr.send();
    };

    /**
     * Create a document fragment from a string of HTML
     *
     * @method createDocumentFragmentFromHTML
     *
     * @param {string} html HTML to convert to DocumentFragment
     *
     * @return {DocumentFragment} DocumentFragment representing input HTML
     */
    Utility.createDocumentFragmentFromHTML = function createDocumentFragmentFromHTML(html) {
        var element = document.createElement('div');
        element.innerHTML = html;
        var result = document.createDocumentFragment();
        while (element.hasChildNodes()) result.appendChild(element.firstChild);
        return result;
    };

    module.exports = Utility;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/MultipleTransition',['require','exports','module','famous/utilities/Utility'],function(require, exports, module) {
    var Utility = require('famous/utilities/Utility');

    /**
     * Transition meta-method to support transitioning multiple
     *   values with scalar-only methods.
     *
     *
     * @class MultipleTransition
     * @constructor
     *
     * @param {Object} method Transionable class to multiplex
     */
    function MultipleTransition(method) {
        this.method = method;
        this._instances = [];
        this.state = [];
    }

    MultipleTransition.SUPPORTS_MULTIPLE = true;

    /**
     * Get the state of each transition.
     *
     * @method get
     *
     * @return state {Number|Array} state array
     */
    MultipleTransition.prototype.get = function get() {
        for (var i = 0; i < this._instances.length; i++) {
            this.state[i] = this._instances[i].get();
        }
        return this.state;
    };

    /**
     * Set the end states with a shared transition, with optional callback.
     *
     * @method set
     *
     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
     * @param {Object} transition Transition definition, shared among all instances
     * @param {Function} callback called when all endStates have been reached.
     */
    MultipleTransition.prototype.set = function set(endState, transition, callback) {
        var _allCallback = Utility.after(endState.length, callback);
        for (var i = 0; i < endState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].set(endState[i], transition, _allCallback);
        }
    };

    /**
     * Reset all transitions to start state.
     *
     * @method reset
     *
     * @param  {Number|Array} startState Start state
     */
    MultipleTransition.prototype.reset = function reset(startState) {
        for (var i = 0; i < startState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].reset(startState[i]);
        }
    };

    module.exports = MultipleTransition;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/TweenTransition',['require','exports','module'],function(require, exports, module) {

    /**
     *
     * A state maintainer for a smooth transition between
     *    numerically-specified states.  Example numeric states include floats or
     *    Transfornm objects.
     *
     *    An initial state is set with the constructor or set(startValue). A
     *    corresponding end state and transition are set with set(endValue,
     *    transition). Subsequent calls to set(endValue, transition) begin at
     *    the last state. Calls to get(timestamp) provide the _interpolated state
     *    along the way.
     *
     *   Note that there is no event loop here - calls to get() are the only way
     *    to find out state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class TweenTransition
     * @constructor
     *
     * @param {Object} options TODO
     *    beginning state
     */
    function TweenTransition(options) {
        this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._startTime = 0;
        this._startValue = 0;
        this._updateTime = 0;
        this._endValue = 0;
        this._curve = undefined;
        this._duration = 0;
        this._active = false;
        this._callback = undefined;
        this.state = 0;
        this.velocity = undefined;
    }

    /**
     * Transition curves mapping independent variable t from domain [0,1] to a
     *    range within [0,1]. Includes functions 'linear', 'easeIn', 'easeOut',
     *    'easeInOut', 'easeOutBounce', 'spring'.
     *
     * @property {object} Curve
     * @final
     */
    TweenTransition.Curves = {
        linear: function(t) {
            return t;
        },
        easeIn: function(t) {
            return t*t;
        },
        easeOut: function(t) {
            return t*(2-t);
        },
        easeInOut: function(t) {
            if (t <= 0.5) return 2*t*t;
            else return -2*t*t + 4*t - 1;
        },
        easeOutBounce: function(t) {
            return t*(3 - 2*t);
        },
        spring: function(t) {
            return (1 - t) * Math.sin(6 * Math.PI * t) + t;
        }
    };

    TweenTransition.SUPPORTS_MULTIPLE = true;
    TweenTransition.DEFAULT_OPTIONS = {
        curve: TweenTransition.Curves.linear,
        duration: 500,
        speed: 0 /* considered only if positive */
    };

    var registeredCurves = {};

    /**
     * Add "unit" curve to internal dictionary of registered curves.
     *
     * @method registerCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @param {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     * @return {boolean} false if key is taken, else true
     */
    TweenTransition.registerCurve = function registerCurve(curveName, curve) {
        if (!registeredCurves[curveName]) {
            registeredCurves[curveName] = curve;
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Remove object with key "curveName" from internal dictionary of registered
     *    curves.
     *
     * @method unregisterCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {boolean} false if key has no dictionary value
     */
    TweenTransition.unregisterCurve = function unregisterCurve(curveName) {
        if (registeredCurves[curveName]) {
            delete registeredCurves[curveName];
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Retrieve function with key "curveName" from internal dictionary of
     *    registered curves. Default curves are defined in the
     *    TweenTransition.Curves array, where the values represent
     *    unitCurve functions.
     *
     * @method getCurve
     *
     * @static
     *
     * @param {string} curveName dictionary key
     * @return {unitCurve} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurve = function getCurve(curveName) {
        var curve = registeredCurves[curveName];
        if (curve !== undefined) return curve;
        else throw new Error('curve not registered');
    };

    /**
     * Retrieve all available curves.
     *
     * @method getCurves
     *
     * @static
     *
     * @return {object} curve functions of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    TweenTransition.getCurves = function getCurves() {
        return registeredCurves;
    };

     // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
    function _interpolate(a, b, t) {
        return ((1 - t) * a) + (t * b);
    }

    function _clone(obj) {
        if (obj instanceof Object) {
            if (obj instanceof Array) return obj.slice(0);
            else return Object.create(obj);
        }
        else return obj;
    }

    // Fill in missing properties in "transition" with those in defaultTransition, and
    //   convert internal named curve to function object, returning as new
    //   object.
    function _normalize(transition, defaultTransition) {
        var result = {curve: defaultTransition.curve};
        if (defaultTransition.duration) result.duration = defaultTransition.duration;
        if (defaultTransition.speed) result.speed = defaultTransition.speed;
        if (transition instanceof Object) {
            if (transition.duration !== undefined) result.duration = transition.duration;
            if (transition.curve) result.curve = transition.curve;
            if (transition.speed) result.speed = transition.speed;
        }
        if (typeof result.curve === 'string') result.curve = TweenTransition.getCurve(result.curve);
        return result;
    }

    /**
     * Set internal options, overriding any default options.
     *
     * @method setOptions
     *
     *
     * @param {Object} options options object
     * @param {Object} [options.curve] function mapping [0,1] to [0,1] or identifier
     * @param {Number} [options.duration] duration in ms
     * @param {Number} [options.speed] speed in pixels per ms
     */
    TweenTransition.prototype.setOptions = function setOptions(options) {
        if (options.curve !== undefined) this.options.curve = options.curve;
        if (options.duration !== undefined) this.options.duration = options.duration;
        if (options.speed !== undefined) this.options.speed = options.speed;
    };

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endValue
     *    end state to which we _interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    TweenTransition.prototype.set = function set(endValue, transition, callback) {
        if (!transition) {
            this.reset(endValue);
            if (callback) callback();
            return;
        }

        this._startValue = _clone(this.get());
        transition = _normalize(transition, this.options);
        if (transition.speed) {
            var startValue = this._startValue;
            if (startValue instanceof Object) {
                var variance = 0;
                for (var i in startValue) variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
                transition.duration = Math.sqrt(variance) / transition.speed;
            }
            else {
                transition.duration = Math.abs(endValue - startValue) / transition.speed;
            }
        }

        this._startTime = Date.now();
        this._endValue = _clone(endValue);
        this._startVelocity = _clone(transition.velocity);
        this._duration = transition.duration;
        this._curve = transition.curve;
        this._active = true;
        this._callback = callback;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startValue
     *    starting state
     * @param {number} startVelocity
     *    starting velocity
     */
    TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        this.state = _clone(startValue);
        this.velocity = _clone(startVelocity);
        this._startTime = 0;
        this._duration = 0;
        this._updateTime = 0;
        this._startValue = this.state;
        this._startVelocity = this.velocity;
        this._endValue = this.state;
        this._active = false;
    };

    /**
     * Get current velocity
     *
     * @method getVelocity
     *
     * @returns {Number} velocity
     */
    TweenTransition.prototype.getVelocity = function getVelocity() {
        return this.velocity;
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    _interpolated to this point in time.
     */
    TweenTransition.prototype.get = function get(timestamp) {
        this.update(timestamp);
        return this.state;
    };

    function _calculateVelocity(current, start, curve, duration, t) {
        var velocity;
        var eps = 1e-7;
        var speed = (curve(t) - curve(t - eps)) / eps;
        if (current instanceof Array) {
            velocity = [];
            for (var i = 0; i < current.length; i++){
                if (typeof current[i] === 'number')
                    velocity[i] = speed * (current[i] - start[i]) / duration;
                else
                    velocity[i] = 0;
            }

        }
        else velocity = speed * (current - start) / duration;
        return velocity;
    }

    function _calculateState(start, end, t) {
        var state;
        if (start instanceof Array) {
            state = [];
            for (var i = 0; i < start.length; i++) {
                if (typeof start[i] === 'number')
                    state[i] = _interpolate(start[i], end[i], t);
                else
                    state[i] = start[i];
            }
        }
        else state = _interpolate(start, end, t);
        return state;
    }

    /**
     * Update internal state to the provided timestamp. This may invoke the last
     *    callback and begin a new action.
     *
     * @method update
     *
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     */
    TweenTransition.prototype.update = function update(timestamp) {
        if (!this._active) {
            if (this._callback) {
                var callback = this._callback;
                this._callback = undefined;
                callback();
            }
            return;
        }

        if (!timestamp) timestamp = Date.now();
        if (this._updateTime >= timestamp) return;
        this._updateTime = timestamp;

        var timeSinceStart = timestamp - this._startTime;
        if (timeSinceStart >= this._duration) {
            this.state = this._endValue;
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
            this._active = false;
        }
        else if (timeSinceStart < 0) {
            this.state = this._startValue;
            this.velocity = this._startVelocity;
        }
        else {
            var t = timeSinceStart / this._duration;
            this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
            this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
        }
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     *
     * @return {boolean}
     */
    TweenTransition.prototype.isActive = function isActive() {
        return this._active;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     *
     */
    TweenTransition.prototype.halt = function halt() {
        this.reset(this.get());
    };

    // Register all the default curves
    TweenTransition.registerCurve('linear', TweenTransition.Curves.linear);
    TweenTransition.registerCurve('easeIn', TweenTransition.Curves.easeIn);
    TweenTransition.registerCurve('easeOut', TweenTransition.Curves.easeOut);
    TweenTransition.registerCurve('easeInOut', TweenTransition.Curves.easeInOut);
    TweenTransition.registerCurve('easeOutBounce', TweenTransition.Curves.easeOutBounce);
    TweenTransition.registerCurve('spring', TweenTransition.Curves.spring);

    TweenTransition.customCurve = function customCurve(v1, v2) {
        v1 = v1 || 0; v2 = v2 || 0;
        return function(t) {
            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
        };
    };

    module.exports = TweenTransition;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/Transitionable',['require','exports','module','./MultipleTransition','./TweenTransition'],function(require, exports, module) {
    var MultipleTransition = require('./MultipleTransition');
    var TweenTransition = require('./TweenTransition');

    /**
     * A state maintainer for a smooth transition between
     *    numerically-specified states. Example numeric states include floats or
     *    Transform objects.
     *
     * An initial state is set with the constructor or set(startState). A
     *    corresponding end state and transition are set with set(endState,
     *    transition). Subsequent calls to set(endState, transition) begin at
     *    the last state. Calls to get(timestamp) provide the interpolated state
     *    along the way.
     *
     * Note that there is no event loop here - calls to get() are the only way
     *    to find state projected to the current (or provided) time and are
     *    the only way to trigger callbacks. Usually this kind of object would
     *    be part of the render() path of a visible component.
     *
     * @class Transitionable
     * @constructor
     * @param {number|Array.Number|Object.<number|string, number>} start
     *    beginning state
     */
    function Transitionable(start) {
        this.currentAction = null;
        this.actionQueue = [];
        this.callbackQueue = [];

        this.state = 0;
        this.velocity = undefined;
        this._callback = undefined;
        this._engineInstance = null;
        this._currentMethod = null;

        this.set(start);
    }

    var transitionMethods = {};

    Transitionable.registerMethod = function registerMethod(name, engineClass) {
        if (!(name in transitionMethods)) {
            transitionMethods[name] = engineClass;
            return true;
        }
        else return false;
    };

    Transitionable.unregisterMethod = function unregisterMethod(name) {
        if (name in transitionMethods) {
            delete transitionMethods[name];
            return true;
        }
        else return false;
    };

    function _loadNext() {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        if (this.actionQueue.length <= 0) {
            this.set(this.get()); // no update required
            return;
        }
        this.currentAction = this.actionQueue.shift();
        this._callback = this.callbackQueue.shift();

        var method = null;
        var endValue = this.currentAction[0];
        var transition = this.currentAction[1];
        if (transition instanceof Object && transition.method) {
            method = transition.method;
            if (typeof method === 'string') method = transitionMethods[method];
        }
        else {
            method = TweenTransition;
        }

        if (this._currentMethod !== method) {
            if (!(endValue instanceof Object) || method.SUPPORTS_MULTIPLE === true || endValue.length <= method.SUPPORTS_MULTIPLE) {
                this._engineInstance = new method();
            }
            else {
                this._engineInstance = new MultipleTransition(method);
            }
            this._currentMethod = method;
        }

        this._engineInstance.reset(this.state, this.velocity);
        if (this.velocity !== undefined) transition.velocity = this.velocity;
        this._engineInstance.set(endValue, transition, _loadNext.bind(this));
    }

    /**
     * Add transition to end state to the queue of pending transitions. Special
     *    Use: calling without a transition resets the object to that state with
     *    no pending actions
     *
     * @method set
     *
     * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endState
     *    end state to which we interpolate
     * @param {transition=} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {function()=} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.set = function set(endState, transition, callback) {
        if (!transition) {
            this.reset(endState);
            if (callback) callback();
            return this;
        }

        var action = [endState, transition];
        this.actionQueue.push(action);
        this.callbackQueue.push(callback);
        if (!this.currentAction) _loadNext.call(this);
        return this;
    };

    /**
     * Cancel all transitions and reset to a stable state
     *
     * @method reset
     *
     * @param {number|Array.Number|Object.<number, number>} startState
     *    stable state to set to
     */
    Transitionable.prototype.reset = function reset(startState, startVelocity) {
        this._currentMethod = null;
        this._engineInstance = null;
        this._callback = undefined;
        this.state = startState;
        this.velocity = startVelocity;
        this.currentAction = null;
        this.actionQueue = [];
        this.callbackQueue = [];
    };

    /**
     * Add delay action to the pending action queue queue.
     *
     * @method delay
     *
     * @param {number} duration delay time (ms)
     * @param {function} callback Zero-argument function to call on observed
     *    completion (t=1)
     */
    Transitionable.prototype.delay = function delay(duration, callback) {
        this.set(this.get(), {duration: duration,
            curve: function() {
                return 0;
            }},
            callback
        );
    };

    /**
     * Get interpolated state of current action at provided time. If the last
     *    action has completed, invoke its callback.
     *
     * @method get
     *
     * @param {number=} timestamp Evaluate the curve at a normalized version of this
     *    time. If omitted, use current time. (Unix epoch time)
     * @return {number|Object.<number|string, number>} beginning state
     *    interpolated to this point in time.
     */
    Transitionable.prototype.get = function get(timestamp) {
        if (this._engineInstance) {
            if (this._engineInstance.getVelocity)
                this.velocity = this._engineInstance.getVelocity();
            this.state = this._engineInstance.get(timestamp);
        }
        return this.state;
    };

    /**
     * Is there at least one action pending completion?
     *
     * @method isActive
     *
     * @return {boolean}
     */
    Transitionable.prototype.isActive = function isActive() {
        return !!this.currentAction;
    };

    /**
     * Halt transition at current state and erase all pending actions.
     *
     * @method halt
     */
    Transitionable.prototype.halt = function halt() {
        this.set(this.get());
    };

    module.exports = Transitionable;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Context',['require','exports','module','./RenderNode','./EventHandler','./ElementAllocator','./Transform','famous/transitions/Transitionable'],function(require, exports, module) {
    var RenderNode = require('./RenderNode');
    var EventHandler = require('./EventHandler');
    var ElementAllocator = require('./ElementAllocator');
    var Transform = require('./Transform');
    var Transitionable = require('famous/transitions/Transitionable');

    var _originZeroZero = [0, 0];

    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight];
    }

    /**
     * The top-level container for a Famous-renderable piece of the document.
     *   It is directly updated by the process-wide Engine object, and manages one
     *   render tree root, which can contain other renderables.
     *
     * @class Context
     * @constructor
     * @private
     * @param {Node} container Element in which content will be inserted
     */
    function Context(container) {
        this.container = container;
        this._allocator = new ElementAllocator(container);

        this._node = new RenderNode();
        this._eventOutput = new EventHandler();
        this._size = _getElementSize(this.container);

        this._perspectiveState = new Transitionable(0);
        this._perspective = undefined;

        this._nodeContext = {
            allocator: this._allocator,
            transform: Transform.identity,
            opacity: 1,
            origin: _originZeroZero,
            align: null,
            size: this._size
        };

        this._eventOutput.on('resize', function() {
            this.setSize(_getElementSize(this.container));
        }.bind(this));

    }

    // Note: Unused
    Context.prototype.getAllocator = function getAllocator() {
        return this._allocator;
    };

    /**
     * Add renderables to this Context's render tree.
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    Context.prototype.add = function add(obj) {
        return this._node.add(obj);
    };

    /**
     * Move this Context to another containing document element.
     *
     * @method migrate
     *
     * @param {Node} container Element to which content will be migrated
     */
    Context.prototype.migrate = function migrate(container) {
        if (container === this.container) return;
        this.container = container;
        this._allocator.migrate(container);
    };

    /**
     * Gets viewport size for Context.
     *
     * @method getSize
     *
     * @return {Array.Number} viewport size as [width, height]
     */
    Context.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Sets viewport size for Context.
     *
     * @method setSize
     *
     * @param {Array.Number} size [width, height].  If unspecified, use size of root document element.
     */
    Context.prototype.setSize = function setSize(size) {
        if (!size) size = _getElementSize(this.container);
        this._size[0] = size[0];
        this._size[1] = size[1];
    };

    /**
     * Commit this Context's content changes to the document.
     *
     * @private
     * @method update
     * @param {Object} contextParameters engine commit specification
     */
    Context.prototype.update = function update(contextParameters) {
        if (contextParameters) {
            if (contextParameters.transform) this._nodeContext.transform = contextParameters.transform;
            if (contextParameters.opacity) this._nodeContext.opacity = contextParameters.opacity;
            if (contextParameters.origin) this._nodeContext.origin = contextParameters.origin;
            if (contextParameters.align) this._nodeContext.align = contextParameters.align;
            if (contextParameters.size) this._nodeContext.size = contextParameters.size;
        }
        var perspective = this._perspectiveState.get();
        if (perspective !== this._perspective) {
            this.container.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
            this.container.style.webkitPerspective = perspective ? perspective.toFixed() : '';
            this._perspective = perspective;
        }

        this._node.commit(this._nodeContext);
    };

    /**
     * Get current perspective of this context in pixels.
     *
     * @method getPerspective
     * @return {Number} depth perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspectiveState.get();
    };

    /**
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param {Number} perspective in pixels
     * @param {Object} [transition] Transitionable object for applying the change
     * @param {function(Object)} callback function called on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        return this._perspectiveState.set(perspective, transition, callback);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Context.prototype.emit = function emit(type, event) {
        return this._eventOutput.emit(type, event);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Context.prototype.on = function on(type, handler) {
        return this._eventOutput.on(type, handler);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Context.prototype.removeListener = function removeListener(type, handler) {
        return this._eventOutput.removeListener(type, handler);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Context.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Context.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    module.exports = Context;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/OptionsManager',['require','exports','module','./EventHandler'],function(require, exports, module) {
    var EventHandler = require('./EventHandler');

    /**
     *  A collection of methods for setting options which can be extended
     *  onto other classes.
     *
     *
     *  **** WARNING ****
     *  You can only pass through objects that will compile into valid JSON.
     *
     *  Valid options:
     *      Strings,
     *      Arrays,
     *      Objects,
     *      Numbers,
     *      Nested Objects,
     *      Nested Arrays.
     *
     *    This excludes:
     *        Document Fragments,
     *        Functions
     * @class OptionsManager
     * @constructor
     * @param {Object} value options dictionary
     */
    function OptionsManager(value) {
        this._value = value;
        this.eventOutput = null;
    }

    /**
     * Create options manager from source dictionary with arguments overriden by patch dictionary.
     *
     * @static
     * @method OptionsManager.patch
     *
     * @param {Object} source source arguments
     * @param {...Object} data argument additions and overwrites
     * @return {Object} source object
     */
    OptionsManager.patch = function patchObject(source, data) {
        var manager = new OptionsManager(source);
        for (var i = 1; i < arguments.length; i++) manager.patch(arguments[i]);
        return source;
    };

    function _createEventOutput() {
        this.eventOutput = new EventHandler();
        this.eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this.eventOutput);
    }

    /**
     * Create OptionsManager from source with arguments overriden by patches.
     *   Triggers 'change' event on this object's event handler if the state of
     *   the OptionsManager changes as a result.
     *
     * @method patch
     *
     * @param {...Object} arguments list of patch objects
     * @return {OptionsManager} this
     */
    OptionsManager.prototype.patch = function patch() {
        var myState = this._value;
        for (var i = 0; i < arguments.length; i++) {
            var data = arguments[i];
            for (var k in data) {
                if ((k in myState) && (data[k] && data[k].constructor === Object) && (myState[k] && myState[k].constructor === Object)) {
                    if (!myState.hasOwnProperty(k)) myState[k] = Object.create(myState[k]);
                    this.key(k).patch(data[k]);
                    if (this.eventOutput) this.eventOutput.emit('change', {id: k, value: this.key(k).value()});
                }
                else this.set(k, data[k]);
            }
        }
        return this;
    };

    /**
     * Alias for patch
     *
     * @method setOptions
     *
     */
    OptionsManager.prototype.setOptions = OptionsManager.prototype.patch;

    /**
     * Return OptionsManager based on sub-object retrieved by key
     *
     * @method key
     *
     * @param {string} identifier key
     * @return {OptionsManager} new options manager with the value
     */
    OptionsManager.prototype.key = function key(identifier) {
        var result = new OptionsManager(this._value[identifier]);
        if (!(result._value instanceof Object) || result._value instanceof Array) result._value = {};
        return result;
    };

    /**
     * Look up value by key
     * @method get
     *
     * @param {string} key key
     * @return {Object} associated object
     */
    OptionsManager.prototype.get = function get(key) {
        return this._value[key];
    };

    /**
     * Alias for get
     * @method getOptions
     */
    OptionsManager.prototype.getOptions = OptionsManager.prototype.get;

    /**
     * Set key to value.  Outputs 'change' event if a value is overwritten.
     *
     * @method set
     *
     * @param {string} key key string
     * @param {Object} value value object
     * @return {OptionsManager} new options manager based on the value object
     */
    OptionsManager.prototype.set = function set(key, value) {
        var originalValue = this.get(key);
        this._value[key] = value;
        if (this.eventOutput && value !== originalValue) this.eventOutput.emit('change', {id: key, value: value});
        return this;
    };

    /**
     * Return entire object contents of this OptionsManager.
     *
     * @method value
     *
     * @return {Object} current state of options
     */
    OptionsManager.prototype.value = function value() {
        return this._value;
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    OptionsManager.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'change')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    OptionsManager.prototype.removeListener = function removeListener() {
        _createEventOutput.call(this);
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    OptionsManager.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };

    /**
     * Remove handler object from set of downstream handlers.
     * Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    OptionsManager.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    module.exports = OptionsManager;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Engine',['require','exports','module','./Context','./EventHandler','./OptionsManager'],function(require, exports, module) {

    /**
     * The singleton object initiated upon process
     *   startup which manages all active Context instances, runs
     *   the render dispatch loop, and acts as a listener and dispatcher
     *   for events.  All methods are therefore static.
     *
     *   On static initialization, window.requestAnimationFrame is called with
     *     the event loop function.
     *
     *   Note: Any window in which Engine runs will prevent default
     *     scrolling behavior on the 'touchmove' event.
     *
     * @static
     * @class Engine
     */
    var Context = require('./Context');
    var EventHandler = require('./EventHandler');
    var OptionsManager = require('./OptionsManager');

    var Engine = {};

    var contexts = [];
    var nextTickQueue = [];
    var deferQueue = [];

    var lastTime = Date.now();
    var frameTime;
    var frameTimeLimit;
    var loopEnabled = true;
    var eventForwarders = {};
    var eventHandler = new EventHandler();

    var options = {
        containerType: 'div',
        containerClass: 'famous-container',
        fpsCap: undefined,
        runLoop: true
    };
    var optionsManager = new OptionsManager(options);

    /** @const */
    var MAX_DEFER_FRAME_TIME = 10;

    /**
     * Inside requestAnimationFrame loop, step() is called, which:
     *   calculates current FPS (throttling loop if it is over limit set in setFPSCap),
     *   emits dataless 'prerender' event on start of loop,
     *   calls in order any one-shot functions registered by nextTick on last loop,
     *   calls Context.update on all Context objects registered,
     *   and emits dataless 'postrender' event on end of loop.
     *
     * @static
     * @private
     * @method step
     */
    Engine.step = function step() {
        var currentTime = Date.now();

        // skip frame if we're over our framerate cap
        if (frameTimeLimit && currentTime - lastTime < frameTimeLimit) return;

        var i = 0;

        frameTime = currentTime - lastTime;
        lastTime = currentTime;

        eventHandler.emit('prerender');

        // empty the queue
        for (i = 0; i < nextTickQueue.length; i++) nextTickQueue[i].call(this);
        nextTickQueue.splice(0);

        // limit total execution time for deferrable functions
        while (deferQueue.length && (Date.now() - currentTime) < MAX_DEFER_FRAME_TIME) {
            deferQueue.shift().call(this);
        }

        for (i = 0; i < contexts.length; i++) contexts[i].update();

        eventHandler.emit('postrender');
    };

    // engage requestAnimationFrame
    function loop() {
        if (options.runLoop) {
            Engine.step();
            requestAnimationFrame(loop);
        }
        else loopEnabled = false;
    }
    requestAnimationFrame(loop);

    //
    // Upon main document window resize (unless on an "input" HTML element):
    //   scroll to the top left corner of the window,
    //   and for each managed Context: emit the 'resize' event and update its size.
    // @param {Object=} event document event
    //
    function handleResize(event) {
        for (var i = 0; i < contexts.length; i++) {
            contexts[i].emit('resize');
        }
        eventHandler.emit('resize');
    }
    window.addEventListener('resize', handleResize, false);
    handleResize();

    // prevent scrolling via browser
    window.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, true);

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Engine.pipe = function pipe(target) {
        if (target.subscribe instanceof Function) return target.subscribe(Engine);
        else return eventHandler.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Engine.unpipe = function unpipe(target) {
        if (target.unsubscribe instanceof Function) return target.unsubscribe(Engine);
        else return eventHandler.unpipe(target);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @static
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Engine.on = function on(type, handler) {
        if (!(type in eventForwarders)) {
            eventForwarders[type] = eventHandler.emit.bind(eventHandler, type);
            if (document.body) {
                document.body.addEventListener(type, eventForwarders[type]);
            }
            else {
                Engine.nextTick(function(type, forwarder) {
                    document.body.addEventListener(type, forwarder);
                }.bind(this, type, eventForwarders[type]));
            }
        }
        return eventHandler.on(type, handler);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Engine.emit = function emit(type, event) {
        return eventHandler.emit(type, event);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @static
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Engine.removeListener = function removeListener(type, handler) {
        return eventHandler.removeListener(type, handler);
    };

    /**
     * Return the current calculated frames per second of the Engine.
     *
     * @static
     * @method getFPS
     *
     * @return {Number} calculated fps
     */
    Engine.getFPS = function getFPS() {
        return 1000 / frameTime;
    };

    /**
     * Set the maximum fps at which the system should run. If internal render
     *    loop is called at a greater frequency than this FPSCap, Engine will
     *    throttle render and update until this rate is achieved.
     *
     * @static
     * @method setFPSCap
     *
     * @param {Number} fps maximum frames per second
     */
    Engine.setFPSCap = function setFPSCap(fps) {
        frameTimeLimit = Math.floor(1000 / fps);
    };

    /**
     * Return engine options.
     *
     * @static
     * @method getOptions
     * @param {string} key
     * @return {Object} engine options
     */
    Engine.getOptions = function getOptions() {
        return optionsManager.getOptions.apply(optionsManager, arguments);
    };

    /**
     * Set engine options
     *
     * @static
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.fpsCap]  maximum fps at which the system should run
     * @param {boolean} [options.runLoop=true] whether the run loop should continue
     * @param {string} [options.containerType="div"] type of container element.  Defaults to 'div'.
     * @param {string} [options.containerClass="famous-container"] type of container element.  Defaults to 'famous-container'.
     */
    Engine.setOptions = function setOptions(options) {
        return optionsManager.setOptions.apply(optionsManager, arguments);
    };

    /**
     * Creates a new Context for rendering and event handling with
     *    provided document element as top of each tree. This will be tracked by the
     *    process-wide Engine.
     *
     * @static
     * @method createContext
     *
     * @param {Node} el will be top of Famo.us document element tree
     * @return {Context} new Context within el
     */
    Engine.createContext = function createContext(el) {
        var needMountContainer = false;
        if (!el) {
            el = document.createElement(options.containerType);
            el.classList.add(options.containerClass);
            needMountContainer = true;
        }
        var context = new Context(el);
        Engine.registerContext(context);
        if (needMountContainer) {
            Engine.nextTick(function(context, el) {
                document.body.appendChild(el);
                context.emit('resize');
            }.bind(this, context, el));
        }
        return context;
    };

    /**
     * Registers an existing context to be updated within the run loop.
     *
     * @static
     * @method registerContext
     *
     * @param {Context} context Context to register
     * @return {FamousContext} provided context
     */
    Engine.registerContext = function registerContext(context) {
        contexts.push(context);
        return context;
    };

    /**
     * Queue a function to be executed on the next tick of the
     *    Engine.
     *
     * @static
     * @method nextTick
     *
     * @param {function(Object)} fn function accepting window object
     */
    Engine.nextTick = function nextTick(fn) {
        nextTickQueue.push(fn);
    };

    /**
     * Queue a function to be executed sometime soon, at a time that is
     *    unlikely to affect frame rate.
     *
     * @static
     * @method defer
     *
     * @param {Function} fn
     */
    Engine.defer = function defer(fn) {
        deferQueue.push(fn);
    };

    optionsManager.on('change', function(data) {
        if (data.id === 'fpsCap') Engine.setFPSCap(data.value);
        else if (data.id === 'runLoop') {
            // kick off the loop only if it was stopped
            if (!loopEnabled && data.value) {
                loopEnabled = true;
                requestAnimationFrame(loop);
            }
        }
    });

    module.exports = Engine;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Surface',['require','exports','module','./Entity','./EventHandler','./Transform'],function(require, exports, module) {
    var Entity = require('./Entity');
    var EventHandler = require('./EventHandler');
    var Transform = require('./Transform');

    var devicePixelRatio = window.devicePixelRatio || 1;
    var usePrefix = document.createElement('div').style.webkitTransform !== undefined;

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class Surface
     * @constructor
     *
     * @param {Object} [options] default option overrides
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on inner content
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface
     */
    function Surface(options) {
        this.options = {};

        this.properties = {};
        this.content = '';
        this.classList = [];
        this.size = null;

        this._classesDirty = true;
        this._stylesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;

        this._dirtyClasses = [];

        this._matrix = null;
        this._opacity = 1;
        this._origin = null;
        this._size = null;

        /** @ignore */
        this.eventForwarder = function eventForwarder(event) {
            this.emit(event.type, event);
        }.bind(this);
        this.eventHandler = new EventHandler();
        this.eventHandler.bindThis(this);

        this.id = Entity.register(this);

        if (options) this.setOptions(options);

        this._currTarget = null;
    }
    Surface.prototype.elementType = 'div';
    Surface.prototype.elementClass = 'famous-surface';

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler callback
     * @return {EventHandler} this
     */
    Surface.prototype.on = function on(type, fn) {
        if (this._currTarget) this._currTarget.addEventListener(type, this.eventForwarder);
        this.eventHandler.on(type, fn);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on"
     *
     * @method removeListener
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler
     */
    Surface.prototype.removeListener = function removeListener(type, fn) {
        this.eventHandler.removeListener(type, fn);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} [event] event data
     * @return {EventHandler} this
     */
    Surface.prototype.emit = function emit(type, event) {
        if (event && !event.origin) event.origin = this;
        var handled = this.eventHandler.emit(type, event);
        if (handled && event && event.stopPropagation) event.stopPropagation();
        return handled;
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Surface.prototype.pipe = function pipe(target) {
        return this.eventHandler.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Surface.prototype.unpipe = function unpipe(target) {
        return this.eventHandler.unpipe(target);
    };

    /**
     * Return spec for this surface. Note that for a base surface, this is
     *    simply an id.
     *
     * @method render
     * @private
     * @return {Object} render spec for this surface (spec id)
     */
    Surface.prototype.render = function render() {
        return this.id;
    };

    /**
     * Set CSS-style properties on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setProperties
     * @param {Object} properties property dictionary of "key" => "value"
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var n in properties) {
            this.properties[n] = properties[n];
        }
        this._stylesDirty = true;
    };

    /**
     * Get CSS-style properties on this Surface.
     *
     * @method getProperties
     *
     * @return {Object} Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS-style class to the list of classes on this Surface. Note
     *   this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method addClass
     * @param {string} className name of class to add
     */
    Surface.prototype.addClass = function addClass(className) {
        if (this.classList.indexOf(className) < 0) {
            this.classList.push(className);
            this._classesDirty = true;
        }
    };

    /**
     * Remove CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method removeClass
     * @param {string} className name of class to remove
     */
    Surface.prototype.removeClass = function removeClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
            this._classesDirty = true;
        }
    };

    /**
     * Reset class list to provided dictionary.
     * @method setClasses
     * @param {Array.string} classList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        var i = 0;
        var removal = [];
        for (i = 0; i < this.classList.length; i++) {
            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
        }
        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
        // duplicates are already checked by addClass()
        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
    };

    /**
     * Get array of CSS-style classes attached to this div.
     *
     * @method getClasslist
     * @return {Array.string} array of class names
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    /**
     * Set or overwrite inner (HTML) content of this surface. Note that this
     *    causes a re-rendering if the content has changed.
     *
     * @method setContent
     * @param {string|Document Fragment} content HTML content
     */
    Surface.prototype.setContent = function setContent(content) {
        if (this.content !== content) {
            this.content = content;
            this._contentDirty = true;
        }
    };

    /**
     * Return inner (HTML) content of this surface.
     *
     * @method getContent
     *
     * @return {string} inner (HTML) content
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @param {Object} [options] overrides for default options.  See constructor.
     */
    Surface.prototype.setOptions = function setOptions(options) {
        if (options.size) this.setSize(options.size);
        if (options.classes) this.setClasses(options.classes);
        if (options.properties) this.setProperties(options.properties);
        if (options.content) this.setContent(options.content);
    };

    //  Attach Famous event handling to document events emanating from target
    //    document element.  This occurs just after deployment to the document.
    //    Calling this enables methods like #on and #pipe.
    function _addEventListeners(target) {
        for (var i in this.eventHandler.listeners) {
            target.addEventListener(i, this.eventForwarder);
        }
    }

    //  Detach Famous event handling from document events emanating from target
    //  document element.  This occurs just before recall from the document.
    function _removeEventListeners(target) {
        for (var i in this.eventHandler.listeners) {
            target.removeEventListener(i, this.eventForwarder);
        }
    }

     //  Apply to document all changes from removeClass() since last setup().
    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyStyles(target) {
        for (var n in this.properties) {
            target.style[n] = this.properties[n];
        }
    }

    // Clear all Famous-managed styles from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupStyles(target) {
        for (var n in this.properties) {
            target.style[n] = '';
        }
    }

    /**
     * Return a Matrix's webkit css representation to be used with the
     *    CSS3 -webkit-transform style.
     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
     *
     * @method _formatCSSTransform
     * @private
     * @param {FamousMatrix} m matrix
     * @return {string} matrix3d CSS style representation of the transform
     */
    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
        }
        result += m[15] + ')';
        return result;
    }

    /**
     * Directly apply given FamousMatrix to the document element as the
     *   appropriate webkit CSS style.
     *
     * @method setMatrix
     *
     * @static
     * @private
     * @param {Element} element document element
     * @param {FamousMatrix} matrix
     */

    var _setMatrix;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        _setMatrix = function(element, matrix) {
            element.style.zIndex = (matrix[14] * 1000000) | 0;    // fix for Firefox z-buffer issues
            element.style.transform = _formatCSSTransform(matrix);
        };
    }
    else if (usePrefix) {
        _setMatrix = function(element, matrix) {
            element.style.webkitTransform = _formatCSSTransform(matrix);
        };
    }
    else {
        _setMatrix = function(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };
    }

    // format origin as CSS percentage string
    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

     // Directly apply given origin coordinates to the document element as the
     // appropriate webkit CSS style.
    var _setOrigin = usePrefix ? function(element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function(element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };

     // Shrink given document element until it is effectively invisible.
    var _setInvisible = usePrefix ? function(element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,1)';
        element.style.opacity = 0;
    } : function(element) {
        element.style.transform = 'scale3d(0.0001,0.0001,1)';
        element.style.opacity = 0;
    };

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    /**
     * One-time setup for an element to be ready for commits to document.
     *
     * @private
     * @method setup
     *
     * @param {ElementAllocator} allocator document element pool for this context
     */
    Surface.prototype.setup = function setup(allocator) {
        var target = allocator.allocate(this.elementType);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (var i = 0; i < this.elementClass.length; i++) {
                    target.classList.add(this.elementClass[i]);
                }
            }
            else {
                target.classList.add(this.elementClass);
            }
        }
        target.style.display = '';
        _addEventListeners.call(this, target);
        this._currTarget = target;
        this._stylesDirty = true;
        this._classesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._matrix = null;
        this._opacity = undefined;
        this._origin = null;
        this._size = null;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Surface.prototype.commit = function commit(context) {
        if (!this._currTarget) this.setup(context.allocator);
        var target = this._currTarget;

        var matrix = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            var classList = this.getClassList();
            for (var i = 0; i < classList.length; i++) target.classList.add(classList[i]);
            this._classesDirty = false;
        }

        if (this._stylesDirty) {
            _applyStyles.call(this, target);
            this._stylesDirty = false;
        }

        if (this._contentDirty) {
            this.deploy(target);
            this.eventHandler.emit('deploy');
            this._contentDirty = false;
        }

        if (this.size) {
            var origSize = size;
            size = [this.size[0], this.size[1]];
            if (size[0] === undefined && origSize[0]) size[0] = origSize[0];
            if (size[1] === undefined && origSize[1]) size[1] = origSize[1];
        }

        if (size[0] === true) size[0] = target.clientWidth;
        if (size[1] === true) size[1] = target.clientHeight;

        if (_xyNotEquals(this._size, size)) {
            if (!this._size) this._size = [0, 0];
            this._size[0] = size[0];
            this._size[1] = size[1];
            this._sizeDirty = true;
        }

        if (!matrix && this._matrix) {
            this._matrix = null;
            this._opacity = 0;
            _setInvisible(target);
            return;
        }

        if (this._opacity !== opacity) {
            this._opacity = opacity;
            target.style.opacity = (opacity >= 1) ? '0.999999' : opacity;
        }

        if (_xyNotEquals(this._origin, origin) || Transform.notEquals(this._matrix, matrix) || this._sizeDirty) {
            if (!matrix) matrix = Transform.identity;
            this._matrix = matrix;
            var aaMatrix = matrix;
            if (origin) {
                if (!this._origin) this._origin = [0, 0];
                this._origin[0] = origin[0];
                this._origin[1] = origin[1];
                aaMatrix = Transform.thenMove(matrix, [-this._size[0] * origin[0], -this._size[1] * origin[1], 0]);
                _setOrigin(target, origin);
            }
            _setMatrix(target, aaMatrix);
        }

        if (this._sizeDirty) {
            if (this._size) {
                target.style.width = (this.size && this.size[0] === true) ? '' : this._size[0] + 'px';
                target.style.height = (this.size && this.size[1] === true) ?  '' : this._size[1] + 'px';
            }
            this._sizeDirty = false;
        }
    };

    /**
     *  Remove all Famous-relevant attributes from a document element.
     *    This is called by SurfaceManager's detach().
     *    This is in some sense the reverse of .deploy().
     *
     * @private
     * @method cleanup
     * @param {ElementAllocator} allocator
     */
    Surface.prototype.cleanup = function cleanup(allocator) {
        var i = 0;
        var target = this._currTarget;
        this.eventHandler.emit('recall');
        this.recall(target);
        target.style.display = 'none';
        target.style.width = '';
        target.style.height = '';
        this._size = null;
        _cleanupStyles.call(this, target);
        var classList = this.getClassList();
        _cleanupClasses.call(this, target);
        for (i = 0; i < classList.length; i++) target.classList.remove(classList[i]);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (i = 0; i < this.elementClass.length; i++) {
                    target.classList.remove(this.elementClass[i]);
                }
            }
            else {
                target.classList.remove(this.elementClass);
            }
        }
        _removeEventListeners.call(this, target);
        this._currTarget = null;
        allocator.deallocate(target);
        _setInvisible(target);
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Surface.prototype.deploy = function deploy(target) {
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method recall
     */
    Surface.prototype.recall = function recall(target) {
        var df = document.createDocumentFragment();
        while (target.hasChildNodes()) df.appendChild(target.firstChild);
        this.setContent(df);
    };

    /**
     *  Get the x and y dimensions of the surface.
     *
     * @method getSize
     * @param {boolean} actual return computed size rather than provided
     * @return {Array.Number} [x,y] size of surface
     */
    Surface.prototype.getSize = function getSize(actual) {
        return actual ? this._size : (this.size || this._size);
    };

    /**
     * Set x and y dimensions of the surface.
     *
     * @method setSize
     * @param {Array.Number} size as [width, height]
     */
    Surface.prototype.setSize = function setSize(size) {
        this.size = size ? [size[0], size[1]] : null;
        this._sizeDirty = true;
    };

    module.exports = Surface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Group',['require','exports','module','./Context','./Transform','./Surface'],function(require, exports, module) {
    var Context = require('./Context');
    var Transform = require('./Transform');
    var Surface = require('./Surface');

    /**
     * A Context designed to contain surfaces and set properties
     *   to be applied to all of them at once.
     *   This is primarily used for specific performance improvements in the rendering engine.
     *   Private.
     *
     * @private
     * @class Group
     * @extends Surface
     * @constructor
     * @param {Object} [options] Surface options array (see Surface})
     */
    function Group(options) {
        Surface.call(this, options);
        this._shouldRecalculateSize = false;
        this._container = document.createDocumentFragment();
        this.context = new Context(this._container);
        this.setContent(this._container);
        this._groupSize = [undefined, undefined];
    }

    /** @const */
    Group.SIZE_ZERO = [0, 0];

    Group.prototype = Object.create(Surface.prototype);
    Group.prototype.elementType = 'div';
    Group.prototype.elementClass = 'famous-group';

    /**
     * Add renderables to this component's render tree.
     *
     * @method add
     * @private
     * @param {Object} obj renderable object
     * @return {RenderNode} Render wrapping provided object, if not already a RenderNode
     */
    Group.prototype.add = function add() {
        return this.context.add.apply(this.context, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    Group.prototype.render = function render() {
        return Surface.prototype.render.call(this);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Group.prototype.deploy = function deploy(target) {
        this.context.migrate(target);
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    Group.prototype.recall = function recall(target) {
        this._container = document.createDocumentFragment();
        this.context.migrate(this._container);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     *
     * @private
     * @method commit
     *
     * @param {Object} context update spec passed in from above in the render tree.
     */
    Group.prototype.commit = function commit(context) {
        var transform = context.transform;
        var origin = context.origin;
        var opacity = context.opacity;
        var size = context.size;
        var result = Surface.prototype.commit.call(this, {
            allocator: context.allocator,
            transform: Transform.thenMove(transform, [-origin[0] * size[0], -origin[1] * size[1], 0]),
            opacity: opacity,
            origin: origin,
            size: Group.SIZE_ZERO
        });
        if (size[0] !== this._groupSize[0] || size[1] !== this._groupSize[1]) {
            this._groupSize[0] = size[0];
            this._groupSize[1] = size[1];
            this.context.setSize(size);
        }
        this.context.update({
            transform: Transform.translate(-origin[0] * size[0], -origin[1] * size[1], 0),
            origin: origin,
            size: size
        });
        return result;
    };

    module.exports = Group;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/TransitionableTransform',['require','exports','module','./Transitionable','famous/core/Transform','famous/utilities/Utility'],function(require, exports, module) {
    var Transitionable = require('./Transitionable');
    var Transform = require('famous/core/Transform');
    var Utility = require('famous/utilities/Utility');

    /**
     * A class for transitioning the state of a Transform by transitioning
     * its translate, scale, skew and rotate components independently.
     *
     * @class TransitionableTransform
     * @constructor
     *
     * @param [transform=Transform.identity] {Transform} The initial transform state
     */
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice();
        this.translate = new Transitionable([0, 0, 0]);
        this.rotate = new Transitionable([0, 0, 0]);
        this.skew = new Transitionable([0, 0, 0]);
        this.scale = new Transitionable([1, 1, 1]);

        if (transform) this.set(transform);
    }

    function _build() {
        return Transform.build({
            translate: this.translate.get(),
            rotate: this.rotate.get(),
            skew: this.skew.get(),
            scale: this.scale.get()
        });
    }

    /**
     * An optimized way of setting only the translation component of a Transform
     *
     * @method setTranslate
     * @chainable
     *
     * @param translate {Array}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
        this.translate.set(translate, transition, callback);
        this._final = this._final.slice();
        this._final[12] = translate[0];
        this._final[13] = translate[1];
        if (translate[2] !== undefined) this._final[14] = translate[2];
        return this;
    };

    /**
     * An optimized way of setting only the scale component of a Transform
     *
     * @method setScale
     * @chainable
     *
     * @param scale {Array}         New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
        this.scale.set(scale, transition, callback);
        this._final = this._final.slice();
        this._final[0] = scale[0];
        this._final[5] = scale[1];
        if (scale[2] !== undefined) this._final[10] = scale[2];
        return this;
    };

    /**
     * An optimized way of setting only the rotational component of a Transform
     *
     * @method setRotate
     * @chainable
     *
     * @param eulerAngles {Array}   Euler angles for new rotation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
        this.rotate.set(eulerAngles, transition, callback);
        this._final = _build.call(this);
        this._final = Transform.build({
            translate: this.translate.get(),
            rotate: eulerAngles,
            scale: this.scale.get(),
            skew: this.skew.get()
        });
        return this;
    };

    /**
     * An optimized way of setting only the skew component of a Transform
     *
     * @method setSkew
     * @chainable
     *
     * @param skewAngles {Array}    New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
        this.skew.set(skewAngles, transition, callback);
        this._final = Transform.build({
            translate: this.translate.get(),
            rotate: this.rotate.get(),
            scale: this.scale.get(),
            skew: skewAngles
        });
        return this;
    };

    /**
     * Setter for a TransitionableTransform with optional parameters to transition
     * between Transforms
     *
     * @method set
     * @chainable
     *
     * @param transform {Array}     New transform state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.set = function set(transform, transition, callback) {
        this._final = transform;
        var components = Transform.interpret(transform);

        var _callback = callback ? Utility.after(4, callback) : null;
        this.translate.set(components.translate, transition, _callback);
        this.rotate.set(components.rotate, transition, _callback);
        this.skew.set(components.skew, transition, _callback);
        this.scale.set(components.scale, transition, _callback);
        return this;
    };

    /**
     * Sets the default transition to use for transitioning betwen Transform states
     *
     * @method setDefaultTransition
     *
     * @param transition {Object} Transition definition
     */
    TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        this.translate.setDefault(transition);
        this.rotate.setDefault(transition);
        this.skew.setDefault(transition);
        this.scale.setDefault(transition);
    };

    /**
     * Getter. Returns the current state of the Transform
     *
     * @method get
     *
     * @return {Transform}
     */
    TransitionableTransform.prototype.get = function get() {
        if (this.isActive()) {
            return _build.call(this);
        }
        else return this._final;
    };

    /**
     * Get the destination state of the Transform
     *
     * @method getFinal
     *
     * @return Transform {Transform}
     */
    TransitionableTransform.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the TransitionalTransform is currently transitioning
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    TransitionableTransform.prototype.isActive = function isActive() {
        return this.translate.isActive() || this.rotate.isActive() || this.scale.isActive() || this.skew.isActive();
    };

    /**
     * Halts the transition
     *
     * @method halt
     */
    TransitionableTransform.prototype.halt = function halt() {
        this._final = this.get();
        this.translate.halt();
        this.rotate.halt();
        this.skew.halt();
        this.scale.halt();
    };

    module.exports = TransitionableTransform;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Modifier',['require','exports','module','./Transform','famous/transitions/Transitionable','famous/transitions/TransitionableTransform'],function(require, exports, module) {
    var Transform = require('./Transform');

    /* TODO: remove these dependencies when deprecation complete */
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     *
     *  A collection of visual changes to be
     *    applied to another renderable component. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier.
     *    Modifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The Modifier's children and descendants
     *    are transformed by the amounts specified in the Modifier's properties.
     *
     * @class Modifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function Modifier(options) {
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;

        /* TODO: remove this when deprecation complete */
        this._legacyStates = {};

        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            target: null
        };

        if (options) {
            if (options.transform) this.transformFrom(options.transform);
            if (options.opacity !== undefined) this.opacityFrom(options.opacity);
            if (options.origin) this.originFrom(options.origin);
            if (options.align) this.alignFrom(options.align);
            if (options.size) this.sizeFrom(options.size);
        }
    }

    /**
     * Function, object, or static transform matrix which provides the transform.
     *   This is evaluated on every tick of the engine.
     *
     * @method transformFrom
     *
     * @param {Object} transform transform provider object
     * @return {Modifier} this
     */
    Modifier.prototype.transformFrom = function transformFrom(transform) {
        if (transform instanceof Function) this._transformGetter = transform;
        else if (transform instanceof Object && transform.get) this._transformGetter = transform.get.bind(transform);
        else {
            this._transformGetter = null;
            this._output.transform = transform;
        }
        return this;
    };

    /**
     * Set function, object, or number to provide opacity, in range [0,1].
     *
     * @method opacityFrom
     *
     * @param {Object} opacity provider object
     * @return {Modifier} this
     */
    Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
        if (opacity instanceof Function) this._opacityGetter = opacity;
        else if (opacity instanceof Object && opacity.get) this._opacityGetter = opacity.get.bind(opacity);
        else {
            this._opacityGetter = null;
            this._output.opacity = opacity;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide origin, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method originFrom
     *
     * @param {Object} origin provider object
     * @return {Modifier} this
     */
    Modifier.prototype.originFrom = function originFrom(origin) {
        if (origin instanceof Function) this._originGetter = origin;
        else if (origin instanceof Object && origin.get) this._originGetter = origin.get.bind(origin);
        else {
            this._originGetter = null;
            this._output.origin = origin;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide align, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method alignFrom
     *
     * @param {Object} align provider object
     * @return {Modifier} this
     */
    Modifier.prototype.alignFrom = function alignFrom(align) {
        if (align instanceof Function) this._alignGetter = align;
        else if (align instanceof Object && align.get) this._alignGetter = align.get.bind(align);
        else {
            this._alignGetter = null;
            this._output.align = align;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide size, as [width, height].
     *
     * @method sizeFrom
     *
     * @param {Object} size provider object
     * @return {Modifier} this
     */
    Modifier.prototype.sizeFrom = function sizeFrom(size) {
        if (size instanceof Function) this._sizeGetter = size;
        else if (size instanceof Object && size.get) this._sizeGetter = size.get.bind(size);
        else {
            this._sizeGetter = null;
            this._output.size = size;
        }
        return this;
    };

     /**
     * Deprecated: Prefer transformFrom with static Transform, or use a TransitionableTransform.
     * @deprecated
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        if (transition || this._legacyStates.transform) {
            if (!this._legacyStates.transform) {
                this._legacyStates.transform = new TransitionableTransform(this._output.transform);
            }
            if (!this._transformGetter) this.transformFrom(this._legacyStates.transform);

            this._legacyStates.transform.set(transform, transition, callback);
            return this;
        }
        else return this.transformFrom(transform);
    };

    /**
     * Deprecated: Prefer opacityFrom with static opacity array, or use a Transitionable with that opacity.
     * @deprecated
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        if (transition || this._legacyStates.opacity) {
            if (!this._legacyStates.opacity) {
                this._legacyStates.opacity = new Transitionable(this._output.opacity);
            }
            if (!this._opacityGetter) this.opacityFrom(this._legacyStates.opacity);

            return this._legacyStates.opacity.set(opacity, transition, callback);
        }
        else return this.opacityFrom(opacity);
    };

    /**
     * Deprecated: Prefer originFrom with static origin array, or use a Transitionable with that origin.
     * @deprecated
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.origin) {

            if (!this._legacyStates.origin) {
                this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0]);
            }
            if (!this._originGetter) this.originFrom(this._legacyStates.origin);

            this._legacyStates.origin.set(origin, transition, callback);
            return this;
        }
        else return this.originFrom(origin);
    };

    /**
     * Deprecated: Prefer alignFrom with static align array, or use a Transitionable with that align.
     * @deprecated
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setAlign = function setAlign(align, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.align) {

            if (!this._legacyStates.align) {
                this._legacyStates.align = new Transitionable(this._output.align || [0, 0]);
            }
            if (!this._alignGetter) this.alignFrom(this._legacyStates.align);

            this._legacyStates.align.set(align, transition, callback);
            return this;
        }
        else return this.alignFrom(align);
    };

    /**
     * Deprecated: Prefer sizeFrom with static origin array, or use a Transitionable with that size.
     * @deprecated
     * @method setSize
     * @param {Array.Number} size two element array of [width, height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size && (transition || this._legacyStates.size)) {
            if (!this._legacyStates.size) {
                this._legacyStates.size = new Transitionable(this._output.size || [0, 0]);
            }
            if (!this._sizeGetter) this.sizeFrom(this._legacyStates.size);

            this._legacyStates.size.set(size, transition, callback);
            return this;
        }
        else return this.sizeFrom(size);
    };

    /**
     * Deprecated: Prefer to stop transform in your provider object.
     * @deprecated
     * @method halt
     */
    Modifier.prototype.halt = function halt() {
        if (this._legacyStates.transform) this._legacyStates.transform.halt();
        if (this._legacyStates.opacity) this._legacyStates.opacity.halt();
        if (this._legacyStates.origin) this._legacyStates.origin.halt();
        if (this._legacyStates.align) this._legacyStates.align.halt();
        if (this._legacyStates.size) this._legacyStates.size.halt();
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
    };

    /**
     * Deprecated: Prefer to use your provided transform or output of your transform provider.
     * @deprecated
     * @method getTransform
     * @return {Object} transform provider object
     */
    Modifier.prototype.getTransform = function getTransform() {
        return this._transformGetter();
    };

    /**
     * Deprecated: Prefer to determine the end state of your transform from your transform provider
     * @deprecated
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    Modifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform;
    };

    /**
     * Deprecated: Prefer to use your provided opacity or output of your opacity provider.
     * @deprecated
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    Modifier.prototype.getOpacity = function getOpacity() {
        return this._opacityGetter();
    };

    /**
     * Deprecated: Prefer to use your provided origin or output of your origin provider.
     * @deprecated
     * @method getOrigin
     * @return {Object} origin provider object
     */
    Modifier.prototype.getOrigin = function getOrigin() {
        return this._originGetter();
    };

    /**
     * Deprecated: Prefer to use your provided align or output of your align provider.
     * @deprecated
     * @method getAlign
     * @return {Object} align provider object
     */
    Modifier.prototype.getAlign = function getAlign() {
        return this._alignGetter();
    };

    /**
     * Deprecated: Prefer to use your provided size or output of your size provider.
     * @deprecated
     * @method getSize
     * @return {Object} size provider object
     */
    Modifier.prototype.getSize = function getSize() {
        return this._sizeGetter ? this._sizeGetter() : this._output.size;
    };

    // call providers on tick to receive render spec elements to apply
    function _update() {
        if (this._transformGetter) this._output.transform = this._transformGetter();
        if (this._opacityGetter) this._output.opacity = this._opacityGetter();
        if (this._originGetter) this._output.origin = this._originGetter();
        if (this._alignGetter) this._output.align = this._alignGetter();
        if (this._sizeGetter) this._output.size = this._sizeGetter();
    }

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Modifier.prototype.modify = function modify(target) {
        _update.call(this);
        this._output.target = target;
        return this._output;
    };

    module.exports = Modifier;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/Scene',['require','exports','module','./Transform','./Modifier','./RenderNode'],function(require, exports, module) {
    var Transform = require('./Transform');
    var Modifier = require('./Modifier');
    var RenderNode = require('./RenderNode');

    /**
     * Builds and renders a scene graph based on a declarative structure definition.
     * See the Scene examples in the examples distribution (http://github.com/Famous/examples.git).
     *
     * @class Scene
     * @constructor
     * @param {Object} definition in the format of a render spec.
     */
    function Scene(definition) {
        this.id = null;
        this._objects = null;

        this.node = new RenderNode();
        this._definition = null;

        if (definition) this.load(definition);
    }

    var _MATRIX_GENERATORS = {
        'translate': Transform.translate,
        'rotate': Transform.rotate,
        'rotateX': Transform.rotateX,
        'rotateY': Transform.rotateY,
        'rotateZ': Transform.rotateZ,
        'rotateAxis': Transform.rotateAxis,
        'scale': Transform.scale,
        'skew': Transform.skew,
        'matrix3d': function() {
            return arguments;
        }
    };

    /**
     * Clone this scene
     *
     * @method create
     * @return {Scene} deep copy of this scene
     */
    Scene.prototype.create = function create() {
        return new Scene(this._definition);
    };

    function _resolveTransformMatrix(matrixDefinition) {
        for (var type in _MATRIX_GENERATORS) {
            if (type in matrixDefinition) {
                var args = matrixDefinition[type];
                if (!(args instanceof Array)) args = [args];
                return _MATRIX_GENERATORS[type].apply(this, args);
            }
        }
    }

    // parse transform into tree of render nodes, doing matrix multiplication
    // when available
    function _parseTransform(definition) {
        var transformDefinition = definition.transform;
        var opacity = definition.opacity;
        var origin = definition.origin;
        var size = definition.size;
        var transform = Transform.identity;
        if (transformDefinition instanceof Array) {
            if (transformDefinition.length === 16 && typeof transformDefinition[0] === 'number') {
                transform = transformDefinition;
            }
            else {
                for (var i = 0; i < transformDefinition.length; i++) {
                    transform = Transform.multiply(transform, _resolveTransformMatrix(transformDefinition[i]));
                }
            }
        }
        else if (transformDefinition instanceof Object) {
            transform = _resolveTransformMatrix(transformDefinition);
        }

        var result = new Modifier({
            transform: transform,
            opacity: opacity,
            origin: origin,
            size: size
        });
        return result;
    }

    function _parseArray(definition) {
        var result = new RenderNode();
        for (var i = 0; i < definition.length; i++) {
            var obj = _parse.call(this, definition[i]);
            if (obj) result.add(obj);
        }
        return result;
    }

    // parse object directly into tree of RenderNodes
    function _parse(definition) {
        var result;
        var id;
        if (definition instanceof Array) {
            result = _parseArray.call(this, definition);
        }
        else {
            id = this._objects.length;
            if (definition.render && (definition.render instanceof Function)) {
                result = definition;
            }
            else if (definition.target) {
                var targetObj = _parse.call(this, definition.target);
                var obj = _parseTransform.call(this, definition);

                result = new RenderNode(obj);
                result.add(targetObj);
                if (definition.id) this.id[definition.id] = obj;
            }
            else if (definition.id) {
                result = new RenderNode();
                this.id[definition.id] = result;
            }
        }
        this._objects[id] = result;
        return result;
    }

    /**
     * Builds and renders a scene graph based on a canonical declarative scene definition.
     * See examples/Scene/example.js.
     *
     * @method load
     * @param {Object} definition definition in the format of a render spec.
     */
    Scene.prototype.load = function load(definition) {
        this._definition = definition;
        this.id = {};
        this._objects = [];
        this.node.set(_parse.call(this, definition));
    };

    /**
     * Add renderables to this component's render tree
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} Render wrapping provided object, if not already a RenderNode
     */
    Scene.prototype.add = function add() {
        return this.node.add.apply(this.node, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scene.prototype.render = function render() {
        return this.node.render.apply(this.node, arguments);
    };

    module.exports = Scene;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/View',['require','exports','module','./EventHandler','./OptionsManager','./RenderNode'],function(require, exports, module) {
    var EventHandler = require('./EventHandler');
    var OptionsManager = require('./OptionsManager');
    var RenderNode = require('./RenderNode');

    /**
     * Useful for quickly creating elements within applications
     *   with large event systems.  Consists of a RenderNode paired with
     *   an input EventHandler and an output EventHandler.
     *   Meant to be extended by the developer.
     *
     * @class View
     * @uses EventHandler
     * @uses OptionsManager
     * @uses RenderNode
     * @constructor
     */
    function View(options) {
        this._node = new RenderNode();

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    View.DEFAULT_OPTIONS = {}; // no defaults

    /**
     * Look up options value by key
     * @method getOptions
     *
     * @param {string} key key
     * @return {Object} associated object
     */
    View.prototype.getOptions = function getOptions() {
        return this._optionsManager.value();
    };

    /*
     *  Set internal options.
     *  No defaults options are set in View.
     *
     *  @method setOptions
     *  @param {Object} options
     */
    View.prototype.setOptions = function setOptions(options) {
        this._optionsManager.patch(options);
    };

    /**
     * Add a child renderable to the view.
     *   Note: This is meant to be used by an inheriting class
     *   rather than from outside the prototype chain.
     *
     * @method add
     * @return {RenderNode}
     * @protected
     */
    View.prototype.add = function add() {
        return this._node.add.apply(this._node, arguments);
    };

    /**
     * Alias for add
     * @method _add
     */
    View.prototype._add = View.prototype.add;

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    View.prototype.render = function render() {
        return this._node.render();
    };

    /**
     * Return size of contained element.
     *
     * @method getSize
     * @return {Array.Number} [width, height]
     */
    View.prototype.getSize = function getSize() {
        if (this._node && this._node.getSize) {
            return this._node.getSize.apply(this._node, arguments) || this.options.size;
        }
        else return this.options.size;
    };

    module.exports = View;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/core/ViewSequence',['require','exports','module'],function(require, exports, module) {

    /**
     * Helper object used to iterate through items sequentially. Used in
     *   views that deal with layout.  A ViewSequence object conceptually points
     *   to a node in a linked list.
     *
     * @class ViewSequence
     *
     * @constructor
     * @param {Object|Array} options Options object, or content array.
     * @param {Number} [options.index] starting index.
     * @param {Number} [options.array] Array of elements to populate the ViewSequence
     * @param {Object} [options._] Optional backing store (internal
     * @param {Boolean} [options.loop] Whether to wrap when accessing elements just past the end
     *   (or beginning) of the sequence.
     */
    function ViewSequence(options) {
        if (!options) options = [];
        if (options instanceof Array) options = {array: options};

        this._ = null;
        this.index = options.index || 0;

        if (options.array) this._ = new (this.constructor.Backing)(options.array);
        else if (options._) this._ = options._;

        if (this.index === this._.firstIndex) this._.firstNode = this;
        if (this.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = this;

        if (options.loop !== undefined) this._.loop = options.loop;

        this._previousNode = null;
        this._nextNode = null;
    }

    // constructor for internal storage
    ViewSequence.Backing = function Backing(array) {
        this.array = array;
        this.firstIndex = 0;
        this.loop = false;
        this.firstNode = null;
        this.lastNode = null;
    };

    // Get value "i" slots away from the first index.
    ViewSequence.Backing.prototype.getValue = function getValue(i) {
        var _i = i - this.firstIndex;
        if (_i < 0 || _i >= this.array.length) return null;
        return this.array[_i];
    };

    // Set value "i" slots away from the first index.
    ViewSequence.Backing.prototype.setValue = function setValue(i, value) {
        this.array[i - this.firstIndex] = value;
    };

    // After splicing into the backing store, restore the indexes of each node correctly.
    ViewSequence.Backing.prototype.reindex = function reindex(start, removeCount, insertCount) {
        if (!this.array[0]) return;

        var i = 0;
        var index = this.firstIndex;
        var indexShiftAmount = insertCount - removeCount;
        var node = this.firstNode;

        // find node to begin
        while (index < start - 1) {
            node = node.getNext();
            index++;
        }
        // skip removed nodes
        var spliceStartNode = node;
        for (i = 0; i < removeCount; i++) {
            node = node.getNext();
            if (node) node._previousNode = spliceStartNode;
        }
        var spliceResumeNode = node ? node.getNext() : null;
        // generate nodes for inserted items
        spliceStartNode._nextNode = null;
        node = spliceStartNode;
        for (i = 0; i < insertCount; i++) node = node.getNext();
        index += insertCount;
        // resume the chain
        if (node !== spliceResumeNode) {
            node._nextNode = spliceResumeNode;
            if (spliceResumeNode) spliceResumeNode._previousNode = node;
        }
        if (spliceResumeNode) {
            node = spliceResumeNode;
            index++;
            while (node && index < this.array.length + this.firstIndex) {
                if (node._nextNode) node.index += indexShiftAmount;
                else node.index = index;
                node = node.getNext();
                index++;
            }
        }
    };

    /**
     * Return ViewSequence node previous to this node in the list, respecting looping if applied.
     *
     * @method getPrevious
     * @return {ViewSequence} previous node.
     */
    ViewSequence.prototype.getPrevious = function getPrevious() {
        if (this.index === this._.firstIndex) {
            if (this._.loop) {
                this._previousNode = this._.lastNode || new (this.constructor)({_: this._, index: this._.firstIndex + this._.array.length - 1});
                this._previousNode._nextNode = this;
            }
            else {
                this._previousNode = null;
            }
        }
        else if (!this._previousNode) {
            this._previousNode = new (this.constructor)({_: this._, index: this.index - 1});
            this._previousNode._nextNode = this;
        }
        return this._previousNode;
    };

    /**
     * Return ViewSequence node next after this node in the list, respecting looping if applied.
     *
     * @method getNext
     * @return {ViewSequence} previous node.
     */
    ViewSequence.prototype.getNext = function getNext() {
        if (this.index === this._.firstIndex + this._.array.length - 1) {
            if (this._.loop) {
                this._nextNode = this._.firstNode || new (this.constructor)({_: this._, index: this._.firstIndex});
                this._nextNode._previousNode = this;
            }
            else {
                this._nextNode = null;
            }
        }
        else if (!this._nextNode) {
            this._nextNode = new (this.constructor)({_: this._, index: this.index + 1});
            this._nextNode._previousNode = this;
        }
        return this._nextNode;
    };

    /**
     * Return index of this ViewSequence node.
     *
     * @method getIndex
     * @return {Number} index
     */
    ViewSequence.prototype.getIndex = function getIndex() {
        return this.index;
    };

    /**
     * Return printable version of this ViewSequence node.
     *
     * @method toString
     * @return {string} this index as a string
     */
    ViewSequence.prototype.toString = function toString() {
        return '' + this.index;
    };

    /**
     * Add one or more objects to the beginning of the sequence.
     *
     * @method unshift
     * @param {...Object} value arguments array of objects
     */
    ViewSequence.prototype.unshift = function unshift(value) {
        this._.array.unshift.apply(this._.array, arguments);
        this._.firstIndex -= arguments.length;
    };

    /**
     * Add one or more objects to the end of the sequence.
     *
     * @method push
     * @param {...Object} value arguments array of objects
     */
    ViewSequence.prototype.push = function push(value) {
        this._.array.push.apply(this._.array, arguments);
    };

    /**
     * Remove objects from the sequence
     *
     * @method splice
     * @param {Number} index starting index for removal
     * @param {Number} howMany how many elements to remove
     * @param {...Object} value arguments array of objects
     */
    ViewSequence.prototype.splice = function splice(index, howMany) {
        var values = Array.prototype.slice.call(arguments, 2);
        this._.array.splice.apply(this._.array, [index - this._.firstIndex, howMany].concat(values));
        this._.reindex(index, howMany, values.length);
    };

    /**
     * Exchange this element's sequence position with another's.
     *
     * @method swap
     * @param {ViewSequence} other element to swap with.
     */
    ViewSequence.prototype.swap = function swap(other) {
        var otherValue = other.get();
        var myValue = this.get();
        this._.setValue(this.index, otherValue);
        this._.setValue(other.index, myValue);

        var myPrevious = this._previousNode;
        var myNext = this._nextNode;
        var myIndex = this.index;
        var otherPrevious = other._previousNode;
        var otherNext = other._nextNode;
        var otherIndex = other.index;

        this.index = otherIndex;
        this._previousNode = (otherPrevious === this) ? other : otherPrevious;
        if (this._previousNode) this._previousNode._nextNode = this;
        this._nextNode = (otherNext === this) ? other : otherNext;
        if (this._nextNode) this._nextNode._previousNode = this;

        other.index = myIndex;
        other._previousNode = (myPrevious === other) ? this : myPrevious;
        if (other._previousNode) other._previousNode._nextNode = other;
        other._nextNode = (myNext === other) ? this : myNext;
        if (other._nextNode) other._nextNode._previousNode = other;

        if (this.index === this._.firstIndex) this._.firstNode = this;
        else if (this.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = this;
        if (other.index === this._.firstIndex) this._.firstNode = other;
        else if (other.index === this._.firstIndex + this._.array.length - 1) this._.lastNode = other;
    };

   /**
     * Return value of this ViewSequence node.
     *
     * @method get
     * @return {Object} value of thiss
     */
    ViewSequence.prototype.get = function get() {
        return this._.getValue(this.index);
    };

   /**
     * Call getSize() on the contained View.
     *
     * @method getSize
     * @return {Array.Number} [width, height]
     */
    ViewSequence.prototype.getSize = function getSize() {
        var target = this.get();
        return target ? target.getSize() : null;
    };

    /**
     * Generate a render spec from the contents of this component.
     * Specifically, this will render the value at the current index.
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    ViewSequence.prototype.render = function render() {
        var target = this.get();
        return target ? target.render.apply(target, arguments) : null;
    };

    module.exports = ViewSequence;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/math/Utilities',['require','exports','module'],function(require, exports, module) {
    /**
     * A few static methods.
     *
     * @class Utilities
     * @static
     */
    var Utilities = {};

    /**
     * Constrain input to range.
     *
     * @method clamp
     * @param {Number} value input
     * @param {Array.Number} range [min, max]
     * @static
     */
    Utilities.clamp = function clamp(value, range) {
        return Math.max(Math.min(value, range[1]), range[0]);
    };

    /**
     * Euclidean length of numerical array.
     *
     * @method length
     * @param {Array.Number} array array of numbers
     * @static
     */
    Utilities.length = function length(array) {
        var distanceSquared = 0;
        for (var i = 0; i < array.length; i++) {
            distanceSquared += array[i] * array[i];
        }
        return Math.sqrt(distanceSquared);
    };

    module.exports = Utilities;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/GenericSync',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Combines multiple types of sync classes (e.g. mouse, touch,
     *  scrolling) into one standardized interface for inclusion in widgets.
     *
     *  Sync classes are first registered with a key, and then can be accessed
     *  globally by key.
     *
     *  Emits 'start', 'update' and 'end' events as a union of the sync class
     *  providers.
     *
     * @class GenericSync
     * @constructor
     * @param syncs {Object|Array} object with fields {sync key : sync options}
     *    or an array of registered sync keys
     * @param [options] {Object|Array} options object to set on all syncs
     */
    function GenericSync(syncs, options) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._syncs = {};
        if (syncs) this.addSync(syncs);
        if (options) this.setOptions(options);
    }

    GenericSync.DIRECTION_X = 0;
    GenericSync.DIRECTION_Y = 1;
    GenericSync.DIRECTION_Z = 2;

    // Global registry of sync classes. Append only.
    var registry = {};

    /**
     * Register a global sync class with an identifying key
     *
     * @static
     * @method register
     *
     * @param syncObject {Object} an object of {sync key : sync options} fields
     */
    GenericSync.register = function register(syncObject) {
        for (var key in syncObject){
            if (registry[key]){
                if (registry[key] === syncObject[key]) return; // redundant registration
                else throw new Error('this key is registered to a different sync class');
            }
            else registry[key] = syncObject[key];
        }
    };

    /**
     * Helper to set options on all sync instances
     *
     * @method setOptions
     * @param options {Object} options object
     */
    GenericSync.prototype.setOptions = function(options) {
        for (var key in this._syncs){
            this._syncs[key].setOptions(options);
        }
    };

    /**
     * Pipe events to a sync class
     *
     * @method pipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.pipeSync = function pipeToSync(key) {
        var sync = this._syncs[key];
        this._eventInput.pipe(sync);
        sync.pipe(this._eventOutput);
    };

    /**
     * Unpipe events from a sync class
     *
     * @method unpipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.unpipeSync = function unpipeFromSync(key) {
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync);
        sync.unpipe(this._eventOutput);
    };

    function _addSingleSync(key, options) {
        if (!registry[key]) return;
        this._syncs[key] = new (registry[key])(options);
        this.pipeSync(key);
    }

    /**
     * Add a sync class to from the registered classes
     *
     * @method addSync
     * @param syncs {Object|Array.String} an array of registered sync keys
     *    or an object with fields {sync key : sync options}
     */
    GenericSync.prototype.addSync = function addSync(syncs) {
        if (syncs instanceof Array)
            for (var i = 0; i < syncs.length; i++)
                _addSingleSync.call(this, syncs[i]);
        else if (syncs instanceof Object)
            for (var key in syncs)
                _addSingleSync.call(this, key, syncs[key]);
    };

    module.exports = GenericSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/MouseSync',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Handles piped in mouse drag events. Outputs an object with two
     *   properties, position and velocity.
     *   Emits 'start', 'update' and 'end' events with DOM event passthroughs,
     *   with position, velocity, and a delta key.
     *
     * @class MouseSync
     * @constructor
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.propogate] {Boolean}  add listened to document on mouseleave
     */
    function MouseSync(options) {
        this.options =  Object.create(MouseSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('mousedown', _handleStart.bind(this));
        this._eventInput.on('mousemove', _handleMove.bind(this));
        this._eventInput.on('mouseup', _handleEnd.bind(this));

        if (this.options.propogate) this._eventInput.on('mouseleave', _handleLeave.bind(this));
        else this._eventInput.on('mouseleave', _handleEnd.bind(this));

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : 0,
            clientY  : 0,
            offsetX  : 0,
            offsetY  : 0
        };

        this._position = null;      // to be deprecated
        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._down = false;
        this._moved = false;
    }

    MouseSync.DEFAULT_OPTIONS = {
        direction: undefined,
        rails: false,
        scale: 1,
        propogate: true  // events piped to document on mouseleave
    };

    MouseSync.DIRECTION_X = 0;
    MouseSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    var _now = Date.now;

    function _handleStart(event) {
        var delta;
        var velocity;
        event.preventDefault(); // prevent drag

        var x = event.clientX;
        var y = event.clientY;

        this._prevCoord = [x, y];
        this._prevTime = _now();
        this._down = true;
        this._move = false;

        if (this.options.direction !== undefined){
            this._position = 0;
            delta = 0;
            velocity = 0;
        }
        else {
            this._position = [0, 0];
            delta = [0, 0];
            velocity = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = x;
        payload.clientY = y;
        payload.offsetX = event.offsetX;
        payload.offsetY = event.offsetY;

        this._eventOutput.emit('start', payload);
    }

    function _handleMove(event) {
        if (!this._prevCoord) return;

        var prevCoord = this._prevCoord;
        var prevTime = this._prevTime;

        var x = event.clientX;
        var y = event.clientY;

        var currTime = _now();

        var diffX = x - prevCoord[0];
        var diffY = y - prevCoord[1];

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === MouseSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === MouseSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.position = this._position;
        payload.velocity = nextVel;
        payload.clientX  = x;
        payload.clientY  = y;
        payload.offsetX  = event.offsetX;
        payload.offsetY  = event.offsetY;

        this._eventOutput.emit('update', payload);

        this._prevCoord = [x, y];
        this._prevTime = currTime;
        this._move = true;
    }

    function _handleEnd(event) {
        if (!this._down) return;

        this._eventOutput.emit('end', this._payload);
        this._prevCoord = undefined;
        this._prevTime = undefined;
        this._down = false;
        this._move = false;
    }

    function _handleLeave(event) {
        if (!this._down || !this._move) return;

        var boundMove = _handleMove.bind(this);
        var boundEnd = function(event) {
            _handleEnd.call(this, event);
            document.removeEventListener('mousemove', boundMove);
            document.removeEventListener('mouseup', boundEnd);
        }.bind(this, event);

        document.addEventListener('mousemove', boundMove);
        document.addEventListener('mouseup', boundEnd);
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    MouseSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.propogate] {Boolean}  add listened to document on mouseleave
     */
    MouseSync.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.rails !== undefined) this.options.rails = options.rails;
        if (options.scale !== undefined) this.options.scale = options.scale;
        if (options.propogate !== undefined) this.options.propogate = options.propogate;
    };

    module.exports = MouseSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/TouchTracker',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    var _now = Date.now;

    function _timestampTouch(touch, event, history) {
        return {
            x: touch.clientX,
            y: touch.clientY,
            identifier : touch.identifier,
            origin: event.origin,
            timestamp: _now(),
            count: event.touches.length,
            history: history
        };
    }

    function _handleStart(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var data = _timestampTouch(touch, event, null);
            this.eventOutput.emit('trackstart', data);
            if (!this.selective && !this.touchHistory[touch.identifier]) this.track(data);
        }
    }

    function _handleMove(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.touchHistory[touch.identifier].push(data);
                this.eventOutput.emit('trackmove', data);
            }
        }
    }

    function _handleEnd(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var history = this.touchHistory[touch.identifier];
            if (history) {
                var data = _timestampTouch(touch, event, history);
                this.eventOutput.emit('trackend', data);
                delete this.touchHistory[touch.identifier];
            }
        }
    }

    function _handleUnpipe() {
        for (var i in this.touchHistory) {
            var history = this.touchHistory[i];
            this.eventOutput.emit('trackend', {
                touch: history[history.length - 1].touch,
                timestamp: Date.now(),
                count: 0,
                history: history
            });
            delete this.touchHistory[i];
        }
    }

    /**
     * Helper to TouchSync – tracks piped in touch events, organizes touch
     *   events by ID, and emits track events back to TouchSync.
     *   Emits 'trackstart', 'trackmove', and 'trackend' events upstream.
     *
     * @class TouchTracker
     * @constructor
     * @param {Boolean} selective if false, save state for each touch.
     */
    function TouchTracker(selective) {
        this.selective = selective;
        this.touchHistory = {};

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('touchstart', _handleStart.bind(this));
        this.eventInput.on('touchmove', _handleMove.bind(this));
        this.eventInput.on('touchend', _handleEnd.bind(this));
        this.eventInput.on('touchcancel', _handleEnd.bind(this));
        this.eventInput.on('unpipe', _handleUnpipe.bind(this));
    }

    /**
     * Record touch data, if selective is false.
     * @private
     * @method track
     * @param {Object} data touch data
     */
    TouchTracker.prototype.track = function track(data) {
        this.touchHistory[data.identifier] = [data];
    };

    module.exports = TouchTracker;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/TouchSync',['require','exports','module','./TouchTracker','famous/core/EventHandler'],function(require, exports, module) {
    var TouchTracker = require('./TouchTracker');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Handles piped in touch events. Emits 'start', 'update', and 'events'
     *   events with position, velocity, acceleration, and touch id.
     *   Useful for dealing with inputs on touch devices.
     *
     *
     * @class TouchSync
     * @constructor
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    function TouchSync(options) {
        this.options =  Object.create(TouchSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._eventOutput = new EventHandler();
        this._touchTracker = new TouchTracker();

        EventHandler.setOutputHandler(this, this._eventOutput);
        EventHandler.setInputHandler(this, this._touchTracker);

        this._touchTracker.on('trackstart', _handleStart.bind(this));
        this._touchTracker.on('trackmove', _handleMove.bind(this));
        this._touchTracker.on('trackend', _handleEnd.bind(this));

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            clientX  : undefined,
            clientY  : undefined,
            count    : 0,
            touch    : undefined
        };

        this._position = null; // to be deprecated
    }

    TouchSync.DEFAULT_OPTIONS = {
        direction: undefined,
        rails: false,
        scale: 1
    };

    TouchSync.DIRECTION_X = 0;
    TouchSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    // handle 'trackstart'
    function _handleStart(data) {
        var velocity;
        var delta;
        if (this.options.direction !== undefined){
            this._position = 0;
            velocity = 0;
            delta = 0;
        }
        else {
            this._position = [0, 0];
            velocity = [0, 0];
            delta = [0, 0];
        }

        var payload = this._payload;
        payload.delta = delta;
        payload.position = this._position;
        payload.velocity = velocity;
        payload.clientX = data.x;
        payload.clientY = data.y;
        payload.count = data.count;
        payload.touch = data.identifier;

        this._eventOutput.emit('start', payload);
    }

    // handle 'trackmove'
    function _handleMove(data) {
        var history = data.history;

        var currHistory = history[history.length - 1];
        var prevHistory = history[history.length - 2];

        var prevTime = prevHistory.timestamp;
        var currTime = currHistory.timestamp;

        var diffX = currHistory.x - prevHistory.x;
        var diffY = currHistory.y - prevHistory.y;

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME);

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === TouchSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === TouchSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;
        payload.clientX  = data.x;
        payload.clientY  = data.y;
        payload.count    = data.count;
        payload.touch    = data.identifier;

        this._eventOutput.emit('update', payload);
    }

    // handle 'trackend'
    function _handleEnd(data) {
        this._payload.count = data.count;
        this._eventOutput.emit('end', this._payload);
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param [options] {Object}             default options overrides
     * @param [options.direction] {Number}   read from a particular axis
     * @param [options.rails] {Boolean}      read from axis with greatest differential
     * @param [options.scale] {Number}       constant factor to scale velocity output
     */
    TouchSync.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.rails !== undefined) this.options.rails = options.rails;
        if (options.scale !== undefined) this.options.scale = options.scale;
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    TouchSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    module.exports = TouchSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/modifiers/Draggable',['require','exports','module','famous/core/Transform','famous/transitions/Transitionable','famous/core/EventHandler','famous/math/Utilities','famous/inputs/GenericSync','famous/inputs/MouseSync','famous/inputs/TouchSync'],function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var EventHandler = require('famous/core/EventHandler');
    var Utilities = require('famous/math/Utilities');

    var GenericSync = require('famous/inputs/GenericSync');
    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});

    /**
     * Makes added render nodes responsive to drag beahvior.
     *   Emits events 'start', 'update', 'end'.
     * @class Draggable
     * @constructor
     * @param {Object} [options] options configuration object.
     * @param {Number} [options.snapX] grid width for snapping during drag
     * @param {Number} [options.snapY] grid height for snapping during drag
     * @param {Array.Number} [options.xRange] maxmimum [negative, positive] x displacement from start of drag
     * @param {Array.Number} [options.yRange] maxmimum [negative, positive] y displacement from start of drag
     * @param {Number} [options.scale] one pixel of input motion translates to this many pixels of output drag motion
     * @param {Number} [options.projection] User should set to Draggable._direction.x or
     *    Draggable._direction.y to constrain to one axis.
     *
     */
    function Draggable(options) {
        this.options = Object.create(Draggable.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._positionState = new Transitionable([0,0]);
        this._differential  = [0,0];
        this._active = true;

        this.sync = new GenericSync(['mouse', 'touch'], {scale : this.options.scale});
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this,  this.sync);
        EventHandler.setOutputHandler(this, this.eventOutput);

        _bindEvents.call(this);
    }

    //binary representation of directions for bitwise operations
    var _direction = {
        x : 0x01,         //001
        y : 0x02          //010
    };

    Draggable.DIRECTION_X = _direction.x;
    Draggable.DIRECTION_Y = _direction.y;

    var _clamp = Utilities.clamp;

    Draggable.DEFAULT_OPTIONS = {
        projection  : _direction.x | _direction.y,
        scale       : 1,
        xRange      : null,
        yRange      : null,
        snapX       : 0,
        snapY       : 0,
        transition  : {duration : 0}
    };

    function _mapDifferential(differential) {
        var opts        = this.options;
        var projection  = opts.projection;
        var snapX       = opts.snapX;
        var snapY       = opts.snapY;

        //axes
        var tx = (projection & _direction.x) ? differential[0] : 0;
        var ty = (projection & _direction.y) ? differential[1] : 0;

        //snapping
        if (snapX > 0) tx -= tx % snapX;
        if (snapY > 0) ty -= ty % snapY;

        return [tx, ty];
    }

    function _handleStart() {
        if (!this._active) return;
        if (this._positionState.isActive()) this._positionState.halt();
        this.eventOutput.emit('start', {position : this.getPosition()});
    }

    function _handleMove(event) {
        if (!this._active) return;

        var options = this.options;
        this._differential = event.position;
        var newDifferential = _mapDifferential.call(this, this._differential);

        //buffer the differential if snapping is set
        this._differential[0] -= newDifferential[0];
        this._differential[1] -= newDifferential[1];

        var pos = this.getPosition();

        //modify position, retain reference
        pos[0] += newDifferential[0];
        pos[1] += newDifferential[1];

        //handle bounding box
        if (options.xRange){
            var xRange = [options.xRange[0] + 0.5 * options.snapX, options.xRange[1] - 0.5 * options.snapX];
            pos[0] = _clamp(pos[0], xRange);
        }

        if (options.yRange){
            var yRange = [options.yRange[0] + 0.5 * options.snapY, options.yRange[1] - 0.5 * options.snapY];
            pos[1] = _clamp(pos[1], yRange);
        }

        this.eventOutput.emit('update', {position : pos});
    }

    function _handleEnd() {
        if (!this._active) return;
        this.eventOutput.emit('end', {position : this.getPosition()});
    }

    function _bindEvents() {
        this.sync.on('start', _handleStart.bind(this));
        this.sync.on('update', _handleMove.bind(this));
        this.sync.on('end', _handleEnd.bind(this));
    }

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options.  See constructor.
     */
    Draggable.prototype.setOptions = function setOptions(options) {
        var currentOptions = this.options;
        if (options.projection !== undefined) {
            var proj = options.projection;
            this.options.projection = 0;
            ['x', 'y'].forEach(function(val) {
                if (proj.indexOf(val) !== -1) currentOptions.projection |= _direction[val];
            });
        }
        if (options.scale  !== undefined) {
            currentOptions.scale  = options.scale;
            this.sync.setOptions({
                scale: options.scale
            });
        }
        if (options.xRange !== undefined) currentOptions.xRange = options.xRange;
        if (options.yRange !== undefined) currentOptions.yRange = options.yRange;
        if (options.snapX  !== undefined) currentOptions.snapX  = options.snapX;
        if (options.snapY  !== undefined) currentOptions.snapY  = options.snapY;
    };

    /**
     * Get current delta in position from where this draggable started.
     *
     * @method getPosition
     *
     * @return {array<number>} [x, y] position delta from start.
     */
    Draggable.prototype.getPosition = function getPosition() {
        return this._positionState.get();
    };

    /**
     * Transition the element to the desired relative position via provided transition.
     *  For example, calling this with [0,0] will not change the position.
     *  Callback will be executed on completion.
     *
     * @method setRelativePosition
     *
     * @param {array<number>} position end state to which we interpolate
     * @param {transition} transition transition object specifying how object moves to new position
     * @param {function} callback zero-argument function to call on observed completion
     */
    Draggable.prototype.setRelativePosition = function setRelativePosition(position, transition, callback) {
        var currPos = this.getPosition();
        var relativePosition = [currPos[0] + position[0], currPos[1] + position[1]];
        this.setPosition(relativePosition, transition, callback);
    };

    /**
     * Transition the element to the desired absolute position via provided transition.
     *  Callback will be executed on completion.
     *
     * @method setPosition
     *
     * @param {array<number>} position end state to which we interpolate
     * @param {transition} transition transition object specifying how object moves to new position
     * @param {function} callback zero-argument function to call on observed completion
     */
    Draggable.prototype.setPosition = function setPosition(position, transition, callback) {
        if (this._positionState.isActive()) this._positionState.halt();
        this._positionState.set(position, transition, callback);
    };

    /**
     * Set this draggable to respond to user input.
     *
     * @method activate
     *
     */
    Draggable.prototype.activate = function activate() {
        this._active = true;
    };

    /**
     * Set this draggable to ignore user input.
     *
     * @method deactivate
     *
     */
    Draggable.prototype.deactivate = function deactivate() {
        this._active = false;
    };

    /**
     * Switch the input response stage between active and inactive.
     *
     * @method toggle
     *
     */
    Draggable.prototype.toggle = function toggle() {
        this._active = !this._active;
    };

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Draggable.prototype.modify = function modify(target) {
        var pos = this.getPosition();
        return {
            transform: Transform.translate(pos[0], pos[1]),
            target: target
        };
    };

    module.exports = Draggable;
});

define('famous/modifiers/Fader',['require','exports','module','famous/transitions/Transitionable','famous/core/OptionsManager'],function(require, exports, module) {
    var Transitionable = require('famous/transitions/Transitionable');
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * Modifier that allows you to fade the opacity of affected renderables in and out.
     * @class Fader
     * @constructor
     * @param {Object} [options] options configuration object.
     * @param {Boolean} [options.cull=false] Stops returning affected renderables up the tree when they're fully faded when true.
     * @param {Transition} [options.transition=true] The main transition for showing and hiding.
     * @param {Transition} [options.pulseInTransition=true] Controls the transition to a pulsed state when the Fader instance's pulse
     * method is called.
     * @param {Transition} [options.pulseOutTransition=true]Controls the transition back from a pulsed state when the Fader instance's pulse
     * method is called.
     *
     */
    function Fader(options, startState) {
        this.options = Object.create(Fader.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        if (!startState) startState = 0;
        this.transitionHelper = new Transitionable(startState);
    }

    Fader.DEFAULT_OPTIONS = {
        cull: false,
        transition: true,
        pulseInTransition: true,
        pulseOutTransition: true
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options.  See constructor.
     */
    Fader.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Fully displays the Fader instance's associated renderables.
     *
     * @method show
     * @param {Transition} [transition] The transition that coordinates setting to the new state.
     * @param {Function} [callback] A callback that executes once you've transitioned to the fully shown state.
     */
    Fader.prototype.show = function show(transition, callback) {
        transition = transition || this.options.transition;
        this.set(1, transition, callback);
    };

    /**
     * Fully fades the Fader instance's associated renderables.
     *
     * @method hide
     * @param {Transition} [transition] The transition that coordinates setting to the new state.
     * @param {Function} [callback] A callback that executes once you've transitioned to the fully faded state.
     */
    Fader.prototype.hide = function hide(transition, callback) {
        transition = transition || this.options.transition;
        this.set(0, transition, callback);
    };

    /**
     * Manually sets the opacity state of the fader to the passed-in one. Executes with an optional
     * transition and callback.
     *
     * @method set
     * @param {Number} state A number from zero to one: the amount of opacity you want to set to.
     * @param {Transition} [transition] The transition that coordinates setting to the new state.
     * @param {Function} [callback] A callback that executes once you've finished executing the pulse.
     */
    Fader.prototype.set = function set(state, transition, callback) {
        this.halt();
        this.transitionHelper.set(state, transition, callback);
    };

    /**
     * Halt the transition
     *
     * @method halt
     */
    Fader.prototype.halt = function halt() {
        this.transitionHelper.halt();
    };

    /**
     * Tells you if your Fader instance is above its visibility threshold.
     *
     * @method isVisible
     * @return {Boolean} Whether or not your Fader instance is visible.
     */
    Fader.prototype.isVisible = function isVisible() {
        return (this.transitionHelper.get() > 0);
    };

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Fader.prototype.modify = function modify(target) {
        var currOpacity = this.transitionHelper.get();
        if (this.options.cull && !currOpacity) return undefined;
        else return {opacity: currOpacity, target: target};
    };

    module.exports = Fader;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/modifiers/ModifierChain',['require','exports','module'],function(require, exports, module) {

    /**
     * A class to add and remove a chain of modifiers
     *   at a single point in the render tree
     *
     * @class ModifierChain
     * @constructor
     */
    function ModifierChain() {
        this._chain = [];
        if (arguments.length) this.addModifier.apply(this, arguments);
    }

    /**
     * Add a modifier, or comma separated modifiers, to the modifier chain.
     *
     * @method addModifier
     *
     * @param {...Modifier*} varargs args list of Modifiers
     */
    ModifierChain.prototype.addModifier = function addModifier(varargs) {
        Array.prototype.push.apply(this._chain, arguments);
    };

    /**
     * Remove a modifier from the modifier chain.
     *
     * @method removeModifier
     *
     * @param {Modifier} modifier
     */
    ModifierChain.prototype.removeModifier = function removeModifier(modifier) {
        var index = this._chain.indexOf(modifier);
        if (index < 0) return;
        this._chain.splice(index, 1);
    };

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} input (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    ModifierChain.prototype.modify = function modify(input) {
        var chain  = this._chain;
        var result = input;
        for (var i = 0; i < chain.length; i++) {
            result = chain[i].modify(result);
        }
        return result;
    };

    module.exports = ModifierChain;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/modifiers/StateModifier',['require','exports','module','famous/core/Modifier','famous/core/Transform','famous/transitions/Transitionable','famous/transitions/TransitionableTransform'],function(require, exports, module) {
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     *  A collection of visual changes to be
     *    applied to another renderable component, strongly coupled with the state that defines
     *    those changes. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier, and an alignment specifier.
     *    StateModifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The StateModifier's children and descendants
     *    are transformed by the amounts specified in the modifier's properties.
     *
     * @class StateModifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.align] align adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function StateModifier(options) {
        this._transformState = new TransitionableTransform(Transform.identity);
        this._opacityState = new Transitionable(1);
        this._originState = new Transitionable([0, 0]);
        this._alignState = new Transitionable([0, 0]);
        this._sizeState = new Transitionable([0, 0]);

        this._modifier = new Modifier({
            transform: this._transformState,
            opacity: this._opacityState,
            origin: null,
            align: null,
            size: null
        });

        this._hasOrigin = false;
        this._hasAlign = false;
        this._hasSize = false;

        if (options) {
            if (options.transform) this.setTransform(options.transform);
            if (options.opacity !== undefined) this.setOpacity(options.opacity);
            if (options.origin) this.setOrigin(options.origin);
            if (options.align) this.setAlign(options.align);
            if (options.size) this.setSize(options.size);
        }
    }

    /**
     * Set the transform matrix of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to.
     * @param {Transitionable} [transition] Valid transitionable object
     * @param {Function} [callback] callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        this._transformState.set(transform, transition, callback);
        return this;
    };

    /**
     * Set the opacity of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        this._opacityState.set(opacity, transition, callback);
        return this;
    };

    /**
     * Set the origin of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        if (origin === null) {
            if (this._hasOrigin) {
                this._modifier.originFrom(null);
                this._hasOrigin = false;
            }
            return this;
        }
        else if (!this._hasOrigin) {
            this._hasOrigin = true;
            this._modifier.originFrom(this._originState);
        }
        this._originState.set(origin, transition, callback);
        return this;
    };

    /**
     * Set the alignment of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setAlign = function setOrigin(align, transition, callback) {
        if (align === null) {
            if (this._hasAlign) {
                this._modifier.alignFrom(null);
                this._hasAlign = false;
            }
            return this;
        }
        else if (!this._hasAlign) {
            this._hasAlign = true;
            this._modifier.alignFrom(this._alignState);
        }
        this._alignState.set(align, transition, callback);
        return this;
    };

    /**
     * Set the size of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setSize
     *
     * @param {Array.Number} size two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size === null) {
            if (this._hasSize) {
                this._modifier.sizeFrom(null);
                this._hasSize = false;
            }
            return this;
        }
        else if (!this._hasSize) {
            this._hasSize = true;
            this._modifier.sizeFrom(this._sizeState);
        }
        this._sizeState.set(size, transition, callback);
        return this;
    };

    /**
     * Stop the transition.
     *
     * @method halt
     */
    StateModifier.prototype.halt = function halt() {
        this._transformState.halt();
        this._opacityState.halt();
        this._originState.halt();
        this._alignState.halt();
        this._sizeState.halt();
    };

    /**
     * Get the current state of the transform matrix component.
     *
     * @method getTransform
     * @return {Object} transform provider object
     */
    StateModifier.prototype.getTransform = function getTransform() {
        return this._transformState.get();
    };

    /**
     * Get the destination state of the transform component.
     *
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    StateModifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._transformState.getFinal();
    };

    /**
     * Get the current state of the opacity component.
     *
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    StateModifier.prototype.getOpacity = function getOpacity() {
        return this._opacityState.get();
    };

    /**
     * Get the current state of the origin component.
     *
     * @method getOrigin
     * @return {Object} origin provider object
     */
    StateModifier.prototype.getOrigin = function getOrigin() {
        return this._hasOrigin ? this._originState.get() : null;
    };

    /**
     * Get the current state of the align component.
     *
     * @method getAlign
     * @return {Object} align provider object
     */
    StateModifier.prototype.getAlign = function getAlign() {
        return this._hasAlign ? this._alignState.get() : null;
    };

    /**
     * Get the current state of the size component.
     *
     * @method getSize
     * @return {Object} size provider object
     */
    StateModifier.prototype.getSize = function getSize() {
        return this._hasSize ? this._sizeState.get() : null;
    };

    /**
     * Return render spec for this StateModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this StateModifier, including the
     *    provided target
     */
    StateModifier.prototype.modify = function modify(target) {
        return this._modifier.modify(target);
    };

    module.exports = StateModifier;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/math/Vector',['require','exports','module'],function(require, exports, module) {

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
        _setFromVector.call(v, _register);
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/math/Matrix',['require','exports','module','./Vector'],function(require, exports, module) {
    var Vector = require('./Vector');

    /**
     * A library for using a 3x3 numerical matrix, represented as a two-level array.
     *
     * @class Matrix
     * @constructor
     *
     * @param {Array.Array} values array of rows
     */
    function Matrix(values) {
        this.values = values ||
            [
                [1,0,0],
                [0,1,0],
                [0,0,1]
            ];

        return this;
    }

    var _register = new Matrix();
    var _vectorRegister = new Vector();

    /**
     * Return the values in the matrix as an array of numerical row arrays
     *
     * @method get
     *
     * @return {Array.array} matrix values as array of rows.
     */
    Matrix.prototype.get = function get() {
        return this.values;
    };

    /**
     * Set the nested array of rows in the matrix.
     *
     * @method set
     *
     * @param {Array.array} values matrix values as array of rows.
     */
    Matrix.prototype.set = function set(values) {
        this.values = values;
    };

    /**
     * Take this matrix as A, input vector V as a column vector, and return matrix product (A)(V).
     *   Note: This sets the internal vector register.  Current handles to the vector register
     *   will see values changed.
     *
     * @method vectorMultiply
     *
     * @param {Vector} v input vector V
     * @return {Vector} result of multiplication, as a handle to the internal vector register
     */
    Matrix.prototype.vectorMultiply = function vectorMultiply(v) {
        var M = this.get();
        var v0 = v.x;
        var v1 = v.y;
        var v2 = v.z;

        var M0 = M[0];
        var M1 = M[1];
        var M2 = M[2];

        var M00 = M0[0];
        var M01 = M0[1];
        var M02 = M0[2];
        var M10 = M1[0];
        var M11 = M1[1];
        var M12 = M1[2];
        var M20 = M2[0];
        var M21 = M2[1];
        var M22 = M2[2];

        return _vectorRegister.setXYZ(
            M00*v0 + M01*v1 + M02*v2,
            M10*v0 + M11*v1 + M12*v2,
            M20*v0 + M21*v1 + M22*v2
        );
    };

    /**
     * Multiply the provided matrix M2 with this matrix.  Result is (this) * (M2).
     *   Note: This sets the internal matrix register.  Current handles to the register
     *   will see values changed.
     *
     * @method multiply
     *
     * @param {Matrix} M2 input matrix to multiply on the right
     * @return {Matrix} result of multiplication, as a handle to the internal register
     */
    Matrix.prototype.multiply = function multiply(M2) {
        var M1 = this.get();
        var result = [[]];
        for (var i = 0; i < 3; i++) {
            result[i] = [];
            for (var j = 0; j < 3; j++) {
                var sum = 0;
                for (var k = 0; k < 3; k++) {
                    sum += M1[i][k] * M2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return _register.set(result);
    };

    /**
     * Creates a Matrix which is the transpose of this matrix.
     *   Note: This sets the internal matrix register.  Current handles to the register
     *   will see values changed.
     *
     * @method transpose
     *
     * @return {Matrix} result of transpose, as a handle to the internal register
     */
    Matrix.prototype.transpose = function transpose() {
        var result = [];
        var M = this.get();
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                result[row][col] = M[col][row];
            }
        }
        return _register.set(result);
    };

    /**
     * Clones the matrix
     *
     * @method clone
     * @return {Matrix} New copy of the original matrix
     */
    Matrix.prototype.clone = function clone() {
        var values = this.get();
        var M = [];
        for (var row = 0; row < 3; row++)
            M[row] = values[row].slice();
        return new Matrix(M);
    };

    module.exports = Matrix;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/math/Quaternion',['require','exports','module','./Matrix'],function(require, exports, module) {
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
            this.w = v[0];
            this.x = v[1];
            this.y = v[2];
            this.z = v[3];
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/math/Random',['require','exports','module'],function(require, exports, module) {

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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/events/EventArbiter',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * A switch which wraps several event destinations and
     *  redirects received events to at most one of them.
     *  Setting the 'mode' of the object dictates which one
     *  of these destinations will receive events.
     *
     * @class EventArbiter
     * @constructor
     *
     * @param {Number | string} startMode initial setting of switch,
     */
    function EventArbiter(startMode) {
        this.dispatchers = {};
        this.currMode = undefined;
        this.setMode(startMode);
    }

    /**
     * Set switch to this mode, passing events to the corresponding
     *   EventHandler.  If mode has changed, emits 'change' event,
     *   emits 'unpipe' event to the old mode's handler, and emits 'pipe'
     *   event to the new mode's handler.
     *
     * @method setMode
     *
     * @param {string | number} mode indicating which event handler to send to.
     */
    EventArbiter.prototype.setMode = function setMode(mode) {
        if (mode !== this.currMode) {
            var startMode = this.currMode;

            if (this.dispatchers[this.currMode]) this.dispatchers[this.currMode].trigger('unpipe');
            this.currMode = mode;
            if (this.dispatchers[mode]) this.dispatchers[mode].emit('pipe');
            this.emit('change', {from: startMode, to: mode});
        }
    };

    /**
     * Return the existing EventHandler corresponding to this
     *   mode, creating one if it doesn't exist.
     *
     * @method forMode
     *
     * @param {string | number} mode mode to which this eventHandler corresponds
     *
     * @return {EventHandler} eventHandler corresponding to this mode
     */
    EventArbiter.prototype.forMode = function forMode(mode) {
        if (!this.dispatchers[mode]) this.dispatchers[mode] = new EventHandler();
        return this.dispatchers[mode];
    };

    /**
     * Trigger an event, sending to currently selected handler, if
     *   it is listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} eventType event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    EventArbiter.prototype.emit = function emit(eventType, event) {
        if (this.currMode === undefined) return false;
        if (!event) event = {};
        var dispatcher = this.dispatchers[this.currMode];
        if (dispatcher) return dispatcher.trigger(eventType, event);
    };

    module.exports = EventArbiter;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/events/EventFilter',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * EventFilter regulates the broadcasting of events based on
     *  a specified condition function of standard event type: function(type, data).
     *
     * @class EventFilter
     * @constructor
     *
     * @param {function} condition function to determine whether or not
     *    events are emitted.
     */
    function EventFilter(condition) {
        EventHandler.call(this);
        this._condition = condition;
    }
    EventFilter.prototype = Object.create(EventHandler.prototype);
    EventFilter.prototype.constructor = EventFilter;

    /**
     * If filter condition is met, trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} data event data
     * @return {EventHandler} this
     */
    EventFilter.prototype.emit = function emit(type, data) {
        if (this._condition(type, data))
            return EventHandler.prototype.emit.apply(this, arguments);
    };

    /**
     * An alias of emit. Trigger determines whether to send
     *  events based on the return value of it's condition function
     *  when passed the event type and associated data.
     *
     * @method trigger
     * @param {string} type name of the event
     * @param {object} data associated data
     */
    EventFilter.prototype.trigger = EventFilter.prototype.emit;

    module.exports = EventFilter;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/events/EventMapper',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * EventMapper routes events to various event destinations
     *  based on custom logic.  The function signature is arbitrary.
     *
     * @class EventMapper
     * @constructor
     *
     * @param {function} mappingFunction function to determine where
     *  events are routed to.
     */
    function EventMapper(mappingFunction) {
        EventHandler.call(this);
        this._mappingFunction = mappingFunction;
    }
    EventMapper.prototype = Object.create(EventHandler.prototype);
    EventMapper.prototype.constructor = EventMapper;

    EventMapper.prototype.subscribe = null;
    EventMapper.prototype.unsubscribe = null;

    /**
     * Trigger an event, sending to all mapped downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} data event data
     * @return {EventHandler} this
     */
    EventMapper.prototype.emit = function emit(type, data) {
        var target = this._mappingFunction.apply(this, arguments);
        if (target && (target.emit instanceof Function)) target.emit(type, data);
    };

    /**
     * Alias of emit.
     * @method trigger
     */
    EventMapper.prototype.trigger = EventMapper.prototype.emit;

    module.exports = EventMapper;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
define('famous/physics/PhysicsEngine',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * The Physics Engine is responsible for mediating Bodies and their
     * interaction with forces and constraints. The Physics Engine handles the
     * logic of adding and removing bodies, updating their state of the over
     * time.
     *
     * @class PhysicsEngine
     * @constructor
     * @param options {Object} options
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
        this._prevTime       = now();
        this._isSleeping     = false;
        this._eventHandler   = null;
        this._currAgentId    = 0;
        this._hasBodies      = false;
    }

    var TIMESTEP = 17;
    var MIN_TIME_STEP = 1000 / 120;
    var MAX_TIME_STEP = 17;

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
            for (var i = 0; i < Object.keys(this._agents).length; i++) this.detachFrom(i, body);
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

        if (dtFrame < MIN_TIME_STEP) return;
        if (dtFrame > MAX_TIME_STEP) dtFrame = MAX_TIME_STEP;

        //robust integration
//        this._buffer += dtFrame;
//        while (this._buffer > this._timestep){
//            _integrate.call(this, this._timestep);
//            this._buffer -= this._timestep;
//        };
//        _integrate.call(this, this._buffer);
//        this._buffer = 0.0;
        _integrate.call(this, TIMESTEP);

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

define('famous/inputs/Accumulator',['require','exports','module','famous/core/EventHandler','famous/transitions/Transitionable'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * Accumulates differentials of event sources that emit a `delta`
     *  attribute taking a Number or Array of Number types. The accumulated
     *  value is stored in a getter/setter.
     *
     * @class Accumulator
     * @constructor
     * @param value {Number|Array|Transitionable}   Initializing value
     * @param [eventName='update'] {String}         Name of update event
     */
    function Accumulator(value, eventName) {
        if (eventName === undefined) eventName = 'update';

        this._state = (value && value.get && value.set)
            ? value
            : new Transitionable(value || 0);

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._eventInput.on(eventName, _handleUpdate.bind(this));
    }

    function _handleUpdate(data) {
        var delta = data.delta;
        var state = this.get();

        if (delta.constructor === state.constructor){
            var newState = (delta instanceof Array)
                ? [state[0] + delta[0], state[1] + delta[1]]
                : state + delta;
            this.set(newState);
        }
    }

    /**
     * Basic getter
     *
     * @method get
     * @return {Number|Array} current value
     */
    Accumulator.prototype.get = function get() {
        return this._state.get();
    };

    /**
     * Basic setter
     *
     * @method set
     * @param value {Number|Array} new value
     */
    Accumulator.prototype.set = function set(value) {
        this._state.set(value);
    };

    module.exports = Accumulator;
});

define('famous/inputs/DesktopEmulationMode',['require','exports','module'],function(require, exports, module) {
    var hasTouch = 'ontouchstart' in window;

    function kill(type) {
        window.addEventListener(type, function(event) {
            event.stopPropagation();
            return false;
        }, true);
    }

    if (hasTouch) {
        kill('mousedown');
        kill('mousemove');
        kill('mouseup');
        kill('mouseleave');
    }
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/FastClick',['require','exports','module'],function(require, exports, module) {
    /**
     * FastClick is an override shim which maps event pairs of
     *   'touchstart' and 'touchend' which differ by less than a certain
     *   threshold to the 'click' event.
     *   This is used to speed up clicks on some browsers.
     */
    if (!window.CustomEvent) return;
    var clickThreshold = 300;
    var clickWindow = 500;
    var potentialClicks = {};
    var recentlyDispatched = {};
    var _now = Date.now;

    window.addEventListener('touchstart', function(event) {
        var timestamp = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            potentialClicks[touch.identifier] = timestamp;
        }
    });

    window.addEventListener('touchmove', function(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            delete potentialClicks[touch.identifier];
        }
    });

    window.addEventListener('touchend', function(event) {
        var currTime = _now();
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            var startTime = potentialClicks[touch.identifier];
            if (startTime && currTime - startTime < clickThreshold) {
                var clickEvt = new window.CustomEvent('click', {
                    'bubbles': true,
                    'details': touch
                });
                recentlyDispatched[currTime] = event;
                event.target.dispatchEvent(clickEvt);
            }
            delete potentialClicks[touch.identifier];
        }
    });

    window.addEventListener('click', function(event) {
        var currTime = _now();
        for (var i in recentlyDispatched) {
            var previousEvent = recentlyDispatched[i];
            if (currTime - i < clickWindow) {
                if (event instanceof window.MouseEvent && event.target === previousEvent.target) event.stopPropagation();
            }
            else delete recentlyDispatched[i];
        }
    }, true);
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/TwoFingerSync',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Helper to PinchSync, RotateSync, and ScaleSync.  Generalized handling of
     *   two-finger touch events.
     *   This class is meant to be overridden and not used directly.
     *
     * @class TwoFingerSync
     * @constructor
     */
    function TwoFingerSync() {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.touchAEnabled = false;
        this.touchAId = 0;
        this.posA = null;
        this.timestampA = 0;
        this.touchBEnabled = false;
        this.touchBId = 0;
        this.posB = null;
        this.timestampB = 0;

        this._eventInput.on('touchstart', this.handleStart.bind(this));
        this._eventInput.on('touchmove', this.handleMove.bind(this));
        this._eventInput.on('touchend', this.handleEnd.bind(this));
        this._eventInput.on('touchcancel', this.handleEnd.bind(this));
    }

    TwoFingerSync.calculateAngle = function(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.atan2(diffY, diffX);
    };

    TwoFingerSync.calculateDistance = function(posA, posB) {
        var diffX = posB[0] - posA[0];
        var diffY = posB[1] - posA[1];
        return Math.sqrt(diffX * diffX + diffY * diffY);
    };

    TwoFingerSync.calculateCenter = function(posA, posB) {
        return [(posA[0] + posB[0]) / 2.0, (posA[1] + posB[1]) / 2.0];
    };

    var _now = Date.now;

    // private
    TwoFingerSync.prototype.handleStart = function handleStart(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (!this.touchAEnabled) {
                this.touchAId = touch.identifier;
                this.touchAEnabled = true;
                this.posA = [touch.pageX, touch.pageY];
                this.timestampA = _now();
            }
            else if (!this.touchBEnabled) {
                this.touchBId = touch.identifier;
                this.touchBEnabled = true;
                this.posB = [touch.pageX, touch.pageY];
                this.timestampB = _now();
                this._startUpdate(event);
            }
        }
    };

    // private
    TwoFingerSync.prototype.handleMove = function handleMove(event) {
        if (!(this.touchAEnabled && this.touchBEnabled)) return;
        var prevTimeA = this.timestampA;
        var prevTimeB = this.timestampB;
        var diffTime;
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === this.touchAId) {
                this.posA = [touch.pageX, touch.pageY];
                this.timestampA = _now();
                diffTime = this.timestampA - prevTimeA;
            }
            else if (touch.identifier === this.touchBId) {
                this.posB = [touch.pageX, touch.pageY];
                this.timestampB = _now();
                diffTime = this.timestampB - prevTimeB;
            }
        }
        if (diffTime) this._moveUpdate(diffTime);
    };

    // private
    TwoFingerSync.prototype.handleEnd = function handleEnd(event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            var touch = event.changedTouches[i];
            if (touch.identifier === this.touchAId || touch.identifier === this.touchBId) {
                if (this.touchAEnabled && this.touchBEnabled) {
                    this._eventOutput.emit('end', {
                        touches : [this.touchAId, this.touchBId],
                        angle   : this._angle
                    });
                }
                this.touchAEnabled = false;
                this.touchAId = 0;
                this.touchBEnabled = false;
                this.touchBId = 0;
            }
        }
    };

    module.exports = TwoFingerSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/PinchSync',['require','exports','module','./TwoFingerSync'],function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');

    /**
     * Handles piped in two-finger touch events to change position via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events with
     *   position, velocity, touch ids, and distance between fingers.
     *
     * @class PinchSync
     * @extends TwoFingerSync
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function PinchSync(options) {
        TwoFingerSync.call(this);

        this.options = Object.create(PinchSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._displacement = 0;
        this._previousDistance = 0;
    }

    PinchSync.prototype = Object.create(TwoFingerSync.prototype);
    PinchSync.prototype.constructor = PinchSync;

    PinchSync.DEFAULT_OPTIONS = {
        scale : 1
    };

    PinchSync.prototype._startUpdate = function _startUpdate(event) {
        this._previousDistance = TwoFingerSync.calculateDistance(this.posA, this.posB);
        this._displacement = 0;

        this._eventOutput.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._dist,
            center: TwoFingerSync.calculateCenter(this.posA, this.posB)
        });
    };

    PinchSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var currDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
        var center = TwoFingerSync.calculateCenter(this.posA, this.posB);

        var scale = this.options.scale;
        var delta = scale * (currDist - this._previousDistance);
        var velocity = delta / diffTime;

        this._previousDistance = currDist;
        this._displacement += delta;

        this._eventOutput.emit('update', {
            delta : delta,
            velocity: velocity,
            distance: currDist,
            displacement: this._displacement,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    PinchSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.scale] scale velocity by this factor
     */
    PinchSync.prototype.setOptions = function setOptions(options) {
        if (options.scale !== undefined) this.options.scale = options.scale;
    };

    module.exports = PinchSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/RotateSync',['require','exports','module','./TwoFingerSync'],function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');

    /**
     * Handles piped in two-finger touch events to increase or decrease scale via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, and angle.
     *   Useful for determining a rotation factor from initial two-finger touch.
     *
     * @class RotateSync
     * @extends TwoFingerSync
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function RotateSync(options) {
        TwoFingerSync.call(this);

        this.options = Object.create(RotateSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._angle = 0;
        this._previousAngle = 0;
    }

    RotateSync.prototype = Object.create(TwoFingerSync.prototype);
    RotateSync.prototype.constructor = RotateSync;

    RotateSync.DEFAULT_OPTIONS = {
        scale : 1
    };

    RotateSync.prototype._startUpdate = function _startUpdate(event) {
        this._angle = 0;
        this._previousAngle = TwoFingerSync.calculateAngle(this.posA, this.posB);
        var center = TwoFingerSync.calculateCenter(this.posA, this.posB);
        this._eventOutput.emit('start', {
            count: event.touches.length,
            angle: this._angle,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });
    };

    RotateSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var scale = this.options.scale;

        var currAngle = TwoFingerSync.calculateAngle(this.posA, this.posB);
        var center = TwoFingerSync.calculateCenter(this.posA, this.posB);

        var diffTheta = scale * (currAngle - this._previousAngle);
        var velTheta = diffTheta / diffTime;

        this._angle += diffTheta;

        this._eventOutput.emit('update', {
            delta : diffTheta,
            velocity: velTheta,
            angle: this._angle,
            center: center,
            touches: [this.touchAId, this.touchBId]
        });

        this._previousAngle = currAngle;
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    RotateSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.scale] scale velocity by this factor
     */
    RotateSync.prototype.setOptions = function setOptions(options) {
        if (options.scale !== undefined) this.options.scale = options.scale;
    };

    module.exports = RotateSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/ScaleSync',['require','exports','module','./TwoFingerSync'],function(require, exports, module) {
    var TwoFingerSync = require('./TwoFingerSync');

    /**
     * Handles piped in two-finger touch events to increase or decrease scale via pinching / expanding.
     *   Emits 'start', 'update' and 'end' events an object with position, velocity, touch ids, distance, and scale factor.
     *   Useful for determining a scaling factor from initial two-finger touch.
     *
     * @class ScaleSync
     * @extends TwoFingerSync
     * @constructor
     * @param {Object} options default options overrides
     * @param {Number} [options.scale] scale velocity by this factor
     */
    function ScaleSync(options) {
        TwoFingerSync.call(this);

        this.options = Object.create(ScaleSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._scaleFactor = 1;
        this._startDist = 0;
        this._eventInput.on('pipe', _reset.bind(this));
    }

    ScaleSync.prototype = Object.create(TwoFingerSync.prototype);
    ScaleSync.prototype.constructor = ScaleSync;

    ScaleSync.DEFAULT_OPTIONS = {
        scale : 1
    };

    function _reset() {
        this.touchAId = undefined;
        this.touchBId = undefined;
    }

    // handles initial touch of two fingers
    ScaleSync.prototype._startUpdate = function _startUpdate(event) {
        this._scaleFactor = 1;
        this._startDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
        this._eventOutput.emit('start', {
            count: event.touches.length,
            touches: [this.touchAId, this.touchBId],
            distance: this._startDist,
            center: TwoFingerSync.calculateCenter(this.posA, this.posB)
        });
    };

    // handles movement of two fingers
    ScaleSync.prototype._moveUpdate = function _moveUpdate(diffTime) {
        var scale = this.options.scale;

        var currDist = TwoFingerSync.calculateDistance(this.posA, this.posB);
        var center = TwoFingerSync.calculateCenter(this.posA, this.posB);

        var delta = (currDist - this._startDist) / this._startDist;
        var newScaleFactor = Math.max(1 + scale * delta, 0);
        var veloScale = (newScaleFactor - this._scaleFactor) / diffTime;

        this._eventOutput.emit('update', {
            delta : delta,
            scale: newScaleFactor,
            velocity: veloScale,
            distance: currDist,
            center : center,
            touches: [this.touchAId, this.touchBId]
        });

        this._scaleFactor = newScaleFactor;
    };

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    ScaleSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.scale] scale velocity by this factor
     */
    ScaleSync.prototype.setOptions = function setOptions(options) {
        if (options.scale !== undefined) this.options.scale = options.scale;
    };

    module.exports = ScaleSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/inputs/ScrollSync',['require','exports','module','famous/core/EventHandler','famous/core/Engine'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Engine = require('famous/core/Engine');

    /**
     * Handles piped in mousewheel events.
     *   Emits 'start', 'update', and 'end' events with payloads including:
     *   delta: change since last position,
     *   position: accumulated deltas,
     *   velocity: speed of change in pixels per ms,
     *   slip: true (unused).
     *
     *   Can be used as delegate of GenericSync.
     *
     * @class ScrollSync
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.direction] Pay attention to x changes (ScrollSync.DIRECTION_X),
     *   y changes (ScrollSync.DIRECTION_Y) or both (undefined)
     * @param {Number} [options.minimumEndSpeed] End speed calculation floors at this number, in pixels per ms
     * @param {boolean} [options.rails] whether to snap position calculations to nearest axis
     * @param {Number | Array.Number} [options.scale] scale outputs in by scalar or pair of scalars
     * @param {Number} [options.stallTime] reset time for velocity calculation in ms
     */
    function ScrollSync(options) {
        this.options = Object.create(ScrollSync.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this._payload = {
            delta    : null,
            position : null,
            velocity : null,
            slip     : true
        };

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._position = (this.options.direction === undefined) ? [0,0] : 0;
        this._prevTime = undefined;
        this._prevVel = undefined;
        this._eventInput.on('mousewheel', _handleMove.bind(this));
        this._eventInput.on('wheel', _handleMove.bind(this));
        this._inProgress = false;
        this._loopBound = false;
    }

    ScrollSync.DEFAULT_OPTIONS = {
        direction: undefined,
        minimumEndSpeed: Infinity,
        rails: false,
        scale: 1,
        stallTime: 50,
        lineHeight: 40
    };

    ScrollSync.DIRECTION_X = 0;
    ScrollSync.DIRECTION_Y = 1;

    var MINIMUM_TICK_TIME = 8;

    var _now = Date.now;

    function _newFrame() {
        if (this._inProgress && (_now() - this._prevTime) > this.options.stallTime) {
            this._position = (this.options.direction === undefined) ? [0,0] : 0;
            this._inProgress = false;

            var finalVel = (Math.abs(this._prevVel) >= this.options.minimumEndSpeed)
                ? this._prevVel
                : 0;

            var payload = this._payload;
            payload.position = this._position;
            payload.velocity = finalVel;
            payload.slip = true;

            this._eventOutput.emit('end', payload);
        }
    }

    function _handleMove(event) {
        event.preventDefault();

        if (!this._inProgress) {
            this._inProgress = true;

            payload = this._payload;
            payload.slip = true;
            payload.position = this._position;
            payload.clientX = event.clientX;
            payload.clientY = event.clientY;
            payload.offsetX = event.offsetX;
            payload.offsetY = event.offsetY;
            this._eventOutput.emit('start', payload);
            if (!this._loopBound) {
                Engine.on('prerender', _newFrame.bind(this));
                this._loopBound = true;
            }
        }

        var currTime = _now();
        var prevTime = this._prevTime || currTime;

        var diffX = (event.wheelDeltaX !== undefined) ? event.wheelDeltaX : -event.deltaX;
        var diffY = (event.wheelDeltaY !== undefined) ? event.wheelDeltaY : -event.deltaY;

        if (event.deltaMode === 1) { // units in lines, not pixels
            diffX *= this.options.lineHeight;
            diffY *= this.options.lineHeight;
        }

        if (this.options.rails) {
            if (Math.abs(diffX) > Math.abs(diffY)) diffY = 0;
            else diffX = 0;
        }

        var diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

        var velX = diffX / diffTime;
        var velY = diffY / diffTime;

        var scale = this.options.scale;
        var nextVel;
        var nextDelta;

        if (this.options.direction === ScrollSync.DIRECTION_X) {
            nextDelta = scale * diffX;
            nextVel = scale * velX;
            this._position += nextDelta;
        }
        else if (this.options.direction === ScrollSync.DIRECTION_Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this._position += nextDelta;
        }
        else {
            nextDelta = [scale * diffX, scale * diffY];
            nextVel = [scale * velX, scale * velY];
            this._position[0] += nextDelta[0];
            this._position[1] += nextDelta[1];
        }

        var payload = this._payload;
        payload.delta    = nextDelta;
        payload.velocity = nextVel;
        payload.position = this._position;
        payload.slip     = true;

        this._eventOutput.emit('update', payload);

        this._prevTime = currTime;
        this._prevVel = nextVel;
    }

    /**
     * Return entire options dictionary, including defaults.
     *
     * @method getOptions
     * @return {Object} configuration options
     */
    ScrollSync.prototype.getOptions = function getOptions() {
        return this.options;
    };

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Number} [options.minimimEndSpeed] If final velocity smaller than this, round down to 0.
     * @param {Number} [options.stallTime] ms of non-motion before 'end' emitted
     * @param {Number} [options.rails] whether to constrain to nearest axis.
     * @param {Number} [options.direction] ScrollSync.DIRECTION_X, DIRECTION_Y -
     *    pay attention to one specific direction.
     * @param {Number} [options.scale] constant factor to scale velocity output
     */
    ScrollSync.prototype.setOptions = function setOptions(options) {
        if (options.direction !== undefined) this.options.direction = options.direction;
        if (options.minimumEndSpeed !== undefined) this.options.minimumEndSpeed = options.minimumEndSpeed;
        if (options.rails !== undefined) this.options.rails = options.rails;
        if (options.scale !== undefined) this.options.scale = options.scale;
        if (options.stallTime !== undefined) this.options.stallTime = options.stallTime;
    };

    module.exports = ScrollSync;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/CachedMap',['require','exports','module'],function(require, exports, module) {
    /**
     * A simple in-memory object cache.  Used as a helper for Views with
     * provider functions.
     * @class CachedMap
     * @constructor
     */
    function CachedMap(mappingFunction) {
        this._map = mappingFunction || null;
        this._cachedOutput = null;
        this._cachedInput = Number.NaN; //never valid as input
    }

    /**
     * Creates a mapping function with a cache.
     * This is the main entrypoint for this object.
     * @static
     * @method create
     * @param {function} mappingFunction mapping
     * @return {function} memoized mapping function
     */
    CachedMap.create = function create(mappingFunction) {
        var instance = new CachedMap(mappingFunction);
        return instance.get.bind(instance);
    };

    /**
     * Retrieve items from cache or from mapping functin.
     *
     * @method get
     * @param {Object} input input key
     */
    CachedMap.prototype.get = function get(input) {
        if (input !== this._cachedInput) {
            this._cachedInput = input;
            this._cachedOutput = this._map(input);
        }
        return this._cachedOutput;
    };

    module.exports = CachedMap;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/Easing',['require','exports','module'],function(require, exports, module) {

    /*
     * A library of curves which map an animation explicitly as a function of time.
     *
     * @class Easing
     */
    var Easing = {

        /**
         * @property inQuad
         * @static
         */
        inQuad: function(t) {
            return t*t;
        },

        /**
         * @property outQuad
         * @static
         */
        outQuad: function(t) {
            return -(t-=1)*t+1;
        },

        /**
         * @property inOutQuad
         * @static
         */
        inOutQuad: function(t) {
            if ((t/=.5) < 1) return .5*t*t;
            return -.5*((--t)*(t-2) - 1);
        },

        /**
         * @property inCubic
         * @static
         */
        inCubic: function(t) {
            return t*t*t;
        },

        /**
         * @property outCubic
         * @static
         */
        outCubic: function(t) {
            return ((--t)*t*t + 1);
        },

        /**
         * @property inOutCubic
         * @static
         */
        inOutCubic: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t;
            return .5*((t-=2)*t*t + 2);
        },

        /**
         * @property inQuart
         * @static
         */
        inQuart: function(t) {
            return t*t*t*t;
        },

        /**
         * @property outQuart
         * @static
         */
        outQuart: function(t) {
            return -((--t)*t*t*t - 1);
        },

        /**
         * @property inOutQuart
         * @static
         */
        inOutQuart: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t*t;
            return -.5 * ((t-=2)*t*t*t - 2);
        },

        /**
         * @property inQuint
         * @static
         */
        inQuint: function(t) {
            return t*t*t*t*t;
        },

        /**
         * @property outQuint
         * @static
         */
        outQuint: function(t) {
            return ((--t)*t*t*t*t + 1);
        },

        /**
         * @property inOutQuint
         * @static
         */
        inOutQuint: function(t) {
            if ((t/=.5) < 1) return .5*t*t*t*t*t;
            return .5*((t-=2)*t*t*t*t + 2);
        },

        /**
         * @property inSine
         * @static
         */
        inSine: function(t) {
            return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
        },

        /**
         * @property outSine
         * @static
         */
        outSine: function(t) {
            return Math.sin(t * (Math.PI/2));
        },

        /**
         * @property inOutSine
         * @static
         */
        inOutSine: function(t) {
            return -.5*(Math.cos(Math.PI*t) - 1);
        },

        /**
         * @property inExpo
         * @static
         */
        inExpo: function(t) {
            return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
        },

        /**
         * @property outExpo
         * @static
         */
        outExpo: function(t) {
            return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
        },

        /**
         * @property inOutExpo
         * @static
         */
        inOutExpo: function(t) {
            if (t===0) return 0.0;
            if (t===1.0) return 1.0;
            if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
            return .5 * (-Math.pow(2, -10 * --t) + 2);
        },

        /**
         * @property inCirc
         * @static
         */
        inCirc: function(t) {
            return -(Math.sqrt(1 - t*t) - 1);
        },

        /**
         * @property outCirc
         * @static
         */
        outCirc: function(t) {
            return Math.sqrt(1 - (--t)*t);
        },

        /**
         * @property inOutCirc
         * @static
         */
        inOutCirc: function(t) {
            if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
            return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
        },

        /**
         * @property inElastic
         * @static
         */
        inElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
        },

        /**
         * @property outElastic
         * @static
         */
        outElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
        },

        /**
         * @property inOutElastic
         * @static
         */
        inOutElastic: function(t) {
            var s=1.70158;var p=0;var a=1.0;
            if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
            s = p/(2*Math.PI) * Math.asin(1.0/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
            return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
        },

        /**
         * @property inBack
         * @static
         */
        inBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            return t*t*((s+1)*t - s);
        },

        /**
         * @property outBack
         * @static
         */
        outBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            return ((--t)*t*((s+1)*t + s) + 1);
        },

        /**
         * @property inOutBack
         * @static
         */
        inOutBack: function(t, s) {
            if (s === undefined) s = 1.70158;
            if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
            return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
        },

        /**
         * @property inBounce
         * @static
         */
        inBounce: function(t) {
            return 1.0 - Easing.outBounce(1.0-t);
        },

        /**
         * @property outBounce
         * @static
         */
        outBounce: function(t) {
            if (t < (1/2.75)) {
                return (7.5625*t*t);
            } else if (t < (2/2.75)) {
                return (7.5625*(t-=(1.5/2.75))*t + .75);
            } else if (t < (2.5/2.75)) {
                return (7.5625*(t-=(2.25/2.75))*t + .9375);
            } else {
                return (7.5625*(t-=(2.625/2.75))*t + .984375);
            }
        },

        /**
         * @property inOutBounce
         * @static
         */
        inOutBounce: function(t) {
            if (t < .5) return Easing.inBounce(t*2) * .5;
            return Easing.outBounce(t*2-1.0) * .5 + .5;
        }
    };

    module.exports = Easing;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/integrators/SymplecticEuler',['require','exports','module','famous/core/OptionsManager'],function(require, exports, module) {
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * Ordinary Differential Equation (ODE) Integrator.
     * Manages updating a physics body's state over time.
     *
     *  p = position, v = velocity, m = mass, f = force, dt = change in time
     *
     *      v <- v + dt * f / m
     *      p <- p + dt * v
     *
     *  q = orientation, w = angular velocity, L = angular momentum
     *
     *      L <- L + dt * t
     *      q <- q + dt/2 * q * w
     *
     * @class SymplecticEuler
     * @constructor
     * @param {Object} options Options to set
     */
    function SymplecticEuler(options) {
        this.options = Object.create(SymplecticEuler.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    /**
     * @property SymplecticEuler.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    SymplecticEuler.DEFAULT_OPTIONS = {

        /**
         * The maximum velocity of a physics body
         *      Range : [0, Infinity]
         * @attribute velocityCap
         * @type Number
         */

        velocityCap : undefined,

        /**
         * The maximum angular velocity of a physics body
         *      Range : [0, Infinity]
         * @attribute angularVelocityCap
         * @type Number
         */
        angularVelocityCap : undefined
    };

    /*
     * Setter for options
     *
     * @method setOptions
     * @param {Object} options
     */
    SymplecticEuler.prototype.setOptions = function setOptions(options) {
        this._optionsManager.patch(options);
    };

    /*
     * Getter for options
     *
     * @method getOptions
     * @return {Object} options
     */
    SymplecticEuler.prototype.getOptions = function getOptions() {
        return this._optionsManager.value();
    };

    /*
     * Updates the velocity of a physics body from its accumulated force.
     *      v <- v + dt * f / m
     *
     * @method integrateVelocity
     * @param {Body} physics body
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integrateVelocity = function integrateVelocity(body, dt) {
        var v = body.velocity;
        var w = body.inverseMass;
        var f = body.force;

        if (f.isZero()) return;

        v.add(f.mult(dt * w)).put(v);
        f.clear();
    };

    /*
     * Updates the position of a physics body from its velocity.
     *      p <- p + dt * v
     *
     * @method integratePosition
     * @param {Body} physics body
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integratePosition = function integratePosition(body, dt) {
        var p = body.position;
        var v = body.velocity;

        if (this.options.velocityCap) v.cap(this.options.velocityCap).put(v);
        p.add(v.mult(dt)).put(p);
    };

    /*
     * Updates the angular momentum of a physics body from its accumuled torque.
     *      L <- L + dt * t
     *
     * @method integrateAngularMomentum
     * @param {Body} physics body (except a particle)
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integrateAngularMomentum = function integrateAngularMomentum(body, dt) {
        var L = body.angularMomentum;
        var t = body.torque;

        if (t.isZero()) return;

        if (this.options.angularVelocityCap) t.cap(this.options.angularVelocityCap).put(t);
        L.add(t.mult(dt)).put(L);
        t.clear();
    };

    /*
     * Updates the orientation of a physics body from its angular velocity.
     *      q <- q + dt/2 * q * w
     *
     * @method integrateOrientation
     * @param {Body} physics body (except a particle)
     * @param {Number} dt delta time
     */
    SymplecticEuler.prototype.integrateOrientation = function integrateOrientation(body, dt) {
        var q = body.orientation;
        var w = body.angularVelocity;

        if (w.isZero()) return;
        q.add(q.multiply(w).scalarMultiply(0.5 * dt)).put(q);
//        q.normalize.put(q);
    };

    module.exports = SymplecticEuler;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/bodies/Particle',['require','exports','module','famous/math/Vector','famous/core/Transform','famous/core/EventHandler','../integrators/SymplecticEuler'],function(require, exports, module) {
    var Vector = require('famous/math/Vector');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var Integrator = require('../integrators/SymplecticEuler');

    /**
     * A point body that is controlled by the Physics Engine. A particle has
     *   position and velocity states that are updated by the Physics Engine.
     *   Ultimately, a particle is a _special type of modifier, and can be added to
     *   the Famous render tree like any other modifier.
     *
     * @constructor
     * @class Particle
     * @uses EventHandler
     * @uses Modifier
     * @extensionfor Body
     * @param {Options} [options] An object of configurable options.
     * @param {Array} [options.position] The position of the particle.
     * @param {Array} [options.velocity] The velocity of the particle.
     * @param {Number} [options.mass] The mass of the particle.
     * @param {Hexadecimal} [options.axis] The axis a particle can move along. Can be bitwise ORed e.g., Particle.AXES.X, Particle.AXES.X | Particle.AXES.Y
     *
     */
     function Particle(options) {
        options = options || {};

        // registers
        this.position = new Vector();
        this.velocity = new Vector();
        this.force    = new Vector();

        var defaults  = Particle.DEFAULT_OPTIONS;

        // set vectors
        this.setPosition(options.position || defaults.position);
        this.setVelocity(options.velocity || defaults.velocity);
        this.force.set(options.force || [0,0,0]);

        // set scalars
        this.mass = (options.mass !== undefined)
            ? options.mass
            : defaults.mass;

        this.axis = (options.axis !== undefined)
            ? options.axis
            : defaults.axis;

        this.inverseMass = 1 / this.mass;

        // state variables
        this._isSleeping     = false;
        this._engine         = null;
        this._eventOutput    = null;
        this._positionGetter = null;

        this.transform = Transform.identity.slice();

        // cached _spec
        this._spec = {
            transform : this.transform,
            target    : null
        };
    }

    Particle.DEFAULT_OPTIONS = {
        position : [0,0,0],
        velocity : [0,0,0],
        mass : 1,
        axis : undefined
    };

    /**
     * Kinetic energy threshold needed to update the body
     *
     * @property SLEEP_TOLERANCE
     * @type Number
     * @static
     * @default 1e-7
     */
    Particle.SLEEP_TOLERANCE = 1e-7;

    /**
     * Axes by which a body can translate
     *
     * @property AXES
     * @type Hexadecimal
     * @static
     * @default 1e-7
     */
    Particle.AXES = {
        X : 0x00, // hexadecimal for 0
        Y : 0x01, // hexadecimal for 1
        Z : 0x02  // hexadecimal for 2
    };

    // Integrator for updating the particle's state
    // TODO: make this a singleton
    Particle.INTEGRATOR = new Integrator();

    //Catalogue of outputted events
    var _events = {
        start  : 'start',
        update : 'update',
        end    : 'end'
    };

    // Cached timing function
    var now = (function() {
        return Date.now;
    })();

    /**
     * Stops the particle from updating
     * @method sleep
     */
    Particle.prototype.sleep = function sleep() {
        if (this._isSleeping) return;
        this.emit(_events.end, this);
        this._isSleeping = true;
    };

    /**
     * Starts the particle update
     * @method wake
     */
    Particle.prototype.wake = function wake() {
        if (!this._isSleeping) return;
        this.emit(_events.start, this);
        this._isSleeping = false;
        this._prevTime = now();
    };

    /**
     * @attribute isBody
     * @type Boolean
     * @static
     */
    Particle.prototype.isBody = false;

    /**
     * Basic setter for position
     * @method getPosition
     * @param position {Array|Vector}
     */
    Particle.prototype.setPosition = function setPosition(position) {
        this.position.set(position);
    };

    /**
     * 1-dimensional setter for position
     * @method setPosition1D
     * @param value {Number}
     */
    Particle.prototype.setPosition1D = function setPosition1D(x) {
        this.position.x = x;
    };

    /**
     * Basic getter function for position
     * @method getPosition
     * @return position {Array}
     */
    Particle.prototype.getPosition = function getPosition() {
        if (this._positionGetter instanceof Function)
            this.setPosition(this._positionGetter());

        this._engine.step();

        return this.position.get();
    };

    /**
     * 1-dimensional getter for position
     * @method getPosition1D
     * @return value {Number}
     */
    Particle.prototype.getPosition1D = function getPosition1D() {
        this._engine.step();
        return this.position.x;
    };

    /**
     * Defines the position from outside the Physics Engine
     * @method positionFrom
     * @param positionGetter {Function}
     */
    Particle.prototype.positionFrom = function positionFrom(positionGetter) {
        this._positionGetter = positionGetter;
    };

    /**
     * Basic setter function for velocity Vector
     * @method setVelocity
     * @function
     */
    Particle.prototype.setVelocity = function setVelocity(velocity) {
        this.velocity.set(velocity);
        this.wake();
    };

    /**
     * 1-dimensional setter for velocity
     * @method setVelocity1D
     * @param velocity {Number}
     */
    Particle.prototype.setVelocity1D = function setVelocity1D(x) {
        this.velocity.x = x;
        this.wake();
    };

    /**
     * Basic getter function for velocity Vector
     * @method getVelocity
     * @return velocity {Array}
     */
    Particle.prototype.getVelocity = function getVelocity() {
        return this.velocity.get();
    };

    /**
     * 1-dimensional getter for velocity
     * @method getVelocity1D
     * @return velocity {Number}
     */
    Particle.prototype.getVelocity1D = function getVelocity1D() {
        return this.velocity.x;
    };

    /**
     * Basic setter function for mass quantity
     * @method setMass
     * @param mass {Number} mass
     */
    Particle.prototype.setMass = function setMass(mass) {
        this.mass = mass;
        this.inverseMass = 1 / mass;
    };

    /**
     * Basic getter function for mass quantity
     * @method getMass
     * @return mass {Number}
     */
    Particle.prototype.getMass = function getMass() {
        return this.mass;
    };

    /**
     * Reset position and velocity
     * @method reset
     * @param position {Array|Vector}
     * @param velocity {Array|Vector}
     */
    Particle.prototype.reset = function reset(position, velocity) {
        this.setPosition(position || [0,0,0]);
        this.setVelocity(velocity || [0,0,0]);
    };

    /**
     * Add force vector to existing internal force Vector
     * @method applyForce
     * @param force {Vector}
     */
    Particle.prototype.applyForce = function applyForce(force) {
        if (force.isZero()) return;
        this.force.add(force).put(this.force);
        this.wake();
    };

    /**
     * Add impulse (change in velocity) Vector to this Vector's velocity.
     * @method applyImpulse
     * @param impulse {Vector}
     */
    Particle.prototype.applyImpulse = function applyImpulse(impulse) {
        if (impulse.isZero()) return;
        var velocity = this.velocity;
        velocity.add(impulse.mult(this.inverseMass)).put(velocity);
    };

    /**
     * Update a particle's velocity from its force accumulator
     * @method integrateVelocity
     * @param dt {Number} Time differential
     */
    Particle.prototype.integrateVelocity = function integrateVelocity(dt) {
        Particle.INTEGRATOR.integrateVelocity(this, dt);
    };

    /**
     * Update a particle's position from its velocity
     * @method integratePosition
     * @param dt {Number} Time differential
     */
    Particle.prototype.integratePosition = function integratePosition(dt) {
        Particle.INTEGRATOR.integratePosition(this, dt);
    };

    /**
     * Update the position and velocity of the particle
     * @method _integrate
     * @protected
     * @param dt {Number} Time differential
     */
    Particle.prototype._integrate = function _integrate(dt) {
        this.integrateVelocity(dt);
        this.integratePosition(dt);
    };

    /**
     * Get kinetic energy of the particle.
     * @method getEnergy
     * @function
     */
    Particle.prototype.getEnergy = function getEnergy() {
        return 0.5 * this.mass * this.velocity.normSquared();
    };

    /**
     * Generate transform from the current position state
     * @method getTransform
     * @return Transform {Transform}
     */
    Particle.prototype.getTransform = function getTransform() {
        this._engine.step();

        var position = this.position;
        var axis = this.axis;
        var transform = this.transform;

        if (axis !== undefined) {
            if (axis & ~Particle.AXES.X) {
                position.x = 0;
            }
            if (axis & ~Particle.AXES.Y) {
                position.y = 0;
            }
            if (axis & ~Particle.AXES.Z) {
                position.z = 0;
            }
        }

        transform[12] = position.x;
        transform[13] = position.y;
        transform[14] = position.z;

        return transform;
    };

    /**
     * The modify interface of a Modifier
     * @method modify
     * @param target {Spec}
     * @return Spec {Spec}
     */
    Particle.prototype.modify = function modify(target) {
        var _spec = this._spec;
        _spec.transform = this.getTransform();
        _spec.target = target;
        return _spec;
    };

    // private
    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        //overrides on/removeListener/pipe/unpipe methods
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Particle.prototype.emit = function emit(type, data) {
        if (!this._eventOutput) return;
        this._eventOutput.emit(type, data);
    };

    Particle.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };
    Particle.prototype.removeListener = function removeListener() {
        _createEventOutput.call(this);
        return this.removeListener.apply(this, arguments);
    };
    Particle.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };
    Particle.prototype.unpipe = function unpipe() {
        _createEventOutput.call(this);
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Particle;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Constraint',['require','exports','module','famous/core/EventHandler'],function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');

    /**
     *  Allows for two circular bodies to collide and bounce off each other.
     *
     *  @class Constraint
     *  @constructor
     *  @uses EventHandler
     *  @param options {Object}
     */
    function Constraint() {
        this.options = this.options || {};
        this._energy = 0.0;
        this._eventOutput = null;
    }

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Constraint.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds an impulse to a physics body's velocity due to the constraint
     *
     * @method applyConstraint
     */
    Constraint.prototype.applyConstraint = function applyConstraint() {};

    /**
     * Getter for energy
     *
     * @method getEnergy
     * @return energy {Number}
     */
    Constraint.prototype.getEnergy = function getEnergy() {
        return this._energy;
    };

    /**
     * Setter for energy
     *
     * @method setEnergy
     * @param energy {Number}
     */
    Constraint.prototype.setEnergy = function setEnergy(energy) {
        this._energy = energy;
    };

    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Constraint.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };
    Constraint.prototype.addListener = function addListener() {
        _createEventOutput.call(this);
        return this.addListener.apply(this, arguments);
    };
    Constraint.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };
    Constraint.prototype.removeListener = function removeListener() {
        return this.removeListener.apply(this, arguments);
    };
    Constraint.prototype.unpipe = function unpipe() {
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Constraint;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Snap',['require','exports','module','./Constraint','famous/math/Vector'],function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('famous/math/Vector');

    /**
     *  A spring constraint is like a spring force, except that it is always
     *    numerically stable (even for low periods), at the expense of introducing
     *    damping (even with dampingRatio set to 0).
     *
     *    Use this if you need fast spring-like behavior, e.g., snapping
     *
     *  @class Snap
     *  @constructor
     *  @extends Constraint
     *  @param {Options} [options] An object of configurable options.
     *  @param {Number} [options.period] The amount of time in milliseconds taken for one complete oscillation when there is no damping. Range : [150, Infinity]
     *  @param {Number} [options.dampingRatio] Additional damping of the spring. Range : [0, 1]. At 0 this spring will still be damped, at 1 the spring will be critically damped (the spring will never oscillate)
     *  @param {Number} [options.length] The rest length of the spring. Range: [0, Infinity].
     *  @param {Array} [options.anchor] The location of the spring's anchor, if not another physics body.
     *
     */
    function Snap(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.pDiff  = new Vector();
        this.vDiff  = new Vector();
        this.impulse1 = new Vector();
        this.impulse2 = new Vector();

        Constraint.call(this);
    }

    Snap.prototype = Object.create(Constraint.prototype);
    Snap.prototype.constructor = Snap;

    Snap.DEFAULT_OPTIONS = {
        period        : 300,
        dampingRatio : 0.1,
        length : 0,
        anchor : undefined
    };

    /** const */ var pi = Math.PI;

    function _calcEnergy(impulse, disp, dt) {
        return Math.abs(impulse.dot(disp)/dt);
    }

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects} options
     */
    Snap.prototype.setOptions = function setOptions(options) {
        if (options.anchor !== undefined) {
            if (options.anchor   instanceof Vector) this.options.anchor = options.anchor;
            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
            if (options.anchor   instanceof Array)  this.options.anchor = new Vector(options.anchor);
        }
        if (options.length !== undefined) this.options.length = options.length;
        if (options.dampingRatio !== undefined) this.options.dampingRatio = options.dampingRatio;
        if (options.period !== undefined) this.options.period = options.period;
    };

    /**
     * Set the anchor position
     *
     * @method setOptions
     * @param {Array} v TODO
     */

    Snap.prototype.setAnchor = function setAnchor(v) {
        if (this.options.anchor !== undefined) this.options.anchor = new Vector();
        this.options.anchor.set(v);
    };

    /**
     * Calculates energy of spring
     *
     * @method getEnergy
     * @param {Object} target TODO
     * @param {Object} source TODO
     * @return energy {Number}
     */
    Snap.prototype.getEnergy = function getEnergy(target, source) {
        var options     = this.options;
        var restLength  = options.length;
        var anchor      = options.anchor || source.position;
        var strength    = Math.pow(2 * pi / options.period, 2);

        var dist = anchor.sub(target.position).norm() - restLength;

        return 0.5 * strength * dist * dist;
    };

    /**
     * Adds a spring impulse to a physics body's velocity due to the constraint
     *
     * @method applyConstraint
     * @param targets {Array.Body}  Array of bodies to apply the constraint to
     * @param source {Body}         The source of the constraint
     * @param dt {Number}           Delta time
     */
    Snap.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var options         = this.options;
        var pDiff        = this.pDiff;
        var vDiff        = this.vDiff;
        var impulse1     = this.impulse1;
        var impulse2     = this.impulse2;
        var length       = options.length;
        var anchor       = options.anchor || source.position;
        var period       = options.period;
        var dampingRatio = options.dampingRatio;

        for (var i = 0; i < targets.length ; i++) {
            var target = targets[i];

            var p1 = target.position;
            var v1 = target.velocity;
            var m1 = target.mass;
            var w1 = target.inverseMass;

            pDiff.set(p1.sub(anchor));
            var dist = pDiff.norm() - length;
            var effMass;

            if (source) {
                var w2 = source.inverseMass;
                var v2 = source.velocity;
                vDiff.set(v1.sub(v2));
                effMass = 1/(w1 + w2);
            }
            else {
                vDiff.set(v1);
                effMass = m1;
            }

            var gamma;
            var beta;

            if (this.options.period === 0) {
                gamma = 0;
                beta = 1;
            }
            else {
                var k = 4 * effMass * pi * pi / (period * period);
                var c = 4 * effMass * pi * dampingRatio / period;

                beta  = dt * k / (c + dt * k);
                gamma = 1 / (c + dt*k);
            }

            var antiDrift = beta/dt * dist;
            pDiff.normalize(-antiDrift)
                .sub(vDiff)
                .mult(dt / (gamma + dt/effMass))
                .put(impulse1);

            // var n = new Vector();
            // n.set(pDiff.normalize());
            // var lambda = -(n.dot(vDiff) + antiDrift) / (gamma + dt/effMass);
            // impulse2.set(n.mult(dt*lambda));

            target.applyImpulse(impulse1);

            if (source) {
                impulse1.mult(-1).put(impulse2);
                source.applyImpulse(impulse2);
            }

            this.setEnergy(_calcEnergy(impulse1, pDiff, dt));
        }
    };

    module.exports = Snap;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/SnapTransition',['require','exports','module','famous/physics/PhysicsEngine','famous/physics/bodies/Particle','famous/physics/constraints/Snap','famous/math/Vector'],function(require, exports, module) {
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/Force',['require','exports','module','famous/math/Vector','famous/core/EventHandler'],function(require, exports, module) {
    var Vector = require('famous/math/Vector');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Force base class.
     *
     * @class Force
     * @uses EventHandler
     * @constructor
     */
    function Force(force) {
        this.force = new Vector(force);
        this._energy = 0.0;
        this._eventOutput = null;
    }

    /**
     * Basic setter for options
     *
     * @method setOptions
     * @param options {Objects}
     */
    Force.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds a force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param body {Body}
     */
    Force.prototype.applyForce = function applyForce(body) {
        body.applyForce(this.force);
    };

    /**
     * Getter for a force's potential energy.
     *
     * @method getEnergy
     * @return energy {Number}
     */
    Force.prototype.getEnergy = function getEnergy() {
        return this._energy;
    };

    /*
     * Setter for a force's potential energy.
     *
     * @method setEnergy
     * @param energy {Number}
     */
    Force.prototype.setEnergy = function setEnergy(energy) {
        this._energy = energy;
    };

    function _createEventOutput() {
        this._eventOutput = new EventHandler();
        this._eventOutput.bindThis(this);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Force.prototype.on = function on() {
        _createEventOutput.call(this);
        return this.on.apply(this, arguments);
    };
    Force.prototype.addListener = function addListener() {
        _createEventOutput.call(this);
        return this.addListener.apply(this, arguments);
    };
    Force.prototype.pipe = function pipe() {
        _createEventOutput.call(this);
        return this.pipe.apply(this, arguments);
    };
    Force.prototype.removeListener = function removeListener() {
        return this.removeListener.apply(this, arguments);
    };
    Force.prototype.unpipe = function unpipe() {
        return this.unpipe.apply(this, arguments);
    };

    module.exports = Force;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/Spring',['require','exports','module','./Force','famous/math/Vector'],function(require, exports, module) {
    var Force = require('./Force');
    var Vector = require('famous/math/Vector');

    /**
     *  A force that moves a physics body to a location with a spring motion.
     *    The body can be moved to another physics body, or an anchor point.
     *
     *  @class Spring
     *  @constructor
     *  @extends Force
     *  @param {Object} options options to set on drag
     */
    function Spring(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.disp = new Vector(0,0,0);

        _init.call(this);
        Force.call(this);
    }

    Spring.prototype = Object.create(Force.prototype);
    Spring.prototype.constructor = Spring;

    /** @const */ var pi = Math.PI;

    /**
     * @property Spring.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    Spring.FORCE_FUNCTIONS = {

        /**
         * A FENE (Finitely Extensible Nonlinear Elastic) spring force
         *      see: http://en.wikipedia.org/wiki/FENE
         * @attribute FENE
         * @type Function
         * @param {Number} dist current distance target is from source body
         * @param {Number} rMax maximum range of influence
         * @return {Number} unscaled force
         */
        FENE : function(dist, rMax) {
            var rMaxSmall = rMax * .99;
            var r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
            return r / (1 - r * r/(rMax * rMax));
        },

        /**
         * A Hookean spring force, linear in the displacement
         *      see: http://en.wikipedia.org/wiki/FENE
         * @attribute FENE
         * @type Function
         * @param {Number} dist current distance target is from source body
         * @return {Number} unscaled force
         */
        HOOK : function(dist) {
            return dist;
        }
    };

    /**
     * @property Spring.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Spring.DEFAULT_OPTIONS = {

        /**
         * The amount of time in milliseconds taken for one complete oscillation
         * when there is no damping
         *    Range : [150, Infinity]
         * @attribute period
         * @type Number
         * @default 300
         */
        period        : 300,

        /**
         * The damping of the spring.
         *    Range : [0, 1]
         *    0 = no damping, and the spring will oscillate forever
         *    1 = critically damped (the spring will never oscillate)
         * @attribute dampingRatio
         * @type Number
         * @default 0.1
         */
        dampingRatio : 0.1,

        /**
         * The rest length of the spring
         *    Range : [0, Infinity]
         * @attribute length
         * @type Number
         * @default 0
         */
        length : 0,

        /**
         * The maximum length of the spring (for a FENE spring)
         *    Range : [0, Infinity]
         * @attribute length
         * @type Number
         * @default Infinity
         */
        maxLength : Infinity,

        /**
         * The location of the spring's anchor, if not another physics body
         *
         * @attribute anchor
         * @type Array
         * @optional
         */
        anchor : undefined,

        /**
         * The type of spring force
         * @attribute forceFunction
         * @type Function
         */
        forceFunction : Spring.FORCE_FUNCTIONS.HOOK
    };

    function _setForceFunction(fn) {
        this.forceFunction = fn;
    }

    function _calcStiffness() {
        var options = this.options;
        options.stiffness = Math.pow(2 * pi / options.period, 2);
    }

    function _calcDamping() {
        var options = this.options;
        options.damping = 4 * pi * options.dampingRatio / options.period;
    }

    function _calcEnergy(strength, dist) {
        return 0.5 * strength * dist * dist;
    }

    function _init() {
        _setForceFunction.call(this, this.options.forceFunction);
        _calcStiffness.call(this);
        _calcDamping.call(this);
    }

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects}
     */
    Spring.prototype.setOptions = function setOptions(options) {
        if (options.anchor !== undefined) {
            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
            if (options.anchor   instanceof Vector)  this.options.anchor = options.anchor;
            if (options.anchor   instanceof Array)  this.options.anchor = new Vector(options.anchor);
        }
        if (options.period !== undefined) this.options.period = options.period;
        if (options.dampingRatio !== undefined) this.options.dampingRatio = options.dampingRatio;
        if (options.length !== undefined) this.options.length = options.length;
        if (options.forceFunction !== undefined) this.options.forceFunction = options.forceFunction;
        if (options.maxLength !== undefined) this.options.maxLength = options.maxLength;

        _init.call(this);
    };

    /**
     * Adds a spring force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply force to.
     */
    Spring.prototype.applyForce = function applyForce(targets, source) {
        var force        = this.force;
        var disp         = this.disp;
        var options      = this.options;

        var stiffness    = options.stiffness;
        var damping      = options.damping;
        var restLength   = options.length;
        var lMax         = options.maxLength;
        var anchor       = options.anchor || source.position;

        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var p2 = target.position;
            var v2 = target.velocity;

            anchor.sub(p2).put(disp);
            var dist = disp.norm() - restLength;

            if (dist === 0) return;

            //if dampingRatio specified, then override strength and damping
            var m      = target.mass;
            stiffness *= m;
            damping   *= m;

            disp.normalize(stiffness * this.forceFunction(dist, lMax))
                .put(force);

            if (damping)
                if (source) force.add(v2.sub(source.velocity).mult(-damping)).put(force);
                else force.add(v2.mult(-damping)).put(force);

            target.applyForce(force);
            if (source) source.applyForce(force.mult(-1));

            this.setEnergy(_calcEnergy(stiffness, dist));
        }
    };

    /**
     * Calculates the potential energy of the spring.
     *
     * @method getEnergy
     * @param target {Body}     The physics body attached to the spring
     * @return energy {Number}
     */
    Spring.prototype.getEnergy = function getEnergy(target) {
        var options        = this.options;
        var restLength  = options.length;
        var anchor      = options.anchor;
        var strength    = options.stiffness;

        var dist = anchor.sub(target.position).norm() - restLength;
        return 0.5 * strength * dist * dist;
    };

    /**
     * Sets the anchor to a new position
     *
     * @method setAnchor
     * @param anchor {Array}    New anchor of the spring
     */
    Spring.prototype.setAnchor = function setAnchor(anchor) {
        if (!this.options.anchor) this.options.anchor = new Vector();
        this.options.anchor.set(anchor);
    };

    module.exports = Spring;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/*global console*/

define('famous/transitions/SpringTransition',['require','exports','module','famous/physics/PhysicsEngine','famous/physics/bodies/Particle','famous/physics/forces/Spring','famous/math/Vector'],function(require, exports, module) {
    var PE = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var Vector = require('famous/math/Vector');

    /**
     * SpringTransition is a method of transitioning between two values (numbers,
     * or arrays of numbers) with a bounce. The transition will overshoot the target
     * state depending on the parameters of the transition.
     *
     * @class SpringTransition
     * @constructor
     *
     * @param {Number|Array} [state=0] Initial state
     */
    function SpringTransition(state) {
        state = state || 0;
        this.endState  = new Vector(state);
        this.initState = new Vector();

        this._dimensions       = undefined;
        this._restTolerance    = 1e-10;
        this._absRestTolerance = this._restTolerance;
        this._callback         = undefined;

        this.PE       = new PE();
        this.spring   = new Spring({anchor : this.endState});
        this.particle = new Particle();

        this.PE.addBody(this.particle);
        this.PE.attach(this.spring, this.particle);
    }

    SpringTransition.SUPPORTS_MULTIPLE = 3;

    /**
     * @property SpringTransition.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    SpringTransition.DEFAULT_OPTIONS = {

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
        velocity : 0
    };

    function _getEnergy() {
        return this.particle.getEnergy() + this.spring.getEnergy(this.particle);
    }

    function _setParticlePosition(p) {
        this.particle.setPosition(p);
    }

    function _setParticleVelocity(v) {
        this.particle.setVelocity(v);
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

    function _wake() {
        this.PE.wake();
    }

    function _sleep() {
        this.PE.sleep();
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

    function _setupDefinition(definition) {
        // TODO fix no-console error
        /* eslint no-console: 0 */
        var defaults = SpringTransition.DEFAULT_OPTIONS;
        if (definition.period === undefined)       definition.period       = defaults.period;
        if (definition.dampingRatio === undefined) definition.dampingRatio = defaults.dampingRatio;
        if (definition.velocity === undefined)     definition.velocity     = defaults.velocity;

        if (definition.period < 150) {
            definition.period = 150;
            console.warn('The period of a SpringTransition is capped at 150 ms. Use a SnapTransition for faster transitions');
        }

        //setup spring
        this.spring.setOptions({
            period       : definition.period,
            dampingRatio : definition.dampingRatio
        });

        //setup particle
        _setParticleVelocity.call(this, definition.velocity);
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

    /**
     * Resets the position and velocity
     *
     * @method reset
     *
     * @param {Number|Array.Number} pos positional state
     * @param {Number|Array} vel velocity
     */
    SpringTransition.prototype.reset = function reset(pos, vel) {
        this._dimensions = (pos instanceof Array)
            ? pos.length
            : 0;

        this.initState.set(pos);
        _setParticlePosition.call(this, pos);
        _setTarget.call(this, pos);
        if (vel) _setParticleVelocity.call(this, vel);
        _setCallback.call(this, undefined);
    };

    /**
     * Getter for velocity
     *
     * @method getVelocity
     *
     * @return {Number|Array} velocity
     */
    SpringTransition.prototype.getVelocity = function getVelocity() {
        return _getParticleVelocity.call(this);
    };

    /**
     * Setter for velocity
     *
     * @method setVelocity
     *
     * @return {Number|Array} velocity
     */
    SpringTransition.prototype.setVelocity = function setVelocity(v) {
        this.call(this, _setParticleVelocity(v));
    };

    /**
     * Detects whether a transition is in progress
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    SpringTransition.prototype.isActive = function isActive() {
        return !this.PE.isSleeping();
    };

    /**
     * Halt the transition
     *
     * @method halt
     */
    SpringTransition.prototype.halt = function halt() {
        this.set(this.get());
    };

    /**
     * Get the current position of the transition
     *
     * @method get
     *
     * @return {Number|Array} state
     */
    SpringTransition.prototype.get = function get() {
        _update.call(this);
        return _getParticlePosition.call(this);
    };

    /**
     * Set the end position and transition, with optional callback on completion.
     *
     * @method set
     *
     * @param  {Number|Array} endState Final state
     * @param {Object}  definition  Transition definition
     * @param  {Function} callback Callback
     */
    SpringTransition.prototype.set = function set(endState, definition, callback) {
        if (!definition) {
            this.reset(endState);
            if (callback) callback();
            return;
        }

        this._dimensions = (endState instanceof Array)
            ? endState.length
            : 0;

        _wake.call(this);
        _setupDefinition.call(this, definition);
        _setTarget.call(this, endState);
        _setCallback.call(this, callback);
    };

    module.exports = SpringTransition;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Wall',['require','exports','module','./Constraint','famous/math/Vector'],function(require, exports, module) {
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
     *  @param {Options} [options] An object of configurable options.
     *  @param {Number} [options.restitution] The energy ratio lost in a collision (0 = stick, 1 = elastic). Range : [0, 1]
     *  @param {Number} [options.drift] Baumgarte stabilization parameter. Makes constraints "loosely" (0) or "tightly" (1) enforced. Range : [0, 1]
     *  @param {Number} [options.slop] Amount of penetration in pixels to ignore before collision event triggers.
     *  @param {Array} [options.normal] The normal direction to the wall.
     *  @param {Number} [options.distance] The distance from the origin that the wall is placed.
     *  @param {onContact} [options.onContact] How to handle collision against the wall.
     *
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

    Wall.DEFAULT_OPTIONS = {
        restitution : 0.5,
        drift : 0.5,
        slop : 0,
        normal : [1, 0, 0],
        distance : 0,
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
                else _onExit.call(this, particle, overlap, dt);
            }
        }
    };

    module.exports = Wall;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/transitions/WallTransition',['require','exports','module','famous/physics/PhysicsEngine','famous/physics/bodies/Particle','famous/physics/forces/Spring','famous/physics/constraints/Wall','famous/math/Vector'],function(require, exports, module) {
    var PE = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Spring = require('famous/physics/forces/Spring');
    var Wall = require('famous/physics/constraints/Wall');
    var Vector = require('famous/math/Vector');

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
        resitution : 0.5
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/CanvasSurface',['require','exports','module','famous/core/Surface'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * A surface containing an HTML5 Canvas element.
     *   This extends the Surface class.
     *
     * @class CanvasSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Array.Number} [options.canvasSize] [width, height] for document element
     */
    function CanvasSurface(options) {
        if (options && options.canvasSize) this._canvasSize = options.canvasSize;
        Surface.apply(this, arguments);
        if (!this._canvasSize) this._canvasSize = this.getSize();
        this._backBuffer = document.createElement('canvas');
        if (this._canvasSize) {
            this._backBuffer.width = this._canvasSize[0];
            this._backBuffer.height = this._canvasSize[1];
        }
        this._contextId = undefined;
    }

    CanvasSurface.prototype = Object.create(Surface.prototype);
    CanvasSurface.prototype.constructor = CanvasSurface;
    CanvasSurface.prototype.elementType = 'canvas';
    CanvasSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set inner document content.  Note that this is a noop for CanvasSurface.
     *
     * @method setContent
     *
     */
    CanvasSurface.prototype.setContent = function setContent() {};

    /**
     * Place the document element this component manages into the document.
     *    This will draw the content to the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    CanvasSurface.prototype.deploy = function deploy(target) {
        if (this._canvasSize) {
            target.width = this._canvasSize[0];
            target.height = this._canvasSize[1];
        }
        if (this._contextId === '2d') {
            target.getContext(this._contextId).drawImage(this._backBuffer, 0, 0);
            this._backBuffer.width = 0;
            this._backBuffer.height = 0;
        }
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    CanvasSurface.prototype.recall = function recall(target) {
        var size = this.getSize();

        this._backBuffer.width = target.width;
        this._backBuffer.height = target.height;

        if (this._contextId === '2d') {
            this._backBuffer.getContext(this._contextId).drawImage(target, 0, 0);
            target.width = 0;
            target.height = 0;
        }
    };

    /**
     * Returns the canvas element's context
     *
     * @method getContext
     * @param {string} contextId context identifier
     */
    CanvasSurface.prototype.getContext = function getContext(contextId) {
        this._contextId = contextId;
        return this._currTarget ? this._currTarget.getContext(contextId) : this._backBuffer.getContext(contextId);
    };

    /**
     *  Set the size of the surface and canvas element.
     *
     *  @method setSize
     *  @param {Array.number} size [width, height] of surface
     *  @param {Array.number} canvasSize [width, height] of canvas surface
     */
    CanvasSurface.prototype.setSize = function setSize(size, canvasSize) {
        Surface.prototype.setSize.apply(this, arguments);
        if (canvasSize) this._canvasSize = [canvasSize[0], canvasSize[1]];
        if (this._currTarget) {
            this._currTarget.width = this._canvasSize[0];
            this._currTarget.height = this._canvasSize[1];
        }
    };

    module.exports = CanvasSurface;
});


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/ContainerSurface',['require','exports','module','famous/core/Surface','famous/core/Context'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Context = require('famous/core/Context');

    /**
     * ContainerSurface is an object designed to contain surfaces and
     *   set properties to be applied to all of them at once.
     *   This extends the Surface class.
     *   A container surface will enforce these properties on the
     *   surfaces it contains:
     *
     *   size (clips contained surfaces to its own width and height);
     *
     *   origin;
     *
     *   its own opacity and transform, which will be automatically
     *   applied to  all Surfaces contained directly and indirectly.
     *
     * @class ContainerSurface
     * @extends Surface
     * @constructor
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on all inner content
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface (should not be used)
     */
    function ContainerSurface(options) {
        Surface.call(this, options);
        this._container = document.createElement('div');
        this._container.classList.add('famous-group');
        this._container.classList.add('famous-container-group');
        this._shouldRecalculateSize = false;
        this.context = new Context(this._container);
        this.setContent(this._container);
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = 'famous-surface';

    /**
     * Add renderables to this object's render tree
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    ContainerSurface.prototype.add = function add() {
        return this.context.add.apply(this.context, arguments);
    };

    /**
     * Return spec for this surface.  Note: Can result in a size recalculation.
     *
     * @private
     * @method render
     *
     * @return {Object} render spec for this surface (spec id)
     */
    ContainerSurface.prototype.render = function render() {
        if (this._sizeDirty) this._shouldRecalculateSize = true;
        return Surface.prototype.render.apply(this, arguments);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    ContainerSurface.prototype.deploy = function deploy() {
        this._shouldRecalculateSize = true;
        return Surface.prototype.deploy.apply(this, arguments);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     * @param {Transform} transform unused TODO
     * @param {Number} opacity  unused TODO
     * @param {Array.Number} origin unused TODO
     * @param {Array.Number} size unused TODO
     * @return {undefined} TODO returns an undefined value
     */
    ContainerSurface.prototype.commit = function commit(context, transform, opacity, origin, size) {
        var previousSize = this._size ? [this._size[0], this._size[1]] : null;
        var result = Surface.prototype.commit.apply(this, arguments);
        if (this._shouldRecalculateSize || (previousSize && (this._size[0] !== previousSize[0] || this._size[1] !== previousSize[1]))) {
            this.context.setSize();
            this._shouldRecalculateSize = false;
        }
        this.context.update();
        return result;
    };

    module.exports = ContainerSurface;
});

define('famous/surfaces/FormContainerSurface',['require','exports','module','./ContainerSurface'],function(require, exports, module) {
    var ContainerSurface = require('./ContainerSurface');

    function FormContainerSurface(options) {
        if (options) this._method = options.method || '';
        ContainerSurface.apply(this, arguments);
    }

    FormContainerSurface.prototype = Object.create(ContainerSurface.prototype);
    FormContainerSurface.prototype.constructor = FormContainerSurface;

    FormContainerSurface.prototype.elementType = 'form';

    FormContainerSurface.prototype.deploy = function deploy(target) {
        if (this._method) target.method = this._method;
        return ContainerSurface.prototype.deploy.apply(this, arguments);
    };

    module.exports = FormContainerSurface;
});


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/ImageSurface',['require','exports','module','famous/core/Surface'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * A surface containing image content.
     *   This extends the Surface class.
     *
     * @class ImageSurface
     *
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     */
    function ImageSurface(options) {
        this._imageUrl = undefined;
        Surface.apply(this, arguments);
    }

    ImageSurface.prototype = Object.create(Surface.prototype);
    ImageSurface.prototype.constructor = ImageSurface;
    ImageSurface.prototype.elementType = 'img';
    ImageSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set content URL.  This will cause a re-rendering.
     * @method setContent
     * @param {string} imageUrl
     */
    ImageSurface.prototype.setContent = function setContent(imageUrl) {
        this._imageUrl = imageUrl;
        this._contentDirty = true;
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    ImageSurface.prototype.deploy = function deploy(target) {
        target.src = this._imageUrl || '';
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    ImageSurface.prototype.recall = function recall(target) {
        target.src = '';
    };

    module.exports = ImageSurface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/InputSurface',['require','exports','module','famous/core/Surface'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * A Famo.us surface in the form of an HTML input element.
     *   This extends the Surface class.
     *
     * @class InputSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an <input> element
     * @param {string} [options.type] specifies the type of element to display (e.g. 'datetime', 'text', 'button', etc.)
     * @param {string} [options.value] value of text
     */
    function InputSurface(options) {
        this._placeholder = options.placeholder || '';
        this._value       = options.value || '';
        this._type        = options.type || 'text';
        this._name        = options.name || '';

        Surface.apply(this, arguments);

        this.on('click', this.focus.bind(this));
        window.addEventListener('click', function(event) {
            if (event.target !== this._currTarget) this.blur();
        }.bind(this));
    }
    InputSurface.prototype = Object.create(Surface.prototype);
    InputSurface.prototype.constructor = InputSurface;

    InputSurface.prototype.elementType = 'input';
    InputSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set placeholder text.  Note: Triggers a repaint.
     *
     * @method setPlaceholder
     * @param {string} str Value to set the placeholder to.
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setPlaceholder = function setPlaceholder(str) {
        this._placeholder = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Focus on the current input, pulling up the keyboard on mobile.
     *
     * @method focus
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.focus = function focus() {
        if (this._currTarget) this._currTarget.focus();
        return this;
    };

    /**
     * Blur the current input, hiding the keyboard on mobile.
     *
     * @method blur
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.blur = function blur() {
        if (this._currTarget) this._currTarget.blur();
        return this;
    };

    /**
     * Set the placeholder conent.
     *   Note: Triggers a repaint next tick.
     *
     * @method setValue
     * @param {string} str Value to set the main input value to.
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setValue = function setValue(str) {
        this._value = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Set the type of element to display conent.
     *   Note: Triggers a repaint next tick.
     *
     * @method setType
     * @param {string} str type of the input surface (e.g. 'button', 'text')
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setType = function setType(str) {
        this._type = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the value of the inner content of the element (e.g. the entered text)
     *
     * @method getValue
     * @return {string} value of element
     */
    InputSurface.prototype.getValue = function getValue() {
        if (this._currTarget) {
            return this._currTarget.value;
        }
        else {
            return this._value;
        }
    };

    /**
     * Set the name attribute of the element.
     *   Note: Triggers a repaint next tick.
     *
     * @method setName
     * @param {string} str element name
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setName = function setName(str) {
        this._name = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the name attribute of the element.
     *
     * @method getName
     * @return {string} name of element
     */
    InputSurface.prototype.getName = function getName() {
        return this._name;
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    InputSurface.prototype.deploy = function deploy(target) {
        if (this._placeholder !== '') target.placeholder = this._placeholder;
        target.value = this._value;
        target.type = this._type;
        target.name = this._name;
    };

    module.exports = InputSurface;
});

define('famous/surfaces/SubmitInputSurface',['require','exports','module','./InputSurface'],function(require, exports, module) {
    var InputSurface = require('./InputSurface');

    function SubmitInputSurface(options) {
        InputSurface.apply(this, arguments);
        this._type = 'submit';
        if (options && options.onClick) this.setOnClick(options.onClick);
    }

    SubmitInputSurface.prototype = Object.create(InputSurface.prototype);
    SubmitInputSurface.prototype.constructor = SubmitInputSurface;

    SubmitInputSurface.prototype.setOnClick = function(onClick) {
        this.onClick = onClick;
    };

    SubmitInputSurface.prototype.deploy = function deploy(target) {
        if (this.onclick) target.onClick = this.onClick;
        InputSurface.prototype.deploy.apply(this, arguments);
    };

    module.exports = SubmitInputSurface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/TextareaSurface',['require','exports','module','famous/core/Surface'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * A Famo.us surface in the form of an HTML textarea element.
     *   This extends the Surface class.
     *
     * @class TextareaSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an textarea element
     * @param {string} [options.value] value of text
     * @param {string} [options.name] specifies the name of textarea
     * @param {string} [options.wrap] specify 'hard' or 'soft' wrap for textarea
     * @param {number} [options.cols] number of columns in textarea
     * @param {number} [options.rows] number of rows in textarea
     */
    function TextareaSurface(options) {
        this._placeholder = options.placeholder || '';
        this._value       = options.value || '';
        this._name        = options.name || '';
        this._wrap        = options.wrap || '';
        this._cols        = options.cols || '';
        this._rows        = options.rows || '';

        Surface.apply(this, arguments);
        this.on('click', this.focus.bind(this));
    }
    TextareaSurface.prototype = Object.create(Surface.prototype);
    TextareaSurface.prototype.constructor = TextareaSurface;

    TextareaSurface.prototype.elementType = 'textarea';
    TextareaSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set placeholder text.  Note: Triggers a repaint.
     *
     * @method setPlaceholder
     * @param {string} str Value to set the placeholder to.
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setPlaceholder = function setPlaceholder(str) {
        this._placeholder = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Focus on the current input, pulling up the keyboard on mobile.
     *
     * @method focus
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.focus = function focus() {
        if (this._currTarget) this._currTarget.focus();
        return this;
    };

    /**
     * Blur the current input, hiding the keyboard on mobile.
     *
     * @method focus
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.blur = function blur() {
        if (this._currTarget) this._currTarget.blur();
        return this;
    };

    /**
     * Set the value of textarea.
     *   Note: Triggers a repaint next tick.
     *
     * @method setValue
     * @param {string} str Value to set the main textarea value to.
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setValue = function setValue(str) {
        this._value = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the value of the inner content of the textarea (e.g. the entered text)
     *
     * @method getValue
     * @return {string} value of element
     */
    TextareaSurface.prototype.getValue = function getValue() {
        if (this._currTarget) {
            return this._currTarget.value;
        }
        else {
            return this._value;
        }
    };

    /**
     * Set the name attribute of the element.
     *   Note: Triggers a repaint next tick.
     *
     * @method setName
     * @param {string} str element name
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setName = function setName(str) {
        this._name = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the name attribute of the element.
     *
     * @method getName
     * @return {string} name of element
     */
    TextareaSurface.prototype.getName = function getName() {
        return this._name;
    };

    /**
     * Set the wrap of textarea.
     *   Note: Triggers a repaint next tick.
     *
     * @method setWrap
     * @param {string} str wrap of the textarea surface (e.g. 'soft', 'hard')
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setWrap = function setWrap(str) {
        this._wrap = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Set the number of columns visible in the textarea.
     *   Note: Overridden by surface size; set width to true. (eg. size: [true, *])
     *         Triggers a repaint next tick.
     *
     * @method setColumns
     * @param {number} num columns in textarea surface
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setColumns = function setColumns(num) {
        this._cols = num;
        this._contentDirty = true;
        return this;
    };

    /**
     * Set the number of rows visible in the textarea.
     *   Note: Overridden by surface size; set height to true. (eg. size: [*, true])
     *         Triggers a repaint next tick.
     *
     * @method setRows
     * @param {number} num rows in textarea surface
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setRows = function setRows(num) {
        this._rows = num;
        this._contentDirty = true;
        return this;
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    TextareaSurface.prototype.deploy = function deploy(target) {
        if (this._placeholder !== '') target.placeholder = this._placeholder;
        if (this._value !== '') target.value = this._value;
        if (this._name !== '') target.name = this._name;
        if (this._wrap !== '') target.wrap = this._wrap;
        if (this._cols !== '') target.cols = this._cols;
        if (this._rows !== '') target.rows = this._rows;
    };

    module.exports = TextareaSurface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/surfaces/VideoSurface',['require','exports','module','famous/core/Surface'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * Creates a famous surface containing video content. Currently adding
     *   controls and manipulating the video are not supported through the
     *   surface interface, but can be accomplished via standard JavaScript
     *   manipulation of the video DOM element.
     *   This extends the Surface class.
     *
     * @class VideoSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] default option overrides
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on inner content
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface
     * @param {boolean} [options.autoplay] autoplay
     */
    function VideoSurface(options) {
        this._videoUrl = undefined;
        this.options = Object.create(VideoSurface.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        Surface.apply(this, arguments);
    }
    VideoSurface.prototype = Object.create(Surface.prototype);
    VideoSurface.prototype.constructor = VideoSurface;

    VideoSurface.DEFAULT_OPTIONS = {
        autoplay: false
    };

    VideoSurface.prototype.elementType = 'video';
    VideoSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set internal options, overriding any default options
     *
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Boolean} [options.autoplay] HTML autoplay
     */
    VideoSurface.prototype.setOptions = function setOptions(options) {
        for (var key in VideoSurface.DEFAULT_OPTIONS) {
            if (options[key] !== undefined) this.options[key] = options[key];
        }
    };

    /**
     * Set url of the video.
     *
     * @method setContent
     * @param {string} videoUrl URL
     */
    VideoSurface.prototype.setContent = function setContent(videoUrl) {
        this._videoUrl = videoUrl;
        this._contentDirty = true;
    };

    /**
     * Place the document element this component manages into the document.
     *   Note: In the case of VideoSurface, simply changes the options on the target.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    VideoSurface.prototype.deploy = function deploy(target) {
        target.src = this._videoUrl;
        target.autoplay = this.options.autoplay;
    };

    /**
     * Remove this component and contained content from the document.
     *   Note: This doesn't actually remove the <video> element from the
     *   document.
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    VideoSurface.prototype.recall = function recall(target) {
        target.src = '';
    };

    module.exports = VideoSurface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/utilities/KeyCodes',['require','exports','module'],function(require, exports, module) {

    /**
     * Collection to map keyboard codes in plain english
     *
     * @class KeyCodes
     * @static
     */
    var KeyCodes = {
        0 : 48,
        1 : 49,
        2 : 50,
        3 : 51,
        4 : 52,
        5 : 53,
        6 : 54,
        7 : 55,
        8 : 56,
        9 : 57,
        a : 97,
        b : 98,
        c : 99,
        d : 100,
        e : 101,
        f : 102,
        g : 103,
        h : 104,
        i : 105,
        j : 106,
        k : 107,
        l : 108,
        m : 109,
        n : 110,
        o : 111,
        p : 112,
        q : 113,
        r : 114,
        s : 115,
        t : 116,
        u : 117,
        v : 118,
        w : 119,
        x : 120,
        y : 121,
        z : 122,
        A : 65,
        B : 66,
        C : 67,
        D : 68,
        E : 69,
        F : 70,
        G : 71,
        H : 72,
        I : 73,
        J : 74,
        K : 75,
        L : 76,
        M : 77,
        N : 78,
        O : 79,
        P : 80,
        Q : 81,
        R : 82,
        S : 83,
        T : 84,
        U : 85,
        V : 86,
        W : 87,
        X : 88,
        Y : 89,
        Z : 90,
        ENTER : 13,
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        SPACE: 32,
        SHIFT: 16,
        TAB: 9
    };

    module.exports = KeyCodes;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */
// TODO fix func-style
/*eslint func-style: [0, "declaration"] */

define('famous/utilities/Timer',['require','exports','module','famous/core/Engine'],function(require, exports, module) {
    /**
     * An internal library to reproduce javascript time-based scheduling.
     *   Using standard javascript setTimeout methods can have a negative performance impact
     *   when combined with the Famous rendering process, so instead require Timer and call
     *   Timer.setTimeout, Timer.setInterval, etc.
     *
     * @class Timer
     * @constructor
     */
    var FamousEngine = require('famous/core/Engine');

    var _event  = 'prerender';

    var getTime = (window.performance) ?
        function() {
            return window.performance.now();
        }
        : function() {
            return Date.now();
        };

    /**
     * Add a function to be run on every prerender
     *
     * @method addTimerFunction
     *
     * @param {function} fn function to be run every prerender
     *
     * @return {function} function passed in as parameter
     */
    function addTimerFunction(fn) {
        FamousEngine.on(_event, fn);
        return fn;
    }

    /**
     * Wraps a function to be invoked after a certain amount of time.
     *  After a set duration has passed, it executes the function and
     *  removes it as a listener to 'prerender'.
     *
     * @method setTimeout
     *
     * @param {function} fn function to be run after a specified duration
     * @param {number} duration milliseconds from now to execute the function
     *
     * @return {function} function passed in as parameter
     */
    function setTimeout(fn, duration) {
        var t = getTime();
        var callback = function() {
            var t2 = getTime();
            if (t2 - t >= duration) {
                fn.apply(this, arguments);
                FamousEngine.removeListener(_event, callback);
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Wraps a function to be invoked after a certain amount of time.
     *  After a set duration has passed, it executes the function and
     *  resets the execution time.
     *
     * @method setInterval
     *
     * @param {function} fn function to be run after a specified duration
     * @param {number} duration interval to execute function in milliseconds
     *
     * @return {function} function passed in as parameter
     */
    function setInterval(fn, duration) {
        var t = getTime();
        var callback = function() {
            var t2 = getTime();
            if (t2 - t >= duration) {
                fn.apply(this, arguments);
                t = getTime();
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Wraps a function to be invoked after a certain amount of prerender ticks.
     *  Similar use to setTimeout but tied to the engine's run speed.
     *
     * @method after
     *
     * @param {function} fn function to be run after a specified amount of ticks
     * @param {number} numTicks number of prerender frames to wait
     *
     * @return {function} function passed in as parameter
     */
    function after(fn, numTicks) {
        if (numTicks === undefined) return undefined;
        var callback = function() {
            numTicks--;
            if (numTicks <= 0) { //in case numTicks is fraction or negative
                fn.apply(this, arguments);
                clear(callback);
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Wraps a function to be continually invoked after a certain amount of prerender ticks.
     *  Similar use to setInterval but tied to the engine's run speed.
     *
     * @method every
     *
     * @param {function} fn function to be run after a specified amount of ticks
     * @param {number} numTicks number of prerender frames to wait
     *
     * @return {function} function passed in as parameter
     */
    function every(fn, numTicks) {
        numTicks = numTicks || 1;
        var initial = numTicks;
        var callback = function() {
            numTicks--;
            if (numTicks <= 0) { //in case numTicks is fraction or negative
                fn.apply(this, arguments);
                numTicks = initial;
            }
        };
        return addTimerFunction(callback);
    }

    /**
     * Remove a function that gets called every prerender
     *
     * @method clear
     *
     * @param {function} fn event linstener
     */
    function clear(fn) {
        FamousEngine.removeListener(_event, fn);
    }

    /**
     * Executes a function after a certain amount of time. Makes sure
     *  the function is not run multiple times.
     *
     * @method debounce
     *
     * @param {function} func function to run after certain amount of time
     * @param {number} wait amount of time
     *
     * @return {function} function that is not able to debounce
     */
    function debounce(func, wait) {
        var timeout;
        var ctx;
        var timestamp;
        var result;
        var args;
        return function() {
            ctx = this;
            args = arguments;
            timestamp = getTime();

            var fn = function() {
                var last = getTime - timestamp;

                if (last < wait) {
                    timeout = setTimeout(fn, wait - last);
                } else {
                    timeout = null;
                    result = func.apply(ctx, args);
                }
            };

            clear(timeout);
            timeout = setTimeout(fn, wait);

            return result;
        };
    }

    module.exports = {
        setTimeout : setTimeout,
        setInterval : setInterval,
        debounce : debounce,
        after : after,
        every : every,
        clear : clear
    };

});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/ContextualView',['require','exports','module','famous/core/Entity','famous/core/Transform','famous/core/EventHandler','famous/core/OptionsManager'],function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * ContextualView is an interface for creating views that need to
     *   be aware of their parent's transform, size, and/or origin.
     *   Consists of a OptionsManager paired with an input EventHandler
     *   and an output EventHandler. Meant to be extended by the developer.
     * @class ContextualView
     * @constructor
     * @param {Options} [options] An object of configurable options.
     */
    function ContextualView(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS || ContextualView.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._id = Entity.register(this);
    }

    ContextualView.DEFAULT_OPTIONS = {};

    /**
     * Patches the ContextualLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the ContextualLayout instance.
     */
    ContextualView.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Returns ContextualLayout instance's options.
     *
     * @method setOptions
     * @return {Options} options The instance's object of configurable options.
     */
    ContextualView.prototype.getOptions = function getOptions() {
        return this._optionsManager.getOptions();
    };

    /**
     * Return the registers Entity id for the ContextualView.
     *
     * @private
     * @method render
     * @return {Number} Registered Entity id
     */
    ContextualView.prototype.render = function render() {
        return this._id;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    ContextualView.prototype.commit = function commit(context) {};

    module.exports = ContextualView;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/SequentialLayout',['require','exports','module','famous/core/OptionsManager','famous/core/Transform','famous/core/ViewSequence','famous/utilities/Utility'],function(require, exports, module) {
    var OptionsManager = require('famous/core/OptionsManager');
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var Utility = require('famous/utilities/Utility');

    /**
     * SequentialLayout will lay out a collection of renderables sequentially in the specified direction.
     * @class SequentialLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the SequentialLayout instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Array.Number} [options.defaultItemSize=[50, 50]] In the case where a renderable layed out
     * under SequentialLayout's control doesen't have a getSize method, SequentialLayout will assign it
     * this default size. (Commonly a case with Views).
     */
    function SequentialLayout(options) {
        this._items = null;
        this._size = null;
        this._outputFunction = SequentialLayout.DEFAULT_OUTPUT_FUNCTION;

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);

        this._itemsCache = [];
        this._outputCache = {
            size: null,
            target: this._itemsCache
        };

        if (options) this.setOptions(options);
    }

    SequentialLayout.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        itemSpacing: 0,
        defaultItemSize: [50, 50]
    };

    SequentialLayout.DEFAULT_OUTPUT_FUNCTION = function DEFAULT_OUTPUT_FUNCTION(input, offset, index) {
        var transform = (this.options.direction === Utility.Direction.X) ? Transform.translate(offset, 0) : Transform.translate(0, offset);
        return {
            transform: transform,
            target: input.render()
        };
    };

    /**
     * Returns the width and the height of the SequentialLayout instance.
     *
     * @method getSize
     * @return {Array} A two value array of the SequentialLayout instance's current width and height (in that order).
     */
    SequentialLayout.prototype.getSize = function getSize() {
        if (!this._size) this.render(); // hack size in
        return this._size;
    };

    /**
     * Sets the collection of renderables under the SequentialLayout instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} items Either an array of renderables or a Famous viewSequence.
     * @chainable
     */
    SequentialLayout.prototype.sequenceFrom = function sequenceFrom(items) {
        if (items instanceof Array) items = new ViewSequence(items);
        this._items = items;
        return this;
    };

    /**
     * Patches the SequentialLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the SequentialLayout instance.
     * @chainable
     */
    SequentialLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions.apply(this.optionsManager, arguments);
        return this;
    };

    /**
     * setOutputFunction is used to apply a user-defined output transform on each processed renderable.
     *  For a good example, check out SequentialLayout's own DEFAULT_OUTPUT_FUNCTION in the code.
     *
     * @method setOutputFunction
     * @param {Function} outputFunction An output processer for each renderable in the SequentialLayout
     * instance.
     * @chainable
     */
    SequentialLayout.prototype.setOutputFunction = function setOutputFunction(outputFunction) {
        this._outputFunction = outputFunction;
        return this;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    SequentialLayout.prototype.render = function render() {
        var length = 0;
        var girth = 0;

        var lengthDim = (this.options.direction === Utility.Direction.X) ? 0 : 1;
        var girthDim = (this.options.direction === Utility.Direction.X) ? 1 : 0;

        var currentNode = this._items;
        var result = this._itemsCache;
        var i = 0;
        while (currentNode) {
            var item = currentNode.get();
            if (!item) break;

            var itemSize;
            if (item && item.getSize) itemSize = item.getSize();
            if (!itemSize) itemSize = this.options.defaultItemSize;
            if (itemSize[girthDim] !== true) girth = Math.max(girth, itemSize[girthDim]);

            var output = this._outputFunction.call(this, item, length, i);
            result[i] = output;

            if (itemSize[lengthDim] && (itemSize[lengthDim] !== true)) length += itemSize[lengthDim] + this.options.itemSpacing;
            currentNode = currentNode.getNext();
            i++;
        }
        this._itemsCache.splice(i);

        if (!girth) girth = undefined;

        if (!this._size) this._size = [0, 0];
        this._size[lengthDim] = length - this.options.itemSpacing; // account for last itemSpacing
        this._size[girthDim] = girth;

        this._outputCache.size = this.getSize();
        return this._outputCache;
    };

    module.exports = SequentialLayout;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/Deck',['require','exports','module','famous/core/Transform','famous/core/OptionsManager','famous/transitions/Transitionable','famous/utilities/Utility','./SequentialLayout'],function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var Utility = require('famous/utilities/Utility');
    var SequentialLayout = require('./SequentialLayout');

    /**
     * A Sequential Layout that can be opened and closed with animations.
     *
     *   Takes the same options as SequentialLayout
     *   as well as options for the open/close transition
     *   and the rotation you want your Deck instance to layout in.
     *
     * @class Deck
     * @constructor
     * @extends SequentialLayout
     *
     * @param {Options} [options] An object of configurable options
     * @param {Transition} [options.transition={duration: 500, curve: 'easeOutBounce'}
     *   The transition that executes upon opening or closing your deck instance.
     * @param {Number} [stackRotation=0] The amount of rotation applied to the propogation
     *   of the Deck instance's stack of renderables.
     * @param {Object} [options.transition] A transition object for changing between states.
     * @param {Number} [options.direction] axis of expansion (Utility.Direction.X or .Y)
     */
    function Deck(options) {
        SequentialLayout.apply(this, arguments);
        this.state = new Transitionable(0);
        this._isOpen = false;

        this.setOutputFunction(function(input, offset, index) {
            var state = _getState.call(this);
            var positionMatrix = (this.options.direction === Utility.Direction.X) ?
                Transform.translate(state * offset, 0, 0.001 * (state - 1) * offset) :
                Transform.translate(0, state * offset, 0.001 * (state - 1) * offset);
            var output = input.render();
            if (this.options.stackRotation) {
                var amount = this.options.stackRotation * index * (1 - state);
                output = {
                    transform: Transform.rotateZ(amount),
                    origin: [0.5, 0.5],
                    target: output
                };
            }
            return {
                transform: positionMatrix,
                size: input.getSize(),
                target: output
            };
        });
    }
    Deck.prototype = Object.create(SequentialLayout.prototype);
    Deck.prototype.constructor = Deck;

    Deck.DEFAULT_OPTIONS = OptionsManager.patch(SequentialLayout.DEFAULT_OPTIONS, {
        transition: {
            curve: 'easeOutBounce',
            duration: 500
        },
        stackRotation: 0
    });

    /**
     * Returns the width and the height of the Deck instance.
     *
     * @method getSize
     * @return {Array} A two value array of Deck's current width and height (in that order).
     *   Scales as Deck opens and closes.
     */
    Deck.prototype.getSize = function getSize() {
        var originalSize = SequentialLayout.prototype.getSize.apply(this, arguments);
        var firstSize = this._items ? this._items.get().getSize() : [0, 0];
        if (!firstSize) firstSize = [0, 0];
        var state = _getState.call(this);
        var invState = 1 - state;
        return [firstSize[0] * invState + originalSize[0] * state, firstSize[1] * invState + originalSize[1] * state];
    };

    function _getState(returnFinal) {
        if (returnFinal) return this._isOpen ? 1 : 0;
        else return this.state.get();
    }

    function _setState(pos, transition, callback) {
        this.state.halt();
        this.state.set(pos, transition, callback);
    }

    /**
     * An accesor method to find out if the messaged Deck instance is open or closed.
     *
     * @method isOpen
     * @return {Boolean} Returns true if the instance is open or false if it's closed.
     */
    Deck.prototype.isOpen = function isOpen() {
        return this._isOpen;
    };

    /**
     * Sets the Deck instance to an open state.
     *
     * @method open
     * @param {function} [callback] Executes after transitioning to a fully open state.
     */
    Deck.prototype.open = function open(callback) {
        this._isOpen = true;
       _setState.call(this, 1, this.options.transition, callback);
    };

    /**
     * Sets the Deck instance to an open state.
     *
     * @method close
     * @param {function} [callback] Executes after transitioning to a fully closed state.
     */
    Deck.prototype.close = function close(callback) {
        this._isOpen = false;
        _setState.call(this, 0, this.options.transition, callback);
    };

    /**
     * Sets the Deck instance from its current state to the opposite state.
     *
     * @method close
     * @param {function} [callback] Executes after transitioning to the toggled state.
     */
    Deck.prototype.toggle = function toggle(callback) {
        if (this._isOpen) this.close(callback);
        else this.open(callback);
    };

    module.exports = Deck;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/RenderController',['require','exports','module','famous/core/Modifier','famous/core/RenderNode','famous/core/Transform','famous/transitions/Transitionable','famous/core/View'],function(require, exports, module) {
    var Modifier = require('famous/core/Modifier');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var View = require('famous/core/View');

    /**
     * A dynamic view that can show or hide different renerables with transitions.
     * @class RenderController
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Transition} [inTransition=true] The transition in charge of showing a renderable.
     * @param {Transition} [outTransition=true]  The transition in charge of removing your previous renderable when
     * you show a new one, or hiding your current renderable.
     * @param {Boolean} [overlap=true] When showing a new renderable, overlap determines if the
      out transition of the old one executes concurrently with the in transition of the new one,
       or synchronously beforehand.
     */
    function RenderController(options) {
        View.apply(this, arguments);

        this._showing = -1;
        this._outgoingRenderables = [];
        this._nextRenderable = null;

        this._renderables = [];
        this._nodes = [];
        this._modifiers = [];
        this._states = [];

        this.inTransformMap = RenderController.DefaultMap.transform;
        this.inOpacityMap = RenderController.DefaultMap.opacity;
        this.inOriginMap = RenderController.DefaultMap.origin;
        this.outTransformMap = RenderController.DefaultMap.transform;
        this.outOpacityMap = RenderController.DefaultMap.opacity;
        this.outOriginMap = RenderController.DefaultMap.origin;

        this._output = [];
    }
    RenderController.prototype = Object.create(View.prototype);
    RenderController.prototype.constructor = RenderController;

    RenderController.DEFAULT_OPTIONS = {
        inTransition: true,
        outTransition: true,
        overlap: true
    };

    RenderController.DefaultMap = {
        transform: function() {
            return Transform.identity;
        },
        opacity: function(progress) {
            return progress;
        },
        origin: null
    };

    function _mappedState(map, state) {
        return map(state.get());
    }

    /**
     * As your RenderController shows a new renderable, it executes a transition in. This transition in
     *  will affect a default interior state and modify it as you bring renderables in and out. However, if you want to control
     *  the transform, opacity, and origin state yourself, you may call certain methods (such as inTransformFrom) to obtain state from an outside source,
     *  that may either be a function or a Famous transitionable. inTransformFrom sets the accessor for the state of
     *  the transform used in transitioning in renderables.
     *
     * @method inTransformFrom
     * @param {Function|Transitionable} transform  A function that returns a transform from outside closure, or a
     * a transitionable that manages a full transform (a sixteen value array).
     * @chainable
     */
    RenderController.prototype.inTransformFrom = function inTransformFrom(transform) {
        if (transform instanceof Function) this.inTransformMap = transform;
        else if (transform && transform.get) this.inTransformMap = transform.get.bind(transform);
        else throw new Error('inTransformFrom takes only function or getter object');
        //TODO: tween transition
        return this;
    };

    /**
     * inOpacityFrom sets the accessor for the state of the opacity used in transitioning in renderables.
     * @method inOpacityFrom
     * @param {Function|Transitionable} opacity  A function that returns an opacity from outside closure, or a
     * a transitionable that manages opacity (a number between zero and one).
     * @chainable
     */
    RenderController.prototype.inOpacityFrom = function inOpacityFrom(opacity) {
        if (opacity instanceof Function) this.inOpacityMap = opacity;
        else if (opacity && opacity.get) this.inOpacityMap = opacity.get.bind(opacity);
        else throw new Error('inOpacityFrom takes only function or getter object');
        //TODO: tween opacity
        return this;
    };

    /**
     * inOriginFrom sets the accessor for the state of the origin used in transitioning in renderables.
     * @method inOriginFrom
     * @param {Function|Transitionable} origin A function that returns an origin from outside closure, or a
     * a transitionable that manages origin (a two value array of numbers between zero and one).
     * @chainable
     */
    RenderController.prototype.inOriginFrom = function inOriginFrom(origin) {
        if (origin instanceof Function) this.inOriginMap = origin;
        else if (origin && origin.get) this.inOriginMap = origin.get.bind(origin);
        else throw new Error('inOriginFrom takes only function or getter object');
        //TODO: tween origin
        return this;
    };

    /**
     * outTransformFrom sets the accessor for the state of the transform used in transitioning out renderables.
     * @method show
     * @param {Function|Transitionable} transform  A function that returns a transform from outside closure, or a
     * a transitionable that manages a full transform (a sixteen value array).
     * @chainable
     */
    RenderController.prototype.outTransformFrom = function outTransformFrom(transform) {
        if (transform instanceof Function) this.outTransformMap = transform;
        else if (transform && transform.get) this.outTransformMap = transform.get.bind(transform);
        else throw new Error('inTransformFrom takes only function or getter object');
        //TODO: tween transition
        return this;
    };

    /**
     * outOpacityFrom sets the accessor for the state of the opacity used in transitioning out renderables.
     * @method inOpacityFrom
     * @param {Function|Transitionable} opacity  A function that returns an opacity from outside closure, or a
     * a transitionable that manages opacity (a number between zero and one).
     * @chainable
     */
    RenderController.prototype.outOpacityFrom = function outOpacityFrom(opacity) {
        if (opacity instanceof Function) this.outOpacityMap = opacity;
        else if (opacity && opacity.get) this.outOpacityMap = opacity.get.bind(opacity);
        else throw new Error('inOpacityFrom takes only function or getter object');
        //TODO: tween opacity
        return this;
    };

    /**
     * outOriginFrom sets the accessor for the state of the origin used in transitioning out renderables.
     * @method inOriginFrom
     * @param {Function|Transitionable} origin A function that returns an origin from outside closure, or a
     * a transitionable that manages origin (a two value array of numbers between zero and one).
     * @chainable
     */
    RenderController.prototype.outOriginFrom = function outOriginFrom(origin) {
        if (origin instanceof Function) this.outOriginMap = origin;
        else if (origin && origin.get) this.outOriginMap = origin.get.bind(origin);
        else throw new Error('inOriginFrom takes only function or getter object');
        //TODO: tween origin
        return this;
    };

    /**
     * Show displays the targeted renderable with a transition and an optional callback to
     * execute afterwards.
     * @method show
     * @param {Object} renderable The renderable you want to show.
     * @param {Transition} [transition] Overwrites the default transition in to display the
     * passed-in renderable.
     * @param {function} [callback] Executes after transitioning in the renderable.
     * @chainable
     */
    RenderController.prototype.show = function show(renderable, transition, callback) {
        if (!renderable) {
            return this.hide(callback);
        }

        if (transition instanceof Function) {
            callback = transition;
            transition = null;
        }

        if (this._showing >= 0) {
            if (this.options.overlap) this.hide();
            else {
                if (this._nextRenderable) {
                    this._nextRenderable = renderable;
                }
                else {
                    this._nextRenderable = renderable;
                    this.hide(function() {
                        if (this._nextRenderable === renderable) this.show(this._nextRenderable, callback);
                        this._nextRenderable = null;
                    });
                }
                return undefined;
            }
        }

        var state = null;

        // check to see if we should restore
        var renderableIndex = this._renderables.indexOf(renderable);
        if (renderableIndex >= 0) {
            this._showing = renderableIndex;
            state = this._states[renderableIndex];
            state.halt();

            var outgoingIndex = this._outgoingRenderables.indexOf(renderable);
            if (outgoingIndex >= 0) this._outgoingRenderables.splice(outgoingIndex, 1);
        }
        else {
            state = new Transitionable(0);

            var modifier = new Modifier({
                transform: this.inTransformMap ? _mappedState.bind(this, this.inTransformMap, state) : null,
                opacity: this.inOpacityMap ? _mappedState.bind(this, this.inOpacityMap, state) : null,
                origin: this.inOriginMap ? _mappedState.bind(this, this.inOriginMap, state) : null
            });
            var node = new RenderNode();
            node.add(modifier).add(renderable);

            this._showing = this._nodes.length;
            this._nodes.push(node);
            this._modifiers.push(modifier);
            this._states.push(state);
            this._renderables.push(renderable);
        }

        if (!transition) transition = this.options.inTransition;
        state.set(1, transition, callback);
    };

    /**
     * Hide hides the currently displayed renderable with an out transition.
     * @method hide
     * @param {Transition} [transition] Overwrites the default transition in to hide the
     * currently controlled renderable.
     * @param {function} [callback] Executes after transitioning out the renderable.
     * @chainable
     */
    RenderController.prototype.hide = function hide(transition, callback) {
        if (this._showing < 0) return;
        var index = this._showing;
        this._showing = -1;

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        var node = this._nodes[index];
        var modifier = this._modifiers[index];
        var state = this._states[index];
        var renderable = this._renderables[index];

        modifier.transformFrom(this.outTransformMap ? _mappedState.bind(this, this.outTransformMap, state) : null);
        modifier.opacityFrom(this.outOpacityMap ? _mappedState.bind(this, this.outOpacityMap, state) : null);
        modifier.originFrom(this.outOriginMap ? _mappedState.bind(this, this.outOriginMap, state) : null);

        if (this._outgoingRenderables.indexOf(renderable) < 0) this._outgoingRenderables.push(renderable);

        if (!transition) transition = this.options.outTransition;
        state.halt();
        state.set(0, transition, function(node, modifier, state, renderable) {
            if (this._outgoingRenderables.indexOf(renderable) >= 0) {
                var index = this._nodes.indexOf(node);
                this._nodes.splice(index, 1);
                this._modifiers.splice(index, 1);
                this._states.splice(index, 1);
                this._renderables.splice(index, 1);
                this._outgoingRenderables.splice(this._outgoingRenderables.indexOf(renderable), 1);

                if (this._showing >= index) this._showing--;
            }
            if (callback) callback.call(this);
        }.bind(this, node, modifier, state, renderable));
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    RenderController.prototype.render = function render() {
        var result = this._output;
        if (result.length > this._nodes.length) result.splice(this._nodes.length);
        for (var i = 0; i < this._nodes.length; i++) {
            result[i] = this._nodes[i].render();
        }
        return result;
    };

    module.exports = RenderController;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/EdgeSwapper',['require','exports','module','famous/transitions/CachedMap','famous/core/Entity','famous/core/EventHandler','famous/core/Transform','./RenderController'],function(require, exports, module) {
    var CachedMap = require('famous/transitions/CachedMap');
    var Entity = require('famous/core/Entity');
    var EventHandler = require('famous/core/EventHandler');
    var Transform = require('famous/core/Transform');
    var RenderController = require('./RenderController');

    /**
     * Container which handles swapping renderables from the edge of its parent context.
     * @class EdgeSwapper
     * @constructor
     * @param {Options} [options] An object of configurable options.
     *   Takes the same options as RenderController.
     * @uses RenderController
     */
    function EdgeSwapper(options) {
        this._currentTarget = null;
        this._size = [undefined, undefined];

        this._controller = new RenderController(options);
        this._controller.inTransformFrom(CachedMap.create(_transformMap.bind(this, 0.0001)));
        this._controller.outTransformFrom(CachedMap.create(_transformMap.bind(this, -0.0001)));

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._entityId = Entity.register(this);
        if (options) this.setOptions(options);
    }

    function _transformMap(zMax, progress) {
        return Transform.translate(this._size[0] * (1 - progress), 0, zMax * (1 - progress));
    }

    /**
     * Displays the passed-in content with the EdgeSwapper instance's default transition.
     *
     * @method show
     * @param {Object} content The renderable you want to display.
     */
    EdgeSwapper.prototype.show = function show(content) {
        // stop sending input to old target
        if (this._currentTarget) this._eventInput.unpipe(this._currentTarget);

        this._currentTarget = content;

        // start sending input to new target
        if (this._currentTarget && this._currentTarget.trigger) this._eventInput.pipe(this._currentTarget);

        this._controller.show.apply(this._controller, arguments);
    };

    /**
     * Patches the EdgeSwapper instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Edgeswapper instance.
     */
    EdgeSwapper.prototype.setOptions = function setOptions(options) {
        this._controller.setOptions(options);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    EdgeSwapper.prototype.render = function render() {
        return this._entityId;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    EdgeSwapper.prototype.commit = function commit(context) {
        this._size[0] = context.size[0];
        this._size[1] = context.size[1];

        return {
            transform: context.transform,
            opacity: context.opacity,
            origin: context.origin,
            size: context.size,
            target: this._controller.render()
        };
    };

    module.exports = EdgeSwapper;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/FlexibleLayout',['require','exports','module','famous/core/Entity','famous/core/Transform','famous/core/OptionsManager','famous/core/EventHandler','famous/transitions/Transitionable'],function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * A layout which divides a context into sections based on a proportion
     *   of the total sum of ratios.  FlexibleLayout can either lay renderables
     *   out vertically or horizontally.
     * @class FlexibleLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=0] Direction the FlexibleLayout instance should lay out renderables.
     * @param {Transition} [options.transition=false] The transiton that controls the FlexibleLayout instance's reflow.
     * @param {Ratios} [options.ratios=[]] The proportions for the renderables to maintain
     */
    function FlexibleLayout(options) {
        this.options = Object.create(FlexibleLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._ratios = new Transitionable(this.options.ratios);
        this._nodes = [];

        this._cachedDirection = null;
        this._cachedTotalLength = false;
        this._cachedLengths = [];
        this._cachedTransforms = null;
        this._ratiosDirty = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    FlexibleLayout.DIRECTION_X = 0;
    FlexibleLayout.DIRECTION_Y = 1;

    FlexibleLayout.DEFAULT_OPTIONS = {
        direction: FlexibleLayout.DIRECTION_X,
        transition: false,
        ratios : []
    };

    function _reflow(ratios, length, direction) {
        var currTransform;
        var translation = 0;
        var flexLength = length;
        var ratioSum = 0;
        var ratio;
        var node;
        var i;

        this._cachedLengths = [];
        this._cachedTransforms = [];

        for (i = 0; i < ratios.length; i++){
            ratio = ratios[i];
            node = this._nodes[i];

            if (typeof ratio !== 'number')
                flexLength -= node.getSize()[direction] || 0;
            else
                ratioSum += ratio;
        }

        for (i = 0; i < ratios.length; i++) {
            node = this._nodes[i];
            ratio = ratios[i];

            length = (typeof ratio === 'number')
                ? flexLength * ratio / ratioSum
                : node.getSize()[direction];

            currTransform = (direction === FlexibleLayout.DIRECTION_X)
                ? Transform.translate(translation, 0, 0)
                : Transform.translate(0, translation, 0);

            this._cachedTransforms.push(currTransform);
            this._cachedLengths.push(length);

            translation += length;
        }
    }

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    FlexibleLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the FlexibleLayouts instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the FlexibleLayout instance.
     */
    FlexibleLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the FlexibleLayout instance's control.  Also sets
     * the associated ratio values for sizing the renderables if given.
     *
     * @method sequenceFrom
     * @param {Array} sequence An array of renderables.
     */
    FlexibleLayout.prototype.sequenceFrom = function sequenceFrom(sequence) {
        this._nodes = sequence;

        if (this._ratios.get().length === 0) {
            var ratios = [];
            for (var i = 0; i < this._nodes.length; i++) ratios.push(1);
            this.setRatios(ratios);
        }
    };

    /**
     * Sets the associated ratio values for sizing the renderables.
     *
     * @method setRatios
     * @param {Array} ratios Array of ratios corresponding to the percentage sizes each renderable should be
     */
    FlexibleLayout.prototype.setRatios = function setRatios(ratios, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        var currRatios = this._ratios;
        if (currRatios.get().length === 0) transition = undefined;
        if (currRatios.isActive()) currRatios.halt();
        currRatios.set(ratios, transition, callback);
        this._ratiosDirty = true;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    FlexibleLayout.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOrigin = context.origin;

        var ratios = this._ratios.get();
        var direction = this.options.direction;
        var length = parentSize[direction];
        var size;

        if (length !== this._cachedTotalLength || this._ratiosDirty || this._ratios.isActive() || direction !== this._cachedDirection) {
            _reflow.call(this, ratios, length, direction);

            if (length !== this._cachedTotalLength) this._cachedTotalLength = length;
            if (direction !== this._cachedDirection) this._cachedDirection = direction;
            if (this._ratiosDirty) this._ratiosDirty = false;
        }

        var result = [];
        for (var i = 0; i < ratios.length; i++) {
            size = [undefined, undefined];
            length = this._cachedLengths[i];
            size[direction] = length;
            result.push({
                transform : this._cachedTransforms[i],
                size: size,
                target : this._nodes[i].render()
            });
        }

        if (parentSize && (parentOrigin[0] !== 0 && parentOrigin[1] !== 0))
            parentTransform = Transform.moveThen([-parentSize[0]*parentOrigin[0], -parentSize[1]*parentOrigin[1], 0], parentTransform);

        return {
            transform: parentTransform,
            size: parentSize,
            target: result
        };
    };

    module.exports = FlexibleLayout;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/Flipper',['require','exports','module','famous/core/Transform','famous/transitions/Transitionable','famous/core/RenderNode','famous/core/OptionsManager'],function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var RenderNode = require('famous/core/RenderNode');
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * Allows you to link two renderables as front and back sides that can be
     *  'flipped' back and forth along a chosen axis. Rendering optimizations are
     *  automatically handled.
     *
     * @class Flipper
     * @constructor
     * @param {Options} [options] An object of options.
     * @param {Transition} [options.transition=true] The transition executed when flipping your Flipper instance.
     */
    function Flipper(options) {
        this.options = Object.create(Flipper.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.angle = new Transitionable(0);

        this.frontNode = undefined;
        this.backNode = undefined;

        this.flipped = false;
    }

    Flipper.DIRECTION_X = 0;
    Flipper.DIRECTION_Y = 1;

    var SEPERATION_LENGTH = 1;

    Flipper.DEFAULT_OPTIONS = {
        transition: true,
        direction: Flipper.DIRECTION_X
    };

    /**
     * Toggles the rotation between the front and back renderables
     *
     * @method flip
     * @param {Object} [transition] Transition definition
     * @param {Function} [callback] Callback
     */
    Flipper.prototype.flip = function flip(transition, callback) {
        var angle = this.flipped ? 0 : Math.PI;
        this.setAngle(angle, transition, callback);
        this.flipped = !this.flipped;
    };

    /**
     * Basic setter to the angle
     *
     * @method setAngle
     * @param {Number} angle
     * @param {Object} [transition] Transition definition
     * @param {Function} [callback] Callback
     */
    Flipper.prototype.setAngle = function setAngle(angle, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        if (this.angle.isActive()) this.angle.halt();
        this.angle.set(angle, transition, callback);
    };

    /**
     * Patches the Flipper instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Flipper instance.
     */
    Flipper.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Adds the passed-in renderable to the view associated with the 'front' of the Flipper instance.
     *
     * @method setFront
     * @chainable
     * @param {Object} node The renderable you want to add to the front.
     */
    Flipper.prototype.setFront = function setFront(node) {
        this.frontNode = node;
    };

    /**
     * Adds the passed-in renderable to the view associated with the 'back' of the Flipper instance.
     *
     * @method setBack
     * @chainable
     * @param {Object} node The renderable you want to add to the back.
     */
    Flipper.prototype.setBack = function setBack(node) {
        this.backNode = node;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    Flipper.prototype.render = function render() {
        var angle = this.angle.get();

        var frontTransform;
        var backTransform;

        if (this.options.direction === Flipper.DIRECTION_X) {
            frontTransform = Transform.rotateY(angle);
            backTransform = Transform.rotateY(angle + Math.PI);
        }
        else {
            frontTransform = Transform.rotateX(angle);
            backTransform = Transform.rotateX(angle + Math.PI);
        }

        var result = [];
        if (this.frontNode){
            result.push({
                transform: frontTransform,
                target: this.frontNode.render()
            });
        }

        if (this.backNode){
            result.push({
                transform: Transform.moveThen([0, 0, SEPERATION_LENGTH], backTransform),
                target: this.backNode.render()
            });
        }

        return result;
    };

    module.exports = Flipper;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/GridLayout',['require','exports','module','famous/core/Entity','famous/core/RenderNode','famous/core/Transform','famous/core/ViewSequence','famous/core/EventHandler','famous/core/Modifier','famous/core/OptionsManager','famous/transitions/Transitionable','famous/transitions/TransitionableTransform'],function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var EventHandler = require('famous/core/EventHandler');
    var Modifier = require('famous/core/Modifier');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     * A layout which divides a context into several evenly-sized grid cells.
     *   If dimensions are provided, the grid is evenly subdivided with children
     *   cells representing their own context, otherwise the cellSize property is used to compute
     *   dimensions so that items of cellSize will fit.
     * @class GridLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Array.Number} [options.dimensions=[1, 1]] A two value array which specifies the amount of columns
     * and rows in your Gridlayout instance.
     * @param {Array.Number} [options.cellSize=[250, 250]]  A two-value array which specifies the width and height
     * of each cell in your Gridlayout instance.
     * @param {Transition} [options.transition=false] The transiton that controls the Gridlayout instance's reflow.
     */
    function GridLayout(options) {
        this.options = Object.create(GridLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._modifiers = [];
        this._states = [];
        this._contextSizeCache = [0, 0];
        this._dimensionsCache = [0, 0];
        this._activeCount = 0;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    function _reflow(size, cols, rows) {
        var usableSize = [size[0], size[1]];
        usableSize[0] -= this.options.gutterSize[0] * (cols - 1);
        usableSize[1] -= this.options.gutterSize[1] * (rows - 1);

        var rowSize = Math.round(usableSize[1] / rows);
        var colSize = Math.round(usableSize[0] / cols);

        var currY = 0;
        var currX;
        var currIndex = 0;
        for (var i = 0; i < rows; i++) {
            currX = 0;
            for (var j = 0; j < cols; j++) {
                if (this._modifiers[currIndex] === undefined) {
                    _createModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1);
                }
                else {
                    _animateModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1);
                }

                currIndex++;
                currX += colSize + this.options.gutterSize[0];
            }

            currY += rowSize + this.options.gutterSize[1];
        }

        this._dimensionsCache = [this.options.dimensions[0], this.options.dimensions[1]];
        this._contextSizeCache = [size[0], size[1]];

        this._activeCount = rows * cols;

        for (i = this._activeCount ; i < this._modifiers.length; i++) _animateModifier.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0], 0);

        this._eventOutput.emit('reflow');
    }

    function _createModifier(index, size, position, opacity) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.translate.apply(null, position)),
            opacity: new Transitionable(opacity),
            size: new Transitionable(size)
        };

        var modifier = new Modifier({
            transform: transitionItem.transform,
            opacity: transitionItem.opacity,
            size: transitionItem.size
        });

        this._states[index] = transitionItem;
        this._modifiers[index] = modifier;

    }

    function _animateModifier(index, size, position, opacity) {
        var currState = this._states[index];

        var currSize = currState.size;
        var currOpacity = currState.opacity;
        var currTransform = currState.transform;

        var transition = this.options.transition;

        currTransform.halt();
        currOpacity.halt();
        currSize.halt();

        currTransform.setTranslate(position, transition);
        currSize.set(size, transition);
        currOpacity.set(opacity, transition);
    }

    GridLayout.DEFAULT_OPTIONS = {
        dimensions: [1, 1],
        transition: false,
        gutterSize: [0, 0]
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    GridLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the GridLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the GridLayout instance.
     */
    GridLayout.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the Gridlayout instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous viewSequence.
     */
    GridLayout.prototype.sequenceFrom = function sequenceFrom(sequence) {
        if (sequence instanceof Array) sequence = new ViewSequence(sequence);
        this.sequence = sequence;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    GridLayout.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        var cols = this.options.dimensions[0];
        var rows = this.options.dimensions[1];

        if (size[0] !== this._contextSizeCache[0] || size[1] !== this._contextSizeCache[1] || cols !== this._dimensionsCache[0] || rows !== this._dimensionsCache[1]) {
            _reflow.call(this, size, cols, rows);
        }

        var sequence = this.sequence;
        var result = [];
        var currIndex = 0;
        while (sequence && (currIndex < this._modifiers.length)) {
            var item = sequence.get();
            var modifier = this._modifiers[currIndex];
            if (currIndex >= this._activeCount && this._states[currIndex].opacity.isActive()) {
                this._modifiers.splice(currIndex, 1);
                this._states.splice(currIndex, 1);
            }
            if (item) {
                result.push(
                    modifier.modify({
                        origin: origin,
                        target: item.render()
                    })
                );
            }
            sequence = sequence.getNext();
            currIndex++;
        }

        if (size) transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        };
    };

    module.exports = GridLayout;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/HeaderFooterLayout',['require','exports','module','famous/core/Entity','famous/core/RenderNode','famous/core/Transform','famous/core/OptionsManager'],function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * A layout which will arrange three renderables into a header and footer area of defined size,
      and a content area of flexible size.
     * @class HeaderFooterLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=HeaderFooterLayout.DIRECTION_Y] A direction of HeaderFooterLayout.DIRECTION_X
     * lays your HeaderFooterLayout instance horizontally, and a direction of HeaderFooterLayout.DIRECTION_Y
     * lays it out vertically.
     * @param {Number} [options.headerSize=undefined]  The amount of pixels allocated to the header node
     * in the HeaderFooterLayout instance's direction.
     * @param {Number} [options.footerSize=undefined] The amount of pixels allocated to the footer node
     * in the HeaderFooterLayout instance's direction.
     */
    function HeaderFooterLayout(options) {
        this.options = Object.create(HeaderFooterLayout.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._entityId = Entity.register(this);

        this.header = new RenderNode();
        this.footer = new RenderNode();
        this.content = new RenderNode();
    }

    /**
     *  When used as a value for your HeaderFooterLayout's direction option, causes it to lay out horizontally.
     *
     *  @attribute DIRECTION_X
     *  @type Number
     *  @static
     *  @default 0
     *  @protected
     */
    HeaderFooterLayout.DIRECTION_X = 0;

    /**
     *  When used as a value for your HeaderFooterLayout's direction option, causes it to lay out vertically.
     *
     *  @attribute DIRECTION_Y
     *  @type Number
     *  @static
     *  @default 1
     *  @protected
     */
    HeaderFooterLayout.DIRECTION_Y = 1;

    HeaderFooterLayout.DEFAULT_OPTIONS = {
        direction: HeaderFooterLayout.DIRECTION_Y,
        headerSize: undefined,
        footerSize: undefined,
        defaultHeaderSize: 0,
        defaultFooterSize: 0
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    HeaderFooterLayout.prototype.render = function render() {
        return this._entityId;
    };

    /**
     * Patches the HeaderFooterLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the HeaderFooterLayout instance.
     */
    HeaderFooterLayout.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    function _resolveNodeSize(node, defaultSize) {
        var nodeSize = node.getSize();
        return nodeSize ? nodeSize[this.options.direction] : defaultSize;
    }

    function _outputTransform(offset) {
        if (this.options.direction === HeaderFooterLayout.DIRECTION_X) return Transform.translate(offset, 0, 0);
        else return Transform.translate(0, offset, 0);
    }

    function _finalSize(directionSize, size) {
        if (this.options.direction === HeaderFooterLayout.DIRECTION_X) return [directionSize, size[1]];
        else return [size[0], directionSize];
    }

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    HeaderFooterLayout.prototype.commit = function commit(context) {
        var transform = context.transform;
        var origin = context.origin;
        var size = context.size;
        var opacity = context.opacity;

        var headerSize = (this.options.headerSize !== undefined) ? this.options.headerSize : _resolveNodeSize.call(this, this.header, this.options.defaultHeaderSize);
        var footerSize = (this.options.footerSize !== undefined) ? this.options.footerSize : _resolveNodeSize.call(this, this.footer, this.options.defaultFooterSize);
        var contentSize = size[this.options.direction] - headerSize - footerSize;

        if (size) transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);

        var result = [
            {
                size: _finalSize.call(this, headerSize, size),
                target: this.header.render()
            },
            {
                transform: _outputTransform.call(this, headerSize),
                size: _finalSize.call(this, contentSize, size),
                target: this.content.render()
            },
            {
                transform: _outputTransform.call(this, headerSize + contentSize),
                size: _finalSize.call(this, footerSize, size),
                target: this.footer.render()
            }
        ];

        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        };
    };

    module.exports = HeaderFooterLayout;
});

define('famous/views/Lightbox',['require','exports','module','famous/core/Transform','famous/core/Modifier','famous/core/RenderNode','famous/utilities/Utility','famous/core/OptionsManager','famous/transitions/Transitionable','famous/transitions/TransitionableTransform'],function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var RenderNode = require('famous/core/RenderNode');
    var Utility = require('famous/utilities/Utility');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     * Lightbox, using transitions, shows and hides different renderables. Lightbox can essentially be
     * thought of as RenderController with a stateful implementation and interface.
     *
     * @class Lightbox
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Transform} [options.inTransform] The transform at the start of transitioning in a shown renderable.
     * @param {Transform} [options.outTransform] The transform at the end of transitioning out a renderable.
     * @param {Transform} [options.showTransform] The transform applied to your shown renderable in its state of equilibrium.
     * @param {Number} [options.inOpacity] A number between one and zero that defines the state of a shown renderables opacity upon initially
     * being transitioned in.
     * @param {Number} [options.outOpacity] A number between one and zero that defines the state of a shown renderables opacity upon being
     * fully transitioned out.
     * @param {Number} [options.showOpacity] A number between one and zero that defines the state of a shown renderables opacity
     * once succesfully transitioned in.
     * @param {Array<Number>} [options.inOrigin] A two value array of numbers between one and zero that defines the state of a shown renderables
     * origin upon intially being transitioned in.
     * @param {Array<Number>} [options.outOrigin] A two value array of numbers between one and zero that defines the state of a shown renderable
     * once fully hidden.
     * @param {Array<Number>} [options.showOrigin] A two value array of numbers between one and zero that defines the state of a shown renderables
     * origin upon succesfully being shown.
     * @param {Transition} [options.inTransition=true] The transition in charge of showing a renderable.
     * @param {Transition} [options.outTransition=true]  The transition in charge of removing your previous renderable when
     * you show a new one, or hiding your current renderable.
     * @param {Boolean} [options.overlap=false] When showing a new renderable, overlap determines if the
     *   out transition of the old one executes concurrently with the in transition of the new one,
      *  or synchronously beforehand.
     */
    function Lightbox(options) {
        this.options = Object.create(Lightbox.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this._showing = false;
        this.nodes = [];
        this.transforms = [];
        this.states = [];
    }

    Lightbox.DEFAULT_OPTIONS = {
        inTransform: Transform.scale(0.001, 0.001, 0.001),
        inOpacity: 0,
        inOrigin: [0.5, 0.5],
        outTransform: Transform.scale(0.001, 0.001, 0.001),
        outOpacity: 0,
        outOrigin: [0.5, 0.5],
        showTransform: Transform.identity,
        showOpacity: 1,
        showOrigin: [0.5, 0.5],
        inTransition: true,
        outTransition: true,
        overlap: false
    };

    /**
     * Patches the Lightbox instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Lightbox instance.
     */
    Lightbox.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

   /**
     * Show displays the targeted renderable with a transition and an optional callback to
     *  execute afterwards.
     * @method show
     * @param {Object} renderable The renderable you want to show.
     * @param {Transition} [transition] Overwrites the default transition in to display the
     * passed-in renderable.
     * @param {function} [callback] Executes after transitioning in the renderable.
     */
    Lightbox.prototype.show = function show(renderable, transition, callback) {
        if (!renderable) {
            return this.hide(callback);
        }

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        if (this._showing) {
            if (this.options.overlap) this.hide();
            else {
                return this.hide(this.show.bind(this, renderable, transition, callback));
            }
        }
        this._showing = true;

        var stateItem = {
            transform: new TransitionableTransform(this.options.inTransform),
            origin: new Transitionable(this.options.inOrigin),
            opacity: new Transitionable(this.options.inOpacity)
        };

        var transform = new Modifier({
            transform: stateItem.transform,
            opacity: stateItem.opacity,
            origin: stateItem.origin
        });
        var node = new RenderNode();
        node.add(transform).add(renderable);
        this.nodes.push(node);
        this.states.push(stateItem);
        this.transforms.push(transform);

        var _cb = callback ? Utility.after(3, callback) : undefined;

        if (!transition) transition = this.options.inTransition;
        stateItem.transform.set(this.options.showTransform, transition, _cb);
        stateItem.opacity.set(this.options.showOpacity, transition, _cb);
        stateItem.origin.set(this.options.showOrigin, transition, _cb);
    };

    /**
     * Hide hides the currently displayed renderable with an out transition.
     * @method hide
     * @param {Transition} [transition] Overwrites the default transition in to hide the
     * currently controlled renderable.
     * @param {function} [callback] Executes after transitioning out the renderable.
     */
    Lightbox.prototype.hide = function hide(transition, callback) {
        if (!this._showing) return;
        this._showing = false;

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        var node = this.nodes[this.nodes.length - 1];
        var transform = this.transforms[this.transforms.length - 1];
        var stateItem = this.states[this.states.length - 1];
        var _cb = Utility.after(3, function() {
            this.nodes.splice(this.nodes.indexOf(node), 1);
            this.states.splice(this.states.indexOf(stateItem), 1);
            this.transforms.splice(this.transforms.indexOf(transform), 1);
            if (callback) callback.call(this);
        }.bind(this));

        if (!transition) transition = this.options.outTransition;
        stateItem.transform.set(this.options.outTransform, transition, _cb);
        stateItem.opacity.set(this.options.outOpacity, transition, _cb);
        stateItem.origin.set(this.options.outOrigin, transition, _cb);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Lightbox.prototype.render = function render() {
        var result = [];
        for (var i = 0; i < this.nodes.length; i++) {
            result.push(this.nodes[i].render());
        }
        return result;
    };

    module.exports = Lightbox;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/Drag',['require','exports','module','./Force'],function(require, exports, module) {
    var Force = require('./Force');

    /**
     * Drag is a force that opposes velocity. Attach it to the physics engine
     * to slow down a physics body in motion.
     *
     * @class Drag
     * @constructor
     * @extends Force
     * @param {Object} options options to set on drag
     */
    function Drag(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        Force.call(this);
    }

    Drag.prototype = Object.create(Force.prototype);
    Drag.prototype.constructor = Drag;

    /**
     * @property Drag.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    Drag.FORCE_FUNCTIONS = {

        /**
         * A drag force proportional to the velocity
         * @attribute LINEAR
         * @type Function
         * @param {Vector} velocity
         * @return {Vector} drag force
         */
        LINEAR : function(velocity) {
            return velocity;
        },

        /**
         * A drag force proportional to the square of the velocity
         * @attribute QUADRATIC
         * @type Function
         * @param {Vector} velocity
         * @return {Vector} drag force
         */
        QUADRATIC : function(velocity) {
            return velocity.mult(velocity.norm());
        }
    };

    /**
     * @property Drag.DEFAULT_OPTIONS
     * @type Object
     * @protected
     * @static
     */
    Drag.DEFAULT_OPTIONS = {

        /**
         * The strength of the force
         *    Range : [0, 0.1]
         * @attribute strength
         * @type Number
         * @default 0.01
         */
        strength : 0.01,

        /**
         * The type of opposing force
         * @attribute forceFunction
         * @type Function
         */
        forceFunction : Drag.FORCE_FUNCTIONS.LINEAR
    };

    /**
     * Adds a drag force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply drag force to.
     */
    Drag.prototype.applyForce = function applyForce(targets) {
        var strength        = this.options.strength;
        var forceFunction   = this.options.forceFunction;
        var force           = this.force;
        for (var index = 0; index < targets.length; index++) {
            var particle = targets[index];
            forceFunction(particle.velocity).mult(-strength).put(force);
            particle.applyForce(force);
        }
    };

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param {Objects} options
     */
    Drag.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    module.exports = Drag;
});

define('famous/views/Scroller',['require','exports','module','famous/core/Entity','famous/core/Group','famous/core/OptionsManager','famous/core/Transform','famous/utilities/Utility','famous/core/ViewSequence','famous/core/EventHandler'],function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var Group = require('famous/core/Group');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transform = require('famous/core/Transform');
    var Utility = require('famous/utilities/Utility');
    var ViewSequence = require('famous/core/ViewSequence');
    var EventHandler = require('famous/core/EventHandler');

    /**
     * Scroller lays out a collection of renderables, and will browse through them based on
     * accessed position. Scroller also broadcasts an 'edgeHit' event, with a position property of the location of the edge,
     * when you've hit the 'edges' of it's renderable collection.
     * @class Scroller
     * @constructor
      * @event error
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scroller instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scroller will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scroller will process renderables' associated calculations in.
     */
    function Scroller(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this._optionsManager.setOptions(options);

        this._node = null;
        this._position = 0;

        // used for shifting nodes
        this._positionOffset = 0;

        this._positionGetter = null;
        this._outputFunction = null;
        this._masterOutputFunction = null;
        this.outputFrom();

        this._onEdge = 0; // -1 for top, 1 for bottom

        this.group = new Group();
        this.group.add({render: _innerRender.bind(this)});

        this._entityId = Entity.register(this);
        this._size = [undefined, undefined];
        this._contextSize = [undefined, undefined];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Scroller.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        margin: 0,
        clipSize: undefined,
        groupScroll: false
    };

    function _sizeForDir(size) {
        if (!size) size = this._contextSize;
        var dimension = (this.options.direction === Utility.Direction.X) ? 0 : 1;
        return (size[dimension] === undefined) ? this._contextSize[dimension] : size[dimension];
    }

    function _output(node, offset, target) {
        var size = node.getSize ? node.getSize() : this._contextSize;
        var transform = this._outputFunction(offset);
        target.push({transform: transform, target: node.render()});
        return _sizeForDir.call(this, size);
    }

    function _getClipSize() {
        if (this.options.clipSize) return this.options.clipSize;
        else return _sizeForDir.call(this, this._contextSize);
    }

    /**
     * Patches the Scroller instance's options with the passed-in ones.
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scroller instance.
     */
    Scroller.prototype.setOptions = function setOptions(options) {
        this._optionsManager.setOptions(options);

        if (this.options.groupScroll) {
          this.group.pipe(this._eventOutput);
        }
        else {
          this.group.unpipe(this._eventOutput);
        }
    };

    /**
     * Tells you if the Scroller instance is on an edge.
     * @method onEdge
     * @return {Boolean} Whether the Scroller instance is on an edge or not.
     */
    Scroller.prototype.onEdge = function onEdge() {
        return this._onEdge;
    };

    /**
     * Allows you to overwrite the way Scroller lays out it's renderables. Scroller will
     * pass an offset into the function. By default the Scroller instance just translates each node
     * in it's direction by the passed-in offset.
     * Scroller will translate each renderable down
     * @method outputFrom
     * @param {Function} fn A function that takes an offset and returns a transform.
     * @param {Function} [masterFn]
     */
    Scroller.prototype.outputFrom = function outputFrom(fn, masterFn) {
        if (!fn) {
            fn = function(offset) {
                return (this.options.direction === Utility.Direction.X) ? Transform.translate(offset, 0) : Transform.translate(0, offset);
            }.bind(this);
            if (!masterFn) masterFn = fn;
        }
        this._outputFunction = fn;
        this._masterOutputFunction = masterFn ? masterFn : function(offset) {
            return Transform.inverse(fn(-offset));
        };
    };

    /**
     * The Scroller instance's method for reading from an external position. Scroller uses
     * the external position to actually scroll through it's renderables.
     * @method positionFrom
     * @param {Getter} position Can be either a function that returns a position,
     * or an object with a get method that returns a position.
     */
    Scroller.prototype.positionFrom = function positionFrom(position) {
        if (position instanceof Function) this._positionGetter = position;
        else if (position && position.get) this._positionGetter = position.get.bind(position);
        else {
            this._positionGetter = null;
            this._position = position;
        }
        if (this._positionGetter) this._position = this._positionGetter.call(this);
    };

    /**
     * Sets the collection of renderables under the Scroller instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} items Either an array of renderables or a Famous viewSequence.
     * @chainable
     */
    Scroller.prototype.sequenceFrom = function sequenceFrom(node) {
        if (node instanceof Array) node = new ViewSequence({array: node});
        this._node = node;
        this._positionOffset = 0;
    };

    /**
     * Returns the width and the height of the Scroller instance.
     *
     * @method getSize
     * @return {Array} A two value array of the Scroller instance's current width and height (in that order).
     */
    Scroller.prototype.getSize = function getSize(actual) {
        return actual ? this._contextSize : this._size;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scroller.prototype.render = function render() {
        if (!this._node) return null;
        if (this._positionGetter) this._position = this._positionGetter.call(this);
        return this._entityId;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Scroller.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        // reset edge detection on size change
        if (!this.options.clipSize && (size[0] !== this._contextSize[0] || size[1] !== this._contextSize[1])) {
            this._onEdge = 0;
            this._contextSize[0] = size[0];
            this._contextSize[1] = size[1];

            if (this.options.direction === Utility.Direction.X) {
                this._size[0] = _getClipSize.call(this);
                this._size[1] = undefined;
            }
            else {
                this._size[0] = undefined;
                this._size[1] = _getClipSize.call(this);
            }
        }

        var scrollTransform = this._masterOutputFunction(-this._position);

        return {
            transform: Transform.multiply(transform, scrollTransform),
            size: size,
            opacity: opacity,
            origin: origin,
            target: this.group.render()
        };
    };

    function _normalizeState() {
        var nodeSize = _sizeForDir.call(this, this._node.getSize());
        var nextNode = this._node && this._node.getNext ? this._node.getNext() : null;
        while (nextNode && this._position + this._positionOffset >= nodeSize) {
            this._positionOffset -= nodeSize;
            this._node = nextNode;
            nodeSize = _sizeForDir.call(this, this._node.getSize());
            nextNode = this._node && this._node.getNext ? this._node.getNext() : null;
        }
        var prevNode = this._node && this._node.getPrevious ? this._node.getPrevious() : null;
        while (prevNode && this._position + this._positionOffset < 0) {
            var prevNodeSize = _sizeForDir.call(this, prevNode.getSize());
            this._positionOffset += prevNodeSize;
            this._node = prevNode;
            prevNode = this._node && this._node.getPrevious ? this._node.getPrevious() : null;
        }
    }

    function _innerRender() {
        var size = null;
        var position = this._position;
        var result = [];

        this._onEdge = 0;

        var offset = -this._positionOffset;
        var clipSize = _getClipSize.call(this);
        var currNode = this._node;
        while (currNode && offset - position < clipSize + this.options.margin) {
            offset += _output.call(this, currNode, offset, result);
            currNode = currNode.getNext ? currNode.getNext() : null;
        }

        var sizeNode = this._node;
        var nodesSize = _sizeForDir.call(this, sizeNode.getSize());
        if (offset < clipSize) {
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getPrevious();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize());
            }
            sizeNode = this._node;
            while (sizeNode && nodesSize < clipSize) {
                sizeNode = sizeNode.getNext();
                if (sizeNode) nodesSize += _sizeForDir.call(this, sizeNode.getSize());
            }
        }

        var edgeSize = (nodesSize !== undefined && nodesSize < clipSize) ? nodesSize : clipSize;

        if (!currNode && offset - position <= edgeSize) {
            this._onEdge = 1;
            this._eventOutput.emit('edgeHit', {
                position: offset - edgeSize
            });
        }
        else if (!this._node.getPrevious() && position <= 0) {
            this._onEdge = -1;
            this._eventOutput.emit('edgeHit', {
                position: 0
            });
        }

        // backwards
        currNode = (this._node && this._node.getPrevious) ? this._node.getPrevious() : null;
        offset = -this._positionOffset;
        if (currNode) {
            size = currNode.getSize ? currNode.getSize() : this._contextSize;
            offset -= _sizeForDir.call(this, size);
        }

        while (currNode && ((offset - position) > -(_getClipSize.call(this) + this.options.margin))) {
            _output.call(this, currNode, offset, result);
            currNode = currNode.getPrevious ? currNode.getPrevious() : null;
            if (currNode) {
                size = currNode.getSize ? currNode.getSize() : this._contextSize;
                offset -= _sizeForDir.call(this, size);
            }
        }

        _normalizeState.call(this);
        return result;
    }

    module.exports = Scroller;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/Scrollview',['require','exports','module','famous/physics/PhysicsEngine','famous/physics/bodies/Particle','famous/physics/forces/Drag','famous/physics/forces/Spring','famous/core/EventHandler','famous/core/OptionsManager','famous/core/ViewSequence','famous/views/Scroller','famous/utilities/Utility','famous/inputs/GenericSync','famous/inputs/ScrollSync','famous/inputs/TouchSync'],function(require, exports, module) {
    var PhysicsEngine = require('famous/physics/PhysicsEngine');
    var Particle = require('famous/physics/bodies/Particle');
    var Drag = require('famous/physics/forces/Drag');
    var Spring = require('famous/physics/forces/Spring');

    var EventHandler = require('famous/core/EventHandler');
    var OptionsManager = require('famous/core/OptionsManager');
    var ViewSequence = require('famous/core/ViewSequence');
    var Scroller = require('famous/views/Scroller');
    var Utility = require('famous/utilities/Utility');

    var GenericSync = require('famous/inputs/GenericSync');
    var ScrollSync = require('famous/inputs/ScrollSync');
    var TouchSync = require('famous/inputs/TouchSync');
    GenericSync.register({scroll : ScrollSync, touch : TouchSync});

    /**
     * Scrollview will lay out a collection of renderables sequentially in the specified direction, and will
     * allow you to scroll through them with mousewheel or touch events.
     * @class Scrollview
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scrollview instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Boolean} [options.rails=true] When true, Scrollview's genericSync will only process input in it's primary access.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scrollview will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scrollview will process renderables' associated calculations in.
     * @param {Number} [friction=0.001] Input resistance proportional to the velocity of the input.
     * Controls the feel of the Scrollview instance at low velocities.
     * @param {Number} [drag=0.0001] Input resistance proportional to the square of the velocity of the input.
     * Affects Scrollview instance more prominently at high velocities.
     * @param {Number} [edgeGrip=0.5] A coefficient for resistance against after-touch momentum.
     * @param {Number} [egePeriod=300] Sets the period on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Number} [edgeDamp=1] Sets the damping on the spring that handles the physics associated
     * with hitting the end of a scrollview.
     * @param {Boolean} [paginated=false] A paginated scrollview will scroll through items discretely
     * rather than continously.
     * @param {Number} [pagePeriod=500] Sets the period on the spring that handles the physics associated
     * with pagination.
     * @param {Number} [pageDamp=0.8] Sets the damping on the spring that handles the physics associated
     * with pagination.
     * @param {Number} [pageStopSpeed=Infinity] The threshold for determining the amount of velocity
     * required to trigger pagination. The lower the threshold, the easier it is to scroll continuosly.
     * @param {Number} [pageSwitchSpeed=1] The threshold for momentum-based velocity pagination.
     * @param {Number} [speedLimit=10] The highest scrolling speed you can reach.
     */
    function Scrollview(options) {
        this.options = Object.create(Scrollview.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        this._node = null;

        this._physicsEngine = new PhysicsEngine();
        this._particle = new Particle();
        this._physicsEngine.addBody(this._particle);

        this.spring = new Spring({anchor: [0, 0, 0]});

        this.drag = new Drag({forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC});
        this.friction = new Drag({forceFunction: Drag.FORCE_FUNCTIONS.LINEAR});

        this.sync = new GenericSync(['scroll', 'touch'], {direction : this.options.direction});

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        this._eventInput.pipe(this.sync);
        this.sync.pipe(this._eventInput);

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._touchCount = 0;
        this._springState = 0;
        this._onEdge = 0; // -1 for top, 1 for bottom
        this._pageSpringPosition = 0;
        this._edgeSpringPosition = 0;
        this._touchVelocity = undefined;
        this._earlyEnd = false;
        this._needsPaginationCheck = false;

        this._scroller = new Scroller();
        this._scroller.positionFrom(this.getPosition.bind(this));

        this.setOptions(options);

        _bindEvents.call(this);
    }

    /** @const */
    var TOLERANCE = 0.5;

    Scrollview.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        rails: true,
        friction: 0.001,
        drag: 0.0001,
        edgeGrip: 0.5,
        edgePeriod: 300,
        edgeDamp: 1,
        margin: 1000,       // mostly safe
        paginated: false,
        pagePeriod: 500,
        pageDamp: 0.8,
        pageStopSpeed: 10,
        pageSwitchSpeed: 0.5,
        speedLimit: 10,
        groupScroll: false
    };

    /** @enum */
    var SpringStates = {
        NONE: 0,
        EDGE: 1,
        PAGE: 2
    };

    function _handleStart(event) {
        this._touchCount = event.count;
        if (event.count === undefined) this._touchCount = 1;

        _detachAgents.call(this);
        this.setVelocity(0);
        this._touchVelocity = 0;
        this._earlyEnd = false;
    }

    function _handleMove(event) {
        var velocity = -event.velocity;
        var delta = -event.delta;

        if (this._onEdge && event.slip) {
            if ((velocity < 0 && this._onEdge < 0) || (velocity > 0 && this._onEdge > 0)) {
                if (!this._earlyEnd) {
                    _handleEnd.call(this, event);
                    this._earlyEnd = true;
                }
            }
            else if (this._earlyEnd && (Math.abs(velocity) > Math.abs(this.getVelocity()))) {
                _handleStart.call(this, event);
            }
        }
        if (this._earlyEnd) return;
        this._touchVelocity = velocity;

        if (event.slip) this.setVelocity(velocity);
        else this.setPosition(this.getPosition() + delta);
    }

    function _handleEnd(event) {
        this._touchCount = event.count || 0;
        if (!this._touchCount) {
            _detachAgents.call(this);
            if (this._onEdge) _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
            _attachAgents.call(this);
            var velocity = -event.velocity;
            var speedLimit = this.options.speedLimit;
            if (event.slip) speedLimit *= this.options.edgeGrip;
            if (velocity < -speedLimit) velocity = -speedLimit;
            else if (velocity > speedLimit) velocity = speedLimit;
            this.setVelocity(velocity);
            this._touchVelocity = undefined;
            this._needsPaginationCheck = true;
        }
    }

    function _bindEvents() {
        this._eventInput.bindThis(this);
        this._eventInput.on('start', _handleStart);
        this._eventInput.on('update', _handleMove);
        this._eventInput.on('end', _handleEnd);

        this._scroller.on('edgeHit', function(data) {
            this._edgeSpringPosition = data.position;
        }.bind(this));
    }

    function _attachAgents() {
        if (this._springState) this._physicsEngine.attach([this.spring], this._particle);
        else this._physicsEngine.attach([this.drag, this.friction], this._particle);
    }

    function _detachAgents() {
        this._springState = SpringStates.NONE;
        this._physicsEngine.detachAll();
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction;
        var nodeSize = (node.getSize() || this._scroller.getSize())[direction];
        if (!nodeSize) nodeSize = this._scroller.getSize()[direction];
        return nodeSize;
    }

    function _handleEdge(edgeDetected) {
        if (!this._onEdge && edgeDetected) {
            this.sync.setOptions({scale: this.options.edgeGrip});
            if (!this._touchCount && this._springState !== SpringStates.EDGE) {
                _setSpring.call(this, this._edgeSpringPosition, SpringStates.EDGE);
            }
        }
        else if (this._onEdge && !edgeDetected) {
            this.sync.setOptions({scale: 1});
            if (this._springState && Math.abs(this.getVelocity()) < 0.001) {
                // reset agents, detaching the spring
                _detachAgents.call(this);
                _attachAgents.call(this);
            }
        }
        this._onEdge = edgeDetected;
    }

    function _handlePagination() {
        if (!this._needsPaginationCheck) return;

        if (this._touchCount) return;
        if (this._springState === SpringStates.EDGE) return;

        var velocity = this.getVelocity();
        if (Math.abs(velocity) >= this.options.pageStopSpeed) return;

        var position = this.getPosition();
        var velocitySwitch = Math.abs(velocity) > this.options.pageSwitchSpeed;

        // parameters to determine when to switch
        var nodeSize = _nodeSizeForDirection.call(this, this._node);
        var positionNext = position > 0.5 * nodeSize;
        var velocityNext = velocity > 0;

        if ((positionNext && !velocitySwitch) || (velocitySwitch && velocityNext)) this.goToNextPage();
        else _setSpring.call(this, 0, SpringStates.PAGE);

        this._needsPaginationCheck = false;
    }

    function _setSpring(position, springState) {
        var springOptions;
        if (springState === SpringStates.EDGE) {
            this._edgeSpringPosition = position;
            springOptions = {
                anchor: [this._edgeSpringPosition, 0, 0],
                period: this.options.edgePeriod,
                dampingRatio: this.options.edgeDamp
            };
        }
        else if (springState === SpringStates.PAGE) {
            this._pageSpringPosition = position;
            springOptions = {
                anchor: [this._pageSpringPosition, 0, 0],
                period: this.options.pagePeriod,
                dampingRatio: this.options.pageDamp
            };
        }

        this.spring.setOptions(springOptions);
        if (springState && !this._springState) {
            _detachAgents.call(this);
            this._springState = springState;
            _attachAgents.call(this);
        }
        this._springState = springState;
    }

    function _normalizeState() {
        var position = this.getPosition();
        var nodeSize = _nodeSizeForDirection.call(this, this._node);
        var nextNode = this._node.getNext();

        while (position > nodeSize + TOLERANCE && nextNode) {
            _shiftOrigin.call(this, -nodeSize);
            position -= nodeSize;
            this._scroller.sequenceFrom(nextNode);
            this._node = nextNode;
            nextNode = this._node.getNext();
            nodeSize = _nodeSizeForDirection.call(this, this._node);
        }

        var previousNode = this._node.getPrevious();
        var previousNodeSize;

        while (position < -TOLERANCE && previousNode) {
            previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode);
            this._node = previousNode;
            _shiftOrigin.call(this, previousNodeSize);
            position += previousNodeSize;
            previousNode = this._node.getPrevious();
        }
    }

    function _shiftOrigin(amount) {
        this._edgeSpringPosition += amount;
        this._pageSpringPosition += amount;
        this.setPosition(this.getPosition() + amount);
        if (this._springState === SpringStates.EDGE) {
            this.spring.setOptions({anchor: [this._edgeSpringPosition, 0, 0]});
        }
        else if (this._springState === SpringStates.PAGE) {
            this.spring.setOptions({anchor: [this._pageSpringPosition, 0, 0]});
        }
    }

    Scrollview.prototype.outputFrom = function outputFrom() {
        return this._scroller.outputFrom.apply(this._scroller, arguments);
    };

    /**
     * Returns the position associated with the Scrollview instance's current node
     *  (generally the node currently at the top).
     * @method getPosition
     * @param {number} [node] If specified, returns the position of the node at that index in the
     * Scrollview instance's currently managed collection.
     * @return {number} The position of either the specified node, or the Scrollview's current Node,
     * in pixels translated.
     */
    Scrollview.prototype.getPosition = function getPosition() {
        return this._particle.getPosition1D();
    };

    /**
     * Sets position of the physics particle that controls Scrollview instance's "position"
     * @method setPosition
     * @param {number} x The amount of pixels you want your scrollview to progress by.
     */
    Scrollview.prototype.setPosition = function setPosition(x) {
        this._particle.setPosition1D(x);
    };

    /**
     * Returns the Scrollview instance's velocity.
     * @method getVelocity
     * @return {Number} The velocity.
     */

    Scrollview.prototype.getVelocity = function getVelocity() {
        return this._touchCount ? this._touchVelocity : this._particle.getVelocity1D();
    };

    /**
     * Sets the Scrollview instance's velocity. Until affected by input or another call of setVelocity
     *  the Scrollview instance will scroll at the passed-in velocity.
     * @method setVelocity
     * @param {number} v The magnitude of the velocity.
     */
    Scrollview.prototype.setVelocity = function setVelocity(v) {
        this._particle.setVelocity1D(v);
    };

    /**
     * Patches the Scrollview instance's options with the passed-in ones.
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scrollview instance.
     */
    Scrollview.prototype.setOptions = function setOptions(options) {
        if (options) {
            if (options.direction !== undefined) {
                if (options.direction === 'x') options.direction = Utility.Direction.X;
                else if (options.direction === 'y') options.direction = Utility.Direction.Y;
            }

            this._scroller.setOptions(options);
            this._optionsManager.setOptions(options);
        }

        this._scroller.setOptions(this.options);
        if (this.options.groupScroll)
            this._scroller.pipe(this._eventInput);
        else
            this._scroller.unpipe(this._eventInput);

        this.drag.setOptions({strength: this.options.drag});
        this.friction.setOptions({strength: this.options.friction});

        this.spring.setOptions({
            period: this.options.edgePeriod,
            dampingRatio: this.options.edgeDamp
        });

        this.sync.setOptions({
            rails: this.options.rails,
            direction: (this.options.direction === Utility.Direction.X) ? GenericSync.DIRECTION_X : GenericSync.DIRECTION_Y
        });
    };

    /**
     * goToPreviousPage paginates your Scrollview instance backwards by one item.
     * @method goToPreviousPage
     * @return {ViewSequence} The previous node.
     */
    Scrollview.prototype.goToPreviousPage = function goToPreviousPage() {
        if (!this._node) return null;
        var previousNode = this._node.getPrevious();
        if (previousNode) {
            var currentPosition = this.getPosition();
            var previousNodeSize = _nodeSizeForDirection.call(this, previousNode);
            this._scroller.sequenceFrom(previousNode);
            this._node = previousNode;
            var previousSpringPosition = (currentPosition < TOLERANCE) ? -previousNodeSize : 0;
            _setSpring.call(this, previousSpringPosition, SpringStates.PAGE);
            _shiftOrigin.call(this, previousNodeSize);
        }
        this._eventOutput.emit('pageChange', {direction: -1});
        return previousNode;
    };

    /**
     * goToNextPage paginates your Scrollview instance forwards by one item.
     * @method goToNextPage
     * @return {ViewSequence} The next node.
     */
    Scrollview.prototype.goToNextPage = function goToNextPage() {
        if (!this._node) return null;
        var nextNode = this._node.getNext();
        if (nextNode) {
            var currentPosition = this.getPosition();
            var currentNodeSize = _nodeSizeForDirection.call(this, this._node);
            var nextNodeSize = _nodeSizeForDirection.call(this, nextNode);
            this._scroller.sequenceFrom(nextNode);
            this._node = nextNode;
            var nextSpringPosition = (currentPosition > currentNodeSize - TOLERANCE) ? currentNodeSize + nextNodeSize : currentNodeSize;
            _setSpring.call(this, nextSpringPosition, SpringStates.PAGE);
            _shiftOrigin.call(this, -currentNodeSize);
        }
        this._eventOutput.emit('pageChange', {direction: 1});
        return nextNode;
    };

    /**
     * Sets the collection of renderables under the Scrollview instance's control, by
     *  setting its current node to the passed in ViewSequence. If you
     *  pass in an array, the Scrollview instance will set its node as a ViewSequence instantiated with
     *  the passed-in array.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} node Either an array of renderables or a Famous viewSequence.
     */
    Scrollview.prototype.sequenceFrom = function sequenceFrom(node) {
        if (node instanceof Array) node = new ViewSequence({array: node});
        this._node = node;
        return this._scroller.sequenceFrom(node);
    };

    /**
     * Returns the width and the height of the Scrollview instance.
     *
     * @method getSize
     * @return {Array} A two value array of the Scrollview instance's current width and height (in that order).
     */
    Scrollview.prototype.getSize = function getSize() {
        return this._scroller.getSize.apply(this._scroller, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scrollview.prototype.render = function render() {
        if (!this._node) return null;

        _normalizeState.call(this);
        _handleEdge.call(this, this._scroller.onEdge());
        if (this.options.paginated) _handlePagination.call(this);

        return this._scroller.render();
    };

    module.exports = Scrollview;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/views/ScrollContainer',['require','exports','module','famous/surfaces/ContainerSurface','famous/core/EventHandler','./Scrollview','famous/utilities/Utility','famous/core/OptionsManager'],function(require, exports, module) {
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var EventHandler = require('famous/core/EventHandler');
    var Scrollview = require('./Scrollview');
    var Utility = require('famous/utilities/Utility');
    var OptionsManager = require('famous/core/OptionsManager');

    /**
     * A Container surface with a scrollview automatically added. The convenience of ScrollContainer lies in
     * being able to clip out portions of the associated scrollview that lie outside the bounding surface,
     * and in being able to move the scrollview more easily by applying modifiers to the parent container
     * surface.
     * @class ScrollContainer
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Options} [options.container=undefined] Options for the ScrollContainer instance's surface.
     * @param {Options} [options.scrollview={direction:Utility.Direction.X}]  Options for the ScrollContainer instance's scrollview.
     */
    function ScrollContainer(options) {
        this.options = Object.create(ScrollContainer.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this.container = new ContainerSurface(this.options.container);
        this.scrollview = new Scrollview(this.options.scrollview);

        this.container.add(this.scrollview);

        EventHandler.setInputHandler(this, this.scrollview);
        EventHandler.setOutputHandler(this, this.scrollview);
        this.scrollview.subscribe(this.container);
    }

    ScrollContainer.DEFAULT_OPTIONS = {
        container: {
            properties: {overflow : 'hidden'}
        },
        scrollview: {direction: Utility.Direction.X}
    };

    /**
     * Patches the ScrollContainer instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the ScrollContainer instance.
     */
    ScrollContainer.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the ScrollContainer instance scrollview's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous ViewSequence.
     */
    ScrollContainer.prototype.sequenceFrom = function sequenceFrom() {
        return this.scrollview.sequenceFrom.apply(this.scrollview, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    ScrollContainer.prototype.render = function render() {
        return this.container.render.apply(this.container, arguments);
    };

    module.exports = ScrollContainer;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/widgets/NavigationBar',['require','exports','module','famous/core/Scene','famous/core/Surface','famous/core/Transform','famous/core/View'],function(require, exports, module) {
    var Scene = require('famous/core/Scene');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    /**
     * A view for displaying the title of the current page
     *  as well as icons for navigating backwards and opening
     *  further options
     *
     * @class NavigationBar
     * @extends View
     * @constructor
     *
     * @param {object} [options] overrides of default options
     * @param {Array.number} [options.size=(undefined,0.5)] Size of the navigation bar and it's componenets.
     * @param {Array.string} [options.backClasses=(back)] CSS Classes attached to back of Navigation.
     * @param {String} [options.backContent=(&#x25c0;)] Content of the back button.
     * @param {Array.string} [options.classes=(navigation)] CSS Classes attached to the surfaces.
     * @param {String} [options.content] Content to pass into title bar.
     * @param {Array.string} [options.classes=(more)] CSS Classes attached to the More surface.
     * @param {String} [options.moreContent=(&#x271a;)] Content of the more button.
     */
    function NavigationBar(options) {
        View.apply(this, arguments);

        this.title = new Surface({
            classes: this.options.classes,
            content: this.options.content
        });

        this.back = new Surface({
            size: [this.options.size[1], this.options.size[1]],
            classes: this.options.classes,
            content: this.options.backContent
        });
        this.back.on('click', function() {
            this._eventOutput.emit('back', {});
        }.bind(this));

        this.more = new Surface({
            size: [this.options.size[1], this.options.size[1]],
            classes: this.options.classes,
            content: this.options.moreContent
        });
        this.more.on('click', function() {
            this._eventOutput.emit('more', {});
        }.bind(this));

        this.layout = new Scene({
            id: 'master',
            size: this.options.size,
            target: [
                {
                    transform: Transform.inFront,
                    origin: [0, 0.5],
                    target: this.back
                },
                {
                    origin: [0.5, 0.5],
                    target: this.title
                },
                {
                    transform: Transform.inFront,
                    origin: [1, 0.5],
                    target: this.more
                }
            ]
        });

        this._add(this.layout);

        this._optionsManager.on('change', function(event) {
            var key = event.id;
            var data = event.value;
            if (key === 'size') {
                this.layout.id.master.setSize(data);
                this.title.setSize(data);
                this.back.setSize([data[1], data[1]]);
                this.more.setSize([data[1], data[1]]);
            }
            else if (key === 'backClasses') {
                this.back.setOptions({classes: this.options.classes.concat(this.options.backClasses)});
            }
            else if (key === 'backContent') {
                this.back.setContent(this.options.backContent);
            }
            else if (key === 'classes') {
                this.title.setOptions({classes: this.options.classes});
                this.back.setOptions({classes: this.options.classes.concat(this.options.backClasses)});
                this.more.setOptions({classes: this.options.classes.concat(this.options.moreClasses)});
            }
            else if (key === 'content') {
                this.setContent(this.options.content);
            }
            else if (key === 'moreClasses') {
                this.more.setOptions({classes: this.options.classes.concat(this.options.moreClasses)});
            }
            else if (key === 'moreContent') {
                this.more.setContent(this.options.content);
            }
        }.bind(this));
    }

    NavigationBar.prototype = Object.create(View.prototype);
    NavigationBar.prototype.constructor = NavigationBar;

    NavigationBar.DEFAULT_OPTIONS = {
        size: [undefined, 50],
        backClasses: ['back'],
        backContent: '&#x25c0;',
        classes: ['navigation'],
        content: '',
        moreClasses: ['more'],
        moreContent: '&#x271a;'
    };

    /**
     * Set the title of the NavigationBar
     *
     * @method setContent
     *
     * @param {object} content JSON object containing title information
     *
     * @return {undefined}
     */
    NavigationBar.prototype.setContent = function setContent(content) {
        return this.title.setContent(content);
    };

    module.exports = NavigationBar;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/widgets/Slider',['require','exports','module','famous/core/Surface','famous/surfaces/CanvasSurface','famous/core/Transform','famous/core/EventHandler','famous/math/Utilities','famous/core/OptionsManager','famous/inputs/MouseSync','famous/inputs/TouchSync','famous/inputs/GenericSync'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var CanvasSurface = require('famous/surfaces/CanvasSurface');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');
    var Utilities = require('famous/math/Utilities');
    var OptionsManager = require('famous/core/OptionsManager');

    var MouseSync = require('famous/inputs/MouseSync');
    var TouchSync = require('famous/inputs/TouchSync');
    var GenericSync = require('famous/inputs/GenericSync');

    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync
    });

    /** @constructor */
    function Slider(options) {
        this.options = Object.create(Slider.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.indicator = new CanvasSurface({
            size: this.options.indicatorSize,
            classes : ['slider-back']
        });

        this.label = new Surface({
            size: this.options.labelSize,
            content: this.options.label,
            properties : {pointerEvents : 'none'},
            classes: ['slider-label']
        });

        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var scale = (this.options.range[1] - this.options.range[0]) / this.options.indicatorSize[0];

        this.sync = new GenericSync(
            ['mouse', 'touch'],
            {
                scale : scale,
                direction : GenericSync.DIRECTION_X
            }
        );

        this.indicator.pipe(this.sync);
        this.sync.pipe(this);

        this.eventInput.on('update', function(data) {
            this.set(data.position);
        }.bind(this));

        this._drawPos = 0;
        _updateLabel.call(this);
    }

    Slider.DEFAULT_OPTIONS = {
        size: [200, 60],
        indicatorSize: [200, 30],
        labelSize: [200, 30],
        range: [0, 1],
        precision: 2,
        value: 0,
        label: '',
        fillColor: 'rgba(170, 170, 170, 1)'
    };

    function _updateLabel() {
        this.label.setContent(this.options.label + '<span style="float: right">' + this.get().toFixed(this.options.precision) + '</span>');
    }

    Slider.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    Slider.prototype.get = function get() {
        return this.options.value;
    };

    Slider.prototype.set = function set(value) {
        if (value === this.options.value) return;
        this.options.value = Utilities.clamp(value, this.options.range);
        _updateLabel.call(this);
        this.eventOutput.emit('change', {value: value});
    };

    Slider.prototype.getSize = function getSize() {
        return this.options.size;
    };

    Slider.prototype.render = function render() {
        var range = this.options.range;
        var fillSize = Math.floor(((this.get() - range[0]) / (range[1] - range[0])) * this.options.indicatorSize[0]);

        if (fillSize < this._drawPos) {
            this.indicator.getContext('2d').clearRect(fillSize, 0, this._drawPos - fillSize + 1, this.options.indicatorSize[1]);
        }
        else if (fillSize > this._drawPos) {
            var ctx = this.indicator.getContext('2d');
            ctx.fillStyle = this.options.fillColor;
            ctx.fillRect(this._drawPos-1, 0, fillSize - this._drawPos+1, this.options.indicatorSize[1]);
        }
        this._drawPos = fillSize;

        return {
            size: this.options.size,
            target: [
                {
                    origin: [0, 0],
                    target: this.indicator.render()
                },
                {
                    transform: Transform.translate(0, 0, 1),
                    origin: [0, 0],
                    target: this.label.render()
                }
            ]
        };
    };

    module.exports = Slider;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/widgets/ToggleButton',['require','exports','module','famous/core/Surface','famous/core/EventHandler','famous/views/RenderController'],function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var EventHandler = require('famous/core/EventHandler');
    var RenderController = require('famous/views/RenderController');

    /**
     * A view for transitioning between two surfaces based
     *  on a 'on' and 'off' state
     *
     * @class TabBar
     * @extends View
     * @constructor
     *
     * @param {object} options overrides of default options
     */
    function ToggleButton(options) {
        this.options = {
            content: '',
            offClasses: ['off'],
            onClasses: ['on'],
            size: undefined,
            outTransition: {curve: 'easeInOut', duration: 300},
            inTransition: {curve: 'easeInOut', duration: 300},
            toggleMode: ToggleButton.TOGGLE,
            crossfade: true
        };

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.offSurface = new Surface();
        this.offSurface.on('click', function() {
            if (this.options.toggleMode !== ToggleButton.OFF) this.select();
        }.bind(this));
        this.offSurface.pipe(this._eventOutput);

        this.onSurface = new Surface();
        this.onSurface.on('click', function() {
            if (this.options.toggleMode !== ToggleButton.ON) this.deselect();
        }.bind(this));
        this.onSurface.pipe(this._eventOutput);

        this.arbiter = new RenderController({
            overlap : this.options.crossfade
        });

        this.deselect();

        if (options) this.setOptions(options);
    }

    ToggleButton.OFF = 0;
    ToggleButton.ON = 1;
    ToggleButton.TOGGLE = 2;

    /**
     * Transition towards the 'on' state and dispatch an event to
     *  listeners to announce it was selected
     *
     * @method select
     */
    ToggleButton.prototype.select = function select() {
        this.selected = true;
        this.arbiter.show(this.onSurface, this.options.inTransition);
//        this.arbiter.setMode(ToggleButton.ON, this.options.inTransition);
        this._eventOutput.emit('select');
    };

    /**
     * Transition towards the 'off' state and dispatch an event to
     *  listeners to announce it was deselected
     *
     * @method deselect
     */
    ToggleButton.prototype.deselect = function deselect() {
        this.selected = false;
        this.arbiter.show(this.offSurface, this.options.outTransition);
        this._eventOutput.emit('deselect');
    };

    /**
     * Return the state of the button
     *
     * @method isSelected
     *
     * @return {boolean} selected state
     */
    ToggleButton.prototype.isSelected = function isSelected() {
        return this.selected;
    };

    /**
     * Override the current options
     *
     * @method setOptions
     *
     * @param {object} options JSON
     */
    ToggleButton.prototype.setOptions = function setOptions(options) {
        if (options.content !== undefined) {
            this.options.content = options.content;
            this.offSurface.setContent(this.options.content);
            this.onSurface.setContent(this.options.content);
        }
        if (options.offClasses) {
            this.options.offClasses = options.offClasses;
            this.offSurface.setClasses(this.options.offClasses);
        }
        if (options.onClasses) {
            this.options.onClasses = options.onClasses;
            this.onSurface.setClasses(this.options.onClasses);
        }
        if (options.size !== undefined) {
            this.options.size = options.size;
            this.onSurface.setSize(this.options.size);
            this.offSurface.setSize(this.options.size);
        }
        if (options.toggleMode !== undefined) this.options.toggleMode = options.toggleMode;
        if (options.outTransition !== undefined) this.options.outTransition = options.outTransition;
        if (options.inTransition !== undefined) this.options.inTransition = options.inTransition;
        if (options.crossfade !== undefined) {
            this.options.crossfade = options.crossfade;
            this.arbiter.setOptions({overlap: this.options.crossfade});
        }
    };

    /**
     * Return the size defined in the options object
     *
     * @method getSize
     *
     * @return {array} two element array [height, width]
     */
    ToggleButton.prototype.getSize = function getSize() {
        return this.options.size;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    ToggleButton.prototype.render = function render() {
        return this.arbiter.render();
    };

    module.exports = ToggleButton;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/widgets/TabBar',['require','exports','module','famous/utilities/Utility','famous/core/View','famous/views/GridLayout','./ToggleButton'],function(require, exports, module) {
    var Utility = require('famous/utilities/Utility');
    var View = require('famous/core/View');
    var GridLayout = require('famous/views/GridLayout');
    var ToggleButton = require('./ToggleButton');

    /**
     * A view for displaying various tabs that dispatch events
     *  based on the id of the button that was clicked
     *
     * @class TabBar
     * @extends View
     * @constructor
     *
     * @param {object} options overrides of default options
     */
    function TabBar(options) {
        View.apply(this, arguments);

        this.layout = new GridLayout();
        this.buttons = [];
        this._buttonIds = {};
        this._buttonCallbacks = {};

        this.layout.sequenceFrom(this.buttons);
        this._add(this.layout);

        this._optionsManager.on('change', _updateOptions.bind(this));
    }

    TabBar.prototype = Object.create(View.prototype);
    TabBar.prototype.constructor = TabBar;

    TabBar.DEFAULT_OPTIONS = {
        sections: [],
        widget: ToggleButton,
        size: [undefined, 50],
        direction: Utility.Direction.X,
        buttons: {
            toggleMode: ToggleButton.ON
        }
    };

    /**
     * Update the options for all components of the view
     *
     * @method _updateOptions
     *
     * @param {object} data component options
     */
    function _updateOptions(data) {
        var id = data.id;
        var value = data.value;

        if (id === 'direction') {
            this.layout.setOptions({dimensions: _resolveGridDimensions.call(this.buttons.length, this.options.direction)});
        }
        else if (id === 'buttons') {
            for (var i in this.buttons) {
                this.buttons[i].setOptions(value);
            }
        }
        else if (id === 'sections') {
            for (var sectionId in this.options.sections) {
                this.defineSection(sectionId, this.options.sections[sectionId]);
            }
        }
    }

    /**
     * Return an array of the proper dimensions for the tabs
     *
     * @method _resolveGridDimensions
     *
     * @param {number} count number of buttons
     * @param {number} direction direction of the layout
     *
     * @return {array} the dimensions of the tab section
     */
    function _resolveGridDimensions(count, direction) {
        if (direction === Utility.Direction.X) return [count, 1];
        else return [1, count];
    }

    /**
     * Create a new button with the specified id.  If one already exists with
     *  that id, unbind all listeners.
     *
     * @method defineSection
     *
     * @param {string} id name of the button
     * @param {object} content data for the creation of a new ToggleButton
     */
    TabBar.prototype.defineSection = function defineSection(id, content) {
        var button;
        var i = this._buttonIds[id];

        if (i === undefined) {
            i = this.buttons.length;
            this._buttonIds[id] = i;
            var widget = this.options.widget;
            button = new widget();
            this.buttons[i] = button;
            this.layout.setOptions({dimensions: _resolveGridDimensions(this.buttons.length, this.options.direction)});
        }
        else {
            button = this.buttons[i];
            button.unbind('select', this._buttonCallbacks[id]);
        }

        if (this.options.buttons) button.setOptions(this.options.buttons);
        button.setOptions(content);

        this._buttonCallbacks[id] = this.select.bind(this, id);
        button.on('select', this._buttonCallbacks[id]);
    };

    /**
     * Select a particular button and dispatch the id of the selection
     *  to any listeners.  Deselect all others
     *
     * @method select
     *
     * @param {string} id button id
     */
    TabBar.prototype.select = function select(id) {
        var btn = this._buttonIds[id];
        // this prevents event loop
        if (this.buttons[btn] && this.buttons[btn].isSelected()) {
            this._eventOutput.emit('select', {id: id});
        }
        else if (this.buttons[btn]) {
            this.buttons[btn].select();
        }

        for (var i = 0; i < this.buttons.length; i++) {
            if (i !== btn) this.buttons[i].deselect();
        }
    };

    module.exports = TabBar;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/bodies/Body',['require','exports','module','./Particle','famous/core/Transform','famous/math/Vector','famous/math/Quaternion','famous/math/Matrix'],function(require, exports, module) {
    var Particle = require('./Particle');
    var Transform = require('famous/core/Transform');
    var Vector = require('famous/math/Vector');
    var Quaternion = require('famous/math/Quaternion');
    var Matrix = require('famous/math/Matrix');

    /**
     * A unit controlled by the physics engine which extends the zero-dimensional
     * Particle to include geometry. In addition to maintaining the state
     * of a Particle its state includes orientation, angular velocity
     * and angular momentum and responds to torque forces.
     *
     * @class Body
     * @extends Particle
     * @constructor
     */
    function Body(options) {
        Particle.call(this, options);
        options = options || {};

        this.orientation     = new Quaternion();
        this.angularVelocity = new Vector();
        this.angularMomentum = new Vector();
        this.torque          = new Vector();

        if (options.orientation)     this.orientation.set(options.orientation);
        if (options.angularVelocity) this.angularVelocity.set(options.angularVelocity);
        if (options.angularMomentum) this.angularMomentum.set(options.angularMomentum);
        if (options.torque)          this.torque.set(options.torque);

        this.setMomentsOfInertia();

        this.angularVelocity.w = 0;        //quaternify the angular velocity

        //registers
        this.pWorld = new Vector();        //placeholder for world space position
    }

    Body.DEFAULT_OPTIONS = Particle.DEFAULT_OPTIONS;
    Body.DEFAULT_OPTIONS.orientation = [0,0,0,1];
    Body.DEFAULT_OPTIONS.angularVelocity = [0,0,0];

    Body.AXES = Particle.AXES;
    Body.SLEEP_TOLERANCE = Particle.SLEEP_TOLERANCE;
    Body.INTEGRATOR = Particle.INTEGRATOR;

    Body.prototype = Object.create(Particle.prototype);
    Body.prototype.constructor = Body;

    Body.prototype.isBody = true;

    Body.prototype.setMass = function setMass() {
        Particle.prototype.setMass.apply(this, arguments);
        this.setMomentsOfInertia();
    };

    /**
     * Setter for moment of inertia, which is necessary to give proper
     * angular inertia depending on the geometry of the body.
     *
     * @method setMomentsOfInertia
     */
    Body.prototype.setMomentsOfInertia = function setMomentsOfInertia() {
        this.inertia = new Matrix();
        this.inverseInertia = new Matrix();
    };

    /**
     * Update the angular velocity from the angular momentum state.
     *
     * @method updateAngularVelocity
     */
    Body.prototype.updateAngularVelocity = function updateAngularVelocity() {
        this.angularVelocity.set(this.inverseInertia.vectorMultiply(this.angularMomentum));
    };

    /**
     * Determine world coordinates from the local coordinate system. Useful
     * if the Body has rotated in space.
     *
     * @method toWorldCoordinates
     * @param localPosition {Vector} local coordinate vector
     * @return global coordinate vector {Vector}
     */
    Body.prototype.toWorldCoordinates = function toWorldCoordinates(localPosition) {
        return this.pWorld.set(this.orientation.rotateVector(localPosition));
    };

    /**
     * Calculates the kinetic and intertial energy of a body.
     *
     * @method getEnergy
     * @return energy {Number}
     */
    Body.prototype.getEnergy = function getEnergy() {
        return Particle.prototype.getEnergy.call(this)
            + 0.5 * this.inertia.vectorMultiply(this.angularVelocity).dot(this.angularVelocity);
    };

    /**
     * Extends Particle.reset to reset orientation, angular velocity
     * and angular momentum.
     *
     * @method reset
     * @param [p] {Array|Vector} position
     * @param [v] {Array|Vector} velocity
     * @param [q] {Array|Quaternion} orientation
     * @param [L] {Array|Vector} angular momentum
     */
    Body.prototype.reset = function reset(p, v, q, L) {
        Particle.prototype.reset.call(this, p, v);
        this.angularVelocity.clear();
        this.setOrientation(q || [1,0,0,0]);
        this.setAngularMomentum(L || [0,0,0]);
    };

    /**
     * Setter for orientation
     *
     * @method setOrientation
     * @param q {Array|Quaternion} orientation
     */
    Body.prototype.setOrientation = function setOrientation(q) {
        this.orientation.set(q);
    };

    /**
     * Setter for angular velocity
     *
     * @method setAngularVelocity
     * @param w {Array|Vector} angular velocity
     */
    Body.prototype.setAngularVelocity = function setAngularVelocity(w) {
        this.wake();
        this.angularVelocity.set(w);
    };

    /**
     * Setter for angular momentum
     *
     * @method setAngularMomentum
     * @param L {Array|Vector} angular momentum
     */
    Body.prototype.setAngularMomentum = function setAngularMomentum(L) {
        this.wake();
        this.angularMomentum.set(L);
    };

    /**
     * Extends Particle.applyForce with an optional argument
     * to apply the force at an off-centered location, resulting in a torque.
     *
     * @method applyForce
     * @param force {Vector} force
     * @param [location] {Vector} off-center location on the body
     */
    Body.prototype.applyForce = function applyForce(force, location) {
        Particle.prototype.applyForce.call(this, force);
        if (location !== undefined) this.applyTorque(location.cross(force));
    };

    /**
     * Applied a torque force to a body, inducing a rotation.
     *
     * @method applyTorque
     * @param torque {Vector} torque
     */
    Body.prototype.applyTorque = function applyTorque(torque) {
        this.wake();
        this.torque.set(this.torque.add(torque));
    };

    /**
     * Extends Particle.getTransform to include a rotational component
     * derived from the particle's orientation.
     *
     * @method getTransform
     * @return transform {Transform}
     */
    Body.prototype.getTransform = function getTransform() {
        return Transform.thenMove(
            this.orientation.getTransform(),
            Transform.getTranslate(Particle.prototype.getTransform.call(this))
        );
    };

    /**
     * Extends Particle._integrate to also update the rotational states
     * of the body.
     *
     * @method getTransform
     * @protected
     * @param dt {Number} delta time
     */
    Body.prototype._integrate = function _integrate(dt) {
        Particle.prototype._integrate.call(this, dt);
        this.integrateAngularMomentum(dt);
        this.updateAngularVelocity(dt);
        this.integrateOrientation(dt);
    };

    /**
     * Updates the angular momentum via the its integrator.
     *
     * @method integrateAngularMomentum
     * @param dt {Number} delta time
     */
    Body.prototype.integrateAngularMomentum = function integrateAngularMomentum(dt) {
        Body.INTEGRATOR.integrateAngularMomentum(this, dt);
    };

    /**
     * Updates the orientation via the its integrator.
     *
     * @method integrateOrientation
     * @param dt {Number} delta time
     */
    Body.prototype.integrateOrientation = function integrateOrientation(dt) {
        Body.INTEGRATOR.integrateOrientation(this, dt);
    };

    module.exports = Body;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/bodies/Circle',['require','exports','module','./Body','famous/math/Matrix'],function(require, exports, module) {
    var Body = require('./Body');
    var Matrix = require('famous/math/Matrix');

    /**
     * Implements a circle, or spherical, geometry for an Body with
     * radius.
     *
     * @class Circle
     * @extends Body
     * @constructor
     */
    function Circle(options) {
        options = options || {};
        this.setRadius(options.radius || 0);
        Body.call(this, options);
    }

    Circle.prototype = Object.create(Body.prototype);
    Circle.prototype.constructor = Circle;

    /**
     * Basic setter for radius.
     * @method setRadius
     * @param r {Number} radius
     */
    Circle.prototype.setRadius = function setRadius(r) {
        this.radius = r;
        this.size = [2*this.radius, 2*this.radius];
        this.setMomentsOfInertia();
    };

    Circle.prototype.setMomentsOfInertia = function setMomentsOfInertia() {
        var m = this.mass;
        var r = this.radius;

        this.inertia = new Matrix([
            [0.25 * m * r * r, 0, 0],
            [0, 0.25 * m * r * r, 0],
            [0, 0, 0.5 * m * r * r]
        ]);

        this.inverseInertia = new Matrix([
            [4 / (m * r * r), 0, 0],
            [0, 4 / (m * r * r), 0],
            [0, 0, 2 / (m * r * r)]
        ]);
    };

    module.exports = Circle;

});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/bodies/Rectangle',['require','exports','module','./Body','famous/math/Matrix'],function(require, exports, module) {
    var Body = require('./Body');
    var Matrix = require('famous/math/Matrix');

    /**
     * Implements a rectangular geometry for an Body with
     * size = [width, height].
     *
     * @class Rectangle
     * @extends Body
     * @constructor
     */
    function Rectangle(options) {
        options = options || {};
        this.size = options.size || [0,0];
        Body.call(this, options);
    }

    Rectangle.prototype = Object.create(Body.prototype);
    Rectangle.prototype.constructor = Rectangle;

    /**
     * Basic setter for size.
     * @method setSize
     * @param size {Array} size = [width, height]
     */
    Rectangle.prototype.setSize = function setSize(size) {
        this.size = size;
        this.setMomentsOfInertia();
    };

    Rectangle.prototype.setMomentsOfInertia = function setMomentsOfInertia() {
        var m = this.mass;
        var w = this.size[0];
        var h = this.size[1];

        this.inertia = new Matrix([
            [m * h * h / 12, 0, 0],
            [0, m * w * w / 12, 0],
            [0, 0, m * (w * w + h * h) / 12]
        ]);

        this.inverseInertia = new Matrix([
            [12 / (m * h * h), 0, 0],
            [0, 12 / (m * w * w), 0],
            [0, 0, 12 / (m * (w * w + h * h))]
        ]);
    };

    module.exports = Rectangle;

});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Collision',['require','exports','module','./Constraint','famous/math/Vector'],function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('famous/math/Vector');

    /**
     *  Allows for two circular bodies to collide and bounce off each other.
     *
     *  @class Collision
     *  @constructor
     *  @extends Constraint
     *  @param {Options} [options] An object of configurable options.
     *  @param {Number} [options.restitution] The energy ratio lost in a collision (0 = stick, 1 = elastic) Range : [0, 1]
     *  @param {Number} [options.drift] Baumgarte stabilization parameter. Makes constraints "loosely" (0) or "tightly" (1) enforced. Range : [0, 1]
     *  @param {Number} [options.slop] Amount of penetration in pixels to ignore before collision event triggers
     *
     */
    function Collision(options) {
        this.options = Object.create(Collision.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.normal   = new Vector();
        this.pDiff    = new Vector();
        this.vDiff    = new Vector();
        this.impulse1 = new Vector();
        this.impulse2 = new Vector();

        Constraint.call(this);
    }

    Collision.prototype = Object.create(Constraint.prototype);
    Collision.prototype.constructor = Collision;

    Collision.DEFAULT_OPTIONS = {
        restitution : 0.5,
        drift : 0.5,
        slop : 0
    };

    function _normalVelocity(particle1, particle2) {
        return particle1.velocity.dot(particle2.velocity);
    }

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param options {Objects}
     */
    Collision.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds an impulse to a physics body's velocity due to the constraint
     *
     * @method applyConstraint
     * @param targets {Array.Body}  Array of bodies to apply the constraint to
     * @param source {Body}         The source of the constraint
     * @param dt {Number}           Delta time
     */
    Collision.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        if (source === undefined) return;

        var v1 = source.velocity;
        var p1 = source.position;
        var w1 = source.inverseMass;
        var r1 = source.radius;

        var options = this.options;
        var drift = options.drift;
        var slop = -options.slop;
        var restitution = options.restitution;

        var n     = this.normal;
        var pDiff = this.pDiff;
        var vDiff = this.vDiff;
        var impulse1 = this.impulse1;
        var impulse2 = this.impulse2;

        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];

            if (target === source) continue;

            var v2 = target.velocity;
            var p2 = target.position;
            var w2 = target.inverseMass;
            var r2 = target.radius;

            pDiff.set(p2.sub(p1));
            vDiff.set(v2.sub(v1));

            var dist    = pDiff.norm();
            var overlap = dist - (r1 + r2);
            var effMass = 1/(w1 + w2);
            var gamma   = 0;

            if (overlap < 0) {

                n.set(pDiff.normalize());

                if (this._eventOutput) {
                    var collisionData = {
                        target  : target,
                        source  : source,
                        overlap : overlap,
                        normal  : n
                    };

                    this._eventOutput.emit('preCollision', collisionData);
                    this._eventOutput.emit('collision', collisionData);
                }

                var lambda = (overlap <= slop)
                    ? ((1 + restitution) * n.dot(vDiff) + drift/dt * (overlap - slop)) / (gamma + dt/effMass)
                    : ((1 + restitution) * n.dot(vDiff)) / (gamma + dt/effMass);

                n.mult(dt*lambda).put(impulse1);
                impulse1.mult(-1).put(impulse2);

                source.applyImpulse(impulse1);
                target.applyImpulse(impulse2);

                //source.setPosition(p1.add(n.mult(overlap/2)));
                //target.setPosition(p2.sub(n.mult(overlap/2)));

                if (this._eventOutput) this._eventOutput.emit('postCollision', collisionData);

            }
        }
    };

    module.exports = Collision;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Curve',['require','exports','module','./Constraint','famous/math/Vector'],function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('famous/math/Vector');

    /**
     *  A constraint that keeps a physics body on a given implicit curve
     *    regardless of other physical forces are applied to it.
     *
     *    A curve constraint is two surface constraints in disguise, as a curve is
     *    the intersection of two surfaces, and is essentially constrained to both
     *
     *  @class Curve
     *  @constructor
     *  @extends Constraint
     *  @param {Options} [options] An object of configurable options.
     *  @param {Function} [options.equation] An implicitly defined surface f(x,y,z) = 0 that body is constrained to e.g. function(x,y,z) { x*x + y*y - r*r } corresponds to a circle of radius r pixels
     *  @param {Function} [options.plane] An implicitly defined second surface that the body is constrained to
     *  @param {Number} [options.period] The spring-like reaction when the constraint is violated
     *  @param {Number} [options.number] The damping-like reaction when the constraint is violated
     */
    function Curve(options) {
        this.options = Object.create(Curve.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.J = new Vector();
        this.impulse = new Vector();

        Constraint.call(this);
    }

    Curve.prototype = Object.create(Constraint.prototype);
    Curve.prototype.constructor = Curve;

    /** @const */ var epsilon = 1e-7;
    /** @const */ var pi = Math.PI;

    Curve.DEFAULT_OPTIONS = {
        equation  : function(x,y,z) {
            return 0;
        },
        plane : function(x,y,z) {
            return z;
        },
        period : 0,
        dampingRatio : 0
    };

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects}
     */
    Curve.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds a curve impulse to a physics body.
     *
     * @method applyConstraint
     * @param targets {Array.Body} Array of bodies to apply force to.
     * @param source {Body} Not applicable
     * @param dt {Number} Delta time
     */
    Curve.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var options = this.options;
        var impulse = this.impulse;
        var J = this.J;

        var f = options.equation;
        var g = options.plane;
        var dampingRatio = options.dampingRatio;
        var period = options.period;

        for (var i = 0; i < targets.length; i++) {
            var body = targets[i];

            var v = body.velocity;
            var p = body.position;
            var m = body.mass;

            var gamma;
            var beta;

            if (period === 0) {
                gamma = 0;
                beta = 1;
            }
            else {
                var c = 4 * m * pi * dampingRatio / period;
                var k = 4 * m * pi * pi / (period * period);

                gamma = 1 / (c + dt*k);
                beta  = dt*k / (c + dt*k);
            }

            var x = p.x;
            var y = p.y;
            var z = p.z;

            var f0  = f(x, y, z);
            var dfx = (f(x + epsilon, p, p) - f0) / epsilon;
            var dfy = (f(x, y + epsilon, p) - f0) / epsilon;
            var dfz = (f(x, y, p + epsilon) - f0) / epsilon;

            var g0  = g(x, y, z);
            var dgx = (g(x + epsilon, y, z) - g0) / epsilon;
            var dgy = (g(x, y + epsilon, z) - g0) / epsilon;
            var dgz = (g(x, y, z + epsilon) - g0) / epsilon;

            J.setXYZ(dfx + dgx, dfy + dgy, dfz + dgz);

            var antiDrift = beta/dt * (f0 + g0);
            var lambda = -(J.dot(v) + antiDrift) / (gamma + dt * J.normSquared() / m);

            impulse.set(J.mult(dt*lambda));
            body.applyImpulse(impulse);
        }
    };

    module.exports = Curve;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Distance',['require','exports','module','./Constraint','famous/math/Vector'],function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('famous/math/Vector');

    /**
     *  A constraint that keeps a physics body a given distance away from a given
     *  anchor, or another attached body.
     *
     *
     *  @class Distance
     *  @constructor
     *  @extends Constraint
     *  @param {Options} [options] An object of configurable options.
     *  @param {Array} [options.anchor] The location of the anchor
     *  @param {Number} [options.length] The amount of distance from the anchor the constraint should enforce
     *  @param {Number} [options.minLength] The minimum distance before the constraint is activated. Use this property for a "rope" effect.
     *  @param {Number} [options.period] The spring-like reaction when the constraint is broken.
     *  @param {Number} [options.dampingRatio] The damping-like reaction when the constraint is broken.
     *
     */
    function Distance(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        //registers
        this.impulse  = new Vector();
        this.normal   = new Vector();
        this.diffP    = new Vector();
        this.diffV    = new Vector();

        Constraint.call(this);
    }

    Distance.prototype = Object.create(Constraint.prototype);
    Distance.prototype.constructor = Distance;

    Distance.DEFAULT_OPTIONS = {
        anchor : null,
        length : 0,
        minLength : 0,
        period : 0,
        dampingRatio : 0
    };

    /** @const */ var pi = Math.PI;

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects}
     */
    Distance.prototype.setOptions = function setOptions(options) {
        if (options.anchor) {
            if (options.anchor.position instanceof Vector) this.options.anchor = options.anchor.position;
            if (options.anchor   instanceof Vector)  this.options.anchor = options.anchor;
            if (options.anchor   instanceof Array)  this.options.anchor = new Vector(options.anchor);
        }
        if (options.length !== undefined) this.options.length = options.length;
        if (options.dampingRatio !== undefined) this.options.dampingRatio = options.dampingRatio;
        if (options.period !== undefined) this.options.period = options.period;
        if (options.minLength !== undefined) this.options.minLength = options.minLength;
    };

    function _calcError(impulse, body) {
        return body.mass * impulse.norm();
    }

    /**
     * Set the anchor position
     *
     * @method setOptions
     * @param anchor {Array}
     */
    Distance.prototype.setAnchor = function setAnchor(anchor) {
        if (!this.options.anchor) this.options.anchor = new Vector();
        this.options.anchor.set(anchor);
    };

    /**
     * Adds an impulse to a physics body's velocity due to the constraint
     *
     * @method applyConstraint
     * @param targets {Array.Body}  Array of bodies to apply the constraint to
     * @param source {Body}         The source of the constraint
     * @param dt {Number}           Delta time
     */
    Distance.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var n        = this.normal;
        var diffP    = this.diffP;
        var diffV    = this.diffV;
        var impulse  = this.impulse;
        var options  = this.options;

        var dampingRatio = options.dampingRatio;
        var period       = options.period;
        var minLength    = options.minLength;

        var p2;
        var w2;

        if (source) {
            var v2 = source.velocity;
            p2 = source.position;
            w2 = source.inverseMass;
        }
        else {
            p2 = this.options.anchor;
            w2 = 0;
        }

        var length = this.options.length;

        for (var i = 0; i < targets.length; i++) {
            var body = targets[i];

            var v1 = body.velocity;
            var p1 = body.position;
            var w1 = body.inverseMass;

            diffP.set(p1.sub(p2));
            n.set(diffP.normalize());

            var dist = diffP.norm() - length;

            //rope effect
            if (Math.abs(dist) < minLength) return;

            if (source) diffV.set(v1.sub(v2));
            else diffV.set(v1);

            var effMass = 1 / (w1 + w2);
            var gamma;
            var beta;

            if (period === 0) {
                gamma = 0;
                beta  = 1;
            }
            else {
                var c = 4 * effMass * pi * dampingRatio / period;
                var k = 4 * effMass * pi * pi / (period * period);

                gamma = 1 / (c + dt*k);
                beta  = dt*k / (c + dt*k);
            }

            var antiDrift = beta/dt * dist;
            var lambda    = -(n.dot(diffV) + antiDrift) / (gamma + dt/effMass);

            impulse.set(n.mult(dt*lambda));
            body.applyImpulse(impulse);

            if (source) source.applyImpulse(impulse.mult(-1));
        }
    };

    module.exports = Distance;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Surface',['require','exports','module','./Constraint','famous/math/Vector'],function(require, exports, module) {
    var Constraint = require('./Constraint');
    var Vector = require('famous/math/Vector');

    /**
     *  A constraint that keeps a physics body on a given implicit surface
     *    regardless of other physical forces are applied to it.
     *
     *  @class Surface
     *  @constructor
     *  @extends Constraint
     *  @param {Options} [options] An object of configurable options.
     *  @param {Function} [options.equation] An implicitly defined surface f(x,y,z) = 0 that body is constrained to e.g. function(x,y,z) { x*x + y*y + z*z - r*r } corresponds to a sphere of radius r pixels.
     *  @param {Number} [options.period] The spring-like reaction when the constraint is violated.
     *  @param {Number} [options.dampingRatio] The damping-like reaction when the constraint is violated.
     */
    function Surface(options) {
        this.options = Object.create(Surface.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        this.J = new Vector();
        this.impulse  = new Vector();

        Constraint.call(this);
    }

    Surface.prototype = Object.create(Constraint.prototype);
    Surface.prototype.constructor = Surface;

    Surface.DEFAULT_OPTIONS = {
        equation : undefined,
        period : 0,
        dampingRatio : 0
    };

    /** @const */ var epsilon = 1e-7;
    /** @const */ var pi = Math.PI;

    /**
     * Basic options setter
     *
     * @method setOptions
     * @param options {Objects}
     */
    Surface.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    /**
     * Adds a surface impulse to a physics body.
     *
     * @method applyConstraint
     * @param targets {Array.Body} Array of bodies to apply force to.
     * @param source {Body} Not applicable
     * @param dt {Number} Delta time
     */
    Surface.prototype.applyConstraint = function applyConstraint(targets, source, dt) {
        var impulse = this.impulse;
        var J       = this.J;
        var options = this.options;

        var f = options.equation;
        var dampingRatio = options.dampingRatio;
        var period = options.period;

        for (var i = 0; i < targets.length; i++) {
            var particle = targets[i];

            var v = particle.velocity;
            var p = particle.position;
            var m = particle.mass;

            var gamma;
            var beta;

            if (period === 0) {
                gamma = 0;
                beta = 1;
            }
            else {
                var c = 4 * m * pi * dampingRatio / period;
                var k = 4 * m * pi * pi / (period * period);

                gamma = 1 / (c + dt*k);
                beta  = dt*k / (c + dt*k);
            }

            var x = p.x;
            var y = p.y;
            var z = p.z;

            var f0  = f(x, y, z);
            var dfx = (f(x + epsilon, p, p) - f0) / epsilon;
            var dfy = (f(x, y + epsilon, p) - f0) / epsilon;
            var dfz = (f(x, y, p + epsilon) - f0) / epsilon;
            J.setXYZ(dfx, dfy, dfz);

            var antiDrift = beta/dt * f0;
            var lambda = -(J.dot(v) + antiDrift) / (gamma + dt * J.normSquared() / m);

            impulse.set(J.mult(dt*lambda));
            particle.applyImpulse(impulse);
        }
    };

    module.exports = Surface;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/constraints/Walls',['require','exports','module','./Constraint','./Wall','famous/math/Vector'],function(require, exports, module) {
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
     *  @param {Options} [options] An object of configurable options.
     *  @param {Array} [options.sides] An array of sides e.g., [Walls.LEFT, Walls.TOP]
     *  @param {Array} [options.size] The size of the bounding box of the walls.
     *  @param {Array} [options.origin] The center of the wall relative to the size.
     *  @param {Array} [options.drift] Baumgarte stabilization parameter. Makes constraints "loosely" (0) or "tightly" (1) enforced. Range : [0, 1]
     *  @param {Array} [options.slop] Amount of penetration in pixels to ignore before collision event triggers.
     *  @param {Array} [options.restitution] The energy ratio lost in a collision (0 = stick, 1 = elastic) The energy ratio lost in a collision (0 = stick, 1 = elastic)
     *  @param {Array} [options.onContact] How to handle collision against the wall.
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

    Walls.DEFAULT_OPTIONS = {
        sides : Walls.SIDES.TWO_DIMENSIONAL,
        size : [window.innerWidth, window.innerHeight, 0],
        origin : [.5, .5, .5],
        drift : 0.5,
        slop : 0,
        restitution : 0.5,
        onContact : Walls.ON_CONTACT.REFLECT
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

//TODO: test options manager
define('famous/physics/forces/Repulsion',['require','exports','module','./Force','famous/math/Vector'],function(require, exports, module) {
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
         * @attribute INVERSE
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/RotationalDrag',['require','exports','module','./Drag'],function(require, exports, module) {
    var Drag = require('./Drag');

    /**
     * Rotational drag is a force that opposes angular velocity.
     *   Attach it to a physics body to slow down its rotation.
     *
     * @class RotationalDrag
     * @constructor
     * @extends Force
     * @param {Object} options options to set on drag
     */
    function RotationalDrag(options) {
        Drag.call(this, options);
    }

    RotationalDrag.prototype = Object.create(Drag.prototype);
    RotationalDrag.prototype.constructor = RotationalDrag;

    RotationalDrag.DEFAULT_OPTIONS = Drag.DEFAULT_OPTIONS;
    RotationalDrag.FORCE_FUNCTIONS = Drag.FORCE_FUNCTIONS;

    /**
     * @property Repulsion.FORCE_FUNCTIONS
     * @type Object
     * @protected
     * @static
     */
    RotationalDrag.FORCE_FUNCTIONS = {

        /**
         * A drag force proprtional to the angular velocity
         * @attribute LINEAR
         * @type Function
         * @param {Vector} angularVelocity
         * @return {Vector} drag force
         */
        LINEAR : function(angularVelocity) {
            return angularVelocity;
        },

        /**
         * A drag force proprtional to the square of the angular velocity
         * @attribute QUADRATIC
         * @type Function
         * @param {Vector} angularVelocity
         * @return {Vector} drag force
         */
        QUADRATIC : function(angularVelocity) {
            return angularVelocity.mult(angularVelocity.norm());
        }
    };

    /**
     * Adds a rotational drag force to a physics body's torque accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply drag force to.
     */
    RotationalDrag.prototype.applyForce = function applyForce(targets) {
        var strength       = this.options.strength;
        var forceFunction  = this.options.forceFunction;
        var force          = this.force;

        //TODO: rotational drag as function of inertia
        for (var index = 0; index < targets.length; index++) {
            var particle = targets[index];
            forceFunction(particle.angularVelocity).mult(-100*strength).put(force);
            particle.applyTorque(force);
        }
    };

    /*
     * Setter for options.
     *
     * @method setOptions
     * @param {Objects} options
     */
    RotationalDrag.prototype.setOptions = function setOptions(options) {
        for (var key in options) this.options[key] = options[key];
    };

    module.exports = RotationalDrag;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

//TODO: test inheritance
define('famous/physics/forces/RotationalSpring',['require','exports','module','./Spring'],function(require, exports, module) {
    var Spring = require('./Spring');

    /**
     *  A force that rotates a physics body back to target Euler angles.
     *  Just as a spring translates a body to a particular X, Y, Z, location,
     *  a rotational spring rotates a body to a particular X, Y, Z Euler angle.
     *      Note: there is no physical agent that does this in the "real world"
     *
     *  @class RotationalSpring
     *  @constructor
     *  @extends Spring
     *  @param {Object} options options to set on drag
     */
    function RotationalSpring(options) {
        Spring.call(this, options);
    }

    RotationalSpring.prototype = Object.create(Spring.prototype);
    RotationalSpring.prototype.constructor = RotationalSpring;

    RotationalSpring.DEFAULT_OPTIONS = Spring.DEFAULT_OPTIONS;
    RotationalSpring.FORCE_FUNCTIONS = Spring.FORCE_FUNCTIONS;

    /**
     * Adds a torque force to a physics body's torque accumulator.
     *
     * @method applyForce
     * @param targets {Array.Body} Array of bodies to apply torque to.
     */
    RotationalSpring.prototype.applyForce = function applyForce(targets) {
        var force        = this.force;
        var options      = this.options;
        var disp         = this.disp;

        var stiffness    = options.stiffness;
        var damping      = options.damping;
        var restLength   = options.length;
        var anchor       = options.anchor;

        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];

            disp.set(anchor.sub(target.orientation));
            var dist = disp.norm() - restLength;

            if (dist === 0) return;

            //if dampingRatio specified, then override strength and damping
            var m      = target.mass;
            stiffness *= m;
            damping   *= m;

            force.set(disp.normalize(stiffness * this.forceFunction(dist, this.options.lMax)));

            if (damping) force.set(force.add(target.angularVelocity.mult(-damping)));

            target.applyTorque(force);
        }
    };

    /**
     * Calculates the potential energy of the rotational spring.
     *
     * @method getEnergy
     * @param {Body} target The physics body attached to the spring
     */
    RotationalSpring.prototype.getEnergy = function getEnergy(target) {
        var options     = this.options;
        var restLength  = options.length;
        var anchor      = options.anchor;
        var strength    = options.stiffness;

        var dist = anchor.sub(target.orientation).norm() - restLength;
        return 0.5 * strength * dist * dist;
    };

    module.exports = RotationalSpring;
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define('famous/physics/forces/VectorField',['require','exports','module','./Force','famous/math/Vector'],function(require, exports, module) {
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
        this.options = Object.create(VectorField.DEFAULT_OPTIONS);
        if (options) this.setOptions(options);

        _setFieldOptions.call(this, this.options.field);
        Force.call(this);

        //registers
        this.evaluation = new Vector(0,0,0);
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
            return v.set(options.direction);
        },

        /**
         * Linear force
         * @attribute LINEAR
         * @type Function
         * @param v {Vector} Current position of physics body
         * @return {Number} unscaled force
         */
        LINEAR : function(v) {
            return v;
        },

        /**
         * Radial force, e.g., Hookean spring
         * @attribute RADIAL
         * @type Function
         * @param v {Vector} Current position of physics body
         * @return {Number} unscaled force
         */
        RADIAL : function(v) {
            return v.set(v.mult(-1, v));
        },

        /**
         * Spherical force
         * @attribute SPHERE_ATTRACTOR
         * @type Function
         * @param v {Vector}        Current position of physics body
         * @param options {Object}  An object with the radius of the sphere
         *      Pass a {radius : Number} into the VectorField options
         * @return {Number} unscaled force
         */
        SPHERE_ATTRACTOR : function(v, options) {
            return v.set(v.mult((options.radius - v.norm()) / v.norm()));
        },

        /**
         * Point attractor force, e.g., Hookean spring with an anchor
         * @attribute POINT_ATTRACTOR
         * @type Function
         * @param v {Vector}        Current position of physics body
         * @param options {Object}  And object with the position of the attractor
         *      Pass a {position : Vector} into the VectorField options
         * @return {Number} unscaled force
         */
        POINT_ATTRACTOR : function(v, options) {
            return v.set(options.position.sub(v));
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
        for (var key in options) this.options[key] = options[key];
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
        var evaluation = this.evaluation;
        var field = this.options.field;
        evaluation.set(v);
        return field(evaluation, this.options);
    }

    /**
     * Adds the vectorfield's force to a physics body's force accumulator.
     *
     * @method applyForce
     * @param targets {Array.body} Array of bodies to apply force to.
     */
    VectorField.prototype.applyForce = function applyForce(targets) {
        var force = this.force;
        for (var i = 0; i < targets.length; i++) {
            var particle = targets[i];
            force.set(
                _evaluate.call(this, particle.position)
                .mult(particle.mass * this.options.strength)
            );
            particle.applyForce(force);
        }
    };

    module.exports = VectorField;
});

