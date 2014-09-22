/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var RenderNode = require('./RenderNode');
    var EventHandler = require('./EventHandler');
    var ElementAllocator = require('./ElementAllocator');
    var Transform = require('./Transform');
    var Transitionable = require('../transitions/Transitionable');

    var _zeroZero = [0, 0];
    var usePrefix = !('perspective' in document.documentElement.style);

    function _getElementSize(element) {
        return [element.clientWidth, element.clientHeight];
    }

    var _setPerspective = usePrefix ? function(element, perspective) {
        element.style.webkitPerspective = perspective ? perspective.toFixed() + 'px' : '';
    } : function(element, perspective) {
        element.style.perspective = perspective ? perspective.toFixed() + 'px' : '';
    };

    /**
     * The top-level container for a Famous-renderable piece of the document.
     *   It is directly updated by the process-wide Engine object, and manages one
     *   render tree root, which can contain other renderables.
     *
     * @class Context
     * @constructor
     * @private
     * @param {Node} container Element in which content will be inserted
     */
    function Context(container) {
        this.container = container;
        this._allocator = new ElementAllocator(container);

        this._node = new RenderNode();
        this._eventOutput = new EventHandler();
        this._size = _getElementSize(this.container);

        this._perspectiveState = new Transitionable(0);
        this._perspective = undefined;

        this._nodeContext = {
            allocator: this._allocator,
            transform: Transform.identity,
            opacity: 1,
            origin: _zeroZero,
            align: _zeroZero,
            size: this._size
        };

        this._eventOutput.on('resize', function() {
            this.setSize(_getElementSize(this.container));
        }.bind(this));

    }

    // Note: Unused
    Context.prototype.getAllocator = function getAllocator() {
        return this._allocator;
    };

    /**
     * Add renderables to this Context's render tree.
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} RenderNode wrapping this object, if not already a RenderNode
     */
    Context.prototype.add = function add(obj) {
        return this._node.add(obj);
    };

    /**
     * Move this Context to another containing document element.
     *
     * @method migrate
     *
     * @param {Node} container Element to which content will be migrated
     */
    Context.prototype.migrate = function migrate(container) {
        if (container === this.container) return;
        this.container = container;
        this._allocator.migrate(container);
    };

    /**
     * Gets viewport size for Context.
     *
     * @method getSize
     *
     * @return {Array.Number} viewport size as [width, height]
     */
    Context.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Sets viewport size for Context.
     *
     * @method setSize
     *
     * @param {Array.Number} size [width, height].  If unspecified, use size of root document element.
     */
    Context.prototype.setSize = function setSize(size) {
        if (!size) size = _getElementSize(this.container);
        this._size[0] = size[0];
        this._size[1] = size[1];
    };

    /**
     * Commit this Context's content changes to the document.
     *
     * @private
     * @method update
     * @param {Object} contextParameters engine commit specification
     */
    Context.prototype.update = function update(contextParameters) {
        if (contextParameters) {
            if (contextParameters.transform) this._nodeContext.transform = contextParameters.transform;
            if (contextParameters.opacity) this._nodeContext.opacity = contextParameters.opacity;
            if (contextParameters.origin) this._nodeContext.origin = contextParameters.origin;
            if (contextParameters.align) this._nodeContext.align = contextParameters.align;
            if (contextParameters.size) this._nodeContext.size = contextParameters.size;
        }
        var perspective = this._perspectiveState.get();
        if (perspective !== this._perspective) {
            _setPerspective(this.container, perspective);
            this._perspective = perspective;
        }

        this._node.commit(this._nodeContext);
    };

    /**
     * Get current perspective of this context in pixels.
     *
     * @method getPerspective
     * @return {Number} depth perspective in pixels
     */
    Context.prototype.getPerspective = function getPerspective() {
        return this._perspectiveState.get();
    };

    /**
     * Set current perspective of this context in pixels.
     *
     * @method setPerspective
     * @param {Number} perspective in pixels
     * @param {Object} [transition] Transitionable object for applying the change
     * @param {function(Object)} callback function called on completion of transition
     */
    Context.prototype.setPerspective = function setPerspective(perspective, transition, callback) {
        return this._perspectiveState.set(perspective, transition, callback);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} event event data
     * @return {EventHandler} this
     */
    Context.prototype.emit = function emit(type, event) {
        return this._eventOutput.emit(type, event);
    };

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} handler callback
     * @return {EventHandler} this
     */
    Context.prototype.on = function on(type, handler) {
        return this._eventOutput.on(type, handler);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on".
     *
     * @method removeListener
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function} handler function object to remove
     * @return {EventHandler} internal event handler object (for chaining)
     */
    Context.prototype.removeListener = function removeListener(type, handler) {
        return this._eventOutput.removeListener(type, handler);
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Context.prototype.pipe = function pipe(target) {
        return this._eventOutput.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe".
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Context.prototype.unpipe = function unpipe(target) {
        return this._eventOutput.unpipe(target);
    };

    module.exports = Context;
});
