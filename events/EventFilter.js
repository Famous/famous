/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('../core/EventHandler');

    /**
     * EventFilter regulates the broadcasting of events based on
     *  a specified condition function of standard event type: function(type, data).
     *
     * @class EventFilter
     * @constructor
     *
     * @param {function} condition function to determine whether or not
     *    events are emitted.
     */
    function EventFilter(condition) {
        EventHandler.call(this);
        this._condition = condition;
    }
    EventFilter.prototype = Object.create(EventHandler.prototype);
    EventFilter.prototype.constructor = EventFilter;

    /**
     * If filter condition is met, trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} data event data
     * @return {EventHandler} this
     */
    EventFilter.prototype.emit = function emit(type, data) {
        if (this._condition(type, data))
            return EventHandler.prototype.emit.apply(this, arguments);
    };

    /**
     * An alias of emit. Trigger determines whether to send
     *  events based on the return value of it's condition function
     *  when passed the event type and associated data.
     *
     * @method trigger
     * @param {string} type name of the event
     * @param {object} data associated data
     */
    EventFilter.prototype.trigger = EventFilter.prototype.emit;

    module.exports = EventFilter;
});
