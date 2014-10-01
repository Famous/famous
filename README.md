Famo.us
=======

[![Build Status](https://travis-ci.org/Famous/famous.svg?branch=master)](https://travis-ci.org/Famous/famous) [![devDependency Status](https://david-dm.org/Famous/famous/dev-status.svg)](https://david-dm.org/Famous/famous#info=devDependencies)

Welcome to the Famo.us GitHub repo. If you are interested in evaluating Famo.us, we are now in open beta.

| RESOURCE | LINK |
|------------|---------|
| **DOWNLOAD** | [Famo.us Starter Kit][starter-kit] |
| **LEARN** | [Famo.us University][famous-university] |
| **DOCS** | [Documentation][famous-docs] |
| **HELP** | [IRC Channel][IRC] |
| **DEMOS** | [Mobile Interactive Demos][famous-demos] (*built by the community*)|
| **ANGULAR INTEGRATION** | [Famo.us/Angular][famous-angular] |
| **ANGULAR DOWNLOAD** | [Angular Starter Kit][famous-angular-starter-kit] |

## About

Famo.us is a free and open source JavaScript platform for building mobile apps and desktop experiences. What makes Famo.us unique is its JavaScript rendering engine and 3D physics engine that gives developers the power and tools to build native quality apps and animations using pure JavaScript. Famo.us runs on iOS, Android, Kindle and Firefox devices and integrates with [Angular][famous-angular], Backbone, Meteor and Facebook React. 

## Getting Started

###Famo.us University

[Famo.us University][famous-university] is a free live coding classroom that teaches all levels of developers how to utilize Famo.us to build beautiful experiences on every screen.  If you are new to Famo.us or to coding you will find that [Famo.us University][famous-university] is the best place to get started.

### Seed Projects

There are a number of seed projects to get you started with the various way of consuming Famo.us

**[Global Seed][global-seed]**

This project shows the easiest way to get started with Famo.us using a version that loads on the global object.  This project requires zero tooling, and is ready to work out of the box.  For speed and simplicity this seed project points at a version of Famo.us that lives on our cdn (content delivery network).  This project doesn't even require a git clone, you can get started right now simply by [downloading the zip][global-seed-download].

**[Requirejs Seed][requirejs-seed]**

This project can be used to get you started using Famo.us with the AMD module loading pattern via [requirejs][requirejs].  This project is created using the latest version of our Yeoman Generator (see below), and includes an entire tooling stack neccessary to bring your product to development.

**[Browserify Seed][browserify-seed]**

This project can be used to get you started using Famo.us with the CommonJS module loading pattern with [browserify][browserify] and [npm][npm].  This seed project should be treated as experimental, it is for those who want to try and develop client side code using npm.

### Yeoman Generator (*Grunt Toolbelt*)

If you would like to scaffold an app with Famo.us from the command line, install our [yeoman generator][github-generator] via npm.

    npm install -g yo grunt-cli bower generator-famous
    mkdir newProject
    cd newProject
    yo famous
    grunt serve

Preparing your project for distribution is then as simple as:

    grunt

## Contributing

Cloning this repository directly is primarily for those wishing to contribute to our codebase. Check out our [contributing instructions][contributing] to get involved. 
    
Note: cloning only provides the Famo.us folder with all Famo.us code, but it does no application scaffolding. You will additionally need to create your own index.html, and include the `famous.css` file that is included in `famous/core`. Require.js is currently a hard dependency to work off of the Famo.us head.
  
## Documentation

- Guides and Examples can be found in the repo.
- Rendered versions of the source code reference documentation: [docs][site-docs].

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
[starter-kit]: http://code.famo.us/famous-starter-kit/famous-starter-kit.zip?source=repo
[famous-university]: https://famo.us/university
[famous-help]: https://famo.us/help
[famous-docs]: http://famo.us/docs
[famous-demos]: http://famo.us/demos
[famous-angular]: http://famo.us/integrations/angular/
[famous-angular-starter-kit]: http://code.famo.us/famous-angular/latest/famous-angular-starter-kit.zip?source=repo
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
[global-seed]: https://github.com/Famous/global-seed
[global-seed-download]: https://github.com/Famous/global-seed/archive/master.zip
[requirejs-seed]: https://github.com/Famous/requirejs-seed
[browserify-seed]: https://github.com/Famous/browserify-seed/
[requirejs]: http://requirejs.org/
[browserify]: http://browserify.org/
[npm]: http://npmjs.org


[![Analytics](https://ga-beacon.appspot.com/UA-34653957-5/famous/famous/README.md?pixel)](https://github.com/igrigorik/ga-beacon)