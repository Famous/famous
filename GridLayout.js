/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var Modifier = require('famous/core/Modifier');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     * A layout which divides a context into several evenly-sized grid cells.
     *   If dimensions are provided, the grid is evenly subdivided with children
     *   cells representing their own context, otherwise the cellSize property is used to compute
     *   dimensions so that items of cellSize will fit.
     * @class GridLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Array.Number} [options.dimensions=[1, 1]] A two value array which specifies the amount of columns
     * and rows in your Gridlayout instance.
     * @param {Array.Number} [options.cellSize=[250, 250]]  A two-value array which specifies the width and height
     * of each cell in your Gridlayout instance.
     * @param {Transition} [options.transition=false] The transiton that controls the Gridlayout instance's reflow.
     */
    function GridLayout(options) {
        this.options = Object.create(GridLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._modifiers = [];
        this._states = [];
        this._contextSizeCache = [0, 0];
        this._dimensionsCache = [0, 0];
        this._activeCount = 0;
    }

    function _reflow(size, cols, rows) {
        if (!rows) rows = (size[1] / this.options.cellSize[1]) | 0;
        if (!cols) cols = (size[0] / this.options.cellSize[0]) | 0;
        var rowSize = size[1] / rows;
        var colSize = size[0] / cols;
        for (var i = 0; i < rows; i++) {
            var currY = Math.round(rowSize * i);
            for (var j = 0; j < cols; j++) {
                var currX = Math.round(colSize * j);
                var currIndex = i * cols + j;
                if (!(currIndex in this._modifiers)) _createModifier.call(this, currIndex);
                _animateModifier.call(this, currIndex, [Math.round(colSize * (j + 1)) - currX, Math.round(rowSize * (i+ 1)) - currY], [currX, currY, 0], 1);
            }
        }
        this._dimensionsCache = [this.options.dimensions[0], this.options.dimensions[1]];
        this._contextSizeCache = [size[0], size[1]];

        this._activeCount = rows * cols;

        for (i = this._activeCount ; i < this._modifiers.length; i++) {
            _animateModifier.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0], 0);
        }
    }

    function _createModifier(index) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.identity),
            opacity: new Transitionable(0),
            size: new Transitionable([0, 0])
        };

        var modifier = new Modifier({
            transform: transitionItem.transform,
            opacity: transitionItem.opacity,
            size: transitionItem.size
        });

        this._states[index] = transitionItem;
        this._modifiers[index] = modifier;

    }

    function _animateModifier(index, size, position, opacity) {
        var currState = this._states[index];

        var currSize = currState.size;
        var currOpacity = currState.opacity;
        var currTransform = currState.transform;

        var transition = this.options.transition;

        currTransform.halt();
        currOpacity.halt();
        currSize.halt();

        currTransform.setTranslate(position, transition);
        currSize.set(size, transition);
        currOpacity.set(opacity, transition);
    }

    GridLayout.DEFAULT_OPTIONS = {
        dimensions: [1, 1],
        cellSize: [250, 250],
        transition: false
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    GridLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the GridLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the GridLayout instance.
     */
    GridLayout.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the Gridlayout instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous viewSequence.
     */
    GridLayout.prototype.sequenceFrom = function sequenceFrom(sequence) {
        if (sequence instanceof Array) sequence = new ViewSequence(sequence);
        this.sequence = sequence;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    GridLayout.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;
        var size = context.size;

        var cols = this.options.dimensions[0];
        var rows = this.options.dimensions[1];

        if (size[0] !== this._contextSizeCache[0] || size[1] !== this._contextSizeCache[1] || cols !== this._dimensionsCache[0] || rows !== this._dimensionsCache[1]) {
            _reflow.call(this, size, cols, rows);
        }

        var sequence = this.sequence;
        var result = [];
        var currIndex = 0;
        while (sequence && (currIndex < this._modifiers.length)) {
            var item = sequence.get();
            var modifier = this._modifiers[currIndex];
            if (currIndex >= this._activeCount && this._states[currIndex].opacity.isActive()) {
                this._modifiers.splice(currIndex, 1);
                this._states.splice(currIndex, 1);
            }
            if (item) {
                result[currIndex] = modifier.modify({
                    origin: origin,
                    target: item.render()
                });
            }
            sequence = sequence.getNext();
            currIndex++;
        }

        if (size) transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
        return {
            transform: transform,
            opacity: opacity,
            size: size,
            target: result
        };
    };

    module.exports = GridLayout;
});
