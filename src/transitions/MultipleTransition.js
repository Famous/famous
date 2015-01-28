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
     * @return state {Number|Array} state array
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
     *
     * @param {Number|Array} endState Final State.  Use a multi-element argument for multiple transitions.
     * @param {Object} transition Transition definition, shared among all instances
     * @param {Function} callback called when all endStates have been reached.
     */
    MultipleTransition.prototype.set = function set(endState, transition, callback) {
        var _allCallback = Utility.after(endState.length, callback);
        for (var i = 0; i < endState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].set(endState[i], transition, _allCallback);
        }
    };

    /**
     * Reset all transitions to start state.
     *
     * @method reset
     *
     * @param  {Number|Array} startState Start state
     */
    MultipleTransition.prototype.reset = function reset(startState) {
        for (var i = 0; i < startState.length; i++) {
            if (!this._instances[i]) this._instances[i] = new (this.method)();
            this._instances[i].reset(startState[i]);
        }
    };

    module.exports = MultipleTransition;
});
