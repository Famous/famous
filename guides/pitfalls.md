Common Questions, Pitfalls, and Performance Issues
==================================================


### Common Questions a Famo.us Developer May Ask

##### When should I create a new Surface versus adding more HTML content to a single Surface?

In short, when you need something to behave or animate differently, it should be a new Surface.  If the HTML will behave the same, then it can all be contained in a single Surface.  Think of a standard deck of cards.  Each card ought to be its own Surface because it can be moved individually, but the numbers and pictures on each card are never going to animate independently and therefore may exist together as the content of the Surface.

##### Why is my Surface behind this second Surface?

There are a few reasons this could happen.

- The order in which Surfaces are instantiated matters, in regards to browser representation.  Since Famo.us creates the DOM elements in the order that your Javascript runs, the default behavior is similar to how the browser parses standard HTML.  Surfaces that are instantiated first render behind newer Surfaces because their associated DOM element is created first.

- Famo.us translations could be affecting your Surface's position.  Check your code to see if you have any Modifiers affecting your Surface's translation in z space.

- CSS z-indexing still applies in Famo.us.  For Surfaces that share the same translation in z space, default DOM layering will be overridden by explicit CSS z-index values.

##### Why is my Surface not getting this click?

This is usually an indication that there is some invisible Surface on top of the one you are trying to click.  If you inspect the element you are trying to click, it may give you insight into the exact DOM element you are targeting.  This can happen when a Surface has an opacity of 0 but still exists in the DOM.

##### How do I find the absolute position of a Surface on the screen?

By design this is not possible.  It is something the developer should not care about.  For the time being, this means that interactions such as drag and drop are harder to implement, but this is intended and we are working on an elegant solution for these use-cases.

##### When should I be using a new Context?

New contexts should be used when various sections of your application require different perspectives to be set.  A great example is having an overlay or HUD.  It would make sense to have a Context for a 3D scene and a second context for a flat HUD sitting on top of the 3D scene.  This technique is also useful for modals.

Be careful with the amount of Contexts that are created.  Each Context created triggers another full render cycle for the Engine to calculate.  Overuse of Contexts can lead to performance loss.

### Famo.us Do Not's

##### Pinging the DOM

Famo.us is very different from many Javascript frameworks, since it endorses zero touches to the DOM.  Querying the DOM can lead to both performance issues as well as unexpected behavior.

In terms of performance, performing large queries against the DOM is fairly expensive (in measurement of CPU cycles).  Also, seemingly simple requests, such as asking for the width of a DOM element, will sometimes cause the entire page to reflow in order to calculate the correct value for the element's width.  These reflows are made more apparent in a highly animated environment.

There is also unexpected behavior because of how Famo.us uses DOM elements.  Some Famo.us components, such as Scrollview, can cause the DOM element associated with a Surface to be deallocated.  This resource pooling optimization allows Famo.us to minimize the amount of DOM element creations which is an expensive operation.  However, this leads to issues when trying to access DOM elements that no longer are present in the DOM.

##### Using setInterval

Using the default Javascript setInterval will cause issues in Famo.us because of the amount of code the Engine runs.  In some cases, it is possible for the default setInterval to miss a cycle.  If you need setInterval functionality, there is a Timer utility as a part of Famo.us that is integrated with the Engine so that no cycles are missed.

##### Using Native DOM Events

Using native DOM events is fine for intra-surface eventing but is messy for inter-surface eventing.  When trying to communicate across Surfaces, it is best to use Famo.us' eventing system.  By keeping all events in a single system, it is much easier to manage, as an application grows.  Also, because of the resource pooling mentioned in "Pinging the DOM", it is possible that your Surface may have its DOM element deallocated and therefore would result in a loss of all of the registered DOM event handlers that were registered on it.

### Non-performant CSS

CSS is from the age of web pages, not web applications.  As a result, the long paint and reflow times associated with certain CSS classes has gone somewhat unnoticed due to the static nature of the web.  As developers strive to further animate their web applications, understanding the performance implications of their CSS is important.  Below are some of the CSS pitfalls a developer may run into in a highly dynamic environment.

- Combining `border-radius` and `box-shadow` is notoriously slow for browsers to render.  Try to avoid this technique as it will lead to performance problems especially during animations.  See the [CSS Paint Times and Page Render Weight](http://www.html5rocks.com/en/tutorials/speed/css-paint-times/) by Colt McAnlis for a great explanation.

- Breaking the bounding box will lead to performance issues.  It is common for a DOM element to be absolutley positioned `left: -5px`.  While this is very commonplace on the web, it actually becomes harder for the browsers to paint the element performantly.

- Transitioning color values causes large amounts of repainting and is very non-performant.  To achieve a similar effect, try stacking a handful of canvas elements or divs of different colors and then opacitate them in/out accordingly.  Be careful not to add too many layers as there is also a performance hit when too many surfaces exist on the screen.

Check out Paul Lewis' and Paul Irish's [High Performance Animations](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) for a great rundown of CSS' impact on performance.

### Browser Specific Issues

Each browser comes with its own set of quirks.  Understanding the limitations of the browsers and when Famo.us encounters these limitations is very important for developing cross-browser applications.  Below are some of the known browser issues that you may come across while developing with Famo.us.

##### All Browsers

- Combining `overflow: hidden` and CSS transforms in z-space causes unexpected results.  Unfortunately, this is a bug common in the majority of currently available browser implementations.  The inclusion of `overflow: hidden` causes the browser to not interpret z depth correctly when a perspective is set.  This issue is referenced on [StackOverflow](http://stackoverflow.com/questions/14899911/overflow-hidden-breaking-translatez) and is blogged about [here](http://jbkflex.wordpress.com/2013/04/04/css3-transformations-showing-content-outside-overflowhidden-region-in-firefoxandroid/).

- Frame-rate in the browser will take a serious hit when semi-transparent windows lie over them.  Be careful when organizing the windows on your desktop, as this can lead to very confusing performance drops.

##### Chrome & Firefox

- Intersecting surfaces in Chrome and Firefox do not render correctly.  Because of the extensive use of rotation and translation in Famo.us, it is common to come across this issue frequently.  Here it is, referenced on [StackOverflow](http://stackoverflow.com/questions/16968440/chrome-3d-css-transform-intersections-not-rendering-properly) with the accompanying [jsFiddle](http://jsfiddle.net/uNafs/). [Chromium bug report](https://code.google.com/p/chromium/issues/detail?id=116710) and [Bugzilla bug report](https://bugzilla.mozilla.org/show_bug.cgi?id=689498).

##### Chrome

- When a Surface is inserted in the Render Tree, if it is rotated in such a way that none of its pixels would be visible from the current perspective, Chrome will not draw that Surface at all.  This is due to the fact that Chrome tries to save performance by not drawing pixels that cannot be seen but ends up paying for this because of how it implements caching.  Two ways to combat this is to not apply that rotation until immediately before that Surface needs to be seen, or to give that Surface the property "backface-visibility: visible" so that it will end up painting those pixels.

##### Safari

- Garbage collection in Safari tends to be more pronouced.  If an application is performant in Chrome and Firefox but not on Safari, it may be fixable by having more intelligent memory allocation.

##### iOS7 iPad

- iPads that are running iOS7 miscalculate window.innerHeight when they are in landscape orientation.  This poses issues for developers relying on the window's size for laying-out components.  This issue is referenced on [StackOverflow](http://stackoverflow.com/questions/19012135/ios-7-ipad-safari-landscape-innerheight-outerheight-layout-issue).


##### Android

- When using Famo.us on an Android device, it is common that images will be blurry.  This can be fixed by setting a perspective on your context to any non-zero value, like this: `context.setPerspective(1)`

- Images that are affected by a scale tranform, to make them smaller, before being added to the Render Tree will have their bitmap affected.  If that scale transform is then removed, the image will not have its actual bitmap but one that is different because of Android's eager optimization to cache the initial bitmap.  To combat this, avoid scaling images before they are added to the Render Tree, in order to perserve the image's bitmap.
