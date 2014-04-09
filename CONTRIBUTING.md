# Contributing to Famous

Active involvement from the community is essential to help make famous the most
capable and performant browser JavaScript framework out there. You can help by
reporting bugs, fixing bugs, adding features, contributing new modules and by
by providing feedback.


## Reporting bugs and other issues

Famous is a brand new framework that is boldly going where no browser framework
has gone before. As a result, it's likely that you may encounter bugs or other
issues while developing with it.

If you think you've encountered a bug, do the following:

1. Make sure you are working with the latest version of famous. First try the
   `master` branch, and if the problem persists, you may also want to try the
   `develop` branch as well.
2. If your problem persists, browse through the [issues][#issues] to check if
   anyone else has already reported. If someone has, feel free to add more
   information to that issue to help us solve it.
3. If no one has yet submitted the issue you are encountering, check the
   [guidelines for deciding where to file your issue][#issues]. Please be sure
   to include as much information as possible, include errors, warnings,
   screenshots, links to a video showing the problem or code that can reproduce
   the issue.


## Contributing code

The famous framework is made possible by famous, inc. and open source
contributors like you. We're very interested in getting help from the greater
community, but before you start it's important that you become acquainted with
our workflow. Following these guidelines below will make collaboration much
smoother and increase the chances that we will accept your pull request without
hiccups.


### Development Process

The famous framework development process is very similar to the approach
described in the well-known article [A Successful Git Branching Model by Vincent
Driessen][git_branching_model]. Here's a 10,000 foot overview:

* Our `master` branch is considered safe and is the branch upon which most
  famous developers should be basing their work on.
* The `master` branch will be updated only when there is a new release
* Releases on `master` will be tagged using [semantic versioning][semver], and
  the `HEAD` of `master` will always point to the the latest release.
* Development for the next release will take place on the `develop` branch.
* If there are any serious bugs that cannot wait for the next release a hotfix
  will be applied to the `master` branch and that new release will be tagged
  with the appropriate semver based on the magnitude of the change. That hotfix
  will also be pulled into the `develop` branch.
* With the exception of hotfixes, all accepted pull requests will be merged into
  the `develop` branch.
* All commits intended for `develop` should take place on your own personal
  fork, and be submitted via pull request when ready.
* Only maintainers can accept pull requests from forks into the core famous
  repository.
* Some of the internal teams at famous are experimenting with new features or
  tooling to make the experience of working with famous better. These teams
  maintain their own forks of famous, some of which may not yet be public. The
  goal here isn't to be secretive, but to be able to move fast and work in an
  environment in which they feel comfortable. They will submit their pull
  requests to the main famous repository the same way as any other member of the
  community.


### Getting started

1. Make sure you have a [GitHub account](https://github.com/signup/free)
2. [Fork famous][fork-famous]
3. Keep your fork up to date. Famous is a fast moving project, and things are
   changing all the time. It's important that any changes you make are based on
   the most recent version of famous, since it's possible that something may
   have changed that breaks your pull request or invalidates its need.
4. Make sure you have a [Contributor License Agreement][#cla] on file.
5. Read on ...


### Contributor License Agreement

Before we can accept any contributions to famous, we first require that all
individuals or companies agree to our Contributor License Agreement. The email
address used in the pull request will be used to check if a CLA has already been
filed, so be sure to list all email addresses that you might use to submit your
pull requests when filling it out. Our CLA can be found [here][cla].


### Branch grouping tokens

All pull requests submitted to famous should occur on a new branch. For these
branches, we at famous use a short token indicating the nature of the branch in
question followed by a solidus (`/`) and a kebab-cased string describing the
branch. We are using the following tokens:

    bug   // bug fixes
    wip   // work in progress
    feat  // feature
    junk  // experiments and other junk

This naming scheme allows us to easily search for branches using wildcards:

    git branch --list "bug/*"

Bug fixes follow a [slightly different format][#bug-fixes].


### Bug fixes

If you'd like to contribute a fix for a bug you've encountered, first read up on
[how to report a bug][reporting-bugs-and-other-issues] and report it so we are
aware of the issue. By filing the issue first, we may be able to provide you
with some insight that guides you in the right direction.

After reporting the bug, create a new branch off either the `master` or
`develop` branch of your up-to-date fork of [famous] for your bugfix using the
following naming schema:

    bug/repo-where-issue-was-filed/GH-issue-number/kebab-cased-description

So if you were fixing a bug for issue #42 in the `famous/core` repo, you would
name your branch `bug/core/GH-42/particle-render-flicker`


### Feature requests and API Changes

Like Unix, Famous is designed to be extremely modular. The ideal famous module
should adhere as much as possible to the [Unix principles][unix-principles] as
outlined by [Eric S. Raymond][esr] in [The Art of Unix Programming][taoup]. With
this in mind, most feature requests and API changes are probably best
implemented as new modules that extend the famous modules.

If you have an idea for a feature request or API change, first explore making a
module that requires famous modules builds upon the public APIs those required
modules expose. However, if you are going to extend a common famous module,
please be sure to subclass it, instead of modifying the original class. For a
good discussion why modifying the original object is bad read
[this][modifying-ojects-considered-bad].

If you do successfully come up with a new module, we'd love to hear about it.
For now you can email <team@famo.us>, while we set up a section listing modules
created by the community.

If after trying to create a new module, you still feel that the larger famous
community would benefit from an additional feature or API change in a core
famous module, please open an issue in the [main famous issues][famous-issues]
or in the [issues][issues-pages] page that you feel is most appropriate.


## Issues

Famous is composed of several repositories, and it helps if bugs are filed in
the issues section of the right repository. To help you check if your issue has
already been filed or to help you file it in the right place in case it hasn't
we've created the following guidelines:

* If you've encountered an exception with a stack trace that tells you which
  famous module file an error occurred, look at the path to that file and the
  name of the repo to file in will follow `famous/` in the file name. For
  example, if you encounter an exception in `famous/physics/bodies/Particle.js`,
  you should file your issue in "physics" repo.
* If you've encountered a general rendering and animating bugs where something
  is not being displayed or is being displayed incorrectly, you should file your
  bug in the main famous repository issues page. For rendering bugs it's very
  important that we can reproduce your issue in order to figure out the source
  of the problem and fix it. So for these types of problems you should either
  provide a copy of your code demonstrating the issue or reproduce the issue in
  a new project.
* If you have experience with the framework and have read through enough of the
  source to know where the root of the issue lies feel free to file in the
  appropriate repository.
* If you believe you have encountered a security issue with either the famous
  framework or with our site, please do not file it publicly. Instead send an
  email to <security@famo.us> describing the issue you've discovered.
* If you have a feature request or API change to propose, first read our policy
  on [feature requests and API changes][#feature-requests-and-api-changes].
* If you are still unsure of where to file an issue, go ahead and file it in the
  main [famous issues page][famous-issues]. We'll investigate or ask enough
  questions to find out where it should be filed instead.


### Issues Pages

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


## Testing

You may have noticed the conspicuous absence of tests in the famous code
repositories. We've tried a bunch of tools out there, and a lot of what famous
is capable of is beyond the testing capabilities of most tools out there, or
requires so much testing code as to be untenable or unmaintainable. Some of the
approaches attempted required an absurd amount of code for the simplest of
tests, were far too slow or actively interfered with how famous apps work.

We know the lack of tests inhibits your capacity to contribute to famous and our
capacity to accept your improvements. With that in mind, we are taking testing
seriously and are currently working on tools to make famous apps and modules
easily testable. When can you expect to see these tools? As soon as we feel that
they are mature enough that you can be reasonably certain that you're testing
your app or module and not the testing tools themselves.


## The Future

We're aware that in a few places the guidelines above are currently a bit more
complex than you may have experienced when contributing to other open source
projects.

We are currently working to improve the contribution process to make it as
effortless as possible. As part of this effort, we're working on some internal
tools to streamline building upon famous and making contributions back to the
framework and to the community. When we feel these tools are ready, we'll open
source them as well.

If you're interested in getting involved with the tools we have planned as
either a private beta user or as a contributor, you can email the tools team at
<tools@famo.us>.


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
[cla]: http://famo.us/legal/cla.html