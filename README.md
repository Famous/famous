Inputs: Famous user input libraries
===================================

The inputs library is used to interpret user input to the device. Its primary 
concept is the 'Sync' interface.


## Files

- FastClick.js: FastClick is an override shim to speed up clicks on some browsers.
- GenericSync.js: Combines multiple types of event handling into one standardized interface.
- MouseSync.js:  Handles piped in mouse drag events.
- PinchSync.js: Handles piped in two-finger touch events to change position via 
  pinching / expanding.
- RotateSync.js:  Handles piped in two-finger touch events to support rotation.
- ScaleSync.js:  Handles piped in two-finger touch events to increase or 
  decrease scale via pinching / expanding.
- ScrollSync.js: Handles piped in mousewheel events.
- TouchSync.js: Handles piped in touch events.
- TouchTracker.js: Helper to TouchSync – tracks piped in touch events, organizes 
  touch events by ID, and emits track events back to TouchSync.
- TwoFingerSync.js:  Helper to PinchSync, RotateSync, and ScaleSync. Handles 
  piped in two-finger touch events


## Documentation

- [Reference Docs][reference-documentation]


## Maintainer

- Mark Lu <mark@famo.us>


## License

Copyright (c) 2014 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License, 
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain 
one at http://mozilla.org/MPL/2.0/.

[reference-documentation]: http://famo.us/docs
