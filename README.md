Famo.us
=======

Welcome to the Famo.us GitHub repo. If you are interested in evaluating Famo.us, we are now in open beta.

| RESOURCE | LINK |
|------------|---------|
| **DOWNLOAD** | [Famo.us Starter Kit][starter-kit] |
| **LEARN** | [Famo.us University][famous-university] |
| **DOCS** | [Documentation][famous-docs] |
| **HELP** | [IRC Channel][IRC] |
| **DEMOS** | [Mobile Interactive Demos][famous-demos] (*built by the community*)|
| **ANGULAR INTEGRATION** | [ng.us][famous-angular] |

## About

Famo.us is a free and open source JavaScript platform for building mobile apps and desktop experiences. What makes Famo.us unique is its JavaScript rendering engine and 3D physics engine that gives developers the power and tools to build native quality apps and animations using pure JavaScript. Famo.us runs on iOS, Android, Kindle and Firefox devices and integrates with [Angular][famous-angular], Backbone, Meteor and Facebook React. [Famo.us University][famous-university] is a free live coding classroom that teaches all levels of developers how to utilize Famo.us to build beautiful experiences on every screen.

## Installation

### Simple Installation (*Famo.us Starter Kit*)

To get up and running quickly, download our [**starter kit**][starter-kit]. We've loaded it with examples, demos, reference documentation, and higher-level guides.

### Advanced Installation (*Grunt Toolbelt*)

If you would like to scaffold an app with Famo.us from the command line, install our [yeoman generator][github-generator] via npm.

    npm install -g yo grunt-cli bower generator-famous
    mkdir newProject
    cd newProject
    yo famous
    grunt serve

Preparing your project for distribution is then as simple as:

    grunt

## Contributing

Cloning this repository directly is primarily for those wishing to contribute to our codebase. Check out our [contributing instructions][contributing] to get involved. Since we use git submodules, all subfolders will be unpopulated unless you initialize and update your submodules. To clone from the command line, run

    git clone git@github.com:Famous/famous.git path/to/folder
    cd path/to/folder
    git submodule update --init
    
Or clone with the `--recursive` flag for a conveninent the one-liner

    git clone git@github.com:Famous/famous.git --recursive path/to/folder
    
Note: cloning only provides the Famo.us folder with all Famo.us code, but it does no application scaffolding. You will additionally need to create your own index.html, and include the `famous.css` file that is included in `famous/core`. Require.js is currently a hard dependency for using Famo.us.

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

- High-level documentation: [guides][site-guides].
- Rendered versions of the source code reference documentation: [docs][site-docs].
- Small examples of each Famo.us component: [examples repository][github-examples].

## Community

- If you would like to report a bug, please check the [issues][contributing-issues] section in our [contributing instructions][contributing].
- Join us in our IRC channel #famous at irc.freenode.net. Freenode maintains this [getting started guide][irc-getting-started] for those new to IRC.
- For contributors, read more instructions in [CONTRIBUTING.md][contributing-issues].

## Licensing information
- Famo.us' client-side development package is licensed under the Mozilla public license version 2.0.  More information can be found at [Mozilla][mpl].
- Mozilla also maintains an [MPL-2.0 FAQ][mpl-faq] that should answer most questions you may have about the license.
- Contact license@famo.us for further inquiries.

Copyright (c) 2014 Famous Industries, Inc.


[famous-site]: http://famo.us
[starter-kit]: http://code.famo.us/famous-starter-kit/famous-starter-kit.zip
[famous-university]: https://famo.us/university
[famous-help]: https://famo.us/help
[famous-docs]: http://famo.us/docs
[famous-demos]: http://famo.us/demos
[famous-angular]: http://famo.us/integrations/angular/
[IRC]: http://webchat.freenode.net/?channels=famous
[mpl]: http://www.mozilla.org/MPL/2.0/
[mpl-faq]: http://www.mozilla.org/MPL/2.0/FAQ.html
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
