## 0.3.5

### General

- Update .gitignore
- Update copyright year
- Update linter
- update distribution generator
- Fix broken links to http://famo.us

### Bug Fixes

- Famous/core
    - Fix container memory leak on migration

- Famous/math
    - Fix Matrix.transpose
    - Fix Random
    - Update Matrix.multiply documentation
    - Fix Quaternion.slerp

- Famous/views
    - Fix caching in ImageSurface
    - Pass parent opacity through SequentialLayout
    - Add SizeAwareView

- Famous/physics
    - Fix Curve constraint

- Famous/transitions
    - Transitionable.delay fix

## 0.3.4

### Bug Fixes

- Famous/inputs
    - 0.3.3 did not fix changes to inputs.  All changes from 0.3.2 and 0.3.3 involving inputs have been reverted

## 0.3.3

### Bug Fixes

- Famous/inputs
    - bug in TouchSync where NaN's were produced

## 0.3.2

### Bug Fixes

- Famous/core
    - Fixed issue where Famo.us would break when it took more than a single frame for the browser to load the body

- Famous/inputs
    - Made sync velocities average out to stop wild spikes
    - Fixed logic for GenericSync to always run through the syncs to register even if it hits one that wa slaready registered

- Famous/views
    - Fixed bug where SequentialLayout would not work if you gave children undefined size

## 0.3.1

### General

- Added fix for ios8 Safari compositing by setting the famous-root to have an opacity of .999999

### Bug Fixes

- Famous/core
    - Fixed sizing checks that prevented things from being resized

- Famous/physics
    - Added direction to setOptions for VectorFields

### Features

- Famous/views
    - Added getSize to GridLayout

### Performance Increases

- Famous/core
    - Removed unneeded removeChild call from ElementAllocator's migrate

## 0.3.0

### General

- Fixed various spelling and grammar errors
- Updated README.md
- Updated the linters
- Updated CONTRIBUTING.md
- Changed to relative pathing
- Move source to src/ directory

### Bug Fixes

- General
    - Fixed issues that prevented Famous from being loaded in the head

- Famous/core
    - Fixed opacity issues on setup and cleanup
    - Now resets origin on setup
    - Added guard for precommited size to allow Surface's getSize call to be non nullification
    - Fixed issue that when the size of a Surface changes, the transform matrix is recalculated to account for non [0, 0] origins
    - "true" sized Surfaces now use the offsetWidth and offsetHeight property find their size in order to account for padding and border
    
- Famous/inputs
    - Added guard to TouchTracker to avoid collisions with two finger sync    
    
- Famous/physics
    - PhysicsEngine removeBody now works as intended
    
- Famous/surfaces
    - Fixed VideoSurface setOptions
    - Fixed issue with VideoSurface instantiation not respecting src options that were passed
    - Fixed outdated references to this._currTarget

- Famous/transitions
    - TransitionableTransform no longer reverts to the original state reducing frame flickering

- Famous/utilities
    - Added checks for the existence of performance.now
    
- Famous/view
    - ScrollContainer eventing has been fixed
    - Scroller now defaults to the size of it's content if the size of it's content is less that the size of it's parent context
    - Scrollview pagination now working
    - Fixed bug that allows Scrollview to know what index it is on
    - Scrollview goToPreviousPage, goToNextPage now work
    - Added align to Lightbox
    


### Features

- Famous/core
    - Added the ability for Scene to be passed functions for Modifier properties
    - Added a toggleClass function to Surface for toggling CSS classes
    - Made Surface methods chainable (setAttributes, setProperties, toggleClass, addClass, removeClass, setClasses, setContent, setOptions, setSize)
    - Surfaces now have the ability to set HTML attributes on itself (id, data, etc)
    - Modifier now has the ability to specify size as a proportion of it's parent
    
    ```
    new Modifier({
        proportions: [.5, .25]
    });
    ```
    - Made changes to OptionsManager's getOptions to return either the full options hash or particular options based on the existence of a parameter
    - Surface now emits "resize" events
    - ViewSequence now has a trackSize options that tracks the size of it's collection
    
- Famous/inputs
    - Added OptionsManager to syncs
    - Added preventDefault to ScrollSync to allow for scrolling navigation in the browser
    - TouchSync now averages out velocity for a smoother, more expected stream of values
    
- Famous/physics
    - Particle now has a setForce function
    - PhysicsEngine can now cap the velocity/angular velocity of particles
    - PhysicsEngine now hs a getAgentEnergy function for calculating the energy of an agent
    - PhysicsEngine now sleeps if all particles/bodies are sleeping
    - Particle now has setForce to set a vector force to apply to itself
    - RotationalSpring now has setOptions
    - RotationalSpring now has options, forceFunction and maxLength
    - VectorField has a getEnergy method
    - Methods that can accept bodies and now also accept arrays of bodies
        
- Famous/transitions
    - Transitionable's halt is now chainable
    - Transitionable has a register in the same manner as GenericSync

- Famous/utilities
    - Added clone function for deep cloning of objects
    
- Famous/views
    - Scrollview now uses enum for spring states
    - Added a getSize function to ScrollContainer
    - Scroller has a function getCumulativeSize that returns the size of the collection of renderables
    - Scrollview emits "settle", "onEdge" and "offEdge" events
    - Scrollview can now handle "true" sized elements
    - Scrollview has a getCurrentIndex that returns the index of the renderable of it's collection that it is on
    - Scrollview now has a goToPage method
    - Scrollview now has getAbsolutePosition which returns the total progress through the Scrollview in pixels
    - FlexibleLayout now reflows when an element marked as true size changes it's size
    - ViewSequence now has indexOf
    

### Performance Increases

- Famous/views
    - More performant edge detection for Scrollview

### Breaking Changes

- Famous/core
    - Align defaults to [0, 0] no matter what the origin was set as
    
- Famous/views
    - Reimplemented SequentialLayout to reduce the API
    
- Famous/physics
    - Constraint no longer has energy
    - Constraint has a default output EventHandler
    - Constraint and Force no longer has setEnergy
    - Snap's and Spring's setAnchor was deprecated
    - Force now has an output EventHandler and emits change events on setOptions changes
    - RotationalSpring's and Spring's getEnergy now takes in an array of targets
    - VectorField methods, RADIAL, LINEAR, POINT_ATTRACTOR, now return vectors instead of numbers
    - VectorField defaults have changed
    - Removed options from SymplecticEuler
    
- Famous/views
    - Scroller emits "onEdge" and "offEdge" events instead of "edgeHit" events
    - Scrollview's default options have changed
    - Scrollview getPosition marked for deprecation in favor of getOffset


## 0.2.2

**famous/core:**

- FIX `Scene` now has support for `align`.
- UPDATE `requestAnimationFrame` scoped to `window`.

**famous/inputs:**

- FIX `ScrollSync` position type set on `start` instead of `reset` on end.
- FIX `FastClick` typo fix.

**famous/math:**
- FIX `Vector` `.put` can be called from a `Vector` instead of only a `register`.

**famous/physics:**

- FIX `Walls` `.forEach` bug.

## 0.2.1

**famous/core:**

- FEATURE `Transform` now has `.skewX` and `.skewY` methods

**famous/inputs:**

- ADD `DesktopEmulationMode` is a convenience utility to cancel mouse events
- UPDATE `ScaleSync` now outputs `center` for the `[x,y]` point between two fingers

**famous/physics:**

- FIX time-stepping bug which caused jittering

**famous/surfaces:**

- FIX `InputSurface` `blur` event

**famous/transitions:**

- FIX `Transitionable` callback bug on `.reset` method
- FIX `Transitionable` `.delay` bug when `_engineInstance` not defined.

**famous/utilities:**

- FIX `Timer` bug in `debounce` for clearing timers

**famous/views:**

- UPDATE `SequentialView` now has `itemSpacing`
- FIX `FlexibleLayout` caching bug
- FIX `Scrollview` `groupScroll` option
- FIX `ContextualView` `DEFAULT_OPTIONS` inheritance

## 0.2.0

**famous/core:**

- FEATURE `Modifier` now takes `align` as well as `origin` for layout
- FIX `Surface` `{size : [true, true]}` now works with origin and alignment
- FIX Famo.us can now run before the `<body>` tag loads
- FIX `Engine` `resize` event when an `input` field has focus

**famous/inputs:**

- ADD `Accumulator` can accumulate differentials from various syncs
- UPDATE `GenericSync` now acts as a registry for various syncs
- UPDATE `Scroll` `Rotate` and `Pinch` syncs now emit `center` for stable zooming
- UPDATE `clientX`, `clientY`, on `Mouse` and `Touch` syncs
- UPDATE `offsetX`, `offsetY` on `MouseSync`

**famous/modifiers:**

- UPDATE `StateModifier` takes `align` attribute

**famous/transitions:**

- FIX `Transitionable` can now transition arrays with non-numeric (`boolean`, `undefined`) values

**famous/views:**

- ADD `FlexibleLayout`, a layout for defining proportions of a sizing context for responsive and fixed layouts
- ADD `ContextualView` is similar to `core/View` but passes in contextual information (`transform`, `size`, etc) for dynamic layouts.
- FEATURE `GridLayout` now has a `gutterSize` attribute
- FEATURE `Flipper` now has `setAngle` method


## 0.1.2

- ADD `package.json` and `Gruntfile.js` to automate linting with Grunt and eslint
- ADD `.travis.yml` for continuous integration with Travis-CI
- Improved documentation

**famous/core:**

- FEATURE Automatic CSS `transform-matrix` pixel rounding
- FIX `Modifier` zero sizing
- FIX Firefox `z-index` bug

**famous/inputs:**

- UPDATE `FastClick` improvements for `click` events

**famous/modifiers:**

- FIX `StateModifier` opacity 0 bug

**famous/physics:**

- FIX `Walls` bug

**famous/surfaces:**

- ADD `Textarea` surface
- ADD `FormContainerSurface` surface
- ADD `SubmitInputSurface` surface

**famous/views:**

- FEATURE `Scrollview` group piping flag for automatic eventing
- FIX `Scrollview` `options` passing
- FIX `ScrollContainer` typo

**famous/widgets:**

- FIX `NavigationBar` `optionsManager` typo


## 0.1.1

- Initial release
