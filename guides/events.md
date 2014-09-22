Event Guide
===========

Events are a way of moving information between Famo.us Views and Widgets† in a
decoupled way, and also to listen to the native events of the DOM, like "resize"
or "touchmove". When building nested views, a parent view will have access to
the subviews inside it. But what if a subview needs to alert a parent, as in the
case of a "page next" action that triggers a higher-order app behavior? A
subview could have a reference to its parent, but this results in tightly
coupled code. Instead, you can decouple your code  with events. Similarly, if
two unrelated views need to pass information between each other, rather than
saving data to some globally shared data structure, it's better practice to pass
data via events.

The solution to these common issues is found in Famous/core's EventHandler.js,
and the eventing utility methods found in Famous/events. These tools allow views
and widgets to broadcast and receive events, additionally they allow
functionality such as piping, filtering and mapping events. Here we will take a
look at all the functionality events offer, and include basic code snippets for
each. All the example code is references the following scaffolding:

```js
    var EventHandler = require('famous/core/EventHandler');

    // a bunch of event handlers
    var eventHandlerA = new EventHandler();
    var eventHandlerB = new EventHandler();
    var eventHandlerC = new EventHandler();

    // a data "payload" to broadcast
    var message = {msg : 'ALERT!'};

    // a widget module that can receive and broadcast events
    // widgets created by extending View.js have this boilerplate by default
    function Widget(){
        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);
    }

    var widget = new Widget();
```

† *Famo.us comes with a base class View.js in Famous/Core. In Famo.us lingo, a
Widget is a class that inherits from View.js. In the scaffolding code above for
`Widget`, we hand-code the necessary boilerplate to have an eventing class. It
should be emphasized that this boilerplate comes for free in View.js. To better
explain the magic, though, we start from first principles in this tutorial.*

## Overview

- [**Event Handlers**](#eventHandlers)
    - [Broadcasting and Listening](#broadcastingAndListening)
    - [Piping](#piping)
    - [Subscribing](#subscribing)
        - [Piping vs Subscribing](#pipingVsSubscribing)
    - [Processing](#processing)
- [**Event Helpers**](#eventHelpers)
    - [Filtering](#filtering)
    - [Mapping](#mapping)
    - [Arbitration](#arbitration)
- [**Widgets**](#eventHandling_widget)
    - [Listening](#listening_widget)
        - [Input Handler](#inputHandler)
        - [Example: Parent to Child](#parentToChild)
    - [Broadcasting](#broadcasting_widget)
        - [Output Handler](#outputHandler)
        - [Example: Child to Parent](#childToParent)

## <a name="eventHandlers">Event Handlers (Core/EventHandler.js)</a>

This is the basic module used for event handling. It allows a user to broadcast,
listen, pipe to and subscribe from events.

## <a name="broadcastingAndListening">Broadcasting and Listening</a>

Broadcasting from an event handler is done with either the `emit` method,

```js
    eventHandlerA.on('A', function(data){ alert(data.msg); });  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

or the `trigger` method.

```js
    eventHandlerA.on('A', function(data){ alert(data.msg); });  // alerts 'ALERT!'
    eventHandlerA.trigger('A', message);
```

Deciding between using `emit` or `trigger` will be more clear when building an event handling widget.
Emitting has a connotation of outward flow, while triggering has a connotation of inward flow.
For event handlers, it is a matter of preference; they are aliases of one another.

## <a name="piping">Piping</a>

Piping is a way of pushing events downstream from one handler to another. An event handler
can broadcast data by calling its `.emit` method which takes two arguments: a key, and an optional JSON object to broadcast. Downstream handlers can listen to the event via the `.on` method, which takes
a key and callback as arguments.

```js
    eventHandlerA.pipe(eventHandlerB);
    eventHandlerB.on('A', function(data){alert(data.msg)});  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

Event handlers can be successively piped.

```js
    eventHandlerA.pipe(eventHandlerB);
    eventHandlerB.pipe(eventHandlerC);
    eventHandlerC.on('A', function(data){alert(data.msg)});  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

Equivalently, they can be chained.

```js
    eventHandlerA.pipe(eventHandlerB).pipe(eventHandlerC);
    eventHandlerC.on('A', function(data){alert(data.msg)});  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

## <a name="subscribing">Subscribing</a>

While piping is a way of *pushing* events downstream, subscribing is the reverse: events are *pulled* upstream.

```js
    eventHandlerB.subscribe(eventHandlerA);
    eventHandlerB.on('A', function(data){alert(data.msg)});  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

Like piping, subscribing can also be successively applied.

```js
    eventHandlerC.subscribe(eventHandlerB);
    eventHandlerB.subscribe(eventHandlerA);
    eventHandlerC.on('A', function(data){alert(data.msg)});  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

## <a name="pipingVsSubscribing">Piping vs Subscribing</a>

When listening on DOM events, a subscribe pattern is more performant
because you can subscribe to only the events you need. In a piping model, all
events must be broadcast (even if they are never used) in order to listen to them downstream.
Hence, you should subscribe from Surfaces, the Engine (which can both listen to the DOM),
whereas you should pipe to (or subscribe from) custom events broadcast from widgets.

```js
    widget.subscribe(surface);                     // surface is not broadcasting anything yet
    widget.on('touchmove', function(event){...});  // surface is now broadcasting 'touchmove'
```

The magic happens when subscribes are chained:

```js
    widgetB.subscribe(widgetA);
    widgetA.subscribe(surface);
    widgetB.on('touchmove', function(event){...}); // widget A and surface are now broadcasting 'touchmove'
```

*Note*: piping from a Engine or Surface does nothing unless they have subscribed to the event!

```js
    surface.pipe(widgetA);
    widgetA.on('touchmove', function(event){...}); // does nothing. Surface is not yet emitting 'touchmove'

    widgetA.subscribe(surface);
    widgetA.on('touchmove', function(event){...}); // works!
```

## <a name="processing">Processing</a>

Two event handlers can be linked together so that events coming into one can be
processed and re-broadcasted to the other.

```js
    eventHandlerA.on('A', function(data){
        data.msg = 'processed';
        eventHandlerB.emit('A', data);
    });

    eventHandlerB.on('A', function(data){ alert(data.msg); });  // alerts 'processed'
    eventHandlerA.emit('A', message);
```

## <a name="eventHelpers">Event Helpers</a>

Our event library comes with convenience modules for conditionally processing events
including event filtering, mapping and arbitration.

## <a name="filtering">Filtering (Events/EventFilter.js)</a>

Often, an event should only be broadcasted if a certain condition is met, like a flag having value `true`.
Famo.us offers an event filter to do this.

```js
    var myFilter = new EventFilter(function(type, data) {
        return data && (data.msg === 'ALERT!');
    });
```

With this filter, only an event with a `{msg : 'ALERT!'}` payload will be broadcast.

```js
    eventHandlerA.pipe(myFilter).pipe(eventHandlerB);
    eventHandlerB.on('A', function(data){
        alert('piped message: ' + data.msg);
    });
```

Filtering also works in a subscribe model:

```js
    eventHandlerB.subscribe(myFilter);
    myFilter.subscribe(eventHandlerA);
    eventHandlerB.on('A', function(data){
        alert('subscribed message: ' + data.msg);
    });

    eventHandlerA.emit('A', message);
```

## <a name="mapping">Mapping (Events/EventMapper.js)</a>

Often, events need to be routed based on some custom logic.
Famo.us offers an event mapper for this use case.

```js
    var myMapper = new EventMapper(function(type, data) {
        return (data && (data.direction === 'x')) ? eventHandlerB : eventHandlerC;
    });

    eventHandlerA.pipe(myMapper);

    eventHandlerB.on('A', function(data){
        alert('B direction : ' + data.direction);
    });
    eventHandlerC.on('A', function(data){
        alert('C direction : ' + data.direction);
    });

    eventHandlerA.trigger('A', {direction : 'x'});  // pipes to eventHandlerB
    eventHandlerA.trigger('A', {direction : 'y'});  // pipes to eventHandlerC
```

*Note*: mapping only supports a piping interface and not a subscribing one.

## <a name="arbitration">Arbitration (Events/EventArbiter.js)</a>

The Event Arbiter is like a switch or router. Events come in, and the arbiter
pipes them to their respective targets by changing its internal state. It is
similar to the Event Mapper, except that you never have to define event
handlers and the piping is automated.

```js
    var eventArbiter = new EventArbiter();

    eventArbiter.forMode('routeA').on('A', function(data){
        alert('subscribed message: ' + data.msg);
    });

    eventArbiter.forMode('routeB').on('B', function(data){
        alert('subscribed message: ' + data.msg);
    });

    eventArbiter.setMode('routeA');

    eventArbiter.forMode('routeA').emit('A', message); // alerts 'ALERT!'
    eventArbiter.forMode('routeB').emit('B', message); // does nothing. Mode is not set.

    eventArbiter.setMode('routeB');

    eventArbiter.forMode('routeA').emit('A', message); // does nothing. Mode is not set.
    eventArbiter.forMode('routeB').emit('B', message); // alerts 'ALERT!'
```

## <a name="eventHandling_widget">Event Handling Inside a Widget</a>

Views and Widgets can also broadcast, listen, and pipe events just as event handlers can,
and their interface is similar. However, event handling in widgets is complicated
by the fact that widgets have two handlers: an input and output handler.
The interface to communicating *to* the widget is via its input handler.
The interface for broadcasting *from* the widget is via its output handler.
This can best be summarized by the following rules of thumb:

- External to a Widget:
    - `widget.trigger` : the interface to talk to a widget
    - `widget.on` : the interface to listen to a widget
    - `widget.pipe` : the interface to pipe from a widget
    - `widget.subscribe` : the interface to subscribe from a widget

- Internal to a Widget:
    - *receive* events via `widget.eventInput`
    - *broadcast* events via `widget.eventOutput`

*Note*: `Widget.emit` does not exist! There is no interface to broadcast from
the widget while outside the widget. Emitting from the widget is the
responsibility of the widget, and should only be done from inside.

## <a name="listening_widget">Listening</a>

Widgets listen to the external world via their input handler. The external world
can ping the widget via its `trigger` method.

## <a name="inputHandler">Input Handler</a>

All widgets have access to an internal `eventInput` for receiving events
which is internally assigned using the `EventHandler.setInputHandler` method.
This adds the methods of `trigger` and `subscribe` to the widget.

```js
    EventHandler.setInputHandler(widget, eventHandlerA);
    eventHandlerA.on('B', function(data){alert(data.msg)});
    widget.trigger('B', message);
```

## <a name="parentToChild">Parent to Child</a>

A common use case of listening to a widget is when a child widget listens to a containing parent widget.
In the following example, a parent receives a "bad report card" from the external world,
and responds by hiring a tutor for her child. The child then gets accepted to Harvard. It's that simple.

```js
    // Child widget
    function Child(){
        // setup input and output handlers
        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.eventInput.on('hires tutor', function(){
            alert('Accepted to Harvard');
        }.bind(this));
    }

    // Parent widget
    function Parent(){
        // setup input and output handlers
        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.child = new Child();

        this.eventInput.on('bad report card', function(){
            this.child.trigger('hires tutor');
        }.bind(this));
    }

    var parent = new Parent();
    parent.trigger('bad report card');
```

*Note*: in this use case, it is more customary to expose a method on the child that the parent can call.
Also, notice we did not need to hook up any output handlers in this case, though a widget would need both
if it is responsible for broadcasting events externally.

## <a name="broadcasting_widget">Broadcasting</a>

Broadcasting from a widget is the responsibility of the widget via its output handler.

## <a name="outputHandler">Output Handler</a>

All widgets have internal access to an `eventOutput`, which is internally created using
`EventHandler.setOutputHandler` method. This adds the `pipe` and `on` methods to
the widget.

```
    EventHandler.setOutputHandler(widget, eventHandlerA);
    widget.on('A', function(data){ alert(data.msg) }; );  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

Typically, this is a more useful paradigm when the widget is piping to another handler,
or to another widget.

```js
    EventHandler.setOutputHandler(widget, eventHandlerA);
    widget.pipe(eventHandlerB);
    eventHandlerB.on('A', function(data){ alert(data.msg) }; );  // alerts 'ALERT!'
    eventHandlerA.emit('A', message);
```

## <a name="childToParent">Child to Parent</a>

A common use case of broadcasting from a widget is when a child widget broadcasts
to a containing parent widget. Here we have a parent that needs to respond when
its child starts "crying". A child "cries" when it is "hungry", and the parent responds
by feeding it.

```js
    // Child widget
    function Child(){
        // setup input and output handlers
        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        // child broadcasts 'crying' when it gets hungry using the event processing pattern
        this.eventInput.on('hungry', function(){
            this.eventOutput.emit('crying');
        }.bind(this));

        // randomly...the child gets hungry
        setTimeout(function(){
            this.trigger('hungry');
        }.bind(this), 5000 * Math.random());
    }

    // Parent widget
    function Parent(){
        // setup input and output handlers
        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.child = new Child();

        // parent reacts to child crying by feeding her
        this.child.on('crying', function(){
            alert('feeds child');
        });
    }

    var parent = new Parent();
```
