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
 * After
 * --------
 *
 * After is a utility that will run a particular callback
 * once the returned function is called a set number of
 * times.
 *
 * In the example, the callback is run after the 5th click.
 */

define(function(require, exports, module) {
    var Engine  = require('famous/core/Engine');
    var Utility = require('famous/utilities/Utility');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');

    var mySurface = new Surface({
        size: [undefined, 100],
        properties: {
            backgroundColor: '#fa5c4f',
            lineHeight: '100px',
            textAlign: 'center',
            color: '#eee'
        },
        content: 'Take only the 5th click into account.'
    });

    var myModifier = new StateModifier({
        origin: [0, 0],
        align: [0, 0]
    });

    var mainContext = Engine.createContext();
    mainContext.add(myModifier).add(mySurface);

    var fn = Utility.after(5, function() {
        alert('Was called on 5th try');
    });

    Engine.on('click', fn);
});
