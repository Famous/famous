Famo.us
=======


Famo.us provides a JavaScript framework designed to build rich, interactive web applications.  Famo.us takes an opinionated approach to web development, maintaining a tight control of rendering to achieve performance.  The framework also maintains strict modularity for flexibility. Paired with server-side technology designed to match Famo.us on the front end, you can finally create high quality applications that was once reserved only for native development.

Famo.us is in public beta, and currently optimized to work for mobile devices on iOS 6+ and Android 4.3+.  Broader support is coming.

If you have any problems at all, we recommend you join our [IRC channel (#famous on Freenode)][IRC] for live help.

> "The only constant is change." — Heraclitus

## Installation
Famo.us can be installed in one of two ways:

### Grunt Toolbelt

If you would like to get started right away you can install our [yeoman generator][github-generator] via npm.

    npm install -g yo grunt-cli bower generator-famous
    mkdir newProject
    cd newProject
    yo famous
    grunt serve

Preparing your project for distribution is then as simple as:

    grunt

### Git Submodules (for contributors)

Cloning this repository directly is primarily for those wishing to contribute to our codebase. Check out our [contributing instructions][contributing] to get involved. Since we use git submodules, all subfolders will be unpopulated unless you initialize and update your submodules. To clone from the command line, run

    git clone git@github.com:Famous/famous.git
    cd famous
    git submodule update --init
    
Note: this only provides the Famo.us folder and all Famo.us code, but it does no application scaffolding. You will additionally need to create your own index.html, and include the famous.css file that is included in famous/core. Require.js is also a hard dependency for using Famo.us.    

## Famous.git Package

This package contains the submodules necessary to be productive in Famo.us.  They are all hosted on [our github organization][famous-organization-github].  

| Submodule | Description |
| --------- | ----------- |
| core.git | The low level componentry of Famo.us, plus the required famous.css stylesheet. |
| events.git | Events are used for communication between objects in Famous. |
| inputs.git | The inputs library is used to interpret user input to the device. |
| math.git | A simple math library used throughout the core. |
| modifiers.git | Implementations of the core/Modifier pattern which output transforms to the render tree. |
| physics.git | Core engine controlling animations via physical simulation. |
| surfaces.git | Surfaces extend core/Surface and encapsulate common HTML tags like `<img>` and `<canvas>`.|
| transitions.git | Transitions are used to create animation, usually by providing input to a Modifier. |
| utilities.git | Utilities hosts various helper classes and static methods. |
| views.git | Views are visually interactable components for use in applications. |
| widgets.git | Widgets are small visually interactable components for use in applications with their own styling. |
  
## Documentation

- High-level documentation is included publicly at the [guides section on our website][site-guides].
- Rendered versions of the JSDoc comments in the source are browsable at the [docs section of our website][site-docs].


## Examples

Small examples of using each component are available at [examples repo][github-examples]

##### List of all examples by submodule
| Core | Events | Inputs |
| --------- | ----------- | ----------- |
| [Context - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/Context/example.js) | [EventArbiter - Base example](https://github.com/Famous/examples/blob/master/src/examples/events/EventArbiter/example.js) | [GenericSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/GenericSync/example.js) |
| [Context - Context in an existing DOM element](https://github.com/Famous/examples/blob/master/src/examples/core/Context/context-in-existing-element.js) | [EventFilter - Piping](https://github.com/Famous/examples/blob/master/src/examples/events/EventFilter/pipe-filter.js) | [MouseSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/MouseSync/example.js) |
| [Context - Setting perspective](https://github.com/Famous/examples/blob/master/src/examples/core/Context/setting-perspective.js) | [EventFilter - Subscribing](https://github.com/Famous/examples/blob/master/src/examples/events/EventFilter/subscribe-filter.js) | [MouseSync - Single direction](https://github.com/Famous/examples/blob/master/src/examples/inputs/MouseSync/single-dimensional.js) |
| [Engine - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/Engine/example.js) | [EventMapper - Base example](https://github.com/Famous/examples/blob/master/src/examples/events/EventMapper/example.js) | [PinchSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/PinchSync/example.js) |
| [EventHandler - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/EventHandler/example.js) | []() | [RotateSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/RotateSync/example.js) |
| [EventHandler - Trigger](https://github.com/Famous/examples/blob/master/src/examples/core/EventHandler/trigger.js) | []() | [ScaleSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/ScaleSync/example.js) |
| [Modifier - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/Modifier/example.js) | []() | [ScrollSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/ScrollSync/example.js) |
| [Modifier - Origin](https://github.com/Famous/examples/blob/master/src/examples/core/Modifier/origin.js) | []() | [TouchSync - Base example](https://github.com/Famous/examples/blob/master/src/examples/inputs/TouchSync/example.js) |
| [Modifier - Size](https://github.com/Famous/examples/blob/master/src/examples/core/Modifier/size.js) | []() | [TouchSync - Single direction](https://github.com/Famous/examples/blob/master/src/examples/inputs/TouchSync/single-dimensional.js) |
| [Modifier - Opacity](https://github.com/Famous/examples/blob/master/src/examples/core/Modifier/opacity.js) | []() | []() |
| [Modifier - Chaining](https://github.com/Famous/examples/blob/master/src/examples/core/Modifier/chaining.js) | []() | []() |
| [Modifier - Branching](https://github.com/Famous/examples/blob/master/src/examples/core/Modifier/branching.js) | []() | []() |
| [Scene - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/Scene/example.js) | []() | []() |
| [Surface - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/Surface/example.js) | []() | []() |
| [Surface - True size](https://github.com/Famous/examples/blob/master/src/examples/core/Surface/true-sizing.js) | []() | []() |
| [Transform - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/Transform/example.js) | []() | []() |
| [View - Base example](https://github.com/Famous/examples/blob/master/src/examples/core/View/example.js) | []() | []() |

| Math | Modifiers | Physics |
| --------- | ----------- | ----------- |
| [Matrix - Base example](https://github.com/Famous/examples/blob/master/src/examples/math/Matrix/example.js) | [Draggable - Base example](https://github.com/Famous/examples/blob/master/src/examples/modifiers/Draggable/example.js) | []() |
| [Quaternion - Base example](https://github.com/Famous/examples/tree/master/src/examples/math/Quaternion) | [ModifierChain - Base example](https://github.com/Famous/examples/blob/master/src/examples/modifiers/ModifierChain/example.js) | []() |
| [Quaternion - Rotating box](https://github.com/Famous/examples/blob/master/src/examples/math/Quaternion/rotating_box.js) | [StateModifier - Base example](https://github.com/Famous/examples/blob/master/src/examples/modifiers/StateModifier/example.js) | []() |
| [Random - Base example](https://github.com/Famous/examples/blob/master/src/examples/math/Random/example.js) | []() | []() |
| [Vector - Base example](https://github.com/Famous/examples/blob/master/src/examples/math/Vector/example.js) | []() | []() |

| Surfaces | Transitions | Utilities |
| --------- | ----------- | ----------- |
| [ContainerSurface - Base example](https://github.com/Famous/examples/blob/master/src/examples/surfaces/ContainerSurface/example.js) | [Easing - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/Easing/example.js) | [KeyCodes - Base example](https://github.com/Famous/examples/blob/master/src/examples/utilities/KeyCodes/example.js) |
| [ImageSurface - Base example](https://github.com/Famous/examples/blob/master/src/examples/surfaces/ImageSurface/example.js) | [SnapTransition - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/SnapTransition/example.js) | [Timer - After](https://github.com/Famous/examples/blob/master/src/examples/utilities/Timer/after.js) |
| [InputSurface - Base example](https://github.com/Famous/examples/blob/master/src/examples/surfaces/InputSurface/example.js) | [SpringTransition - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/SpringTransition/example.js) | [Timer - Every](https://github.com/Famous/examples/blob/master/src/examples/utilities/Timer/every.js) |
| []() | [Transitionable - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/Transitionable/example.js) | [Timer - setTimeout](https://github.com/Famous/examples/blob/master/src/examples/utilities/Timer/setTimeout.js) |
| []() | [TransitionableTransform - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/TransitionableTransform/example.js) | [Timer - setInterval](https://github.com/Famous/examples/blob/master/src/examples/utilities/Timer/setInterval.js) |
| []() | [TweenTransition - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/TweenTransition/example.js) | [Timer - Clear](https://github.com/Famous/examples/blob/master/src/examples/utilities/Timer/clear.js) |
| []() | [WallTransition - Base example](https://github.com/Famous/examples/blob/master/src/examples/transitions/WallTransition/example.js) | [Utility - After](https://github.com/Famous/examples/blob/master/src/examples/utilities/Utility/after.js) |


| Views | Widgets |
| --------- | ----------- |
| [Deck - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/Deck/example.js) | []() |
| [EdgeSwapper - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/EdgeSwapper/example.js) | []() |
| [GridLayout - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/GridLayout/example.js) | []() |
| [GridLayout - With sized Modifier](https://github.com/Famous/examples/blob/master/src/examples/views/GridLayout/with-sized-modifier.js) | []() |
| [HeaderFooterLayout - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/HeaderFooterLayout/example.js) | []() |
| [HeaderFooterLayout - With sized Modifier](https://github.com/Famous/examples/blob/master/src/examples/views/HeaderFooterLayout/with-sized-modifier.js) | []() |
| [RenderController - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/RenderController/example.js) | []() |
| [Scrollview - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/Scrollview/example.js) | []() |
| [SequentialLayout - Base example](https://github.com/Famous/examples/blob/master/src/examples/views/SequentialLayout/example.js) | []() |


## Community

- If you would like to report a bug, please check the [issues][contributing-issues] section in our [contributing instructions][contributing].
- Ask a question on our [forum][forum] (requires login).
- Join us in our IRC channel #famous at irc.freenode.net. Freenode maintains this [getting started guide][irc-getting-started] for those new to irc. If you're new to discussing open-source software development on freenode and you want to ask a question, we recommend that you first read esr's [How to Ask Questions the Smart Way][esr-questions].
- For contributors, read more instructions in the [CONTRIBUTING.md][contributing-issues] document in this repo.

## Licensing information
- Famo.us' client-side development package is licensed under the Mozilla public license version 2.0.  More information can be found at [Mozilla][mpl].
- Mozilla also maintains an [MPL-2.0 FAQ][mpl-faq] that should answer most questions you may have about the license.
- Contact us at license@famo.us for further inquiries.

Copyright (c) 2014 Famous Industries, Inc.


[famous-site]: http://famo.us
[IRC]: http://webchat.freenode.net/?channels=famous
[mpl]: http://www.mozilla.org/MPL/2.0/
[mpl-faq]: http://www.mozilla.org/MPL/2.0/FAQ.html
[forum]: http://forum.famo.us
[site-install]: http://famo.us/install
[github-generator]: http://github.com/Famous/generator-famous.git
[site-guides]: http://famo.us/guides
[site-docs]: http://famo.us/docs
[site-university]: http://famo.us/university
[famous-organization-github]: http://github.com/Famous
[github-examples]: http://github.com/Famous/examples
[contributing]: https://github.com/Famous/famous/blob/master/CONTRIBUTING.md
[contributing-issues]: https://github.com/Famous/famous/blob/master/CONTRIBUTING.md#issues
[irc-getting-started]: http://freenode.net/using_the_network.shtml
[esr-questions]: http://www.catb.org/esr/faqs/smart-questions.html
