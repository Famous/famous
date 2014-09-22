/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var CachedMap = require('../transitions/CachedMap');
    var Entity = require('../core/Entity');
    var EventHandler = require('../core/EventHandler');
    var Transform = require('../core/Transform');
    var RenderController = require('./RenderController');

    /**
     * Container which handles swapping renderables from the edge of its parent context.
     * @class EdgeSwapper
     * @constructor
     * @param {Options} [options] An object of configurable options.
     *   Takes the same options as RenderController.
     * @uses RenderController
     */
    function EdgeSwapper(options) {
        this._currentTarget = null;
        this._size = [undefined, undefined];

        this._controller = new RenderController(options);
        this._controller.inTransformFrom(CachedMap.create(_transformMap.bind(this, 0.0001)));
        this._controller.outTransformFrom(CachedMap.create(_transformMap.bind(this, -0.0001)));

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._entityId = Entity.register(this);
        if (options) this.setOptions(options);
    }

    function _transformMap(zMax, progress) {
        return Transform.translate(this._size[0] * (1 - progress), 0, zMax * (1 - progress));
    }

    /**
     * Displays the passed-in content with the EdgeSwapper instance's default transition.
     *
     * @method show
     * @param {Object} content The renderable you want to display.
     */
    EdgeSwapper.prototype.show = function show(content) {
        // stop sending input to old target
        if (this._currentTarget) this._eventInput.unpipe(this._currentTarget);

        this._currentTarget = content;

        // start sending input to new target
        if (this._currentTarget && this._currentTarget.trigger) this._eventInput.pipe(this._currentTarget);

        this._controller.show.apply(this._controller, arguments);
    };

    /**
     * Patches the EdgeSwapper instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the Edgeswapper instance.
     */
    EdgeSwapper.prototype.setOptions = function setOptions(options) {
        this._controller.setOptions(options);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    EdgeSwapper.prototype.render = function render() {
        return this._entityId;
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
    EdgeSwapper.prototype.commit = function commit(context) {
        this._size[0] = context.size[0];
        this._size[1] = context.size[1];

        return {
            transform: context.transform,
            opacity: context.opacity,
            origin: context.origin,
            size: context.size,
            target: this._controller.render()
        };
    };

    module.exports = EdgeSwapper;
});
