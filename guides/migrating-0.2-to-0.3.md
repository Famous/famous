# Migrating from Famo.us v0.2 to v0.3

The [v0.3 release of Famo.us](https://github.com/Famous/famous/releases/tag/0.3.0) is packed with new features, bug fixes — and a few breaking changes that you'll need to patch for when you upgrade. In this guide, we'll go over how to smoothly migrate your applications from Famo.us 0.2 to 0.3, and point to some cool new features while we're at it. As always, see the [changelog](https://github.com/Famous/famous/releases/tag/0.3.0) for a complete list of changes. We welcome [pull requests](https://github.com/Famous/famous/pulls) if you want to suggest additions to this guide.

## Upgrading

### Upgrading a _Starter Kit_ installation

If you started your project using the _Famo.us Starter Kit_ — this would have been a .ZIP file download — the easiest way to upgrade is to change the reference to the Famo.us CDN in your project's `index.html`. In the starter-kit, this file is located at `boilerplate/index.html`. You'll want to change line 19 and 20 to:

````
<link rel="stylesheet" type="text/css" href="http://code.famo.us/famous/0.3/famous.css" />
<script type="text/javascript" src="http://code.famo.us/famous/0.3/famous.min.js"></script>
````

### Upgrading a _Grunt Toolbelt_ / Yeoman installation

If you started your project with the advanced installation steps (i.e., via `$ yo famous`), change lines 29 and 30 in your project's `bower.json` file to:

```
"famous-polyfills": "~0.3.0",
"famous": "~0.3.0"
```

Then run:

```
bower install
```

You will also notice that the source code inside of the bower installed version of famous is now in a folder called src/  To support this you will need to update the reference to famous in your requirejs config to read

```
famous: ‘../lib/famous/src’
```

Update the stylesheet reference in the generated app/index.html to read

```
<link rel="stylesheet" type="text/css" href="lib/famous/src/core/famous.css" />
```

### Upgrading an installation via npm

If you installed Famo.us via npm, change the `"famous"` package reference in your `package.json` file to:

```
"famous": "~0.3.0"
```

Then run:

```
npm install
```

You will also need to include the [famousify](http://github.com/FamousTools/famousify) transform to allow you to continue requiring famous with referencing the src/ folder

```
npm install --save famousify
```

You will then need to update your package.json to add the transform


```json
"browserify": {
  "transform": [
    "famousify",
    "cssify",
    "brfs"
  ]
}
```

You will also notice that famous now comes packed with the cssify and deamdify browserify transforms included internally.  This will allow you to require in any file (including famous.css) into a browserify project without any conversion on your end.

Once you've completed the upgrade, take a look at the notes below, which cover the breaking changes you'll need to patch for.

### Fixing rendering issues on iOS 8

If you're noticing display issues when viewing your Famo.us app on iOS 8, you may need to adjust your HTML file's meta viewport configuration to the following:

    <meta name="viewport" content="width=device-width, maximum-scale=1, initial-scale=1, user-scalable=no" />

The `initial-scale=1` setting will ensure that the content is displayed correctly within the viewport.

## Breaking changes to patch

First, let's look at the breaking changes in the v0.3 release of Famo.us:

###src folder
All src code is now found in a src/ folder.  This will cause issues with any pathing you are currently relying on.  Please see the above sections that describe how to properly update your tooling stack accordingly.

### Align & origin

**The `align` property now defaults to `[0, 0]`** no matter what `origin` was set to. (Previously, `align` was automatically set to the same value as `origin`.) Anywhere you've set `origin` but not `align`, you'll need to explicitly set `align` to the value you intend.

### Scrollview

**`Scrollview`'s default option values have changed:**

* `friction` is now set to `0.005` (was `0.001`)
* `edgeGrip` is now set to `0.2` (was `0.5`)
* `speedLimit` is now set to `5` (was `10`)
* A default value for `syncScale` has been added; its value is `1`

**The `getPosition` method has been marked for deprecation.** Instead, use the `getOffset` method.

### Scroller

**`Scroller` no longer emits an `'edgetHit'` event.** Instead, it emits `'onEdge'` and `'offEdge'`. `'onEdge'` is fired when the scroller has reached an edge. `'offEdge'` is fired when the scroller was previously on an edge and has moved off of the edge. Both emit a data object with a `position` property.

### SequentialLayout

**The `SequentialLayout` API has been reduced substantially.** It's now the caller's responsibility to add sizing and spacing to the layout items. Any layout that relies on the `defaultItemSize` or `itemSpacing` options will need to be patched:

* The `defaultItemSize` option has been removed. If you want content items to have a default size, you'll need to explicitly set that size on all items. (Items should respond to a `getSize` method.)
* The `itemSpacing` option has been removed. To space out your items, you'll need to explicitly add the appropriate padding to each item.

### Physics

**`Constraint`'s `setEnergy`  method has been removed**, and the `getEnergy` method will now always return `0.0`.

**`Force`'s `setEnergy` method has been removed**, and the `getEnergy` method will now always return `0.0`.

**`Snap`'s `setAnchor` method has been deprecated.**

**`Spring`'s `setAnchor` method has been deprecated.**

**`Spring`'s `getEnergy` method now takes an array of targets** as its first argument.

**`RotationalSpring`'s `getEnergy` method now takes an array of targets** as its first argument.

**`VectorField`'s defaults have changed.** The RADIAL, LINEAR, and POINT_ATTRACTOR field methods now return Vectors instead of numbers.

**`SymplecticEuler` is now a singleton.** It no longer accepts any options.

That covers all the breaking changes! Here are some other highlights to know about:

## Bug-fix highlights

Here are a few major bug-fixes we're excited to release:

### Views

**`Scroller`'s size now defaults to the size of its content** (if the size of its content is less than the size of its parent context).

**`Scrollview` pagination now works.**

**`Scrollview` methods `goToPreviousPage` and `goToNextPage` now work.**

### Surfaces

**`VideoSurface` now properly respects the `src` option** for setting a video's URL.

### Physics

**The `PhysicsEngine` method `removeBody` now works as intended**, detaching the body from all forces and constraints.

## Feature highlights

### General

**Famo.us can now be loaded reliably in the `<head>`.**

### Core

**`Modifier` can specify size as a proportion of its parent:**

    new Modifier({
        proportions: [0.5, 0.25]
    });

**`Surface` now has a `toggleClass` method** that can be used to add/remove CSS classes from the `Surface`'s corresponding `<div>`. (The class is removed from the class list if present, and added if not present.)

**The following `Surface ` methods are now chainable:** `setAttributes`, `setProperties`, `toggleClass`, `addClass`, `removeClass`, `setClasses`, `setContent`, `setOptions`, `setSize`.

**HTML attributes can now be set on Surfaces.** You can either set attributes via the constructor, or via the `setAttributes` method:

    var surface = new Surface({
        attributes: {
            id: 'hello',
            data-something: '123'
        }
    });

    // Or:

    surface.setAttributes({ id: 'hello' });

_Note that the `style` attribute cannot be set this way, as doing so will break Famo.us rendering._

### Views

**`Scrollview` now has a `goToPage` method.**

