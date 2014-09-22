/**
 * GenericSync
 * ------------
 *
 * GenericSync combines multiple types of event handling
 * (e.g. touch, trackpad scrolling) into one standardized
 * interface for inclusion in widgets. TouchSync and ScrollSync
 * are enabled by default.
 *
 * In this example, we create a GenericSync that listens to
 * TouchSync, ScrollSync, and MouseSync and displays the data
 * it receives to the screen.
 *
 */
define(function(require, exports, module) {
    var Engine      = require("famous/core/Engine");
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync   = require("famous/inputs/MouseSync");
    var TouchSync   = require("famous/inputs/TouchSync");
    var ScrollSync  = require("famous/inputs/ScrollSync");
    var Surface     = require("famous/core/Surface");
    var Accumulator = require("famous/inputs/Accumulator");

    var mainContext = Engine.createContext();

    var update = 0;
    var start = 0;

    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync,
        scroll : ScrollSync
    });

    var accumulator = new Accumulator(start);

    var genericSync = new GenericSync({
        mouse : {
            direction : GenericSync.DIRECTION_X,
            scale : 2
        },
        touch : {direction : GenericSync.DIRECTION_Y},
        scroll : {direction : GenericSync.DIRECTION_Y}
    });

    Engine.pipe(genericSync);
    genericSync.pipe(accumulator);

    var contentTemplate = function() {
        return "<div>Update Count: " + update + "</div>" +
               "<div>Accumulated distance: " + accumulator.get() + "</div>";
    };

    var surface = new Surface({
        size: [undefined, undefined],
        classes: ['grey-bg'],
        content: contentTemplate()
    });

    genericSync.on('start', function(){
        accumulator.set(start);
        surface.setContent(contentTemplate());
    });

    genericSync.on("update", function() {
        update++;
        surface.setContent(contentTemplate());
    });

    mainContext.add(surface);
});
