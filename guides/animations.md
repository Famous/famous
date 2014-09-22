Animation & Transition Guide
============================

Famo.us began when we moved a square `<div>` at 60 FPS entirely in JavaScript without relying on CSS3 keyframe animations. From that proof of concept, we built a framework. Animation was as core to Famo.us then as it is now. You'll find that unlike the standard HTML5 techniques, our animations are far more flexible and extensible. They can be halted, chained, and customized. We support a wide variety of built in tween transitions as well as transitions that are inspired from physical principles like springs and walls.

## Outline

- [Transitionables](#transitionable)
- [Tween Transitions](#tweens)
- [Physics Transitions](#physics)
- [Tweens vs Physics](#tween_vs_physics)

## <a name="transitionable">Transitionables (Transitions/Transitionable.js)</a>

`Transitionable` turns any static number or array of numbers into dynamic data.
It allows the transition from a start state to an end state via an
interpolating definition. The state could be the `[x,y,z]` position of a
Surface, or a number representing the opacity of a Modifier. Transitionables are
agnostic to what they're transitioning; they just go from A to B over time.

In the example below, we transition a number from 0 to 100 in a duration of
500 milliseconds.

```js
var state = new Transitionable(0);
state.set(100, {duration : 500});
```

At any time you can call `.get` which returns the current value of the Transitionable
given that it has been transitioning at a constant rate since `.set` was called.
You can also call `.set` with no arguments, which changes the value immediately;
no transition is applied.

We can do the same to arrays of arbitrary length.

```js
var state = new Transitionable([0, 50]);
state.set([100, -20], {duration : 500});

setTimeout(function(){
    state.get();            //returns [50, 15]
}, 250);

```

The `set` method can be called over and over again. For instance, if there
is an opacity that is being transitioned on and off, you may code that with

```js
var opacityState = new Transitionable(0);

function opacitateIn (duration){
    opacityState.set(1, {duration : duration || 0})
}

function opacitateOut (duration){
    opacityState.set(0, {duration : duration || 0})
}

function opacityToggle (duration){
    var currentOpacity = opacityState.get();
    if (currentOpacity > 0.5) opacitateIn(duration);
    else opacitateOut(duration);
}
```

Transitionables can also take an optional third argument, which is a callback to
fire after the transition is complete. In the following example, after 500ms
the callback will fire.

```js
var state = new Transitionable(0);
state.set(100, {duration : 500}, function(){ alert('done!'); });
```

## <a name="tweens">Tween Transitions (Transitions/Transitionable.js)</a>

The above examples showed the simplest transition, which is linear, or with
constant rate of change. We can modify the transition definition to have
different tween (easing) curves. This will allow transitions that ramp up, slow
down, or overshoot, etc. Famo.us comes with 30 optional tween curves in
Transitions/Easing.js, and six defaults: `linear`, `easeIn`, `easeOut`, `easeInOut`,
`easeOutBounce`, and `spring`.

To apply a default tween transition, all you need to do is add a `curve` key to
the transition definition.

```js
var state = new Transitionable(0);
state.set(100, {duration : 500, curve : 'easeInOut'});
```

To apply a non-default transition, first register it with a key that is consistent
with the transition definition.

```js
var TweenTransition = require('famous/transitions/TweenTransition');
TweenTransition.registerCurve('inSine', Easing.inSine);

var state = new Transitionable(0);
state.set(100, {duration : 500, curve : 'inSine'});
```

You can extend our easing library by creating your own. An easing curve is simply
a function that is defined on the domain [0, 1] and maps to the range [0,1]. You
can map to values beyond the range [0,1] which will correspond to an undershoot
(if less than 0) or overshoot (if greater than 1).

```js
var customCurve = function(t){ return Math.pow(t,2); };
var TweenTransition = require('famous/transitions/TweenTransition');
TweenTransition.registerCurve('custom', customCurve);

var state = new Transitionable(0);
state.set(100, {duration : 500, curve : 'custom'});
```

You only need to register the custom curve with TweenTransition once in your app.
After the initial registration (typically in main.js), you can refer to the curve
anywhere else in your app.

## <a name="physics">Physics Transitions</a>

The limitation of tween transitions is that they are a discrete set of 30.
Sometimes what is needed is a continuum of curves. For instance, when coding a
scrollview, you want to scroll based on the velocity of the user input, which
can be any number. A tween will never be able to accommodate this.

This is one of the reasons why Famo.us has invested in its own physics engine. A
physics simulation is capable of giving a fully parametrizable transition, where
the velocity can be any number, and the bounce effect of an overshoot can be of
infinite variety. Whereas tweens are hard-coded, physics transitions are fluid.

There are several physics transitions:

| Transition Type  | Definition   | Effect     |
| -------------    | ------------ | ---------- |
| SpringTransition | `{method : <String>, period : <Number>, dampingRatio : <Number>, velocity : <Number or Array>}` | Overshoots with a bounce       |
| WallTransition   | `{method : <String>, period : <Number>, dampingRatio : <Number>, velocity : <Number or Array>}` | Undershoots with a bounce      |
| SnapTransition   | `{method : <String>, period : <Number>, dampingRatio : <Number>, velocity : <Number or Array>}` | Overshoots with a sharp bounce |

You'll notice that the definition to define a physics transition is slightly
different than for a tween, which takes a duration and type. For physics transitions
no exact duration can be defined; instead, you define the physical parameters
of the transitions.

The `method` key is a user-defined string that tells Famo.us which physics transition
you're using.

The `period` key denotes the period of a spring, which is the amount
of time for a complete back and forth cycle when there is no damping.

The `dampingRatio` key is a number between 0 and 1 that introduces damping into
the motion. For `dampingRatio = 0`, the spring motion with oscillate forever,
and when `dampingRatio = 1`, the spring motion will not oscillate at all, and come
to a gentle halt.

Transitioning with a physics definition is very similar to transitioning with
a non-default easing curve: require in the physics transition, and register it
with Transitionable as a method.

```js
var SpringTransition = require('famous/transitions/SpringTransition');
var WallTransition = require('famous/transitions/WallTransition');
var SnapTransition = require('famous/transitions/SnapTransition');

Transitionable.registerMethod('spring', SpringTransition);
Transitionable.registerMethod('wall', WallTransition);
Transitionable.registerMethod('snap', SnapTransition);

var state = new Transitionable(0);

state.set(100, {method : 'spring', dampingRatio : 0.5, period : 500}); // spring
state.set(0,   {method : 'wall',   dampingRatio : 0.5, period : 500}); // wall
state.set(100, {method : 'snap',   dampingRatio : 0.5, period : 500}); // snap
```

You only need to register a physics transition once per app. After you register it
with as a method, you can call any transition with that `method` key anywhere
else in your app.

## <a name="tween_vs_physics">Tweens vs Physics </a>

With physics transitions, you may wonder, "Why use a tween transition
at all?" The Achilles' Heel of a physics transition is that it cannot have a
predetermined duration like a tween can. With physics you gain intuitive feel,
but sacrifice on exact duration. If you don't need events to fire with precise
timing, but instead respond to variable user input, it is suggested to use a physics transition.

## <a name="modifiers">Transitioning Modifiers</a>

Thus far we have only mentioned transitions in the abstract: numbers going from
start to end. In practice, you would want this transition to effect some visual
aspect of your app, like the translation or rotation of a Surface, or perhaps
its opacity. All of these are properties of a Modifier, and Modifiers are built
to transition between states, just like Transitionables.

```js
var rotateModifier = new Modifier({transform : Transform.identity});
rotateModifier.setTransform(Transform.rotateZ(Math.PI), {curve : 'linear', duration : 500});

setTimeout(function(){
    rotateModifier.getTransform();    // returns Transform.rotateZ(Math.PI/2)
}, 250)
```
Modifiers can take any transition that's been registered in your app, whether
a physics definition, or a tween.

Opacity, origin and size are all properties of Modifiers and can be transitioned
as well.

```js
var modifier = new Modifier({
    transform : Transform.identity,
    opacity   : 0,
    origin    : [0.5, 0.5],
    size      : [100, 100]
});

modifier.setOpacity(1, {duration : 500});
modifier.setSize([0,0], {duration : 500});
modifier.setOrigin([0,0], {duration : 500});

setTimeout(function(){
    modifier.getOpacity();   // returns 0.5
    modifier.getSize();      // returns [50, 50]
    modifier.getOrigin();    // returns [0.25, 0.25]
}, 250)

```

