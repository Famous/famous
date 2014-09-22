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
 * Modifier with opacity
 * ---------------------
 *
 * Modifiers have an opacity property.  By setting the opacity
 * of a modifier, all renderables below the modifier in the
 * render tree will have their opacity's affected multiplicatively.
 *
 * In this example we have one surface being affected by a .5
 * opacity modifier and another surface that is affected by that
 * same modifier plus an additional .25 opacity modifier which
 * results in an opacoty of .125.   
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var Surface   = require("famous/core/Surface");
    var Modifier  = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");

    var mainContext = Engine.createContext();

    var halfOpacityMod = new Modifier({
        opacity: 0.5
    });

    var quarterOpacity = new Modifier({
        transform: Transform.translate(100, 0, 0),
        opacity: 0.25
    });

    var surfaceOne = new Surface({
        size: [100, 100],
        content: "Half",
        classes: ["red-bg"],
        properties: {
            textAlign: 'center',
            lineHeight: '100px'
        }
    });

    var surfaceTwo = new Surface({
        size: [100, 100],
        content: ".125 Opacity",
        classes: ["red-bg"],
        properties: {
            textAlign: 'center',
            lineHeight: '100px'
        }
    });

    var halfOpacity = mainContext.add(halfOpacityMod);
    halfOpacity.add(surfaceOne);
    halfOpacity.add(quarterOpacity).add(surfaceTwo);
});
