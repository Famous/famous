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
 * Transform
 * ---------
 *
 * A Famo.us Transform corresponds to a CSS3 3D transform.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
 *
 * With transforms you can affect the translation, rotation, scale, or skew of a
 * Famo.us renderable, e.g., a Famo.us Surface.
 *
 * Transforms are generally parameters to Famo.us modifiers which apply the
 * transform to its children.
 *
 * In this example, a Transform corresponding to a rotation of 45 degreees
 * is created and applied to a surface via a Famo.us Modifier.
 *
 * TODO: add example with a transitioning transform
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var Surface   = require("famous/core/Surface");
    var Modifier  = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");

    var mainContext = Engine.createContext();

    var rotateModifier = new Modifier({
        transform: Transform.rotateZ(Math.PI/4)
    });

    var surface = new Surface({
        size: [200, 200],
        content: "Hello World",
        classes: ["red-bg"],
        properties: {
            lineHeight: "200px",
            textAlign: "center"
        }
    });

    mainContext.add(rotateModifier).add(surface);
});
