Transitions: Famo.us animation library [![Build Status](https://travis-ci.org/Famous/transitions.svg)](https://travis-ci.org/Famous/transitions)
======================================

Transitions are used to create animation, usually by providing input to a 
Modifier.


## Files

- CachedMap.js: A simple in-memory object cache.  Used as a helper for Views 
  with provider functions.
- Easing.js: A library of curves which map an animation explicitly as a function 
  of time.
- MultipleTransition.js: Transition meta-method to support transitioning 
  multiple values with scalar-only methods.  
- SnapTransition.js: SnapTransition is a method of transitioning between two 
  values (numbers, or arrays of numbers)
- SpringTransition.js: SpringTransition is a method of transitioning between two 
  values (numbers, or arrays of numbers) with a bounce.
- Transitionable.js:  A state maintainer for a smooth transition between 
  numerically-specified states.
- TransitionableTransform.js:  A class for transitioning the state of a 
  Transform by transitioning its translate, scale, skew and rotate 
  components independently.
- TweenTransition.js: A state maintainer for a smooth transition between 
  numerically-specified states.
- WallTransition.js: WallTransition is a method of transitioning between two 
  values (numbers, or arrays of numbers) with a bounce.


## Documentation

- [Reference Docs][reference-documentation]
- [Animations][animations]
- [Pitfalls][pitfalls]

## Maintainer

- David Valdman <david@famo.us>


## License

Copyright (c) 2014 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License, 
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain 
one at http://mozilla.org/MPL/2.0/.


[reference-documentation]: http://famo.us/docs
[pitfalls]: http://famo.us/guides/dev/pitfalls.html
[animations]: http://famo.us/guides/dev/animations.html

