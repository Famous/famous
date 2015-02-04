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
 * Modifier chaining
 * ------------------
 *
 * When you chain modifiers all of them will be applied to 
 * any children in the render tree.  The order in which you add
 * the modifiers matters.  Translating and then rotating is not the same as
 * rotating and then translating.
 *
 * In this example, we can see that the two surfaces are laid out
 * differently because one has its translation happen before its rotation,
 * and the reverse is true for the other.
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var Surface   = require("famous/core/Surface");
    var Modifier  = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");

    var mainContext = Engine.createContext();

    var modifierOne = new Modifier({
        transform: Transform.translate(200, 0, -1)
    });

    var modifierTwo = new Modifier({
        transform: Transform.rotateZ(0.7)
    });

    var surface = new Surface({
        size: [200, 200],
        content: "Translate then rotate",
        classes: ["red-bg"],
        properties: {
            textAlign: 'center',
            lineHeight: '200px'
        }
    });

    var modifierThree = new Modifier({
        transform: Transform.rotateZ(0.7)
    });

    var modifierFour = new Modifier({
        transform: Transform.translate(200, 0, 0)
    });

    var surfaceTwo = new Surface({
        size: [200, 200],
        content: "Rotate then translate",
        classes: ["grey-bg"],
        properties: {
            textAlign: 'center',
            lineHeight: '200px'
        }
    });

    mainContext.add(modifierOne).add(modifierTwo).add(surface);
    mainContext.add(modifierThree).add(modifierFour).add(surfaceTwo);
});
