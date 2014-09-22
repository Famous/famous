/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Entity = require('../core/Entity');
    var Transform = require('../core/Transform');
    var OptionsManager = require('../core/OptionsManager');
    var EventHandler = require('../core/EventHandler');
    var Transitionable = require('../transitions/Transitionable');

    /**
     * A layout which divides a context into sections based on a proportion
     *   of the total sum of ratios.  FlexibleLayout can either lay renderables
     *   out vertically or horizontally.
     * @class FlexibleLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=0] Direction the FlexibleLayout instance should lay out renderables.
     * @param {Transition} [options.transition=false] The transiton that controls the FlexibleLayout instance's reflow.
     * @param {Ratios} [options.ratios=[]] The proportions for the renderables to maintain
     */
    function FlexibleLayout(options) {
        this.options = Object.create(FlexibleLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._ratios = new Transitionable(this.options.ratios);
        this._nodes = [];
        this._size = [0, 0];

        this._cachedDirection = null;
        this._cachedLengths = [];
        this._cachedTransforms = null;
        this._ratiosDirty = false;

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    FlexibleLayout.DIRECTION_X = 0;
    FlexibleLayout.DIRECTION_Y = 1;

    FlexibleLayout.DEFAULT_OPTIONS = {
        direction: FlexibleLayout.DIRECTION_X,
        transition: false,
        ratios : []
    };

    function _reflow(ratios, length, direction) {
        var currTransform;
        var translation = 0;
        var flexLength = length;
        var ratioSum = 0;
        var ratio;
        var node;
        var i;

        this._cachedLengths = [];
        this._cachedTransforms = [];

        for (i = 0; i < ratios.length; i++){
            ratio = ratios[i];
            node = this._nodes[i];

            if (typeof ratio !== 'number')
                flexLength -= node.getSize()[direction] || 0;
            else
                ratioSum += ratio;
        }

        for (i = 0; i < ratios.length; i++) {
            node = this._nodes[i];
            ratio = ratios[i];

            length = (typeof ratio === 'number')
                ? flexLength * ratio / ratioSum
                : node.getSize()[direction];

            currTransform = (direction === FlexibleLayout.DIRECTION_X)
                ? Transform.translate(translation, 0, 0)
                : Transform.translate(0, translation, 0);

            this._cachedTransforms.push(currTransform);
            this._cachedLengths.push(length);

            translation += length;
        }
    }

    function _trueSizedDirty(ratios, direction) {
        for (var i = 0; i < ratios.length; i++) {
            if (typeof ratios[i] !== 'number') {
                if (this._nodes[i].getSize()[direction] !== this._cachedLengths[i])
                    return true;
            }
        }

        return false;
    }

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {Object} Render spec for this component
     */
    FlexibleLayout.prototype.render = function render() {
        return this.id;
    };

    /**
     * Patches the FlexibleLayouts instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the FlexibleLayout instance.
     */
    FlexibleLayout.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the FlexibleLayout instance's control.  Also sets
     * the associated ratio values for sizing the renderables if given.
     *
     * @method sequenceFrom
     * @param {Array} sequence An array of renderables.
     */
    FlexibleLayout.prototype.sequenceFrom = function sequenceFrom(sequence) {
        this._nodes = sequence;

        if (this._ratios.get().length === 0) {
            var ratios = [];
            for (var i = 0; i < this._nodes.length; i++) ratios.push(1);
            this.setRatios(ratios);
        }
    };

    /**
     * Sets the associated ratio values for sizing the renderables.
     *
     * @method setRatios
     * @param {Array} ratios Array of ratios corresponding to the percentage sizes each renderable should be
     */
    FlexibleLayout.prototype.setRatios = function setRatios(ratios, transition, callback) {
        if (transition === undefined) transition = this.options.transition;
        var currRatios = this._ratios;
        if (currRatios.get().length === 0) transition = undefined;
        if (currRatios.isActive()) currRatios.halt();
        currRatios.set(ratios, transition, callback);
        this._ratiosDirty = true;
    };

    /**
     * Gets the size of the context the FlexibleLayout exists within.
     *
     * @method getSize
     *
     * @return {Array} Size of the FlexibleLayout in pixels [width, height]
     */
    FlexibleLayout.prototype.getSize = function getSize() {
        return this._size;
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
    FlexibleLayout.prototype.commit = function commit(context) {
        var parentSize = context.size;
        var parentTransform = context.transform;
        var parentOrigin = context.origin;
        var parentOpacity = context.opacity;

        var ratios = this._ratios.get();
        var direction = this.options.direction;
        var length = parentSize[direction];
        var size;

        if (length !== this._size[direction] || this._ratiosDirty || this._ratios.isActive() || direction !== this._cachedDirection || _trueSizedDirty.call(this, ratios, direction)) {
            _reflow.call(this, ratios, length, direction);

            if (length !== this._size[direction]) {
                this._size[0] = parentSize[0];
                this._size[1] = parentSize[1];
            }

            if (direction !== this._cachedDirection) this._cachedDirection = direction;
            if (this._ratiosDirty) this._ratiosDirty = false;
        }

        var result = [];
        for (var i = 0; i < ratios.length; i++) {
            size = [undefined, undefined];
            length = this._cachedLengths[i];
            size[direction] = length;
            result.push({
                transform : this._cachedTransforms[i],
                size: size,
                target : this._nodes[i].render()
            });
        }

        if (parentSize && (parentOrigin[0] !== 0 && parentOrigin[1] !== 0))
            parentTransform = Transform.moveThen([-parentSize[0]*parentOrigin[0], -parentSize[1]*parentOrigin[1], 0], parentTransform);

        return {
            transform: parentTransform,
            size: parentSize,
            opacity: parentOpacity,
            target: result
        };
    };

    module.exports = FlexibleLayout;
});
