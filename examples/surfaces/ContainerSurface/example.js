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
 * ContainerSurface
 * ----------------
 * ContainerSurface is an object designed to contain surfaces and 
 * set properties to be applied to all of them at once.
 * A container surface will enforce these properties on the 
 * surfaces it contains:
 * 
 * - size (clips contained surfaces to its own width and height)
 * 
 * - origin
 * 
 * - its own opacity and transform, which will be automatically 
 *   applied to  all Surfaces contained directly and indirectly.
 *
 * In this example we have a ContainerSurface that contains a Scrollview.
 * Because the ContainerSurface creates its own context the
 * Scrollview will behave according to the size of the ContainerSurface
 * it exists within.  The ContainerSurface having the an overflow of
 * 'hidden' means that the scrollview overflow will be hidden.
 */
define(function(require, exports, module) {
    var Engine           = require("famous/core/Engine");
    var Surface          = require("famous/core/Surface");
    var Modifier         = require("famous/core/Modifier");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var Scrollview       = require("famous/views/Scrollview");

    var mainContext = Engine.createContext();

    var container = new ContainerSurface({
        size: [400, 400],
        properties: {
            overflow: 'hidden'
        }
    });

    var surfaces = [];
    var scrollview = new Scrollview();

    var temp;
    for (var i = 0; i < 100; i++) {
        temp = new Surface({
            size: [undefined, 50],
            content: 'I am surface: ' + (i + 1),
            classes: ['red-bg'],
            properties: {
                textAlign: 'center',
                lineHeight: '50px'
            }
        });

        temp.pipe(scrollview);
        surfaces.push(temp);
    }

    scrollview.sequenceFrom(surfaces);
    container.add(scrollview);

    mainContext.add(new Modifier({
        align: [.5, .5],
        origin: [.5, .5]
    })).add(container);
});
