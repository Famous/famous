/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var RenderNode = require('famous/core/RenderNode');
    var OptionsManager = require('famous/core/OptionsManager');
    var Utility = require('famous/utilities/Utility');

    /**
     * Allows you to link two renderables as front and back sides that can be
     *  'flipped' back and forth along a chosen axis. Rendering optimizations are
     *  automatically handled.
     *
     * @class Flipper
     * @constructor
     * @param {Options} [options] An object of options.
     * @param {Transition} [options.transition=true] The transition executed when flipping your Flipper instance.
     * @param {Boolean} [options.cull=true] If true, culls the 'hidden' side untill you flip to it.
     */
    function Flipper(options) {
        this.options = Object.create(Flipper.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.state = new Transitionable(0);
        this.flipped = false;

        this.frontNode = new RenderNode();
        this.backNode = new RenderNode();

        this.secondFlip = false;
    }

    Flipper.DEFAULT_OPTIONS = {
        transition: true,
        cull: true,
        direction: Utility.Direction.Y
    };

    /**
     * Flips from the current side to the opposite one with the Flipper instance's default transition.
     *
     * @method setDefaultTransition
     * @param {Number} side Can be either one or zero (one represents the back, zero represents the front).
     *   Defaults to the default transition (true).
     * @param {function} [callback] Executes after transitioning to the toggled state.
     */
    Flipper.prototype.rotate = function rotate(angle, transition, callback) {
        if (angle === undefined) {
            angle = this.flipped ? 0 : Math.PI;
            this.flipped = !this.flipped;
        } else {
            this.flipped = false;
        }
        if (transition === undefined) transition = this.options.transition;
        this.state.halt();
        this.state.set(angle, transition, callback);
    };

    /**
     * Patches the Flipper instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Flipper instance.
     */
    Flipper.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Adds the passed-in renderable to the view associated with the 'front' of the Flipper instance.
     *
     * @method setFront
     * @chainable
     * @param {Object} obj The renderable you want to add to the front.
     */
    Flipper.prototype.setFront = function setFront(obj) {
        return this.frontNode.set(obj);
    };

    /**
     * Adds the passed-in renderable to the view associated with the 'back' of the Flipper instance.
     *
     * @method setBack
     * @chainable
     * @param {Object} obj The renderable you want to add to the back.
     */
    Flipper.prototype.setBack = function setBack(obj) {
        return this.backNode.set(obj);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    Flipper.prototype.render = function render() {

        var pos = this.state.get();


        var axis = this.options.direction;
        var frontRotation = [0, 0, 0];
        var backRotation = [0, 0, 0];

        frontRotation[axis] = pos;
        backRotation[axis] = pos + Math.PI;

        if (this.options.cull && !this.state.isActive()) {
            var reducedRadians = Math.abs(pos) % Math.PI;
            if (reducedRadians < (0.5 * Math.PI) || reducedRadians > (1.5 * Math.PI)) {
                return {
                    transform: Transform.moveThen([0, 0, 1], Transform.rotate.apply(null, frontRotation)),
                    target: this.frontNode.render()
                };
            }
            else {
                return {
                    transform: Transform.moveThen([0, 0, 1], Transform.rotate.apply(null, backRotation)),
                    target: this.backNode.render()
                };
            }
        } else {
            return [
                {
                    transform: Transform.moveThen([0, 0, 1], Transform.rotate.apply(null, frontRotation)),
                    target: this.frontNode.render()
                },
                {
                    transform: Transform.moveThen([0, 0, 1], Transform.rotate.apply(null, backRotation)),
                    target: this.backNode.render()
                }
            ];
        }
    };

    module.exports = Flipper;
});
