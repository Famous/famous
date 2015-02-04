Core: Famous core libraries
===========================

The low level componentry of Famo.us, including the required CSS stylesheet.


## Files

- Context.js: The top-level container for a Famo.us-renderable piece of the document.
- ElementAllocator.js: Internal helper object to Context, which handles the process of creating and allocating document elements for use in Surfaces (for internal engine only).
- Engine.js: The singleton object initiated upon process startup which manages all active Contexts, runs  the render dispatch loop, and acts as a listener and dispatcher for events.
- Entity.js:  A singleton that maintains a global registry of rendered surfaces (for internal engine only).
- EventEmitter.js: EventEmitter represents a channel for events.
- EventHandler.js: EventHandler forwards received events to a set of provided callback functions. It allows events to be captured, processed, and optionally piped through to other event handlers.
- Group.js: An internal Context designed to contain surfaces and set properties to be applied to all of them at once (for internal engine only).
- Modifier.js:  A collection of visual changes to be applied to another renderable component.
- OptionsManager.js: A collection of methods for setting options which can be extended onto other classes.
- RenderNode.js: A wrapper for inserting a renderable component (like a Modifer or Surface) into the render tree.
- Scene.js: Builds and renders a scene graph based on a declarative structure definition.
- SpecParser.js: This object translates the rendering instructions that renderable components generate
     into document update instructions (for internal engine only).
- Surface.js:  A base class for viewable content and event targets inside an application.
- Transform.js: A high-performance matrix math library used to calculate affine transforms on surfaces and other renderables.
- View.js: Useful for quickly creating elements within applications with large event systems.
- ViewSequence.js: Helper object used to iterate through items sequentially. Used in views that deal with layout.

## Documentation

- [Reference Docs][reference-documentation]
- [The Render Tree][render-tree]
- [Animating][animating]
- [Layout][layout]
- [Events][events]
- [Pitfalls][pitfalls]

## License

Copyright (c) 2015 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain
one at http://mozilla.org/MPL/2.0/.


[reference-documentation]: http://famo.us/docs
[animating]: http://famo.us/guides/animations
[render-tree]: http://famo.us/guides/render-tree
[layout]: http://famo.us/guides/layout
[events]: http://famo.us/guides/events
[pitfalls]: http://famo.us/guides/pitfalls

