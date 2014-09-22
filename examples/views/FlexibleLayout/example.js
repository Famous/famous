/**
 * FlexibleLayout
 * ------------
 *
 * FlexibleLayout is a component for making ratio based layouts
 * similar to HTML5 Flexbox.
 *
 * In this example, use a FlexibleLayout to arrange an array of
 * renderables based on both the parent size and the defined
 * size of the renderables
 */
define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');

	var mainContext = Engine.createContext();

    var colors = [
        'rgba(256, 0, 0, .7)',
        'rgba(0, 256, 0, .7)',
        'rgba(0, 0, 256, .7)',
        'rgba(256, 0, 0, .7)',
        'rgba(0, 256, 0, .7)',
        'rgba(0, 0, 256, .7)',
        'rgba(256, 0, 0, .7)',
        'rgba(0, 256, 0, .7)',
        'rgba(0, 0, 256, .7)'
    ];

    var initialRatios = [1, true, 1, true, 1, true, 1, true];

    var flex = new FlexibleLayout({
        ratios : initialRatios
    });

    var surfaces = [];
    for (var i = 1; i <= 8; i++) {
        size = (i % 2 === 0) ? [10, undefined] : [undefined, undefined]
        surfaces.push(new Surface({
            size: size,
            properties: {
                backgroundColor: colors[i-1]
            }
        }));
    }

    flex.sequenceFrom(surfaces);

    var finalRatios = [4, true, 1, true, 0, true, 7, true];
    var toggle = false;
    Engine.on('click', function(){
        var ratios = toggle ? initialRatios : finalRatios;
        flex.setRatios(ratios, {curve : 'easeOut', duration : 500});
        toggle = !toggle;
    });

    mainContext.add(flex);
});
