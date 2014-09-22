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
 * Timer every
 * ------------
 *
 * Every will continually run a function after a particular 
 * amount of engine ticks.
 *
 * In this example we run a function to update the surfaces content
 * after 100 engine ticks.
 */
define(function(require, exports, module) {
    var Engine   = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Surface  = require('famous/core/Surface');
    var Timer    = require('famous/utilities/Timer');

    var mainContext = Engine.createContext();

    var counter = 0;
    var surface = new Surface({
        size: [undefined, undefined],
        content: 'this function will run every 100 engine ticks',
        classes: ['red-bg'],
        properties: {
            lineHeight: '500px',
            textAlign: 'center'
        }
    });
    mainContext.add(new Modifier({
        align :[.5, .5],
        origin :[.5, .5]
    })).add(surface);

    Timer.every(function() {
        surface.setContent('this function has run ' + ++counter + ' time(s)');
    }, 100);
});
