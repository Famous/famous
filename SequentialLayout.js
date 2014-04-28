/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var OptionsManager = require('famous/core/OptionsManager');
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var Utility = require('famous/utilities/Utility');

    /**
     * SequentialLayout will lay out a collection of renderables sequentially in the specified direction.
     * @class SequentialLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the SequentialLayout instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Array.Number} [options.defaultItemSize=[50, 50]] In the case where a renderable layed out
     * under SequentialLayout's control doesen't have a getSize method, SequentialLayout will assign it
     * this default size. (Commonly a case with Views).
     */
    function SequentialLayout(options) {
        this._items = null;
        this._size = null;
        this._outputFunction = SequentialLayout.DEFAULT_OUTPUT_FUNCTION;

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    SequentialLayout.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        defaultItemSize: [50, 50]
    };

    SequentialLayout.DEFAULT_OUTPUT_FUNCTION = function DEFAULT_OUTPUT_FUNCTION(input, offset, index) {
        var transform = (this.options.direction === Utility.Direction.X) ? Transform.translate(offset, 0) : Transform.translate(0, offset);
        return {
            transform: transform,
            target: input.render()
        };
    };

    /**
     * Returns the width and the height of the SequentialLayout instance.
     *
     * @method getSize
     * @return {Array} A two value array of the SequentialLayout instance's current width and height (in that order).
     */
    SequentialLayout.prototype.getSize = function getSize() {
        if (!this._size) this.render(); // hack size in
        return this._size;
    };

    /**
     * Sets the collection of renderables under the SequentialLayout instance's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} items Either an array of renderables or a Famous viewSequence.
     * @chainable
     */
    SequentialLayout.prototype.sequenceFrom = function sequenceFrom(items) {
        if (items instanceof Array) items = new ViewSequence(items);
        this._items = items;
        return this;
    };

    /**
     * Patches the SequentialLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the SequentialLayout instance.
     * @chainable
     */
    SequentialLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions.apply(this.optionsManager, arguments);
        return this;
    };

    /**
     * setOutputFunction is used to apply a user-defined output transform on each processed renderable.
     *  For a good example, check out SequentialLayout's own DEFAULT_OUTPUT_FUNCTION in the code.
     *
     * @method setOptions
     * @param {Function} outputFunction An output processer for each renderable in the SequentialLayout
     * instance.
     * @chainable
     */
    SequentialLayout.prototype.setOutputFunction = function setOutputFunction(outputFunction) {
        this._outputFunction = outputFunction;
        return this;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    SequentialLayout.prototype.render = function render() {
        var length = 0;
        var girth = 0;

        var lengthDim = (this.options.direction === Utility.Direction.X) ? 0 : 1;
        var girthDim = (this.options.direction === Utility.Direction.X) ? 1 : 0;

        var currentNode = this._items;
        var result = [];
        while (currentNode) {
            var item = currentNode.get();

            var itemSize;
            if (item && item.getSize) itemSize = item.getSize();
            if (!itemSize) itemSize = this.options.defaultItemSize;
            if (itemSize[girthDim] !== true) girth = Math.max(girth, itemSize[girthDim]);

            var output = this._outputFunction.call(this, item, length, result.length);
            result.push(output);

            if (itemSize[lengthDim] && (itemSize[lengthDim] !== true)) length += itemSize[lengthDim];
            currentNode = currentNode.getNext();
        }

        if (!girth) girth = undefined;

        if (!this._size) this._size = [0, 0];
        this._size[lengthDim] = length;
        this._size[girthDim] = girth;

        return {
            size: this.getSize(),
            target: result
        };
    };

    module.exports = SequentialLayout;
});
