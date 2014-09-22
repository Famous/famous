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
 * Scrollview
 * ------------
 *
 * Scrollview is one of the core views in Famo.us. Scrollview
 * will lay out a collection of renderables sequentially in 
 * the specified direction, and will allow you to scroll 
 * through them with mousewheel or touch events.
 *
 * In this example, we have a Scrollview that sequences over
 * a collection of surfaces that vary in color
 */
define(function(require, exports, module) {
    var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/core/Surface");
    var Scrollview = require("famous/views/Scrollview");

    var mainContext = Engine.createContext();

    var scrollview = new Scrollview();
    var surfaces = [];

    scrollview.sequenceFrom(surfaces);

    for (var i = 0, temp; i < 40; i++) {
        temp = new Surface({
             content: "Surface: " + (i + 1),
             size: [undefined, 200],
             properties: {
                 backgroundColor: "hsl(" + (i * 360 / 40) + ", 100%, 50%)",
                 lineHeight: "200px",
                 textAlign: "center"
             }
        });

        temp.pipe(scrollview);
        surfaces.push(temp);
    }

    mainContext.add(scrollview);
});
