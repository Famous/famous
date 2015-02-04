/**
 * Copyright (c) 2015 Famous Industries, Inc.
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
 * EventFilter with subscription
 * -----------------------------
 *
 * EventFilter provides a way to define a function that 
 * can decide whether or not to propogate events downwards.
 *
 * In this example, eventHandlerB is subscribed to all events coming
 * out of the filter and the filter is subscribed to all events
 * coming out of eventHandlerA.  This filter will only propogate events
 * if the data's 'msg' property is 'ALERT!'.  Because we change
 * the msg that is broadcast every click, you can see that the
 * alert occurs every other click.
 */
define(function(require, exports, module) {
    var Engine       = require('famous/core/Engine');
    var EventHandler = require('famous/core/EventHandler');
    var EventFilter  = require('famous/events/EventFilter');

    Engine.createContext();

    var eventHandlerA = new EventHandler();
    var eventHandlerB = new EventHandler();
   
    var myFilter = new EventFilter(function(type, data) {
        return data && (data.msg === 'ALERT!');
    });

    eventHandlerB.subscribe(myFilter);
    myFilter.subscribe(eventHandlerA);
    eventHandlerB.on('A', function(data){
        alert('subscribed message: ' + data.msg);
    });

    var currentMsg = 'ALERT!';

    Engine.on('click', function() {
        eventHandlerA.trigger('A', {msg: currentMsg});
        currentMsg = currentMsg === 'ALERT!' ? 'chickenDogStar': 'ALERT!';
    });
});
