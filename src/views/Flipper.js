/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../transitions/Transitionable');
    var RenderNode = require('../core/RenderNode');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * Allows you to link two renderables as front and back sides that can be
     *  'flipped' back and forth along a chosen axis. Rendering optimizations are
     *  automatically handled.
     *
     * @class Flipper
     * @constructor
     * @param {Options} [options] An object of options.
     * @param {Transition} [options.transition=true] The transition executed when flipping your Flipper instance.
     */
    function Flipper(options) {
        this.options = Object.create(Flipper.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.angle = new Transitionable(0);

        this.frontNode = undefined;
        this.backNode = undefined;

        this.flipped = false;
    }

    Flipper.DIRECTION_X = 0;
    Flipper.DIRECTION_Y = 1;

    var SEPERATION_LENGTH = 1;

    Flipper.DEFAULT_OPTIONS = {
        transition: true,
        direction: Flipper.DIRECTION_X
    };

    /**
     * Toggles the rotation between the front and back renderables
     *
     * @method flip
     * @param {Object} [transition] Transition definition
     * @param {Function} [callback] Callback
     */
    Flipper.prototype.flip = function flip(transition, callback) {
        var angle = this.flipped ? 0 : Math.PI;
        this.setAngle(angle, transition, callback);
        this.flipped = !this.flipped;
    };

    /**
     * Basic setter to the angle
     *
     * @method setAngle
     * @param {Number} angle
     * @param {Object} [transition] Transition definition
     * @param {Function} [callback] Callback
     */
    Flipper.prototype.setAngle = function setAngle(angle, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        if (this.angle.isActive()) this.angle.halt();
        this.angle.set(angle, transition, callback);
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
     * @param {Object} node The renderable you want to add to the front.
     */
    Flipper.prototype.setFront = function setFront(node) {
        this.frontNode = node;
    };

    /**
     * Adds the passed-in renderable to the view associated with the 'back' of the Flipper instance.
     *
     * @method setBack
     * @chainable
     * @param {Object} node The renderable you want to add to the back.
     */
    Flipper.prototype.setBack = function setBack(node) {
        this.backNode = node;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Number} Render spec for this component
     */
    Flipper.prototype.render = function render() {
        var angle = this.angle.get();

        var frontTransform;
        var backTransform;

        if (this.options.direction === Flipper.DIRECTION_X) {
            frontTransform = Transform.rotateY(angle);
            backTransform = Transform.rotateY(angle + Math.PI);
        }
        else {
            frontTransform = Transform.rotateX(angle);
            backTransform = Transform.rotateX(angle + Math.PI);
        }

        var result = [];
        if (this.frontNode){
            result.push({
                transform: frontTransform,
                target: this.frontNode.render()
            });
        }

        if (this.backNode){
            result.push({
                transform: Transform.moveThen([0, 0, SEPERATION_LENGTH], backTransform),
                target: this.backNode.render()
            });
        }

        return result;
    };

    module.exports = Flipper;
});
