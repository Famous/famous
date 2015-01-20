/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var OptionsManager = require('../core/OptionsManager');
    var Transitionable = require('../transitions/Transitionable');
    var Utility = require('../utilities/Utility');
    var SequentialLayout = require('./SequentialLayout');

    /**
     * A Sequential Layout that can be opened and closed with animations.
     *
     *   Takes the same options as SequentialLayout
     *   as well as options for the open/close transition
     *   and the rotation you want your Deck instance to layout in.
     *
     * @class Deck
     * @constructor
     * @extends SequentialLayout
     *
     * @param {Options} [options] An object of configurable options
     * @param {Transition} [options.transition={duration: 500, curve: 'easeOutBounce'}
     *   The transition that executes upon opening or closing your deck instance.
     * @param {Number} [stackRotation=0] The amount of rotation applied to the propogation
     *   of the Deck instance's stack of renderables.
     * @param {Object} [options.transition] A transition object for changing between states.
     * @param {Number} [options.direction] axis of expansion (Utility.Direction.X or .Y)
     */
    function Deck(options) {
        SequentialLayout.apply(this, arguments);
        this.state = new Transitionable(0);
        this._isOpen = false;

        this.setOutputFunction(function(input, offset, index) {
            var state = _getState.call(this);
            var positionMatrix = (this.options.direction === Utility.Direction.X) ?
                Transform.translate(state * offset, 0, 0.001 * (state - 1) * offset) :
                Transform.translate(0, state * offset, 0.001 * (state - 1) * offset);
            var output = input.render();
            if (this.options.stackRotation) {
                var amount = this.options.stackRotation * index * (1 - state);
                output = {
                    transform: Transform.rotateZ(amount),
                    origin: [0.5, 0.5],
                    target: output
                };
            }
            return {
                transform: positionMatrix,
                size: input.getSize(),
                target: output
            };
        });
    }
    Deck.prototype = Object.create(SequentialLayout.prototype);
    Deck.prototype.constructor = Deck;

    Deck.DEFAULT_OPTIONS = OptionsManager.patch(SequentialLayout.DEFAULT_OPTIONS, {
        transition: {
            curve: 'easeOutBounce',
            duration: 500
        },
        stackRotation: 0
    });

    /**
     * Returns the width and the height of the Deck instance.
     *
     * @method getSize
     * @return {Array} A two value array of Deck's current width and height (in that order).
     *   Scales as Deck opens and closes.
     */
    Deck.prototype.getSize = function getSize() {
        var originalSize = SequentialLayout.prototype.getSize.apply(this, arguments);
        var firstSize = this._items ? this._items.get().getSize() : [0, 0];
        if (!firstSize) firstSize = [0, 0];
        var state = _getState.call(this);
        var invState = 1 - state;
        return [firstSize[0] * invState + originalSize[0] * state, firstSize[1] * invState + originalSize[1] * state];
    };

    function _getState(returnFinal) {
        if (returnFinal) return this._isOpen ? 1 : 0;
        else return this.state.get();
    }

    function _setState(pos, transition, callback) {
        this.state.halt();
        this.state.set(pos, transition, callback);
    }

    /**
     * An accesor method to find out if the messaged Deck instance is open or closed.
     *
     * @method isOpen
     * @return {Boolean} Returns true if the instance is open or false if it's closed.
     */
    Deck.prototype.isOpen = function isOpen() {
        return this._isOpen;
    };

    /**
     * Sets the Deck instance to an open state.
     *
     * @method open
     * @param {function} [callback] Executes after transitioning to a fully open state.
     */
    Deck.prototype.open = function open(callback) {
        this._isOpen = true;
       _setState.call(this, 1, this.options.transition, callback);
    };

    /**
     * Sets the Deck instance to an open state.
     *
     * @method close
     * @param {function} [callback] Executes after transitioning to a fully closed state.
     */
    Deck.prototype.close = function close(callback) {
        this._isOpen = false;
        _setState.call(this, 0, this.options.transition, callback);
    };

    /**
     * Sets the Deck instance from its current state to the opposite state.
     *
     * @method close
     * @param {function} [callback] Executes after transitioning to the toggled state.
     */
    Deck.prototype.toggle = function toggle(callback) {
        if (this._isOpen) this.close(callback);
        else this.open(callback);
    };

    module.exports = Deck;
});
