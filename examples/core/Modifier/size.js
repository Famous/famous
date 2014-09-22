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
 * Modifier with size
 * ------------------
 *
 * Modifiers have a size property that will affect any children
 * that depend on the size or origin of the parent. Size can be thought of as
 * a "bounding box" from which an origin and node size is relative to.
 *
 * In this example, we have a surface whose size is [undefined, undefined].
 * Famo.us will then size the surface relative to the last defined size context.
 * Since we include a modifier with size of [200,200] before the surface, the surface
 * is sized to [200,200].
 *
 * To demonstrate origin relative to a size context, we have defined a rotation
 * about the center of a [200,200] bounding box, so that our surface rotates about
 * its center, as opposed to the default origin [0,0] (top left corner).
 *
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var Surface   = require("famous/core/Surface");
    var Modifier  = require("famous/core/Modifier");
    var Transform = require("famous/core/Transform");

    var mainContext = Engine.createContext();

    var sizeMod = new Modifier({
        size: [200, 200]
    });

    var surface = new Surface({
        size: [undefined, undefined],
        classes: ["grey-bg"],
        properties: {
            lineHeight: '200px',
            textAlign: 'center'
        }
    });

    mainContext.add(sizeMod).add(surface);
});
