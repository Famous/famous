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
    var Engine         = require("famous/core/Engine");
    var Surface        = require("famous/core/Surface");
    var OmniScrollview = require("famous/views/OmniScrollview");
    var BorderLayout   = require("famous/views/BorderLayout");

    var mainContext = Engine.createContext();

    //Create the graph.  (CSS graph is 240px)
    var graph = new Surface({size:[4800, 4800], classes: ['graph']});

    //Create OmniScrollview and add the graph.  Events must be piped
    var scroll = new OmniScrollview({margin:[20, 20], rails:false, properties:{border:'2px inset #FFA79F'}});
    graph.pipe(scroll);
    scroll.add(graph);

    //Create a border layout with autoContainer true for scroll component
    var layout = new BorderLayout({autoContainer:true});

    //Add the OmniScrollview center automatically inside a ContainerSurface
    layout.add(scroll, BorderLayout.CENTER);

    //Add the layout
    mainContext.add(layout);
});
