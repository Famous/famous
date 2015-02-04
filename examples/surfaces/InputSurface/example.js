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
 * InputSurface
 * ------------
 *
 * InputSurface is the same interface as a regular Surface
 * except that it will create an input tag instead of a
 * div tag.  It also exposes an interface for defining
 * input specific properites such as name, placeholder, value,
 * and type.
 *
 * In this example we have an InputSurface to insert
 * text.
 */
define(function(require, exports, module) {
    var Engine       = require("famous/core/Engine");
    var Modifier     = require("famous/core/Modifier");
    var InputSurface = require("famous/surfaces/InputSurface");

    var mainCtx = Engine.createContext();

    var input = new InputSurface({
        size: [200, 200],
        name: 'inputSurface',
        placeholder: 'Type text here',
        value: '',
        type: 'text'
    });

    mainCtx.add(new Modifier({
        align: [.5, .5],
        origin: [.5, .5]
    })).add(input);
});
