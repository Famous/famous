/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     *  A collection of visual changes to be
     *    applied to another renderable component, strongly coupled with the state that defines
     *    those changes. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier.
     *    StateModifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The StateModifier's children and descendants
     *    are transformed by the amounts specified in the modifier's properties.
     *
     * @class StateModifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function StateModifier(options) {
        this._transformState = new TransitionableTransform(Transform.identity);
        this._opacityState = new Transitionable(1);
        this._originState = new Transitionable([0, 0]);
        this._sizeState = new Transitionable([0, 0]);

        this._modifier = new Modifier({
            transform: this._transformState,
            opacity: this._opacityState,
            origin: null,
            size: null
        });

        this._hasOrigin = false;
        this._hasSize = false;

        if (options) {
            if (options.transform) this.setTransform(options.transform);
            if (options.opacity) this.setOpacity(options.opacity);
            if (options.origin) this.setOrigin(options.origin);
            if (options.size) this.setSize(options.size);
        }
    }

    /**
     * Set the transform matrix of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to.
     * @param {Transitionable} [transition] Valid transitionable object
     * @param {Function} [callback] callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        this._transformState.set(transform, transition, callback);
        return this;
    };

    /**
     * Set the opacity of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        this._opacityState.set(opacity, transition, callback);
        return this;
    };

    /**
     * Set the origin of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        if (origin === null) {
            if (this._hasOrigin) {
                this._modifier.originFrom(null);
                this._hasOrigin = false;
            }
            return this;
        }
        else if (!this._hasOrigin) {
            this._hasOrigin = true;
            this._modifier.originFrom(this._originState);
        }
        this._originState.set(origin, transition, callback);
        return this;
    };

    /**
     * Set the size of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setSize
     *
     * @param {Array.Number} size two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    StateModifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size === null) {
            if (this._hasSize) {
                this._modifier.sizeFrom(null);
                this._hasSize = false;
            }
            return this;
        }
        else if (!this._hasSize) {
            this._hasSize = true;
            this._modifier.sizeFrom(this._sizeState);
        }
        this._sizeState.set(size, transition, callback);
        return this;
    };

    /**
     * Stop the transition.
     *
     * @method halt
     */
    StateModifier.prototype.halt = function halt() {
        this._transformState.halt();
        this._opacityState.halt();
        this._originState.halt();
        this._sizeState.halt();
    };

    /**
     * Get the current state of the transform matrix component.
     *
     * @method getTransform
     * @return {Object} transform provider object
     */
    StateModifier.prototype.getTransform = function getTransform() {
        return this._transformState.get();
    };

    /**
     * Get the destination state of the transform component.
     *
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    StateModifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._transformState.getFinal();
    };

    /**
     * Get the current state of the opacity component.
     *
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    StateModifier.prototype.getOpacity = function getOpacity() {
        return this._opacityState.get();
    };

    /**
     * Get the current state of the origin component.
     *
     * @method getOrigin
     * @return {Object} origin provider object
     */
    StateModifier.prototype.getOrigin = function getOrigin() {
        return this._hasOrigin ? this._originState.get() : null;
    };

    /**
     * Get the current state of the size component.
     *
     * @method getSize
     * @return {Object} size provider object
     */
    StateModifier.prototype.getSize = function getSize() {
        return this._hasSize ? this._sizeState.get() : null;
    };

    /**
     * Return render spec for this StateModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this StateModifier, including the
     *    provided target
     */
    StateModifier.prototype.modify = function modify(target) {
        return this._modifier.modify(target);
    };

    module.exports = StateModifier;
});
