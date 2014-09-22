/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    /* TODO: remove these dependencies when deprecation complete */
    var Transitionable = require('../transitions/Transitionable');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    /**
     *
     *  A collection of visual changes to be
     *    applied to another renderable component. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier.
     *    Modifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The Modifier's children and descendants
     *    are transformed by the amounts specified in the Modifier's properties.
     *
     * @class Modifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     */
    function Modifier(options) {
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionGetter = null;

        /* TODO: remove this when deprecation complete */
        this._legacyStates = {};

        this._output = {
            transform: Transform.identity,
            opacity: 1,
            origin: null,
            align: null,
            size: null,
            proportions: null,
            target: null
        };

        if (options) {
            if (options.transform) this.transformFrom(options.transform);
            if (options.opacity !== undefined) this.opacityFrom(options.opacity);
            if (options.origin) this.originFrom(options.origin);
            if (options.align) this.alignFrom(options.align);
            if (options.size) this.sizeFrom(options.size);
            if (options.proportions) this.proportionsFrom(options.proportions);
        }
    }

    /**
     * Function, object, or static transform matrix which provides the transform.
     *   This is evaluated on every tick of the engine.
     *
     * @method transformFrom
     *
     * @param {Object} transform transform provider object
     * @return {Modifier} this
     */
    Modifier.prototype.transformFrom = function transformFrom(transform) {
        if (transform instanceof Function) this._transformGetter = transform;
        else if (transform instanceof Object && transform.get) this._transformGetter = transform.get.bind(transform);
        else {
            this._transformGetter = null;
            this._output.transform = transform;
        }
        return this;
    };

    /**
     * Set function, object, or number to provide opacity, in range [0,1].
     *
     * @method opacityFrom
     *
     * @param {Object} opacity provider object
     * @return {Modifier} this
     */
    Modifier.prototype.opacityFrom = function opacityFrom(opacity) {
        if (opacity instanceof Function) this._opacityGetter = opacity;
        else if (opacity instanceof Object && opacity.get) this._opacityGetter = opacity.get.bind(opacity);
        else {
            this._opacityGetter = null;
            this._output.opacity = opacity;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide origin, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method originFrom
     *
     * @param {Object} origin provider object
     * @return {Modifier} this
     */
    Modifier.prototype.originFrom = function originFrom(origin) {
        if (origin instanceof Function) this._originGetter = origin;
        else if (origin instanceof Object && origin.get) this._originGetter = origin.get.bind(origin);
        else {
            this._originGetter = null;
            this._output.origin = origin;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide align, as [x,y],
     *   where x and y are in the range [0,1].
     *
     * @method alignFrom
     *
     * @param {Object} align provider object
     * @return {Modifier} this
     */
    Modifier.prototype.alignFrom = function alignFrom(align) {
        if (align instanceof Function) this._alignGetter = align;
        else if (align instanceof Object && align.get) this._alignGetter = align.get.bind(align);
        else {
            this._alignGetter = null;
            this._output.align = align;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide size, as [width, height].
     *
     * @method sizeFrom
     *
     * @param {Object} size provider object
     * @return {Modifier} this
     */
    Modifier.prototype.sizeFrom = function sizeFrom(size) {
        if (size instanceof Function) this._sizeGetter = size;
        else if (size instanceof Object && size.get) this._sizeGetter = size.get.bind(size);
        else {
            this._sizeGetter = null;
            this._output.size = size;
        }
        return this;
    };

    /**
     * Set function, object, or numerical array to provide proportions, as [percent of width, percent of height].
     *
     * @method proportionsFrom
     *
     * @param {Object} proportions provider object
     * @return {Modifier} this
     */
    Modifier.prototype.proportionsFrom = function proportionsFrom(proportions) {
        if (proportions instanceof Function) this._proportionGetter = proportions;
        else if (proportions instanceof Object && proportions.get) this._proportionGetter = proportions.get.bind(proportions);
        else {
            this._proportionGetter = null;
            this._output.proportions = proportions;
        }
        return this;
    };

     /**
     * Deprecated: Prefer transformFrom with static Transform, or use a TransitionableTransform.
     * @deprecated
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setTransform = function setTransform(transform, transition, callback) {
        if (transition || this._legacyStates.transform) {
            if (!this._legacyStates.transform) {
                this._legacyStates.transform = new TransitionableTransform(this._output.transform);
            }
            if (!this._transformGetter) this.transformFrom(this._legacyStates.transform);

            this._legacyStates.transform.set(transform, transition, callback);
            return this;
        }
        else return this.transformFrom(transform);
    };

    /**
     * Deprecated: Prefer opacityFrom with static opacity array, or use a Transitionable with that opacity.
     * @deprecated
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOpacity = function setOpacity(opacity, transition, callback) {
        if (transition || this._legacyStates.opacity) {
            if (!this._legacyStates.opacity) {
                this._legacyStates.opacity = new Transitionable(this._output.opacity);
            }
            if (!this._opacityGetter) this.opacityFrom(this._legacyStates.opacity);

            return this._legacyStates.opacity.set(opacity, transition, callback);
        }
        else return this.opacityFrom(opacity);
    };

    /**
     * Deprecated: Prefer originFrom with static origin array, or use a Transitionable with that origin.
     * @deprecated
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setOrigin = function setOrigin(origin, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.origin) {

            if (!this._legacyStates.origin) {
                this._legacyStates.origin = new Transitionable(this._output.origin || [0, 0]);
            }
            if (!this._originGetter) this.originFrom(this._legacyStates.origin);

            this._legacyStates.origin.set(origin, transition, callback);
            return this;
        }
        else return this.originFrom(origin);
    };

    /**
     * Deprecated: Prefer alignFrom with static align array, or use a Transitionable with that align.
     * @deprecated
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setAlign = function setAlign(align, transition, callback) {
        /* TODO: remove this if statement when deprecation complete */
        if (transition || this._legacyStates.align) {

            if (!this._legacyStates.align) {
                this._legacyStates.align = new Transitionable(this._output.align || [0, 0]);
            }
            if (!this._alignGetter) this.alignFrom(this._legacyStates.align);

            this._legacyStates.align.set(align, transition, callback);
            return this;
        }
        else return this.alignFrom(align);
    };

    /**
     * Deprecated: Prefer sizeFrom with static origin array, or use a Transitionable with that size.
     * @deprecated
     * @method setSize
     * @param {Array.Number} size two element array of [width, height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setSize = function setSize(size, transition, callback) {
        if (size && (transition || this._legacyStates.size)) {
            if (!this._legacyStates.size) {
                this._legacyStates.size = new Transitionable(this._output.size || [0, 0]);
            }
            if (!this._sizeGetter) this.sizeFrom(this._legacyStates.size);

            this._legacyStates.size.set(size, transition, callback);
            return this;
        }
        else return this.sizeFrom(size);
    };

    /**
     * Deprecated: Prefer proportionsFrom with static origin array, or use a Transitionable with those proportions.
     * @deprecated
     * @method setProportions
     * @param {Array.Number} proportions two element array of [percent of width, percent of height]
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {Modifier} this
     */
    Modifier.prototype.setProportions = function setProportions(proportions, transition, callback) {
        if (proportions && (transition || this._legacyStates.proportions)) {
            if (!this._legacyStates.proportions) {
                this._legacyStates.proportions = new Transitionable(this._output.proportions || [0, 0]);
            }
            if (!this._proportionGetter) this.proportionsFrom(this._legacyStates.proportions);

            this._legacyStates.proportions.set(proportions, transition, callback);
            return this;
        }
        else return this.proportionsFrom(proportions);
    };

    /**
     * Deprecated: Prefer to stop transform in your provider object.
     * @deprecated
     * @method halt
     */
    Modifier.prototype.halt = function halt() {
        if (this._legacyStates.transform) this._legacyStates.transform.halt();
        if (this._legacyStates.opacity) this._legacyStates.opacity.halt();
        if (this._legacyStates.origin) this._legacyStates.origin.halt();
        if (this._legacyStates.align) this._legacyStates.align.halt();
        if (this._legacyStates.size) this._legacyStates.size.halt();
        if (this._legacyStates.proportions) this._legacyStates.proportions.halt();
        this._transformGetter = null;
        this._opacityGetter = null;
        this._originGetter = null;
        this._alignGetter = null;
        this._sizeGetter = null;
        this._proportionGetter = null;
    };

    /**
     * Deprecated: Prefer to use your provided transform or output of your transform provider.
     * @deprecated
     * @method getTransform
     * @return {Object} transform provider object
     */
    Modifier.prototype.getTransform = function getTransform() {
        return this._transformGetter();
    };

    /**
     * Deprecated: Prefer to determine the end state of your transform from your transform provider
     * @deprecated
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    Modifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._legacyStates.transform ? this._legacyStates.transform.getFinal() : this._output.transform;
    };

    /**
     * Deprecated: Prefer to use your provided opacity or output of your opacity provider.
     * @deprecated
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    Modifier.prototype.getOpacity = function getOpacity() {
        return this._opacityGetter();
    };

    /**
     * Deprecated: Prefer to use your provided origin or output of your origin provider.
     * @deprecated
     * @method getOrigin
     * @return {Object} origin provider object
     */
    Modifier.prototype.getOrigin = function getOrigin() {
        return this._originGetter();
    };

    /**
     * Deprecated: Prefer to use your provided align or output of your align provider.
     * @deprecated
     * @method getAlign
     * @return {Object} align provider object
     */
    Modifier.prototype.getAlign = function getAlign() {
        return this._alignGetter();
    };

    /**
     * Deprecated: Prefer to use your provided size or output of your size provider.
     * @deprecated
     * @method getSize
     * @return {Object} size provider object
     */
    Modifier.prototype.getSize = function getSize() {
        return this._sizeGetter ? this._sizeGetter() : this._output.size;
    };

    /**
     * Deprecated: Prefer to use your provided proportions or output of your proportions provider.
     * @deprecated
     * @method getProportions
     * @return {Object} proportions provider object
     */
    Modifier.prototype.getProportions = function getProportions() {
        return this._proportionGetter ? this._proportionGetter() : this._output.proportions;
    };

    // call providers on tick to receive render spec elements to apply
    function _update() {
        if (this._transformGetter) this._output.transform = this._transformGetter();
        if (this._opacityGetter) this._output.opacity = this._opacityGetter();
        if (this._originGetter) this._output.origin = this._originGetter();
        if (this._alignGetter) this._output.align = this._alignGetter();
        if (this._sizeGetter) this._output.size = this._sizeGetter();
        if (this._proportionGetter) this._output.proportions = this._proportionGetter();
    }

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    Modifier.prototype.modify = function modify(target) {
        _update.call(this);
        this._output.target = target;
        return this._output;
    };

    module.exports = Modifier;
});
