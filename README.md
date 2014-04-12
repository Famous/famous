Famo.us
=======


Famo.us provides a powerful JavaScript framework designed to build rich, interactive web applications.  Famo.us takes an opinionated approach to developing, maintaining a tight control of rendering to achieve UI performance.  The framework also maintains strict modularity for flexibility. Paired with server-side technology designed to match Famo.us on the front end, you can finally create high quality applications that was once reserved only for native development.

The Famo.us front end is currently optimized to work for mobile devices on iOS (6 and above) and Android (4.3 and above).  Broader support for more browsers is coming.

Famous is currently in public beta.  Expect additions and changes to be rapid during this early period.

> "The only constant is change." — Heraclitus

## Installation
Famous can be installed in one of two ways:

### Grunt Toolbelt

If you would like to get started right away you can install our [yeoman generator][github-generator] via npm.

    npm install -g generator-famous
    mkdir newProject
    cd newProject
    yo famous
    grunt serve

Preparing your project for production is then as simple as:

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

- High-level documentation is included publicly at the [guides section our website][site-guides].
- Rendered versions of the JSDoc comments in the source are browsable at the [docs section of our website][site-docs].
- Small examples of using each component are available at [examples repo][github-examples]
- Rich interactive tutorials are available at Famous University.  [Matriculate now][site-university]. We are gradually rolling this feature out.

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
