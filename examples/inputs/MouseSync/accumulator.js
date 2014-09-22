/**
 * MouseSync
 * ------------
 *
 * Famo.us syncs default to track two-dimensional movement,
 * but can be passed as optional direction parameter to restrict
 * movement to a single axis.
 *
 * In this example, we create a MouseSync but only track the x-axis
 * changes on mouse drag.
 *
 */
define(function(require, exports, module) {
    var Engine    = require("famous/core/Engine");
    var MouseSync = require("famous/inputs/MouseSync");
    var Surface   = require("famous/core/Surface");
    var Accumulator = require("famous/inputs/Accumulator");

    var mainContext = Engine.createContext();

    var update = 0;

    var x = 0;
    var y = 0;
    var position = [x, y];

    var mouseSync = new MouseSync();
    var accumulator = new Accumulator(position);

    Engine.pipe(mouseSync);
    mouseSync.pipe(accumulator);

    var contentTemplate = function() {
        return "<div>Update Count: " + update + "</div>" +
               "<div>Accumulated distance: " + accumulator.get() + "</div>";
    };

    var surface = new Surface({
        size: [undefined, undefined],
        classes: ["grey-bg"],
        content: contentTemplate()
    });

    mouseSync.on("start", function() {
        accumulator.set([x,y]);
        surface.setContent(contentTemplate());
    });

    mouseSync.on("update", function() {
        update++;
        surface.setContent(contentTemplate());
    });

    mainContext.add(surface);
});
