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
 * BorderLayout and OmniScrollview
 * -----------------------------
 *
 * This example how to link OmniScrollview components together in a BorderLayout to 
 * create a complex scrolling interface.  This example places 5 linked OmniScrollview
 * objects, with their own contained Surfaces, in a BorderLayout as follows:
 *
 *    +--------+------------+--------+
 *    |   NW   | <-Scroll-> |   NE   |
 *    +--------+------------+--------+
 *    |   ^    |   ^ ^ ^    |    ^   |
 *    |   |    |    \|/     |    |   |
 *    | Scroll | <-Scroll-> | Scroll |
 *    |   |    |    /|\     |    |   |
 *    |   v    |   v v v    |    v   |
 *    +--------+------------+--------+
 *    |   SW   | <-Scroll-> |   SE   |
 *    +--------+------------+--------+
 *
 * Scrolling any of the OmniScrollview causes the other scrolling components to move
 * in their allowed directions.  Set rails to true to force the center scrolling to 
 * horizontal and vertical only.
 */
define(function(require, exports, module) {
    var Engine         = require("famous/core/Engine");
    var Surface        = require("famous/core/Surface");
    var BorderLayout   = require("famous/views/BorderLayout");
    var OmniScrollview = require("famous/views/OmniScrollview");
    var Utility        = require('famous/utilities/Utility');

    //Settings
    var HORIZONTAL  = Utility.Direction.X;
    var VERTICLE    = Utility.Direction.Y;
    var mainColor   = '#5A825A';
    var borderColor = '#73AF78';
    var cornerProps = {backgroundColor:mainColor, textAlign:'center', lineHeight:'90px'};
    var scrollProps = {backgroundColor:mainColor, border:'2px', borderColor:borderColor, borderStyle:'inset'};

    var mainContext = Engine.createContext();

    //Set the background color to match corners
    var body = document.querySelector('body')
    body.setAttribute('style', 'color: black; background-color:'+ mainColor);

    //Create the BorderLayout with autoContainer true
    var layout = new BorderLayout({id:'mylayout', autoContainer:true, debug:false});

    //Add corners
    layout.add(new Surface({content: 'NW', properties: cornerProps}), BorderLayout.NW);
    layout.add(new Surface({content: 'NE', properties: cornerProps}), BorderLayout.NE);
    layout.add(new Surface({content: 'SW', properties: cornerProps}), BorderLayout.SW);
    layout.add(new Surface({content: 'SE', properties: cornerProps}), BorderLayout.SE);

    //Graphs for center, north, south, east, and west
    var graph_C = new Surface({size:[3360, 3360], classes: ['graph']});
    var graph_N = new Surface({size:[3360, 100], classes: ['graph']});
    var graph_S = new Surface({size:[3360, 100], classes: ['graph']});
    var graph_E = new Surface({size:[110, 3360], classes: ['graph']});
    var graph_W = new Surface({size:[110, 3360], classes: ['graph']});

    //Create OmniScrollviews for the BorderLayout
    var scroll_C = new OmniScrollview({rails: false, properties: scrollProps});  //Center scroll, no size needed
    graph_C.pipe(scroll_C);
    scroll_C.add(graph_C);

    var scroll_N = new OmniScrollview({margin: [10, 0], size:[undefined, 85], direction:HORIZONTAL, properties: scrollProps});  //North scroll
    graph_N.pipe(scroll_N)
    scroll_N.add(graph_N);

    var scroll_S = new OmniScrollview({margin: [10, 0], size:[undefined, 85], direction:HORIZONTAL, properties: scrollProps});  //South scroll
    graph_S.pipe(scroll_S)
    scroll_S.add(graph_S);

    var scroll_E = new OmniScrollview({margin: [0, 10], size:[85, undefined], direction:VERTICLE, properties: scrollProps});  //East scroll
    graph_E.pipe(scroll_E)
    scroll_E.add(graph_E);

    var scroll_W = new OmniScrollview({margin: [0, 10], size:[85, undefined], direction:VERTICLE, properties: scrollProps});  //West scroll
    graph_W.pipe(scroll_W)
    scroll_W.add(graph_W);

    //link all OmniScrollview objects together. Movement on one moves the others in their allowed direction.
    OmniScrollview.link([scroll_C, scroll_N, scroll_S, scroll_E, scroll_W]);

    //add the OmniScrollview objects to the BorderLayout
    layout.add(scroll_C, BorderLayout.CENTER);
    layout.add(scroll_N, BorderLayout.NORTH);
    layout.add(scroll_S, BorderLayout.SOUTH);
    layout.add(scroll_E, BorderLayout.EAST);
    layout.add(scroll_W, BorderLayout.WEST);

    //Add the layout
    mainContext.add(layout);
});
