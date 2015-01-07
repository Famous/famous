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
 * SizeAwareView
 * ------------------
 *
 * SizeAwareView extends the View class by adding a .getParentSize()
 * method and emitting a 'parentResize' event whenever the parent's
 * size changes.
 *
 * SizeAwareView is a very useful class for building responsive
 * layouts.
 */
define(function(require, exports, module) {
    var Engine        = require("famous/core/Engine");
    var Surface       = require("famous/core/Surface");
    var SizeAwareView = require("famous/views/SizeAwareView");

    var mainContext = Engine.createContext();

    var sizeAwareView = new SizeAwareView();

    var getSurfaceContent = function () {
        return '' +
        'Parent size updates on window resize!' +
        '<br>' +
        'Parent Size: [' + sizeAwareView.getParentSize() + ']'
    };

    var surface = new Surface({
        content: getSurfaceContent(),
        size: [400, 400],
        classes: ["red-bg"],
        properties: {
            textAlign: 'center',
            paddingTop: '100px'
        }
    });
    sizeAwareView.add(surface);

    // Update Surface's content on parent's resize
    sizeAwareView._eventInput.on('parentResize', function (parentSize) {
        surface.setContent(getSurfaceContent());
    });

    mainContext.add(sizeAwareView);
});
