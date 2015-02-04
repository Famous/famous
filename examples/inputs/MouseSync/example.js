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
 * MouseSync
 * ------------
 *
 * MouseSync handles mouse drag events. It outputs an object with two
 * properties: position and velocity.
 *
 * In this example, we create a MouseSync and display the data
 * it receives to the screen.  Based on the update information,
 * we can determine how far away from the mousedown event location
 * we are when we are dragging.
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var MouseSync = require("famous/inputs/MouseSync");
    var Surface   = require("famous/core/Surface");

    var mainContext = Engine.createContext();

    var start = 0;
    var update = 0;
    var end = 0;

    var delta = [0,0];
    var position = [0, 0];
    var mouseSync = new MouseSync();

    Engine.pipe(mouseSync);

    var contentTemplate = function() {
        return "<div>Start Count: " + start + "</div>" +
        "<div>End Count: " + end + "</div>" +
        "<div>Update Count: " + update + "</div>" +
        "<div>Delta: " + delta + "</div>" +
        "<div>Distance from start: " + position + "</div>";
    };

    var surface = new Surface({
        size: [undefined, undefined],
        classes: ["grey-bg"],
        content: contentTemplate()
    });

    mouseSync.on("start", function() {
        start++;
        position = [0, 0];
        surface.setContent(contentTemplate());
    });

    mouseSync.on("update", function(data) {
        update++;
        position = data.position;
        delta = data.delta;

        surface.setContent(contentTemplate());
    });

    mouseSync.on("end", function() {
        end++;
        surface.setContent(contentTemplate());
    });

    mainContext.add(surface);
});
