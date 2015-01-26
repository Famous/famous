/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
/*eslint-disable new-cap */
define(function(require, exports, module) {
    var Utility = require('../utilities/Utility');

    /**
     * Transition meta-method to support transitioning multiple
     *   values with scalar-only methods.
     *
     *
     * @class MultipleTransition
     * @constructor
     *
     * @param {Object} method Transionable class to multiplex
     */
    function MultipleTransition(method) {
        this.method = method;
        this._instances = [];
        this.state = [];
    }

    MultipleTransition.SUPPORTS_MULTIPLE = true;

    /**
     * Get the state of each transition.
     *
     * @method get
     *
     * @return {Array} state array
     */
    MultipleTransition.prototype.get = function get() {
        for (var i = 0; i < this._instances.length; i++) {
            this.state[i] = this._instances[i].get();
        }
        return this.state;
    };

    /**
     * Set the end states with a shared transition, with optional callback.
     *
     * @method set
     * @chainable
     *
     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
     * @param {Object} transition Transition definition, shared among all instances
     * @param {Function} callback called when all endStates have been reached.
     *
     * @return {MultipleTransition} this
     */
    MultipleTransition.prototype.set = function set(endState, transition, callback) {
        var i;
        var allCallback;
        if (Array.isArray(endState)) {
            if (callback) allCallback = Utility.after(endState.length, callback);
            for (i = 0; i < endState.length; i++) {
                if (!this._instances[i]) this._instances[i] = new (this.method)();
                this._instances[i].set(endState[i], transition, allCallback);
            }
        } else {
            if (this._instances.length === 0) this._instances[0] = new (this.method)();
            if (callback) allCallback = Utility.after(this._instances.length, callback);
            for (i = 0; i < this._instances.length; i++) {
                this._instances[i].set(endState, transition, allCallback);
            }
        }
        return this;
    };

    /**
     * Reset all transitions to start state.
     *
     * @method reset
     * @chainable
     *
     * @param {Number|Array} startState Start state
     *
     * @return {MultipleTransition} this
     */
    MultipleTransition.prototype.reset = function reset(startState) {
        var i;
        if (Array.isArray(startState)) {
            for (i = 0; i < startState.length; i++) {
                if (!this._instances[i]) this._instances[i] = new (this.method)();
                this._instances[i].reset(startState[i]);
            }
        } else {
            for (i = 0; i < this.instances.length; i++) {
                this._instances[i].reset(startState);
            }
        }
        return this;
    };

    module.exports = MultipleTransition;
});
