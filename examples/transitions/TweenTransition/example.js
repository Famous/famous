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
 * TweenTransition
 * --------
 *
 * TweenTransition is a state maintainer for a smooth transition between
 * numerically-specified states.
 *
 * In this example, a surface is faded out based on a TweenTransition.
 */
define(function(require, exports, module) {
    var Engine          = require("famous/core/Engine");
    var Surface         = require("famous/core/Surface");
    var Modifier        = require("famous/core/Modifier");
    var Transform       = require("famous/core/Transform");
    var Transitionable  = require("famous/transitions/Transitionable");
    var TweenTransition = require("famous/transitions/TweenTransition");
    
    var mainContext = Engine.createContext();

    var surface = new Surface({
        size:[100,100],
        content: 'Click Me',
        classes: ['red-bg'],
        properties: {
            textAlign: 'center',
            lineHeight: '100px'
        }
    });

    var modifier = new Modifier({
        align: [.5, .5],
        origin: [.5, .5],
        transform: Transform.translate(0,0,0)
    });

    Transitionable.registerMethod('tween', TweenTransition);
    var transitionable = new Transitionable(1);

    modifier.opacityFrom(function() {
        return transitionable.get();
    });

    var transition = {
        method: 'tween',
        curve: "easeInOut",
        duration: 1500,
    };
    
    surface.on("click", function(){
        transitionable.set(0, transition);
    });

    mainContext.add(modifier).add(surface);
});
