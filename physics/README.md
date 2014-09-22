Physics: Famo.us core physics engine
====================================

Core engine controlling animations via physical simulation.

## Files

- bodies/Body.js: A unit controlled by the physics engine which serves to
  provide position and orientation.
- bodies/Circle.js: An elemental circle-shaped Body in the physics engine.
- bodies/Particle.js:  A unit controlled by the physics engine which serves to
  provide position.
- bodies/Rectangle.js: An elemental rectangle-shaped Body in the physics engine.
- constraints/Collision.js: Allows for two circular bodies to collide and bounce off each other.
- constraints/Constraint.js: Allows for two circular bodies to collide and bounce off each other.
- constraints/Curve.js: A constraint that keeps a physics body on a given implicit curve 
  regardless of other physical forces are applied to it.
- constraints/Distance.js:  A constraint that keeps a physics body a given distance away from a given anchor, or another attached body.
- constraints/Snap.js: A spring constraint is like a spring force, except that it is always numerically stable (even for low periods).
- constraints/Surface.js: A constraint that keeps a physics body on a given implicit surface 
  regardless of other physical forces are applied to it.
- constraints/Wall.js:  A wall describes an infinite two-dimensional plane that physics bodies can collide with.
- constraints/Walls.js: Walls combines one or more Wall primitives and exposes a simple 
  API to interact with several walls at once
- forces/Drag.js: Drag is a force that opposes velocity. Attach it to the
  physics engine to slow down a physics body in motion.
- forces/Force.js: Force base class.
- forces/Repulsion.js: Repulsion is a force that repels (attracts) bodies away
  (towards) each other.
- forces/RotationalDrag.js:  Rotational drag is a force that opposes angular
  velocity. Attach it to a physics body to slow down its rotation.
- forces/RotationalSpring.js:  A force that rotates a physics body back to
  target Euler angles.
- forces/Spring.js: A force that moves a physics body to a location with a
  spring motion.
- forces/VectorField.js:  A force that moves a physics body to a location with a spring motion.
- integrators/SymplecticEuler.js:  Ordinary Differential Equation (ODE)
  Integrator. Manages updating a physics body's state over time.
- PhysicsEngine.js: The Physics Engine is responsible for mediating Bodies and 
  their interaction with forces and constraints.


## Documentation

- [Reference Docs][reference-documentation]
- [Animating][animating]
- [Pitfalls][pitfalls]


## Famous Physics Framework

The framework has three main parts that application developers should expect to
use:

### Bodies

Bodies represent physical objects. For example, the Circle class represents a
solid ball, the Rectangle class represents a solid rectangular prism.

### Constraints

Constraints represent ways that objects can be connected. For example, you might
want two objects to behave as is there were a Rope or a StiffSpring connecting
them.

### Forces

Forces can be thought of as soft constraints. So while StiffSpring is a
constraint, Spring is a force. TODO: @dmvaldman, can you explain forces better?


## License

Copyright (c) 2014 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain
one at http://mozilla.org/MPL/2.0/.


[reference-documentation]: http://famo.us/docs
[animating]: http://famo.us/guides/animations
[pitfalls]: http://famo.us/guides/pitfalls
