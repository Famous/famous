/**
 * DrawerLayout
 * -------------
 *
 * DrawerLayout is a custom view with a visible outside face and a concealed inside face.
 * Renderables can be set to both the outside and inside faces of the Drawer.
 * Use drawer.toggle() to swap between hidden and revealed states. The toggle method
 * is itself a wrapper around the Drawer.open() and Drawer.close() methods.
 * See http://famo.us/docs/api/latest/views/DrawerLayout for other methods.
 *
 * In this example, we create a drawer with red/blue surfaces. Clicking shifts the
 * outsideSurface on the top 'content' face, revealing insideSurface in the hidden 'drawer' face
 */
define(function(require, exports, module) {
    var Engine       = require("famous/core/Engine");
    var Surface      = require("famous/core/Surface");
    var DrawerLayout = require("famous/views/DrawerLayout");
    var Modifier     = require("famous/core/Modifier");

    var mainContext = Engine.createContext();
    mainContext.setPerspective(500);

    var outsideSurface = new Surface({
        size : [200, 200],
        content : 'outside the drawer',
        properties : {
            background : 'red',
            lineHeight : '200px',
            textAlign  : 'center'
        }
    });

    var insideSurface = new Surface({
        size : [200, 200],
        content : 'inside the drawer',
        properties : {
            background : 'blue',
            color : 'white',
            lineHeight : '200px',
            textAlign  : 'center'
        }
    });

    var myDrawer = new DrawerLayout({side:1});

    myDrawer.content.add(outsideSurface);

    myDrawer.drawer.add(insideSurface);


    var centerModifier = new Modifier({
        align : [.5,.5],
        origin : [.5,.5]
    });

    mainContext.add(centerModifier).add(myDrawer);

    Engine.on('click', function(){
        myDrawer.toggle();
    });
});
