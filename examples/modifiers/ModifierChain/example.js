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
 * ModifierChain
 * -------------
 * 
 * ModifierChain is a class to add and remove a chain of modifiers
 * at a single point in the render tree.  Because it add exists 
 * in a single element, it has slight performance benefits over 
 * chaining individual modifiers.
 *
 * In the example, you can see that on the click event we are able
 * to remove a modifier after it has been added to the render tree.
 */
define(function(require, exports, module) {
    var Engine        = require('famous/core/Engine');
    var Modifier      = require('famous/core/Modifier');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var ModifierChain = require('famous/modifiers/ModifierChain');
   
    var mainContext = Engine.createContext();

    var modifierChain = new ModifierChain();

    var modifierOne = new Modifier({
        align: [.5, .5],
        origin: [0.5, 0.5]
    });

    var modifierTwo = new Modifier({
        transform: Transform.translate(0, 100, 0)
    });
    
    var surface = new Surface({
        size: [200, 200],
        content: "Click me to remove the center align/origin modifier",
        classes: ["red-bg"],
        properties: {
            textAlign: "center",
        }
    });

    modifierChain.addModifier(modifierOne);
    modifierChain.addModifier(modifierTwo);
    mainContext.add(modifierChain).add(surface);

    surface.on('click', function() {
        modifierChain.removeModifier(modifierOne);
        surface.setContent('Success!');
    });
});
