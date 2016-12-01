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
 * BorderLayout
 * ------------
 *
 * BorderLayout is a layout which gives you control over surface renderables placed
 * north, south, east, west, and center as well as north-west, north-east, south-west,
 * and south-east.  BorderLayouts can be placed within other BorderLayouts to create
 * complex layouts.  If autoContainer is set to true, components will be placed into
 * a ContainerSurface automatically.
 * 
 *    +----+-----------+----+
 *    | NW |   North   | NE |
 *    +----+-----------+----+
 *    |    |           |    |
 *    | W  |   Center  | E  |
 *    |    |           |    |
 *    +----+-----------+----+
 *    | SW |   South   | SE |
 *    +----+-----------+----+
 *
 * In this example, we create a simple border layout with a spinning logo in the
 * center.  Try the following to lines to see how it changes the layout:
 * <ul>
 * <li>Comment out the different "layout.add(...)"</li>
 * <li>Add, remove, or change the size properties for the surfaces"</li>
 * </ul>
 */
define(function(require, exports, module) {
    var Engine           = require("famous/core/Engine");
    var Modifier         = require("famous/core/Modifier");
    var Surface          = require("famous/core/Surface");
    var Transform        = require("famous/core/Transform");
    var ImageSurface     = require("famous/surfaces/ImageSurface");
    var BorderLayout     = require("famous/views/BorderLayout");

    var mainContext = Engine.createContext();

    //Create the layout. An id can be used for CSS styling
    var layout = new BorderLayout({id:'mylayout', autoContainer:true, debug:true});

    //or set properties instead of using CSS
    var NS_props = {textAlign: 'center', color:'#000', backgroundColor:'#C6B8FF'};
    var EW_props = {textAlign: 'center', color:'#000', backgroundColor:'#BEDA8E'};
    var cornerProps = {textAlign: 'center', color:'#000', backgroundColor:'#EBD181'};
    var C_props = {background:'linear-gradient(to bottom, #FFFFFF 0%,#777777 100%)'};

    //Add main components.  Undefined size allows border to stretch to corners.
    layout.add(new Surface({size:[undefined, 40],content: 'North', properties: NS_props}), BorderLayout.NORTH);
    layout.add(new Surface({size:[undefined, 40],content: 'South', properties: NS_props}), BorderLayout.SOUTH);
    layout.add(new Surface({size:[40, undefined],content: 'West', properties: EW_props}), BorderLayout.WEST);
    layout.add(new Surface({size:[40, undefined],content: 'East', properties: EW_props}), BorderLayout.EAST);

    //Add corners, no size required.  Comment out these adds to make north and south full width
    layout.add(new Surface({content: 'NW', properties: cornerProps}), BorderLayout.NW);
    layout.add(new Surface({content: 'NE', properties: cornerProps}), BorderLayout.NE);
    layout.add(new Surface({content: 'SW', properties: cornerProps}), BorderLayout.SW);
    layout.add(new Surface({content: 'SE', properties: cornerProps}), BorderLayout.SE);

    //Create a spinning logo for center
    var initialTime = Date.now();
    var logo = new ImageSurface({
       content: '../../assets/img/famous_logo_black.svg',
       classes: ['backface-visible'],
       properties: C_props
    });
    var logoMod = new Modifier({
       origin: [0.5, 0.5],
       align: [0.5, 0.5],
       transform : function() {
          return Transform.rotateY(.003 * (Date.now() - initialTime));
       }
    });

    //Add the logo to the layout
    layout.add(logoMod).add(logo, BorderLayout.CENTER);

    //Add the layout to the context
    mainContext.add(layout);
});
