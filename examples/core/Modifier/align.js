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
 * Modifier with align
 * --------------------
 * Modifiers have an `align` property. This property controls the
 * position of the modifier's children in the render tree. Its
 * default value, `[0, 0]`, places the modifier's render node at
 * the top left of its parent.
 * 
 * Size and alignment work together to determine the position of
 * render nodes. Consider a render node with an alignment of `[1, 1]`
 * (bottom right). As its parent node's size changes, its position
 * on the screen will change. This diagram explains the effect:
 * 
 *     +--+    +----+
 *     |  | => |    |
 *     | *|    |    |
 *     +--+    |   *|
 *             +----+
 * 
 * In the example below, nine surfaces are placed inside of a Famo.us
 * context. By changing their alignment, we can lay them out at key
 * positions within their sizing context. (Note that by default, the
 * context's size is the size of the window.)
 * 
 */
define(function(require, exports, module) {
    var Engine   = require("famous/core/Engine");
    var Surface  = require("famous/core/Surface");
    var Modifier = require("famous/core/Modifier");

    var mainContext = Engine.createContext();

    var aligns = [
        [.5, .5],
        [ 0,  0],
        [.5,  0],
        [ 1,  0],
        [ 0, .5],
        [ 1, .5],
        [ 0,  1],
        [.5,  1],
        [ 1,  1]
    ];

    var alignKey = 0;

    var modifier = new Modifier({
        align: function() {
            return aligns[alignKey];
        }
    });

    var border = new Surface({
        size: [undefined, undefined],
        properties: {
            border: '2px solid black'
        }
    });

    var surface = new Surface({
        size: [100, 100],
        content: '[.5, .5]',
        classes: ['red-bg'],
        properties: {
            lineHeight: '100px',
            textAlign: 'center'
        }
    });

    var node = mainContext.add(new Modifier({
        align: [.5, .5],
        origin: [.5, .5],
        size: [300, 300]
    }));

    node.add(border);
    node.add(modifier).add(surface);

    Engine.on('click', function() {
        alignKey = ++alignKey % aligns.length;
        surface.setContent(aligns[alignKey]);
    })
});
