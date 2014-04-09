Famo.us
=======


Famo.us provides a powerful JavaScript framework and developer tools designed to build rich, fast web applications.  Famo.us takes an opinionated approach to developing with web technology, maintaining tight control of rendering to achieve maximum UI performance.  Built-in and user-defined animations can be powered by our physics engine, creating delightful, natural motion.  The framework also maintains strict modularity for maximum flexibility.  Paired with server-side technology designed to match Famo.us on the front end, you can finally create high quality applications that was once reserved only for native development.

The Famo.us front end is currently optimized to work for mobile devices on iOS (6 and above) and Android (4.3 and above).  Broader support for more browsers is coming.

Our [github organization][famous-organization-github] is primarily for those wishing to contribute back to Famo.us.  If you are looking instead to get started quickly on an applications and you've only cloned this repository, prefer one of the installation methods listed in [#Installation].

Famous is currently in public beta.  Expect additions and changes to be rapid during this early period.

- "The only constant is change." -- Heraclitus

## Famous.git package
- This package contains the submodules necessary to be productive in Famo.us.  They are all hosted on [our github organization][famous-organization-github].  In particular:
  - core: The low level componentry of Famo.us, plus the required famous.css stylesheet.
  - events: Events are used for communication between objects in Famous.
  - inputs: The inputs library is used to interpret user input to the device.
  - math: A simple math library used throughout the core.
  - modifiers: Implementations of the core/Modifier pattern which output transforms to the render tree.
  - physics: Core engine controlling animations via physical simulation.
  - surfaces: Surfaces are extensions of core/Surface and are the primary concrete interface to the visual document elements.
  - transitions: Transitions are used to create animation, usually by providing input to a Modifier.
  - utilities: Utilities hosts various helper classes and static methods.
  - views: Views are visually interactable components for use in applications.
  - widgets: Widgets are small visually interactable components for use in applications with their own styling.


## Documentation
- High-level documentation is included in this distribution in markdown format in the docs folder.
- Online verisons of this documentation are available in our [guides pages][launch-guides].
- Rendered versions of the JSDoc comments in the source are browsable at our [docs pages][launch-docs] .
- Small examples of using each component are available at [examples repo][github-examples]
- Rich interactive tutorials are available at Famous University.  [Matriculate now][launch-university].


## Installation
Famous can be installed in one of two ways:

### Installation: Toolbelt
You can find information about our toolbelt over at [our install page][launch-install]

If you would like to get started right away you can install our [yeoman generator][github-generator] via npm.

    npm install -g generator-famous
    mkdir newProject
    cd newProject
    yo famous
    grunt serve

Preparing your project for production is then as simple as:

    grunt

### Installation: Getting started with Famo.us Base
By installing our starter kit available at [our install page][launch-install], unzipping, and building a project starting directly from js/main.js.

    unzip base.zip
    npm install -g serve
    cd starter
    serve

### This repository

Again, cloning this repository directly is primarily for those wishing to contribute back. Check out our [contributing instructions][contributing] if you wish to get involved.

## Community
- If you would like to report a bug, please check the [issues][contributing-issues] section in our [contributing instructions][contributing].
- Ask a question on our [forum][forum].
- Join us in our IRC channel #famous at irc.freenode.net. Freenode maintains this [getting started guide][irc-getting-started] for those new to irc. If you're new to discussing open-source software development on freenode and you want to ask a question, we recommend that you first read esr's [How to Ask Questions the Smart Way][esr-questions].
- For contributors, read more instructions in the [CONTRIBUTING.md][contributing-issues] document in this repo.

## Licensing information
- Famo.us' client-side development package is licensed under the Mozilla public license version 2.0.  More information can be found at [Mozilla][mpl].
- Mozilla also maintains an [MPL-2.0 FAQ][mpl-faq] that should answer most questions you may have about the license.
- Contact us at license@famo.us for further inquiries.

## News
- 4/9: Welcome to the jungle.

License
-------

Copyright (c) 2014 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this file,
You can obtain one at http://mozilla.org/MPL/2.0/.



[famous-site]: http://famo.us
[mpl]: http://www.mozilla.org/MPL/2.0/
[mpl-faq]: http://www.mozilla.org/MPL/2.0/FAQ.html
[bugs-general]: http://github.com/Famous/famous/issues
[bugs-sumobule]: http://github.com/Famous/core/issues
[forum]: http://forum.famo.us
[launch-install]: http://famo.us/install.html
[github-generator]: http://github.com/Famous/generator-famous.git
[launch-guides]: http://famo.us/guides/dev
[launch-docs]: http://famo.us/docs
[launch-university]: http://famo.us/university
[famous-organization-github]: http://github.com/Famous
[github-examples]: http://github.com/Famous/examples
[contributing]: https://github.com/Famous/famous/blob/master/CONTRIBUTING.md
[contributing-issues]: https://github.com/Famous/famous/blob/master/CONTRIBUTING.md#issues
[irc-getting-started]: http://freenode.net/using_the_network.shtml
[esr-questions]: http://www.catb.org/esr/faqs/smart-questions.html
