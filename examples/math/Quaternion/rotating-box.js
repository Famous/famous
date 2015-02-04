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
 * Rotating Box
 * ----------
 * You can define a rotation as the (noncommutative) multiplication
 * of two Quaternions. When you do this, the first quaternion has 
 * the rotation described by the second quaternion added to it.
 * 
 * In this example, we have two quaternions, one that defines the box's
 * current rotation, and another which defines a rotation to be added
 * to the box.
 */
define(function(require, exports, module) {
    var Engine     = require('famous/core/Engine');
    var Surface    = require('famous/core/Surface');
    var Modifier   = require('famous/core/Modifier');
    var Transform  = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var Quaternion = require('famous/math/Quaternion');

    var mainContext = Engine.createContext();

    // The axis of the rotation is a Left Hand Rule vector with X Y Z (i j k) components
    var quaternion = new Quaternion(1, 0, 0, 0);
    var smallQuaternion = new Quaternion(185, 1, 1, 1);

    var rotationModifier = new Modifier({
        origin: [.5, .5],
        align: [.5, .5]
    });

    // Bind the box's rotation to the quaternion
    rotationModifier.transformFrom(function() {
        return quaternion.getTransform();
    });

    mainContext.add(rotationModifier)
               .add(createBox(260, 260, 260));

    // This is where the rotation is created
    Engine.on('prerender', function() {
        // You combine rotations through quaternion multiplication
        quaternion = quaternion.multiply(smallQuaternion);
    });

    Engine.on('click', function() {
        var x = (Math.random() * 2) - 1;
        var y = (Math.random() * 2) - 1;
        var z = (Math.random() * 2) - 1;
        smallQuaternion = new Quaternion(185, x, y, z);
    });

    // Creates box renderable
    function createBox(width, height, depth) {
        var box = new RenderNode();

        function createSide(params){
            var surface = new Surface({
                size: params.size,
                content: params.content,
                classes: params.classes,
                properties: params.properties
            });

            var modifier = new Modifier({
                transform: params.transform
            });

            box.add(modifier).add(surface);
        };

        // Front
        createSide({
            size: [width, height],
            content: '<h2>Hello World, let\'s get friendly.</h2><p>Isn\'t it awesome that you can scroll this scroller while the cube is moving?</p>',
            classes: ["red-bg"],
            properties: {
                lineHeight: 25 + 'px',
                textSize: '20px',
                textAlign: 'center',
                overflow: 'auto'
            },
            transform: Transform.translate(0, 0, depth / 2)
        });

        // Back
        createSide({
            size: [width, height],
            content: 'G\'bye world, Good to know you :D',
            properties: {
                lineHeight: height + 'px',
                textAlign: 'center',
                backgroundColor: '#ccc',
                fontSize: '18px',
                overflow: 'hidden',
                color: '#777'
            },
            transform: Transform.multiply(Transform.translate(0, 0, - depth / 2), Transform.multiply(Transform.rotateZ(Math.PI), Transform.rotateX(Math.PI))),
        });

        // Top
        createSide({
            size: [width, depth],
            content: 'I\'m on Top! Just a shimmy and a shake',
            properties: {
                lineHeight: depth + 'px',
                textAlign: 'center',
                backgroundColor: '#0cf',
                overflow: 'hidden',
                color: '#666'
            },
            transform: Transform.multiply(Transform.translate(0, -height / 2, 0), Transform.rotateX(Math.PI/2)),
        });

        // Bottom
        createSide({
            size: [width, depth],
            content: 'I\'m the bottom!',
            properties: {
                lineHeight: depth + 'px',
                textAlign: 'center',
                backgroundColor: '#fc0',
                overflow: 'hidden',
                color: '#777'
            },
            transform: Transform.multiply(Transform.translate(0, height / 2, 0), Transform.multiply(Transform.rotateX(-Math.PI/2), Transform.rotateZ(Math.PI))),
        });

        // Left
        createSide({
            size: [depth, height],
            content: 'I\'m the Left! I\'m content',
            properties: {
                lineHeight: height + 'px',
                textAlign: 'center',
                backgroundColor: '#f0c',
                overflow: 'hidden',
                color: '#777'
            },
            transform: Transform.multiply(Transform.translate(-width / 2, 0, 0), Transform.rotateY(-Math.PI/2))
        });

        // Right
        createSide({
            size: [depth, height],
            content: 'I\'m always Right!',
            properties: {
                lineHeight: height + 'px',
                textAlign: 'center',
                backgroundColor: '#c0f',
                overflow: 'hidden',
                color: '#777',
            },
            transform: Transform.multiply(Transform.translate(width / 2, 0, 0), Transform.rotateY(Math.PI/2))
        });

        return box;
    }
});

