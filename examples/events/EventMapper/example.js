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
 * EventMapper
 * ------------
 *
 * EventMapper is a way to route events to various EventHandlers
 * based on the type of the event.
 *
 * In this example, we pipe all events from eventHandlerA to
 * the EventMapper.  This filter will decide whether to send
 * the event to eventHandlerB or eventHandlerC based on the
 * direction property of the data sent along with the event.
 */
define(function(require, exports, module) {
    var Engine       = require('famous/core/Engine');
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper  = require('famous/events/EventMapper');
   
    Engine.createContext();
   
    var eventHandlerA = new EventHandler();
    var eventHandlerB = new EventHandler();
    var eventHandlerC = new EventHandler();
      
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

    var currentDirection = 'x';
    Engine.on('click', function() {
        eventHandlerA.trigger('A', {direction : currentDirection});
        currentDirection = currentDirection === 'x' ? 'y' : 'x';
    });
});
