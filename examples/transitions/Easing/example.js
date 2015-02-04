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
 * Easing
 * --------
 *
 * Easing is a library of curves which map an animation
 * explicitly as a function of time.
 *
 * In this example we have a red ball that transitions from
 * the top of the box to the middle based on various easing
 * curves.
 */
define(function(require, exports, module) {
    var Engine           = require("famous/core/Engine");
    var Surface          = require("famous/core/Surface");
    var Modifier         = require("famous/core/Modifier");
    var Transform        = require("famous/core/Transform");
    var Transitionable   = require("famous/transitions/Transitionable");
    var Easing           = require("famous/transitions/Easing");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var ScrollView       = require("famous/views/Scrollview");

    // create the main context
    var mainContext = Engine.createContext();

   //create the dot
    var surface = new Surface({
        size:[100,100],
        classes: ['red-bg']
    });

    var modifier = new Modifier({
        align: [.5, .5],
        origin: [.5, .5],
        transform: Transform.translate(100,-240,0)
    });

    mainContext.add(modifier).add(surface);

    //This is where the meat is
    function _playCurve(curve){
        modifier.setTransform(Transform.translate(100,-240,0));
        modifier.setTransform(
            Transform.translate(100,0,0), 
            { curve: curve, duration: 1000}
        );
    }

    //Create a scroll view to let the user play with the different easing curves available.
    var curves = [];
    for(var curve in Easing){
        var surface = new Surface({
            size:[200,40],
            content: "<h3>" + curve + "</h3>",
            properties: {
                color:"#3cf",
                cursor: 'pointer'
            }
        });

        curves.push(surface);
        surface.on("click", 
            _playCurve.bind(null, Easing[curve])
        );
    }

    //this will hold and clip the scroll view
    var scrollContainer = new ContainerSurface({
        size: [200,480],
        properties: {
            overflow:"hidden",
            border: "1px solid rgba(255,255,255, .8)",
            borderRadius: "10px 0px 0px 10px"
        }
    });

    //the actual scroll view
    var scrollView = new ScrollView({
        clipSize: 460
    });

    //set where the items come from 
    scrollView.sequenceFrom(curves);

    //give the scroll view input
    scrollContainer.pipe(scrollView);

    //add the scrollview to the scroll container
    scrollContainer.add(new Modifier({transform: Transform.translate(20,0,0)})).add(scrollView);
    
    //finally add the scroll container to the context
    mainContext.add(new Modifier({align: [.5, .5], origin: [.5, .5], transform: Transform.translate(-240,0,0)})).add(scrollContainer);
});
