/**
 * Flipper
 * -------------
 *
 * Flipper is a custom view with back and front faces.
 * A renderable can be set as front and back surfaces of the flipper.
 * Use flipper.setAngle(theta, transition) to later set the rotation of flipper to one face or somewhere inbetween.
 * Use flipper.flip() for the more generic case of flipping 180 degrees (It internally uses setAngle with a flag)
 *
 * In this example, we make a Flipper with red/blue surfaces and flips it on click.
 */
define(function(require, exports, module) {
    var Engine     = require("famous/core/Engine");
    var Surface    = require("famous/core/Surface");
    var Flipper    = require("famous/views/Flipper");
    var Modifier   = require("famous/core/Modifier");

    var mainContext = Engine.createContext();
    mainContext.setPerspective(500);

    var flipper = new Flipper();

    var frontSurface = new Surface({
        size : [200, 200],
        content : 'front',
        properties : {
            background : 'red',
            lineHeight : '200px',
            textAlign  : 'center'
        }
    });

    var backSurface = new Surface({
        size : [200, 200],
        content : 'back',
        properties : {
            background : 'blue',
            color : 'white',
            lineHeight : '200px',
            textAlign  : 'center'
        }
    });

    flipper.setFront(frontSurface);
    flipper.setBack(backSurface);

    var centerModifier = new Modifier({
        align : [.5,.5],
        origin : [.5,.5]
    });

    mainContext.add(centerModifier).add(flipper);

    var toggle = false;
    Engine.on('click', function(){
        var angle = toggle ? 0 : Math.PI;
        flipper.setAngle(angle, {curve : 'easeOutBounce', duration : 500});
        toggle = !toggle;
    });
});
