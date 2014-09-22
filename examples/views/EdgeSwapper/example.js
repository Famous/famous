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
 * EdgeSwapper
 * ------------
 *
 * EdgeSwapper is a container which handles swapping 
 * renderables from the edge of its parent context.
 *
 * In this example, we toggle the view that is shown on every
 * click.
 */
define(function(require, exports, module) {
    var Engine      = require("famous/core/Engine");
    var Surface     = require("famous/core/Surface");
    var EdgeSwapper = require("famous/views/EdgeSwapper");

    var mainContext = Engine.createContext();

    var edgeswapper = new EdgeSwapper();

    var primary = new Surface({
        size: [undefined, undefined],
        content: "Primary",
        classes: ["red-bg"],
        properties: {
            lineHeight: window.innerHeight + "px",
            textAlign: "center"
        }
    });

    var secondary = new Surface({
        size: [undefined, undefined],
        content: "Secondary",
        classes: ["grey-bg"],
        properties: {
            lineHeight: window.innerHeight + "px",
            textAlign: "center"
        }
    });
    mainContext.add(edgeswapper); 

    edgeswapper.show(primary);

    var showing = true;
    Engine.on("click", function() {
        if (showing) {
            edgeswapper.show(secondary);
            showing = false;
        } else {
            edgeswapper.show(primary);
            showing = true;
        }
    });
});
