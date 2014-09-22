/**
 * Copyright (c) 2014 Famous Industries, Inc.
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
 * View
 * -------
 *
 * View is one of the core components of Famo.us.  A view is 
 * a way to encapsulate modifiers, surfaces, and other views 
 * into a single view so they can be treated as a single component.
 *
 * Views also have dual EventHandlers for controlling the input
 * and output of events and an OptionsManager for dealing with 
 * recursive options passing.
 *
 * In this example, you can see that once the surfaces are added 
 * and have their output piped to the view, you no longer have
 * to deal with the surfaces themselves and just deal with the
 * view itself.
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var View      = require("famous/core/View");
    var Surface   = require("famous/core/Surface");
    var Modifier  = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");

    var mainContext = Engine.createContext();

    var view = new View();

    var surface = new Surface({
        size: [200, 200],
        content: "Hello World",
        classes: ["red-bg"],
        properties: {
            lineHeight: "200px",
            textAlign: "center"
        }
    });
    surface.pipe(view);

    view._eventInput.on("click", function() {
        alert("Primary Surface Clicked");
    });

    var viewTwo = new View();

    var mod = new Modifier({
        transform: Transform.thenMove(Transform.rotateZ(Math.PI * 0.25),[200, 100, 1])
    });

    var surfaceTwo = new Surface({
        size: [200, 200],
        content: "Secondary",
        classes: ["grey-bg"],
        properties: {
            lineHeight: "200px",
            textAlign: "center"
        }
    });
    surfaceTwo.pipe(viewTwo);

    viewTwo._eventInput.on("click", function() {
        alert("Secondary Surface Clicked");
    });

    view._add(surface);
    viewTwo._add(mod).add(surfaceTwo);

    mainContext.add(view);
    mainContext.add(viewTwo);
});
