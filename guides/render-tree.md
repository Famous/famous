The Famo.us Render Tree
=======================

One of the first things to notice about Famo.us is how little
we expose HTML and the DOM to the developer. Interacting with the DOM is riddled
with performance issues. Famo.us abstracts away DOM management by maintaining a
representation of it in JavaScript called the Render Tree.

If you inspect a website running Famo.us, you'll notice the DOM
is very flat: most elements are siblings of one another. Inspect any other
website, and you'll see the DOM is highly nested. Famo.us takes a radically
different approach to HTML from a conventional website. We keep the structure of
HTML in JavaScript, and to us, HTML is more like a list of things to draw to the
screen than the source of truth of a website.

Developers are used to nesting HTML elements because that's *the* way to get
relative positioning, event bubbling, and semantic structure. However, there is
a cost to each of these: relative positioning causes slow page reflows on
animating content; event bubbling is expensive when event propagation is not
carefully managed; and semantic structure is not well separated from visual
rendering in HTML.

Famo.us promises a rich 60 FPS experience, and to do so, we needed to circumvent
these inefficiencies. When we decided to abstract away the DOM, we needed a way to maintain
the expectations every web developer has of the DOM, but in a way that doesn't compromise on
performance. The Render Tree is our solution to relative positioning and
semantic structure. In other documentation we'll go into events and animation.

#Overview

- [Creating the Tree](#creation)
- [Extending the Tree](#extension)
  - [Types of Nodes](#nodes)
    - [Renderables](#renderables)
    - [Modifiers](#modifiers)
  - [Chaining Nodes](#chaining)
  - [Branching Nodes](#branching)
  - [Views](#views)
- [The Big Picture](#review)


##<a name="creation">Creating the Tree</a>


A tree's starting point is called its root. In HTML, this root is the `<body>` tag.
In Famo.us, the root is a Context. We instantiate a Context via the
Famo.us Engine's `.createContext` method. This will create a `<div>` with CSS
class `famous-container` (we can also pass in a pre-existing DOM element).

```javascript
  context                    var context = Engine.createContext();
     │
```

##<a name="extension">Extending the Tree</a>


So far we have a pretty boring app. A Context has no visual representation,
it merely provides a starting point for Famo.us' render cycle. To get something
on the screen, we will need to extend the Render Tree by adding nodes via the
`.add` method. A Famo.us Surface is one kind of node, which loosely
corresponds to a `<div>` in HTML. This `<div>` will be nested inside of the
`<div>` allocated to the Context. This is how we build up HTML in Famo.us.

```javascript
  context                    var context = Engine.createContext();
     │
  surface                    context.add(surface);
```

##<a name="nodes">Types of Nodes</a>


A tree is made up of nodes. In HTML, these nodes are tags like `<div>` or
`<button>`. In Famo.us, nodes come in two flavors: renderables, and modifiers.
Above, we saw how to add one type of renderable, a Surface, to the Render Tree.
Below, we will examine other kinds of nodes that make up a typical Render Tree.


##<a name="renderables">Renderables</a>


Renderables are nodes that get drawn to the screen. We have already been
introduced to a Surface, which is associated with an HTML `<div>`, but there are
other kinds of surfaces associated with other HTML tags. Famo.us currently supports:

| Surface Type  | Associated Tag |
| ------------- | :------------: |
| Surface       |  `<div>`       |
| ImageSurface  |  `<img>`       |
| InputSurface  |  `<input>`     |
| CanvasSurface |  `<canvas>`    |
| VideoSurface  |  `<video>`     |

There's one more surface type, called a ContainerSurface, which is associated
to a `<div>` that nests a Surface within it. This is used primarily for clipping
when `{overflow : hidden}` is set as a CSS property.

All surfaces can take in arbitrary HTML content and CSS styling. Famo.us is 100%
agnostic to what you do within a Surface, whether it's render from a template,
or use an MVC to bind data to its content. However, if you want to independently
animate a chunk of HTML, or bind DOM listeners that interact with the rest of
your app, we suggest you encapsulate that inside a Surface; a surface's content
is reserved for HTML that is static, or at least doesn't update often.

Surfaces are the atomic renderable unit in Famo.us, but we also support more
complex composited renderables. These are called Views and will be
discussed [below](#views).


##<a name="modifiers">Modifiers</a>


A Modifier is another type of Famo.us node that is capable of modifying
the nodes below it in the Render Tree. Surfaces are dumb, really. They don't
know where they are in the page, or whether they're even visible; that is
the job of the Modifier. Modifiers are responsible for the layout and visibility
of the Render Tree below them. We group these two different concepts together
because CSS3 transforms and opacity are precisely the hardware accelerated
properties that can change performantly.

```javascript
  context                    var context = Engine.createContext();
     │
  modifier                   var chain = context.add(modifier);
     │
  surface                    chain.add(surface);
```

The above example is a stripped down version of how a Modifier is applied to
a Surface. For instance, if we define the modifier with

```javascript
var modifier = new Modifier({
    transform : Transform.translate(100,200)
});
```

then the surface will be at `[100px, 200px]` from the top left of the Context.
Modifiers also have more complicated support for layout, like auto-centering
and sizing, but this will be discussed in a different tutorial.

##<a name="chaining">Chaining Nodes</a>


Modifiers affect the render tree beneath them. But that means Modifiers can
affect other Modifiers. By chaining Modifiers, their effects compound: their
transforms are composed, and their opacities are multiplied. This makes
separating state easy to do. One modifier can handle opacity, another, rotation.

```javascript
  context                    var context = Engine.createContext();
     │
 modifier1                   context.add(modifier1)
     │                              .add(modifier2)
 modifier2                          .add(surface);
     │
  surface
```

##<a name="branching">Branching Nodes</a>


So far our Render Trees have been linear: one node sequentially following another.
What makes trees fun is when they branch. Below is a simple example demonstrating
how to branch the tree by calling `.add` successively on the same node.

```javascript
      context                var context = Engine.createContext();
   ┌─────┴─────┐
modifier    surface2         context.add(modifier).add(surface1); // left branch
   │
surface1                     context.add(surface2);               // right branch
```

Branching is key to relatively positioning renderables. For example,


```javascript
      context                var context = Engine.createContext();
         │
     modifier1               var relativeNode = context.add(modifier1);
   ┌─────┴─────┐
modifier2   surface2         relativeNode.add(modifier2).add(surface1);
   │
surface1                     relativeNode.add(surface2);
```

Here, `surface1` and `surface2` are both relative to `modifier1`, and
`surface1` has an additional modifier so that the surfaces are non-overlapping
(assuming these modifiers are for translating nodes).


##<a name="views">Views</a>


So far we've seen that you can add Modifiers and Surfaces to the Render Tree.
These can be thought of as the lego blocks of more complicated widgets. To help
reduce the boiler plate to creating a widget, Famo.us provides a base class
called a View. A View provides an interface for adding to the Render Tree (no different
from a Surface or Modifier), receive and broadcast events, and take in default parameters
and state variables. Famo.us also ships with a library of common views that we hope to
keep building upon (and hope our community contributes to!). We will consider how
Views handle events and state in other documentation. Here, we are only concerned with
how they can be used to extend the Render Tree, and how they encapsulate their own
internal Render Trees.

In the example below, we add a Scrollview.

```javascript
      context                var context = Engine.createContext()
         │
      modifier               context.add(modifier).add(scrollview);
         │
     scrollview
```

Internally, Scrollview has its own complex logic, but that is hidden from the
developer, who can simply include it in her project by adding it to the tree
like any other node. It's the Famo.us equivalent of the
[Shadow DOM](http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/).
After instantiating a Scrollview, we can populate it with any other renderables
via its `sequenceFrom` interface, thus building its internal Render Tree.

```javascript
     scrollview              scrollview.sequenceFrom([S1, S2, S3, ... , S10]);
 ┌───┬───┼───────┐
S1  S2  S3  ⋯  S10
```

Notice in the above example, S10 doesn't have to be a Famo.us Surface; it could
have been a view with its own modifiers, other nodes, even another scrollview.
You could have a scrollview whose first item has a cross-fading opacity between
two surfaces by letting S10 be its own View with the structure:

```javascript
         S10                 S10.add(modifier1).add(surface1);
    ┌─────┴─────┐
modifier1   modifier2        S10.add(modifier2).add(surface2);
    │           │
surface1    surface2
```

If we were to unravel the Render Tree, we would find it looks like:

```javascript
      context
         │
      modifier
         │
     scrollview
 ┌───┬───┼───────┐
S1  S2  S3  ⋯  S10
           ┌─────┴─────┐
       modifier1    modifier2
           │           │
       surface1     surface2
```

but by encapsulating complex logic in views, understanding an app becomes more
manageable. And unlike DOM, there is no performance degradation incurred from
nesting structure; everything is flattened by the time it gets to the DOM.


##<a name="review">The Big Picture</a>


> It's modifiers all the way down - *Anon*

In all the examples above, you'll notice a pattern: a Render Tree starts with
a Context, branches into a bunch of Modifiers, and ends with Surfaces. Unlike
the DOM, where nodes mix visual representation with syntactic clustering, the
Render Tree makes a clear separation between layout (Modifiers), content
(Surfaces) and structure (`.add`).

In fact, if you want to know what the position, or opacity of a surface
at the bottom of the Render Tree, you just have to multiply the opacities and
transforms of the Modifiers above it. 

Another point of divergence is that the DOM executes a redraw whenever a node's 
styling or content is changed (immediate mode). In Famo.us, the Render Tree 
batches changes (retain mode) behind the scenes by buffering them against the 
`requestAnimationFrame` API. This ensures changes are resolved at the most optimal time 
(synced to your monitor's refresh rate).

To recap, here's a comparison between traditional DOM, and the Famo.us Render Tree.


|                   | Famo.us Render Tree     | DOM           |
| ----------------- | ----------------------- | ------------- |
| *Tree Structure*  | Yes                     | Yes           |
| *Nodes*           | Renderables & Modifiers | HTML Elements |
| *Reflows*         | No                      | Yes           |
| *Encapsulation*   | Views & Widgets         | Shadow DOM    |
| *Meaning*         | Structure               | Structure, Rendering |
| *Render Cycle*    | Retain Mode             | Immediate Mode |
| *Language*        | JavaScript              | HTML          |
