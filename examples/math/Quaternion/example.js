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
 * Quaternion
 * ----------
 * 
 * Quaternions are used to represent rotations.  It has two components,
 * an axis represented by x, y, and z and the amount of rotation to
 * be applied around that axis, represented by w.  Quaternions are
 * particularly useful because they have no chance of gimbal lock.
 *
 * In this example, we have a Quaternion that defined the surface's
 * rotation.
 */
define(function(require, exports, module) {
    var Engine     = require('famous/core/Engine');
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var Quaternion = require('famous/math/Quaternion');

    var mainContext = Engine.createContext();

    var quaternion = new Quaternion(Math.PI/3, .5, .5, 0);

    var surface = new Surface({
        size: [200, 200],
        content: 'Hello World',
        classes: ["red-bg"],
        properties: {
            lineHeight: '200px',
            textAlign: 'center'
        }
    });

    var modifier = new Modifier();
    modifier.transformFrom(function() {
        return toggle ? Transform.identity : quaternion.getTransform();
    });

    mainContext.add(
      new Modifier({
        origin: [.5, .5],
        align: [.5, .5]
      })
    ).add(modifier).add(surface);

    var toggle = true;
    Engine.on('click', function() {
        toggle = toggle ? false : true;
    });
});
