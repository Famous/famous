/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Modifier = require('famous/core/Modifier');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');
    var View = require('famous/core/View');

    /**
     * A dynamic view that can show or hide different renerables with transitions.
     * @class RenderController
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Transition} [inTransition=true] The transition in charge of showing a renderable.
     * @param {Transition} [outTransition=true]  The transition in charge of removing your previous renderable when
     * you show a new one, or hiding your current renderable.
     * @param {Boolean} [overlap=true] When showing a new renderable, overlap determines if the
      out transition of the old one executes concurrently with the in transition of the new one,
       or synchronously beforehand.
     */
    function RenderController(options) {
        View.apply(this, arguments);

        this._showing = -1;
        this._outgoingRenderables = [];
        this._nextRenderable = null;

        this._renderables = [];
        this._nodes = [];
        this._modifiers = [];
        this._states = [];

        this.inTransformMap = RenderController.DefaultMap.transform;
        this.inOpacityMap = RenderController.DefaultMap.opacity;
        this.inOriginMap = RenderController.DefaultMap.origin;
        this.outTransformMap = RenderController.DefaultMap.transform;
        this.outOpacityMap = RenderController.DefaultMap.opacity;
        this.outOriginMap = RenderController.DefaultMap.origin;

        this._output = [];
    }
    RenderController.prototype = Object.create(View.prototype);
    RenderController.prototype.constructor = RenderController;

    RenderController.DEFAULT_OPTIONS = {
        inTransition: true,
        outTransition: true,
        overlap: true
    };

    RenderController.DefaultMap = {
        transform: function() {
            return Transform.identity;
        },
        opacity: function(progress) {
            return progress;
        },
        origin: null
    };

    function _mappedState(map, state) {
        return map(state.get());
    }

    /**
     * As your RenderController shows a new renderable, it executes a transition in. This transition in
     *  will affect a default interior state and modify it as you bring renderables in and out. However, if you want to control
     *  the transform, opacity, and origin state yourself, you may call certain methods (such as inTransformFrom) to obtain state from an outside source,
     *  that may either be a function or a Famous transitionable. inTransformFrom sets the accessor for the state of
     *  the transform used in transitioning in renderables.
     *
     * @method inTransformFrom
     * @param {Function|Transitionable} transform  A function that returns a transform from outside closure, or a
     * a transitionable that manages a full transform (a sixteen value array).
     * @chainable
     */
    RenderController.prototype.inTransformFrom = function inTransformFrom(transform) {
        if (transform instanceof Function) this.inTransformMap = transform;
        else if (transform && transform.get) this.inTransformMap = transform.get.bind(transform);
        else throw new Error('inTransformFrom takes only function or getter object');
        //TODO: tween transition
        return this;
    };

    /**
     * inOpacityFrom sets the accessor for the state of the opacity used in transitioning in renderables.
     * @method inOpacityFrom
     * @param {Function|Transitionable} opacity  A function that returns an opacity from outside closure, or a
     * a transitionable that manages opacity (a number between zero and one).
     * @chainable
     */
    RenderController.prototype.inOpacityFrom = function inOpacityFrom(opacity) {
        if (opacity instanceof Function) this.inOpacityMap = opacity;
        else if (opacity && opacity.get) this.inOpacityMap = opacity.get.bind(opacity);
        else throw new Error('inOpacityFrom takes only function or getter object');
        //TODO: tween opacity
        return this;
    };

    /**
     * inOriginFrom sets the accessor for the state of the origin used in transitioning in renderables.
     * @method inOriginFrom
     * @param {Function|Transitionable} origin A function that returns an origin from outside closure, or a
     * a transitionable that manages origin (a two value array of numbers between zero and one).
     * @chainable
     */
    RenderController.prototype.inOriginFrom = function inOriginFrom(origin) {
        if (origin instanceof Function) this.inOriginMap = origin;
        else if (origin && origin.get) this.inOriginMap = origin.get.bind(origin);
        else throw new Error('inOriginFrom takes only function or getter object');
        //TODO: tween origin
        return this;
    };

    /**
     * outTransformFrom sets the accessor for the state of the transform used in transitioning out renderables.
     * @method show
     * @param {Function|Transitionable} transform  A function that returns a transform from outside closure, or a
     * a transitionable that manages a full transform (a sixteen value array).
     * @chainable
     */
    RenderController.prototype.outTransformFrom = function outTransformFrom(transform) {
        if (transform instanceof Function) this.outTransformMap = transform;
        else if (transform && transform.get) this.outTransformMap = transform.get.bind(transform);
        else throw new Error('inTransformFrom takes only function or getter object');
        //TODO: tween transition
        return this;
    };

    /**
     * outOpacityFrom sets the accessor for the state of the opacity used in transitioning out renderables.
     * @method inOpacityFrom
     * @param {Function|Transitionable} opacity  A function that returns an opacity from outside closure, or a
     * a transitionable that manages opacity (a number between zero and one).
     * @chainable
     */
    RenderController.prototype.outOpacityFrom = function outOpacityFrom(opacity) {
        if (opacity instanceof Function) this.outOpacityMap = opacity;
        else if (opacity && opacity.get) this.outOpacityMap = opacity.get.bind(opacity);
        else throw new Error('inOpacityFrom takes only function or getter object');
        //TODO: tween opacity
        return this;
    };

    /**
     * outOriginFrom sets the accessor for the state of the origin used in transitioning out renderables.
     * @method inOriginFrom
     * @param {Function|Transitionable} origin A function that returns an origin from outside closure, or a
     * a transitionable that manages origin (a two value array of numbers between zero and one).
     * @chainable
     */
    RenderController.prototype.outOriginFrom = function outOriginFrom(origin) {
        if (origin instanceof Function) this.outOriginMap = origin;
        else if (origin && origin.get) this.outOriginMap = origin.get.bind(origin);
        else throw new Error('inOriginFrom takes only function or getter object');
        //TODO: tween origin
        return this;
    };

    /**
     * Show displays the targeted renderable with a transition and an optional callback to
     * execute afterwards.
     * @method show
     * @param {Object} renderable The renderable you want to show.
     * @param {Transition} [transition] Overwrites the default transition in to display the
     * passed-in renderable.
     * @param {function} [callback] Executes after transitioning in the renderable.
     * @chainable
     */
    RenderController.prototype.show = function show(renderable, transition, callback) {
        if (!renderable) {
            return this.hide(callback);
        }

        if (transition instanceof Function) {
            callback = transition;
            transition = null;
        }

        if (this._showing >= 0) {
            if (this.options.overlap) this.hide();
            else {
                if (this._nextRenderable) {
                    this._nextRenderable = renderable;
                }
                else {
                    this._nextRenderable = renderable;
                    this.hide(function() {
                        if (this._nextRenderable === renderable) this.show(this._nextRenderable, callback);
                        this._nextRenderable = null;
                    });
                }
                return undefined;
            }
        }

        var state = null;

        // check to see if we should restore
        var renderableIndex = this._renderables.indexOf(renderable);
        if (renderableIndex >= 0) {
            this._showing = renderableIndex;
            state = this._states[renderableIndex];
            state.halt();

            var outgoingIndex = this._outgoingRenderables.indexOf(renderable);
            if (outgoingIndex >= 0) this._outgoingRenderables.splice(outgoingIndex, 1);
        }
        else {
            state = new Transitionable(0);

            var modifier = new Modifier({
                transform: this.inTransformMap ? _mappedState.bind(this, this.inTransformMap, state) : null,
                opacity: this.inOpacityMap ? _mappedState.bind(this, this.inOpacityMap, state) : null,
                origin: this.inOriginMap ? _mappedState.bind(this, this.inOriginMap, state) : null
            });
            var node = new RenderNode();
            node.add(modifier).add(renderable);

            this._showing = this._nodes.length;
            this._nodes.push(node);
            this._modifiers.push(modifier);
            this._states.push(state);
            this._renderables.push(renderable);
        }

        if (!transition) transition = this.options.inTransition;
        state.set(1, transition, callback);
    };

    /**
     * Hide hides the currently displayed renderable with an out transition.
     * @method hide
     * @param {Transition} [transition] Overwrites the default transition in to hide the
     * currently controlled renderable.
     * @param {function} [callback] Executes after transitioning out the renderable.
     * @chainable
     */
    RenderController.prototype.hide = function hide(transition, callback) {
        if (this._showing < 0) return;
        var index = this._showing;
        this._showing = -1;

        if (transition instanceof Function) {
            callback = transition;
            transition = undefined;
        }

        var node = this._nodes[index];
        var modifier = this._modifiers[index];
        var state = this._states[index];
        var renderable = this._renderables[index];

        modifier.transformFrom(this.outTransformMap ? _mappedState.bind(this, this.outTransformMap, state) : null);
        modifier.opacityFrom(this.outOpacityMap ? _mappedState.bind(this, this.outOpacityMap, state) : null);
        modifier.originFrom(this.outOriginMap ? _mappedState.bind(this, this.outOriginMap, state) : null);

        if (this._outgoingRenderables.indexOf(renderable) < 0) this._outgoingRenderables.push(renderable);

        if (!transition) transition = this.options.outTransition;
        state.halt();
        state.set(0, transition, function(node, modifier, state, renderable) {
            if (this._outgoingRenderables.indexOf(renderable) >= 0) {
                var index = this._nodes.indexOf(node);
                this._nodes.splice(index, 1);
                this._modifiers.splice(index, 1);
                this._states.splice(index, 1);
                this._renderables.splice(index, 1);
                this._outgoingRenderables.splice(this._outgoingRenderables.indexOf(renderable), 1);

                if (this._showing >= index) this._showing--;
            }
            if (callback) callback.call(this);
        }.bind(this, node, modifier, state, renderable));
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    RenderController.prototype.render = function render() {
        var result = this._output;
        if (result.length > this._nodes.length) result.splice(this._nodes.length);
        for (var i = 0; i < this._nodes.length; i++) {
            result[i] = this._nodes[i].render();
        }
        return result;
    };

    module.exports = RenderController;
});
