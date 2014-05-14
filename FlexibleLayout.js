/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Entity = require('famous/core/Entity');
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');
    var EventHandler = require('famous/core/EventHandler');
    var Transitionable = require('famous/transitions/Transitionable');

    /**
     * A layout which divides a context into sections based on a proportion
     *   of the total sum of ratios.  FlexibleLayout can either lay renderables
     *   out vertically or horizontally.
     * @class FlexibleLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=0] Direction the FlexibleLayout instance should lay out renderables.
     * @param {Transition} [options.transition=false] The transiton that controls the FlexibleLayout instance's reflow.
     */
    function FlexibleLayout(options) {
        this.options = Object.create(FlexibleLayout.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.id = Entity.register(this);

        this._ratios = new Transitionable(this.options.ratios);
        this._nodes = [];

        this._cachedDirection = this.options.direction;
        this._cachedSpec = null;
        this._cachedLength = false;

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
        if (options.direction && options.direction !== this.options.direction) this._cachedDirection = options.direction;
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
        var size = context.size;
        var transform = context.transform;
        var origin = context.origin;

        var direction = this.options.direction;
        var length = size[direction];

        var ratio;
        var i;
        var node;

        if (length === this._cachedLength && this._cachedSpec && !this._ratios.isActive() && direction === this._cachedDirection)
            return this._cachedSpec;

        var ratios = this._ratios.get();

        var flexLength = length;
        var ratioSum = 0;
        for (i = 0; i < ratios.length; i++){
            ratio = ratios[i];
            node = this._nodes[i];
            if (typeof ratio !== 'number')
                flexLength -= node.getSize()[direction] || 0;
            else
                ratioSum += ratio;
        }

        var currTransform;
        var translation = 0;
        var result = [];
        for (i = 0; i < ratios.length; i++) {
            var nodeSize = [size[0], size[1]];
            node = this._nodes[i];
            ratio = ratios[i];

            nodeSize[direction] = (typeof ratio === 'number')
                ? flexLength * ratio / ratioSum
                : node.getSize()[direction];

            currTransform = (direction === FlexibleLayout.DIRECTION_X)
                ? Transform.translate(translation, 0, 0)
                : Transform.translate(0, translation, 0);

            result.push({
                transform : currTransform,
                size: nodeSize,
                target : node.render()
            });

            translation += nodeSize[direction];
        }

        if (size && (origin[0] !== 0 && origin[1] !== 0))
            transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);

        this._cachedSpec = {
            transform: transform,
            size: size,
            target: result
        };
        this._cachedLength = length;
        this._cachedDirection = direction;

        return this._cachedSpec;
    };

    module.exports = FlexibleLayout;
});
