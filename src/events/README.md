Events: Famous eventing libraries
=================================

Events are used for communication between objects in Famous.  Famo.us implements
an event interface similar to that used in NodeJS.


## Files

- EventArbiter.js: A switch which wraps several event destinations and redirects
  received events to at most one of them.
- EventFilter.js: EventFilter regulates the broadcasting of events based on a
  specified condition.
- EventMapper.js: EventMapper routes events to various event destinations based
  on custom logic.


## Documentation

- [Reference Docs][reference-documentation]
- [Events][events]
- [Pitfalls][pitfalls]


## License

Copyright (c) 2015 Famous Industries, Inc.

This Source Code Form is subject to the terms of the Mozilla Public License,
v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain
one at http://mozilla.org/MPL/2.0/.


[reference-documentation]: http://famo.us/docs
[events]: http://famo.us/guides/events
[pitfalls]: http://famo.us/guides/pitfalls

