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
 * RotateSync
 * ------------
 * 
 * RotateSync handles piped-in two-finger touch events to support rotation.
 * It outputs an object with position, velocity, touches, and angle.
 *
 * In this example, we create a RotateSync and display the data
 * it receives to the screen.
 */
define(function(require, exports, module) {
    var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/core/Surface");
    var RotateSync = require("famous/inputs/RotateSync");

    var mainContext = Engine.createContext();

    var start = 0;
    var update = 0;
    var end = 0;
    var direction = "";
    var angle = 0;
    var delta = 0;

    var rotateSync = new RotateSync();

    Engine.pipe(rotateSync);

    var contentTemplate = function() {
        return "<div>Start Count: " + start + "</div>" +
        "<div>End Count: " + end + "</div>" +
        "<div>Update Count: " + update + "</div>" +
        "<div>Direction: " + direction + "</div>" +
        "<div>Delta: " + delta.toFixed(3) + "</div>" +
        "<div>Angle: " + angle.toFixed(3) + "</div>";
    };

    var surface = new Surface({
        size: [undefined, undefined],
        classes: ['grey-bg'],
        content: contentTemplate()
    });

    rotateSync.on("start", function() {
        start++;
        angle = 0;
        surface.setContent(contentTemplate());
    });

    rotateSync.on("update", function(data) {
        update++;
        direction = data.velocity > 0 ? "Clockwise" : "Counter-Clockwise";
        angle = data.angle;
        delta = data.delta;
        surface.setContent(contentTemplate());
    });

    rotateSync.on("end", function() {
        end++;
        surface.setContent(contentTemplate());
    });

    mainContext.add(surface);
});
