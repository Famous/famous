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
 * Multiple BorderLayouts
 * ----------------------
 *
 * You can place multiple BorderLayouts within a border layout to create more
 * complex layouts.
 * 
 * In this example, we create a simple black header-footer layout consisting of 
 * a BorderLayout with logos and buttons.  Then, several other BorderLayouts
 * are added center in the header-footer layout.
 */
define(function(require, exports, module) {
    var Engine           = require("famous/core/Engine");
    var Modifier         = require("famous/core/Modifier");
    var Surface          = require("famous/core/Surface");
    var Transform        = require("famous/core/Transform");
    var ContainerSurface = require("famous/surfaces/ContainerSurface");
    var ImageSurface     = require("famous/surfaces/ImageSurface");
    var BorderLayout     = require("famous/views/BorderLayout");

    var mainContext = Engine.createContext();

    /**
     * Create the header and footer as a border layout.  Two logos are added to
     * the top corners, and two buttons are added to the bottom corners.
     *
     * @returns {BorderLayout}
     */
    var createHeaderFooter = function(north, south, east, west, createLogo) {
       var props = {color:'white', background: 'black', textAlign: 'center'};
       var layout = new BorderLayout({id:'hflayout'});

       //north, south, east, and west
       layout.add(new Surface({size:[undefined, north], content: 'North', properties:props}), BorderLayout.NORTH);
       layout.add(new Surface({size:[undefined, south], content: 'South', properties:props}), BorderLayout.SOUTH);
       layout.add(new Surface({size:[east,  undefined], content: 'E', properties:props}), BorderLayout.EAST);
       layout.add(new Surface({size:[west,  undefined], content: 'W', properties:props}), BorderLayout.WEST);

       //top corners
       layout.add(createLogo([west, north], 'black'), BorderLayout.NW);
       layout.add(createLogo([east, north], 'black'), BorderLayout.NE);

       //outline button container
       var outline = new Surface({
          size:[140, undefined],
          content:"<div class='button'>Show Outline</div>",
          properties: {background: 'black'}
       });

       outline.on('click', function (evt) {
          var body = document.querySelector('body');
          body.classList.toggle('showBorder');
       });

       //add layout button container
       var addLayout = new Surface({
          size:[140, undefined],
          content:"<div class='button'>Add Layout</div>",
          properties: {background: 'black'}
       });

       //add buttons south east and west
       layout.add(outline, BorderLayout.SE);
       layout.add(addLayout, BorderLayout.SW);
       return layout;
    }

    /**
     * Convenience method to create a BorderLayout.  Note that size is ignored
     * if the layout is placed center on another layout.
     *
     * @returns {BorderLayout}
     */
    var createBorderLayout = function(north, south, east, west, size) {
       var props1 = {textAlign: 'center', color:'#000', backgroundColor:'#C6B8FF'};
       var props2 = {textAlign: 'center', color:'#000', backgroundColor:'#BEDA8E'};
       var props3 = {textAlign: 'center', color:'#000', backgroundColor:'#EBD181'};
       var props4 = {textAlign: 'center', color:'#000', background:'linear-gradient(to bottom, #FFFFFF 0%,#777777 100%)'};

       var layout = new BorderLayout({id:'mylayout', size:size});
       layout.add(new Surface({content: 'Center', properties:props4}), BorderLayout.CENTER);
       layout.add(new Surface({size:[undefined, north], content: 'N', properties:props1}), BorderLayout.NORTH);
       layout.add(new Surface({size:[undefined, south], content: 'S', properties:props1}), BorderLayout.SOUTH);
       layout.add(new Surface({size:[west, undefined], content: 'W', properties:props2}), BorderLayout.WEST);
       layout.add(new Surface({size:[east, undefined], content: 'E', properties:props2}), BorderLayout.EAST);
       layout.add(new Surface({content: 'NW', properties:props3}), BorderLayout.NW);
       layout.add(new Surface({content: 'NE', properties:props3}), BorderLayout.NE);
       layout.add(new Surface({content: 'SW', properties:props3}), BorderLayout.SW);
       layout.add(new Surface({content: 'SE', properties:props3}), BorderLayout.SE);

       return layout;
    }

    /**
     * Convenience method to create a spinning logo within a container.
     *
     * @returns {ContainerSurface}
     */
    var createLogo = function(size, background) {
       var initialTime = Date.now();
       var logo = new ImageSurface({
          content: '../../assets/img/famous_logo_white.svg',
          classes: ['backface-visible']
       });

       var logoMod = new Modifier({
          align: [0.5, 0.5],
          origin: [0.5, 0.5],
          opacity: 0.5,
          transform : function() {
             return Transform.rotateY(.003 * (Date.now() - initialTime));
          }
       });

       var container = new ContainerSurface({size:size, properties: {background:background}});
       container.add(logoMod).add(logo);

       return container;
    }

    //Create the main layout
    var layout1 = createHeaderFooter(40, 50, 30, 30, createLogo);

    //Create layout to hold other border layouts
    var layout2 = createBorderLayout(25, 25, 25, 25, [100, undefined]);

    //Create layouts for layout2
    var layout3 = createBorderLayout(25, 25, 25, 25, [100, undefined]);
    var layout4 = createBorderLayout(25, 25, 25, 25, [100, undefined]);

    layout1.add(layout2, BorderLayout.CENTER);
    layout2.add(layout3, BorderLayout.WEST);
    layout2.add(layout4, BorderLayout.EAST);

    //Hook in the add layout button
    var button = layout1.get(BorderLayout.SW);
    button.on('click', function (evt) {
       var layout = createBorderLayout(25, 25, 25, 25, [undefined, 150]);
       layout2.add(layout, BorderLayout.CENTER);
       layout2 = layout;
    });

    //Add the main layout
    mainContext.add(layout1);
});
