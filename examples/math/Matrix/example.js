/**
 * Copyright (c) 2015 Famous Industries, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 *
 * @license MIT
 */


/**
 * Matrix
 * -------
 *
 * Matrix is a library for creating a 3x3 matrix and applying
 * various math operations to them such as multiplication
 * or finding the transpose.
 *
 * In this example we create a 3x3 matrix and multiply it by a
 * unit vector to create the 3x1 matrix [0.707,0.707,0].
 */
define(function(require, exports, module) {
    // import dependencies
    var Engine  = require('famous/core/Engine');
    var Matrix  = require('famous/math/Matrix');
    var Vector  = require('famous/math/Vector');
    var Surface = require('famous/core/Surface');

    var mainContext = Engine.createContext();

    // rotate 45 degrees about z axis
    var matrix = new Matrix([
       [ .707, -.707, 0],
       [ .707, .707, 0],
       [ 0, 0, 1]
    ]);

    var vector = new Vector(1, 0, 0);
    var rotatedVector = matrix.vectorMultiply(vector);

    var surface = new Surface({
        size: [200, 200],
        classes: ["red-bg"],
        properties: {
            lineHeight: '200px',
            textAlign: 'center'
        }
    });
    surface.setContent('[' + rotatedVector.get() + ']');
    mainContext.add(surface);
});
