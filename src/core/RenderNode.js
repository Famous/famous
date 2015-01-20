/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Entity = require('./Entity');
    var SpecParser = require('./SpecParser');

    /**
     * A wrapper for inserting a renderable component (like a Modifer or
     *   Surface) into the render tree.
     *
     * @class RenderNode
     * @constructor
     *
     * @param {Object} object Target renderable component
     */
    function RenderNode(object) {
        this._object = null;
        this._child = null;
        this._hasMultipleChildren = false;
        this._isRenderable = false;
        this._isModifier = false;

        this._resultCache = {};
        this._prevResults = {};

        this._childResult = null;

        if (object) this.set(object);
    }

    /**
     * Append a renderable to the list of this node's children.
     *   This produces a new RenderNode in the tree.
     *   Note: Does not double-wrap if child is a RenderNode already.
     *
     * @method add
     * @param {Object} child renderable object
     * @return {RenderNode} new render node wrapping child
     */
    RenderNode.prototype.add = function add(child) {
        var childNode = (child instanceof RenderNode) ? child : new RenderNode(child);
        if (this._child instanceof Array) this._child.push(childNode);
        else if (this._child) {
            this._child = [this._child, childNode];
            this._hasMultipleChildren = true;
            this._childResult = []; // to be used later
        }
        else this._child = childNode;

        return childNode;
    };

    /**
     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
     *
     * @method get
     *
     * @return {Ojbect} contained renderable object
     */
    RenderNode.prototype.get = function get() {
        return this._object || (this._hasMultipleChildren ? null : (this._child ? this._child.get() : null));
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(child) {
        this._childResult = null;
        this._hasMultipleChildren = false;
        this._isRenderable = child.render ? true : false;
        this._isModifier = child.modify ? true : false;
        this._object = child;
        this._child = null;
        if (child instanceof RenderNode) return child;
        else return this;
    };

    /**
     * Get render size of contained object.
     *
     * @method getSize
     * @return {Array.Number} size of this or size of single child.
     */
    RenderNode.prototype.getSize = function getSize() {
        var result = null;
        var target = this.get();
        if (target && target.getSize) result = target.getSize();
        if (!result && this._child && this._child.getSize) result = this._child.getSize();
        return result;
    };

    // apply results of rendering this subtree to the document
    function _applyCommit(spec, context, cacheStorage) {
        var result = SpecParser.parse(spec, context);
        var keys = Object.keys(result);
        for (var i = 0; i < keys.length; i++) {
            var id = keys[i];
            var childNode = Entity.get(id);
            var commitParams = result[id];
            commitParams.allocator = context.allocator;
            var commitResult = childNode.commit(commitParams);
            if (commitResult) _applyCommit(commitResult, context, cacheStorage);
            else cacheStorage[id] = commitParams;
        }
    }

    /**
     * Commit the content change from this node to the document.
     *
     * @private
     * @method commit
     * @param {Context} context render context
     */
    RenderNode.prototype.commit = function commit(context) {
        // free up some divs from the last loop
        var prevKeys = Object.keys(this._prevResults);
        for (var i = 0; i < prevKeys.length; i++) {
            var id = prevKeys[i];
            if (this._resultCache[id] === undefined) {
                var object = Entity.get(id);
                if (object.cleanup) object.cleanup(context.allocator);
            }
        }

        this._prevResults = this._resultCache;
        this._resultCache = {};
        _applyCommit(this.render(), context, this._resultCache);
    };

    /**
     * Generate a render spec from the contents of the wrapped component.
     *
     * @private
     * @method render
     *
     * @return {Object} render specification for the component subtree
     *    only under this node.
     */
    RenderNode.prototype.render = function render() {
        if (this._isRenderable) return this._object.render();

        var result = null;
        if (this._hasMultipleChildren) {
            result = this._childResult;
            var children = this._child;
            for (var i = 0; i < children.length; i++) {
                result[i] = children[i].render();
            }
        }
        else if (this._child) result = this._child.render();

        return this._isModifier ? this._object.modify(result) : result;
    };

    module.exports = RenderNode;
});
