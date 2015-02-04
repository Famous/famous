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
 * GridLayout with sized modifier
 * ------------------------------
 * 
 * GridLayouts will respect their parents size.  When placed behind
 * a modifier with a set size, the layout will expand to that size
 * instead of filling the full window.
 *
 * In this example, we see a GridLayout behind a sized Modifier.
 */
define(function(require, exports, module) {
    var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/core/Surface");
    var Modifier   = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");

    var mainContext = Engine.createContext();

    var grid = new GridLayout({
        dimensions: [4, 2]
    });

    var surfaces = [];
    grid.sequenceFrom(surfaces);

    for(var i = 0; i < 8; i++) {
        surfaces.push(new Surface({
            content: "I am panel " + (i + 1),
            size: [undefined, 100],
            properties: {
                backgroundColor: "hsl(" + (i * 360 / 8) + ", 100%, 50%)",
                color: "black",
                lineHeight: '100px',
                textAlign: 'center'
            }
        }));
    }

    mainContext.add(new Modifier({
        size: [400, 200],
        origin: [.5, .5],
        align: [.5, .5]
    })).add(grid);
});
