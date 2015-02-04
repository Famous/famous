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
 * Timer
 * --------
 *
 * Timer is a utility that integrates with Engine to 
 * perform more precise timing operations.
 * 
 * In this example we reset the content of the surface
 * afer 200 ticks from the Engine.
 */
define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Timer = require('famous/utilities/Timer');
   
    var mainContext = Engine.createContext();

    var counter = 0;

    var surface = new Surface({
        size: [undefined, 200],
        content: 'this function has not been run',
        classes: ['red-bg'],
        properties: {
            lineHeight: '200px',
            textAlign: 'center'
        }
    });

    mainContext.add(new Modifier({
        align  :[.5, .5],
        origin :[.5, .5]
    })).add(surface);

    Timer.after(function() {
        surface.setContent('this function was run after 200 Engine ticks')
    }, 200);
});
