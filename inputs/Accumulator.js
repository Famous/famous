define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * Accumulates differentials of event sources that emit a `delta`
     *  attribute taking a Number or Array of Number types. The accumulated
     *  value is stored in a getter/setter.
     *
     * @class Accumulator
     * @constructor
     * @param value {Number|Array|Transitionable}   Initializing value
     * @param [eventName='update'] {String}         Name of update event
     */
    function Accumulator(value, eventName) {
        if (eventName === undefined) eventName = 'update';

        this._state = (value && value.get && value.set)
            ? value
            : new Transitionable(value || 0);

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._eventInput.on(eventName, _handleUpdate.bind(this));
    }

    function _handleUpdate(data) {
        var delta = data.delta;
        var state = this.get();

        if (delta.constructor === state.constructor){
            var newState = (delta instanceof Array)
                ? [state[0] + delta[0], state[1] + delta[1]]
                : state + delta;
            this.set(newState);
        }
    }

    /**
     * Basic getter
     *
     * @method get
     * @return {Number|Array} current value
     */
    Accumulator.prototype.get = function get() {
        return this._state.get();
    };

    /**
     * Basic setter
     *
     * @method set
     * @param value {Number|Array} new value
     */
    Accumulator.prototype.set = function set(value) {
        this._state.set(value);
    };

    module.exports = Accumulator;
});
