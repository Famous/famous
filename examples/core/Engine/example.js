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
 * Engine
 * ------
 *
 * The Famo.us Engine is responsible for managing the requestAnimationFrame loop,
 * creating Famo.us contexts, and listening to DOM events on the window. The
 * Engine is a JavaScript singleton: there is only one instance per app.
 *
 */
define(function(require, exports, module) {
    var Engine  = require("famous/core/Engine");
    var Surface = require("famous/core/Surface");

    var mainContext = Engine.createContext();

    var surface = new Surface({
        size: [undefined, 200],
        content: "Hello World",
        classes: ["red-bg"],
        properties: {
            textAlign: "center"
        }
    });

    mainContext.add(surface);

    // listen on window resize
    Engine.on("resize", function() {
        surface.setContent(
            'dimensions:' + '<br>' +
            'width : ' + window.innerWidth  + 'px ' + '<br>' +
            'height: ' + window.innerHeight + 'px'
        );
    });

    // listen on click
    Engine.on("click", function(event){
        surface.setContent(
            'click position:' + '<br>' +
            'x :' + event.clientX + 'px ' + '<br>' +
            'y :' + event.clientY + 'px'
        );
    });

    // exectute function on next requestAnimationFrame cycle
    Engine.nextTick(function() {
        surface.setContent("Try resizing the device/window or clicking somewhere!");
    });
});
