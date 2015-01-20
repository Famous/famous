/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
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
        var result = [[], [], []];
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
