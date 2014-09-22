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
 * Draggable
 * -----------
 *
 * Draggable is a modifier that allows a renderable to be
 * responsive to drag behavior.
 *
 * In this example we can see that the red surface is draggable
 * because it sits behind a draggable modifier.  It has boundaries
 * and snaps because of the options set on the draggable modifier.
 */
define(function(require, exports, module) {                                                                                                                                                                 
    var Engine    = require('famous/core/Engine');
    var Surface   = require('famous/core/Surface');
    var Modifier  = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Draggable = require('famous/modifiers/Draggable');

    var mainContext = Engine.createContext();

    //show a grid for reference
    var grid = new Surface({
        size: [481,481],
        classes: ['graph']
    });

    var draggable = new Draggable({
        snapX: 40, 
        snapY: 40, 
        xRange: [-220, 220],
        yRange: [-220, 220]
    });

    var surface = new Surface({
        size: [40, 40],
        content: 'drag',
        classes: ['red-bg'],
        properties: {
            lineHeight: '40px',
            textAlign: 'center',
            cursor: 'pointer'
        }
    });

    draggable.subscribe(surface);

    var node = mainContext.add(new Modifier({align: [.5, .5], origin:[0.5,0.5]}));
    node.add(grid);
    node.add(draggable).add(surface);
});
