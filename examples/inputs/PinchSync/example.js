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
 * PinchSync
 * ------------
 * 
 * PinchSync handles piped-in two-finger touch events to change
 * position via pinching / expanding. It outputs an object with
 * position, velocity, touch IDs, and distance.
 *
 * In this example, we create a PinchSync and display the data
 * it receives to the screen.  Based on the data, we can decide if
 * it is pinching or expanding.
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var Surface   = require("famous/core/Surface");
    var PinchSync = require("famous/inputs/PinchSync");

    var mainCtx = Engine.createContext();

    var start = 0;
    var update = 0;
    var end = 0;
    var direction = "";
    var distance = 0;
    var delta = 0;
    var displacement = 0;

    var pinchSync = new PinchSync();

    Engine.pipe(pinchSync);

    var contentTemplate = function() {
        return "<div>Start Count: " + start + "</div>" +
        "<div>End Count: " + end + "</div>" +
        "<div>Update Count: " + update + "</div>" +
        "<div>Pinch Direction: " + direction + "</div>" +
        "<div>Delta: " + delta.toFixed(3) + "</div>" +
        "<div>Separation Distance: " + distance.toFixed(3) + "</div>" +
        "<div>Separation Displacement: " + displacement.toFixed(3) + "</div>";
    };

    var surface = new Surface({
        size: [undefined, undefined],
        classes: ["grey-bg"],
        content: contentTemplate()
    });

    pinchSync.on("start", function() {
        start++;
        surface.setContent(contentTemplate());
    });

    pinchSync.on("update", function(data) {
        update++;
        distance = data.distance;
        direction = data.velocity > 0 ? "Expanding" : "Contracting";
        displacement = data.displacement;
        delta = data.delta;
        surface.setContent(contentTemplate());
    });

    pinchSync.on("end", function() {
        end++;
        surface.setContent(contentTemplate());
    });

    mainCtx.add(surface);
});
