/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {

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
     * Fast-multiply two Transform matrix types to return a
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
     * Return a Transform matrix which represents the result of a transform matrix
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
        if (y === undefined) y = x;
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
        return [1, Math.tan(theta), 0, 0, Math.tan(psi), 1, 0, 0, 0, Math.tan(phi), 1, 0, 0, 0, 0, 1];
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
