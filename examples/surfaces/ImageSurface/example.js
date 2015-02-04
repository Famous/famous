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
 * ImageSurface
 * ------------
 *
 * ImageSurface is the same interface as a regular Surface
 * except that it will create an img tag instead of a
 * div tag.  When you call setContent on an ImageSurface,
 * it will change the src property of the tag.
 *
 * In this example we have an ImageSurface with the
 * Famo.us logo as it's content.
 */
define(function(require, exports, module) {
    var Engine       = require("famous/core/Engine");
    var Modifier     = require("famous/core/Modifier");
    var ImageSurface = require("famous/surfaces/ImageSurface");

    var mainCtx = Engine.createContext();

    var image = new ImageSurface({
        size: [200, 200]
    });

    image.setContent("http://code.famo.us/assets/famous.jpg");

    mainCtx.add(new Modifier({
        align: [.5, .5],
        origin: [.5, .5]
    })).add(image);
});
