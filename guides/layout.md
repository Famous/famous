Layout
================================================================================

Layout in Famo.us is managed by `Transforms` and `Modifiers`. `Transforms`
encapsulate the [CSS3 transform specification](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
which define the position, orientation and distortion of a node. While a
`Transform` is a static object, representing a snapshot in time, a `Modifier`
encapsulates varying `Transforms` over time. `Modifiers` also bundle layout
properties like `size`, `origin` and `align` that allow for alignment and justification. 
`Modifiers` can be directly added to the Famo.us Scene Graph, acting on the nodes beneath them.

Overview
================================================================================

- [Transforms](#transforms)
    - [Transform Primitives](#primitives)
    - [Building Complex Transforms](#building)
    - [Breaking Down Transforms](#breakdown)
- [Modifiers](#modifiers)
- [Alignment & Sizing](#alignment)
    - [Size](#size)
    - [Align](#align)
    - [Origin](#origin)
- [Dynamic Layout](#dynamic)

<a name="transforms">Transforms</a>
--------------------------------------------------------------------------------

`Transforms` correspond directly to a [CSS3 transformation matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).
A `Transform` combines `translation`, `rotation`, `scale` and `skew` components
into a 16-element array.

|Component|Description|Default Value|
|----|:----:|:----:|
|translation|`[x,y,z]`|`[0,0,0]`|
|rotation|`[x,y,z]`|`[0,0,0]`|
|scale| `[x,y,z]`|`[1,1,1]`|
|skew| `[x,y,z]`|`[0,0,0]`|

The `Transform` class provides methods to break down a `Transform` into these
components, and also to build up `Transforms` from them.

<a name="primitives">Transform Primitives</a>
--------------------------------------------------------------------------------

All `Transforms` are built up from these `Transforms` primitives

|           Transform        |                                                    Return Value                                                                       |                                              Components                                               |    Description    |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|-------------------|
|`Transform.identity`        |<pre>[1,      0,      0,      0, <br> 0,      1,      0,      0, <br> 0,      0,      1,      0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [0,0,0] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>     |The identity transformation. This has no affect on layout.
|`Transform.translate(x,y,z)`|<pre>[1,      0,      0,      0, <br> 0,      1,      0,      0, <br> 0,      0,      1,      0, <br> x,      y,      z,      1]</pre>|<pre> translation : [x,y,z] <br> rotation : [0,0,0] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>     |Translates along the x-, y- and z-axes.
|`Transform.scale(x,y,z)`    |<pre>[x,      0,      0,      0, <br> 0,      y,      0,      0, <br> 0,      0,      z,      0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [0,0,0] <br> scale : [x,y,z] <br> skew : [0,0,0] </pre>     |Scales in the x-, y-, and z-axes relative to an origin.
|`Transform.rotateX(θ)`      |<pre>[1,      0,      0,      0, <br> 0,      cos(θ),-sin(θ), 0, <br> 0,      sin(θ), cos(θ), 0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [θ,0,0] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>     |Rotates clock-wise in the y/z-plane (along the x-axis).
|`Transform.rotateY(θ)`      |<pre>[cos(θ), 0,      sin(θ), 0, <br> 0,      1,      0,      0, <br> sin(θ), 0,      cos(θ), 0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [0,θ,0] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>     |Rotates clock-wise in the x/z-plane (along the y-axis).
|`Transform.rotateZ(θ)`      |<pre>[cos(θ),-sin(θ), 0,      0, <br> sin(θ), cos(θ), 0,      0, <br> 0,      0,      0,      0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [0,0,θ] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>     |Rotates clock-wise in the x/y-plane (along the z-axis).
|`Transform.skewX(θ)`        |<pre>[1,      0,      0,      0, <br> tan(θ), 1,      0,      0, <br> 0,      0,      1,      0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [0,0,0] <br> scale : [1,1,1] <br> skew : [θ,0,0] </pre>     |Skews along the x-axis. θ gives the angle between the top and left sides.
|`Transform.skewY(θ)`        |<pre>[1,      tan(θ), 0,      0, <br> 0,      1,      0,      0, <br> 0,      0,      1,      0, <br> 0,      0,      0,      1]</pre>|<pre> translation : [0,0,0] <br> rotation : [0,0,0] <br> scale : [1,1,1] <br> skew : [0,θ,0] </pre>     |Skews along the y-axis. θ gives the angle between the top and left sides.
|`Transform.inFront`         |<pre>[1,      0,      0,      0, <br> 0,      1,      0,      0, <br> 0,      0,      1,      0, <br> 0,      0,      0.001,  1]</pre>|<pre> translation : [0,0, 0.001] <br> rotation : [0,0,0] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>|A small z-translation forwards toward the viewer. Useful for layering.|
|`Transform.behind`          |<pre>[1,      0,      0,      0, <br> 0,      1,      0,      0, <br> 0,      0,      1,      0, <br> 0,      0,     -0.001,  1]</pre>|<pre> translation : [0,0,-0.001] <br> rotation : [0,0,0] <br> scale : [1,1,1] <br> skew : [0,0,0] </pre>|A small z-translation backwards away from the viewer. Useful for layering.|

<a name="building">Building Transforms</a>
--------------------------------------------------------------------------------

Complex `Transforms` can be built up from the above primitives in two ways

- Nesting `Modifiers` with `Transforms` in the Scene Graph
- Composing `Transforms`

For this guide, we will focus on the latter. See the Scene Graph guide for the former.
`Transform` composition is done through the `.multiply` method. Though `.multiply` 
is useful for composing arbitrary transforms, it is heavyweight for simple compositions, 
such as composing a translation on a rotation. Famo.us provides optimized methods for these 
use cases.

| Method | Description |
|--------|-------------|
|`Transform.multiply(T1,T2)`| Equivalent to applying a `transform` _T1_ on top of a `transform` _T2_. _Note_: Order matters!|
|`Transform.thenMove(T,p)`| Translates a `transform` _T_ by _p_ = `[x,y,z]`. <br> Equivalent to `Transform.multiply(Transform.translate(x,y,z), T)`.|
|`Transform.moveThen(p,T)`| Translates by _p_ = `[x,y,z]` prior to applying the `Transform` _T_. <br> Equivalent to `Transform.multiply(T, Transform.translate(x,y,z))`.|
|`Transform.thenScale(T,s)`| Scales a `transform` _T_ by _s_ = `[x,y,z]`. <br> Equivalent to `Transform.multiply(Transform.scale(x,y,z), T)`.|
|`Transform.aboutOrigin(T,p)`| Shifts the origin of a `Transform` to a new point _p_ = `[x,y,z]` in pixels from the top/left. <br> For instance, <br> `Transform.aboutOrigin(Transform.rotateZ(Math.PI/4), [50,100,0])` <br> would rotate a renderable around a pivot at `[50,100,0]` instead of the top-left.|
|`Transform.average(T1,T2,w)`| Returns a weighted average between the two transforms with weight _w_ by averaging their `rotate`, `translate`, `scale` and `skew` components.|

<a name="breakdown">Breaking Down Transforms</a>
--------------------------------------------------------------------------------

Complex `Transforms` can be broken up into their individual components via the methods

| Method | Description |
|--------|-------------|
|`Transform.getTransform(T)`| Returns the `translate` components of the `Transform` _T_.|
|`Transform.interpret(T)`| Returns an object with `translate`, `rotate`, `scale`, and `skew` keys. <br> _Note_: This is a relatively expensive operation and its use is discouraged.|

<a name="modifiers">Modifiers</a>
--------------------------------------------------------------------------------

`Transforms` by themselves can't be added to the Scene Graph. In order to apply
a `Transform` to a renderable, a `Modifier` is necessary. A `Modifier` is a node,
and can be directly added to the Scene Graph. A `Modifier` is best thought of as
a shell that accepts primitives, like `Transforms` that can modify the nodes (which
can be other `Modifiers`) below them either by applying a `Transform`, `opacity`
or alignment.

Below we demonstrate applying a translational `Transform` to a `Surface` 100px
in the x- and y- directions.

```js
var surface = new Surface({
    size: [50, 50],
    properties: { background: 'red' }
});

var modifier = new Modifier({
    transform : Transform.translate(100, 100, 0)
});

context.add(modifier).add(surface);
```

Any `Transform` can be applied this way. As mentioned above, `Modifiers` have
convenience properties to affect alignment as well. Before we introduce this
concept, we will need to understand Famo.us sizing primitives: `size`, `origin`
and `align`.

<a name="alignment">Alignment & Sizing</a>
--------------------------------------------------------------------------------
In addition to positioning, `Modifiers` can also align renderables relative to a
size context. This allows users to "center" objects, or "left-justify" them, etc.
To understand how this is accomplished in Famo.us, we introduce the concepts of 
`size`, `align` and `origin` in `Modifier`.

<a name="size">Size</a>
--------------------------------------------------------------------------------
`Size` defines a bounding-box for content. Nodes in the Scene Graph below sized
`Modifiers` can use this bounding size to define their container's size. The
simplest example being a `Surface` with `size = [undefined, undefined]` that
takes the size of a parenting `Modifier`.

In the following example, the created surface will have a `size` of `[200, 100]`,
even though its width was original set to `undefined`.

```js
  var sizeModifier = new Modifier({size: [200, 200]});

  var surface = new Surface({
    size: [undefined, 100],
    properties: { background : 'red' }
  });

  context.add(sizeModifier).add(surface);
```

This concept extends beyond `Surfaces` to any Famo.us renderable, such as a `View`.
It is especially important in `Views` that handle layout, such as `GridLayout` or
`SequentialLayout`. These layouts have no intrinsic notion of a boundind-box, and
need to have their `size` defined for them in a parenting `Modifier`.

<a name="align">Align</a>
--------------------------------------------------------------------------------
Layout is often easily described in terms of "top left", "bottom right", etc.
`Align` is a way of defining an alignment relative to a bounding-box given by a
`size`. `Align` is given by an array `[x, y]` of proportions between 0 and 1. 
The default value for the `align` is top left, or `[0, 0]`. The following table 
summarizes common alignment values.

|Align Values| Meaning |
|:------------:|:---------:|
|`[0, 0]`    | Top Left |
|`[0.5, 0]`  | Top Center |
|`[1, 0]`    | Top Right |
|`[0.5, 0.5]`| Center Center |
|`[1, 0.5]`  | Center Right |
|`[0.5, 1]`  | Bottom Center |
|`[1, 1]`    | Bottom Right |

For example, below is a way of aligning a `Surface's` top/left corner to the
left center of within a bounding-box of size `[100, 100]`.

```js
    ////////////////////////////////////
    //
    //       100 x 100 bounding box
    //                  ↙            
    // ┌──────────────┐
    // │              │
    // │              │
    // ├──────┐       │
    // │      │       │
    // ├──────┘       │
    // └──────────────┘
    //
    ////////////////////////////////////

    var surface = new Surface({
        size: [50, 30],
        properties: { background: 'red' }
    });

    var sizeModifier = new Modifier({
        size: [100, 100]
    });

    var alignModifier = new Modifier({
        align: [0, 0.5]
    });

    context.add(sizeModifier).add(alignModifier).add(surface);
```

<a name="origin">Origin</a>
--------------------------------------------------------------------------------

In the above example, we aligned the `top left` corner of the Surface. What if
we want to align a different location of the Surface, such as its center? This
is done by setting the `origin` property of a `Modifier`.

While alignment is relative to parenting size, origin is relative to the renderable.
The combination of the two places the renderable's origin at the location of the
parent's alignment. This is best described visually:

```
    align point (+)       origin point (○)
  ┌─────────────────┐        ┌───────┐
  │                 │        │       │
  │                 │        │ ○     │
  │        +        │        └───────┘
  │                 │       (renderable)
  │                 │ 
  └─────────────────┘
     (bounding box)
  
            align & origin (⊕)
           ┌─────────────────┐
           │      ┌───────┐  │
           │      │       │  │
           │      │ ⊕     │  │
           │      └───────┘  │
           │                 │
           └─────────────────┘
     (renderable inside bounding box)
```

For example, if we want to have a `Surface` centered within some sized context,
we would need to place the `Surface`'s center, on the sized context's center. In
code,

```js
    ////////////////////////////////
    //
    //        100 x 100 bounding box
    //                ↙
    // ┌────────────┐
    // │  ┌──────┐  │
    // │  │      │  │
    // │  │      │  │
    // │  └──────┘  │
    // └────────────┘
    //
    ////////////////////////////////

    var surface = new Surface({
        size: [70, 70],
        properties: { background: 'red' }
    });

    var sizeModifier = new Modifier({
        size: [100, 100]
    });

    var centerModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
    });

    context
        .add(sizeModifier)
        .add(centerModifier)
        .add(surface);
```

The default value for the `origin` is top left, or `[0, 0]`. _Note_: The
`sizeModifier` must come before the `alignModifier` as alignment must reference
a _parent_ size. These modifiers can not be combined into one.

<a name="dynamic">Dynamic Layout</a>
--------------------------------------------------------------------------------

Thus far, we have only considered setting the `transform`, `size`, `origin` and
`align` parameters as a static property of a `Modifier`. However, each of these
properties can animate over time. This can be done in one of two methods

- [push-based](#push)
- [pull-based](#pull)

####<a name="push">Push-based animations</a>

The `StateModifier` class found in Famous/modifiers/StateModifier.js is a push-based
implementation. Here, `StateModifier` has the methods

| method | description |
|--------|-------------|
|`StateModifier.setTransform(T, definition, callback)`| Sets the `transform` state.|
|`StateModifier.setOpacity(opacity, definition, callack)`|Sets the `opacity` state.|
|`StateModifier.setSize(size, definition, callack)`|Sets the `size` state.|
|`StateModifier.setOrigin(origin, definition, callack)`|Sets the `origin` state.|
|`StateModifier.setAlign(align, definition, callack)`|Sets the `align` state.|

A push-based example of animating a renderable is

```js
var surface = new Surface({
    size: [70, 70],
    properties: { background: 'red' }
});

var stateModifier = new StateModifier({
    opacity: 1
});

context.add(stateModifier).add(surface);

// animate the opacity from 1 to 0 over 500ms using a linear easing curve
stateModifier.setOpacity(
    0,
    {curve: 'linear', duration : 500},
    function() { console.log('animation finished!') }
);
```

####<a name="pull">Pull-based animations</a>

The `Modifier` class found in Famous/core/Modifier.js is a pull-based
implementation. The `Modifier` itself doesn't keep any state (like what the 
current `Transform` is); instead that state is provided externally by a getter, 
which is either a function that returns the state, or an object with a `.get`
method that returns the state. `Modifier` has the methods

| method | description |
|--------|-------------|
|`Modifier.transformFrom(transformGetter)`|The `transform` state is pulled from the `transformGetter`.|
|`Modifier.opacityFrom(opacityGetter)`|The `opacity` state is pulled from the `opacityGetter`.|
|`Modifier.sizeFrom(sizeGetter)`|The `size` state is pulled from the `sizeGetter`.|
|`Modifier.originFrom(originGetter)`|The `origin` state is pulled from the `originGetter`.|
|`Modifier.alignFrom(alignGetter)`|The `align` state is pulled from the `alignGetter`.|

The same example above can be recreated in a pull-based way as

```js
var surface = new Surface({
    size: [70, 70],
    properties: { background: 'red' }
});

var modifier = new Modifier();

context.add(modifier).add(surface);

// the opacityGetter
var opacityState = new Transitionable(1);

modifier.opacityFrom(opacityState);

// animate the opacity from 1 to 0 over 500ms using a linear easing curve
opacityState.set({
    0,
    {curve : 'linear', duration : 500},
    function(){ console.log('animation finished!'); }
});
```
