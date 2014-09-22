
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('../core/Surface');
    var Context = require('../core/Context');

    /**
     * ContainerSurface is an object designed to contain surfaces and
     *   set properties to be applied to all of them at once.
     *   This extends the Surface class.
     *   A container surface will enforce these properties on the
     *   surfaces it contains:
     *
     *   size (clips contained surfaces to its own width and height);
     *
     *   origin;
     *
     *   its own opacity and transform, which will be automatically
     *   applied to  all Surfaces contained directly and indirectly.
     *
     * @class ContainerSurface
     * @extends Surface
     * @constructor
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on all inner content
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface (should not be used)
     */
    function ContainerSurface(options) {
        Surface.call(this, options);
        this._container = document.createElement('div');
        this._container.classList.add('famous-group');
        this._container.classList.add('famous-container-group');
        this._shouldRecalculateSize = false;
        this.context = new Context(this._container);
        this.setContent(this._container);
    }

    ContainerSurface.prototype = Object.create(Surface.prototype);
    ContainerSurface.prototype.constructor = ContainerSurface;
    ContainerSurface.prototype.elementType = 'div';
    ContainerSurface.prototype.elementClass = 'famous-surface';

    /**
     * Add renderables to this object's render tree
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    ContainerSurface.prototype.add = function add() {
        return this.context.add.apply(this.context, arguments);
    };

    /**
     * Return spec for this surface.  Note: Can result in a size recalculation.
     *
     * @private
     * @method render
     *
     * @return {Object} render spec for this surface (spec id)
     */
    ContainerSurface.prototype.render = function render() {
        if (this._sizeDirty) this._shouldRecalculateSize = true;
        return Surface.prototype.render.apply(this, arguments);
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    ContainerSurface.prototype.deploy = function deploy() {
        this._shouldRecalculateSize = true;
        return Surface.prototype.deploy.apply(this, arguments);
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     * @param {Transform} transform unused TODO
     * @param {Number} opacity  unused TODO
     * @param {Array.Number} origin unused TODO
     * @param {Array.Number} size unused TODO
     * @return {undefined} TODO returns an undefined value
     */
    ContainerSurface.prototype.commit = function commit(context, transform, opacity, origin, size) {
        var previousSize = this._size ? [this._size[0], this._size[1]] : null;
        var result = Surface.prototype.commit.apply(this, arguments);
        if (this._shouldRecalculateSize || (previousSize && (this._size[0] !== previousSize[0] || this._size[1] !== previousSize[1]))) {
            this.context.setSize();
            this._shouldRecalculateSize = false;
        }
        this.context.update();
        return result;
    };

    module.exports = ContainerSurface;
});
