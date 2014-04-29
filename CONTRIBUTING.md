# Contributing to Famo.us

Active involvement from the community is essential to help make famous the most
capable and performant front-end JavaScript framework out there. You can help by
reporting bugs, fixing bugs, adding features, contributing new modules and by
by providing feedback.


## Reporting bugs and other issues

Famo.us is a framework that is always testing the limits of where browsers can go. As a result, it's likely that you may encounter bugs or other issues while developing with it.

If you think you've encountered a bug, do the following:

1. Make sure you are working with the latest version of the Famo.us `master` branch.
2. Browse through the [issues](#issues) to check if
   anyone else has already reported. If someone has, feel free to add more
   information to that issue to help us solve it.
3. If no one has yet submitted the issue you are encountering, check the
   [guidelines for deciding where to file your issue](#issues). Please be sure
   to include as much information as possible, include errors, warnings,
   screenshots, links to a video showing the problem or code that can reproduce
   the issue.


## Contributing code

The Famo.us framework is made possible by open source
contributors like you. We're very interested in getting help from the greater
community, but before you start it's important that you become acquainted with
our workflow. Following these guidelines below will make collaboration much
smoother and increase the chances that we will accept your pull request without
hiccups.


### Development Process

Our development process is very similar to the approach
described in the well-known article [A Successful Git Branching Model by Vincent
Driessen][git-branching-model]. Here's a 10,000 foot overview:

* Our `master` branch is the branch upon which most
  famous developers should be basing their work on. The `master` branch is not guaranteed to be stable.
* All commits intended for `master` should take place on your own personal
  fork, and be submitted via pull request when ready.
* Only maintainers can accept pull requests from forks into the core Famo.us
  repository.
* Some of the internal teams at Famo.us are experimenting with new features or
  tooling to make the experience of working with Famo.us better. These teams
  maintain their own forks of Famo.us, some of which may not yet be public. The
  goal here isn't to be secretive, but to be able to move fast and work in an
  environment in which they feel comfortable. They will submit their pull
  requests to the main famous repository the same way as any other member of the
  community.


### Getting started

1. Make sure you have a [GitHub account](https://github.com/signup/free)
2. [Fork famous][fork-famous]
3. Keep your fork up to date. Famo.us is a fast moving project, and things are
   changing all the time. It's important that any changes you make are based on
   the most recent version of famous, since it's possible that something may
   have changed that breaks your pull request or invalidates its need.
4. Make sure you have a [Contributor License Agreement][cla] on file.
5. Read on ...


### Contributor License Agreement

Before we can accept any contributions to Famo.us, we first require that all
individuals or companies agree to our Contributor License Agreement (CLA). The e-mail
address used in the pull request will be used to check if a CLA has already been
filed, so be sure to list all email addresses that you might use to submit your
pull requests when filling it out. Our CLA can be found [here][cla].


### Branch grouping tokens

All pull requests submitted to Famo.us should occur on a new branch. For these
branches, we at famous use a short token indicating the nature of the branch in
question followed by a solidus (`/`) and a kebab-cased string describing the
branch. We are using the following tokens:

    bug   // bug fixes
    wip   // work in progress
    feat  // feature

Bug fixes follow a [slightly different format](#bug-fixes).


### Bug fixes

If you'd like to contribute a fix for a bug you've encountered, first read up on
[how to report a bug][reporting-bugs-and-other-issues] and report it so we are
aware of the issue. By filing the issue first, we may be able to provide you
with some insight that guides you in the right direction.

## Issues

Famo.us is composed of several repositories, and it helps if bugs are filed in
the issues section of the right repository. To help you check if your issue has
already been filed or to help you file it in the right place in case it hasn't
we've created the following guidelines:

Below is a list of links to the issues page for all the famous framework
repositories.

* [famous][famous-issues]
  * [core][core-issues]
  * [events][events-issues]
  * [inputs][inputs-issues]
  * [math][math-issues]
  * [modifiers][modifiers-issues]
  * [physics][physics-issues]
  * [surfaces][surfaces-issues]
  * [transitions][transitions-issues]
  * [utilities][utilities-issues]
  * [views][views-issues]
  * [widgets][widgets-issues]


[famous-issues]: https://github.com/famous/famous/issues
[core-issues]: https://github.com/famous/core/issues
[events-issues]: https://github.com/famous/events/issues
[inputs-issues]: https://github.com/famous/inputs/issues
[math-issues]: https://github.com/famous/math/issues
[modifiers-issues]: https://github.com/famous/modifiers/issues
[physics-issues]: https://github.com/famous/physics/issues
[surfaces-issues]: https://github.com/famous/surfaces/issues
[transitions-issues]: https://github.com/famous/transitions/issues
[utilities-issues]: https://github.com/famous/utilities/issues
[views-issues]: https://github.com/famous/views/issues
[widgets-issues]: https://github.com/famous/widgets/issues

[famous]: https://github.com/famous/famous
[git-branching-model]: http://nvie.com/posts/a-successful-git-branching-model/
[semver]: http://semver.org/
[fork-famous]: https://github.com/Famous/famous/fork
[unix-principles]: http://www.faqs.org/docs/artu/ch01s06.html
[esr]: http://www.catb.org/esr/
[taoup]: http://www.catb.org/esr/writings/taoup/
[modifying-ojects-considered-bad]: http://perfectionkills.com/whats-wrong-with-extending-the-dom/
[cla]: http://famo.us/cla/individual
