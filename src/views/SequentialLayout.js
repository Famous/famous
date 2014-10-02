/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var OptionsManager = require('../core/OptionsManager');
    var Transform = require('../core/Transform');
    var ViewSequence = require('../core/ViewSequence');
    var Utility = require('../utilities/Utility');

    /**
     * SequentialLayout will lay out a collection of renderables sequentially in the specified direction.
     * @class SequentialLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the SequentialLayout instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     */
    function SequentialLayout(options) {
        this._items = null;
        this._size = null;
        this._outputFunction = SequentialLayout.DEFAULT_OUTPUT_FUNCTION;

        this.options = Utility.clone(this.constructor.DEFAULT_OPTIONS || SequentialLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    SequentialLayout.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        itemSpacing: 0
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
     * @method setOutputFunction
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
        var length             = 0;
        var secondaryDirection = this.options.direction ^ 1;
        var currentNode        = this._items;
        var item               = null;
        var itemSize           = [];
        var output             = {};
        var result             = [];
        var i                  = 0;

        this._size = [0, 0];

        while (currentNode) {
            item = currentNode.get();
            if (!item) break;

            if (item.getSize) itemSize = item.getSize();

            output = this._outputFunction.call(this, item, length, i++);
            result.push(output);

            if (itemSize) {
                if (itemSize[this.options.direction]) length += itemSize[this.options.direction];
                if (itemSize[secondaryDirection] > this._size[secondaryDirection]) this._size[secondaryDirection] = itemSize[secondaryDirection];
            }

            currentNode = currentNode.getNext();

            if (this.options.itemSpacing && currentNode) length += this.options.itemSpacing;
        }

        this._size[this.options.direction] = length;

        return result;
    };

    module.exports = SequentialLayout;
});
