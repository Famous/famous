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

## 0.1.1

- Initial release