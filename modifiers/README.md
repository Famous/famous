Modifiers: Famous modifier objects
==================================

Implementations of the core/Modifier pattern which output transforms to the
render tree.


## Files

- Draggable.js: Makes added render nodes responsive to drag behavior.
- Lift.js: Lifts a rendernode further down the render chain to a new different
  parent context
- ModifierChain.js: A class to add and remove a chain of modifiers at a single
  point in the render tree.
- StateModifier.js: A collection of visual changes to be applied to another
  renderable component, strongly coupled with the state that defines those
  changes.


## Documentation

- [Reference Docs][reference-documentation]
- [The Render Tree][render-tree]
- [Layout][layout]
- [Animating][animating]
- [Pitfalls][pitfalls]


## Maintainer

- Mark Lu <mark@famo.us>


## License

Copyright (c) 2014 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain
one at http://mozilla.org/MPL/2.0/.


[reference-documentation]: http://famo.us/docs
[animating]: http://famo.us/guides/dev/animating.html
[render-tree]: http://famo.us/guides/dev/render-tree.html
[layout]: http://famo.us/guides/dev/layout.html
[pitfalls]: http://famo.us/guides/dev/pitfalls.html

