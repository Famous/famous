/**
 * Copyright (c) 2014 Famous Industries, Inc.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 *
 * @license MIT
 */


/**
 * EventArbiter
 * -------------
 *
 * EventArbiter is a way to route events based on a 
 * particular mode.  Each mode can have at most one
 * event handler that handles the events when the 
 * EventArbiter is in that mode.
 *
 * In this example, we have two event handlers: one for mode A
 * and one for mode B.  Every time we click we are changing the
 * mode of the EventArbiter and thus toggling which EventHandlers
 * are getting the events.
 */
define(function(require, exports, module) {
    var Engine       = require('famous/core/Engine');
    var EventArbiter = require('famous/events/EventArbiter');

    Engine.createContext();

    var MODES = {
        A: 'A',
        B: 'B'
    };

    var eventArbiter = new EventArbiter(MODES.A);

    var AHandler = eventArbiter.forMode(MODES.A);
    AHandler.on('my_event', function(event) { 
        alert('AHandler'); 
    });

    var BHandler = eventArbiter.forMode(MODES.B)
    BHandler.on('my_event', function(event) { 
        alert('BHandler'); 
    });

    var currentMode = 'A';
    Engine.on('click', function() {
        eventArbiter.emit('my_event', {data: 123});
        currentMode = currentMode === 'A' ? 'B' : 'A';
        eventArbiter.setMode(currentMode);
    });
});
