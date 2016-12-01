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
 * OmniScrollview
 * ------------
 *
 * OmniScrollview is an omni-directional container for scrolling components.  This
 * example creates a large surface with a CSS graph.
 *
 * See the "linked-scroll-border-example" for a scrolling example with multiple
 * linked OmniScrollview components.
 */
define(function(require, exports, module) {
    var Engine           = require("famous/core/Engine");
    var Surface          = require("famous/core/Surface");
    var OmniScrollview   = require("famous/views/OmniScrollview");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");

    var mainContext = Engine.createContext();

    //Create the graph.  (CSS graph is 240px)
    var graph = new Surface({size:[4800, 4800], classes: ['graph']});

    //Create OmniScrollview and add the graph.  Events must be piped
    var scroll = new OmniScrollview({rails:false});
    graph.pipe(scroll);
    scroll.add(graph);

    //Add scroll to container for clipping
    var container = new ContainerSurface({
       size: [undefined, undefined],
       properties: {
          overflow: 'hidden'
       }
    });
    container.add(scroll);

    //Add the container
    mainContext.add(container);
});
