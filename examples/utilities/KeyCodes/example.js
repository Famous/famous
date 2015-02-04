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
 * KeyCodes
 * ---------
 *
 * KeyCodes is a simple utility for mapping number and letter
 * keycodes.
 *
 * In this example, the content of the surface reflects whether
 * the last key pressed was a number or not.
 */
define(function(require, exports, module) {
    var Engine   = require('famous/core/Engine');
    var Surface  = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var KeyCodes = require('famous/utilities/KeyCodes');
   
    var mainContext = Engine.createContext();

    var surface = new Surface({
        size: [200, 200],
        content: 'press keys',
        classes: ['red-bg'],
        properties: {
            lineHeight: '200px',
            textAlign: 'center'
        }
    });

    mainContext.add(new Modifier({
        align  : [.5, .5],
        origin : [.5, .5]
    })).add(surface);

    Engine.on('keypress', function(event) {
        if (event.charCode >= KeyCodes['0'] && event.charCode <= KeyCodes['9']) {
            surface.setContent('you hit a number');
        } else {
            surface.setContent('not a number')
        }
    });
});
