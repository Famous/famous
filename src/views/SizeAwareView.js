/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: arkady@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var View      = require('../core/View');
    var Entity    = require('../core/Entity');
    var Transform = require('../core/Transform');

    /*
     *  A View that keeps track of the parent's resize, passed down from the
     *  commit function. This can be anything higher in the render tree,
     *  either the engine, or a modifier with a size, or a custom render function
     *  that changes the size.
     *
     *  Views that inherit from SizeAwareView have a .getParentSize() method
     *  that can be queried at any point as well as a 'parentResize' event on
     *  the View's '_eventInput' that can be listened to for immediate notifications
     *  of size changes.
     *
     *  @class SizeAwareView
     */
    function SizeAwareView() {
        View.apply(this, arguments);
        this._id = Entity.register(this);
        this._parentSize = []; //Store reference to parent size.
    }

    SizeAwareView.prototype = Object.create(View.prototype);
    SizeAwareView.prototype.constructor = SizeAwareView;

    /*
     * Commit the content change from this node to the document.
     * Keeps track of parent's size and fires 'parentResize' event on
     * eventInput when it changes.
     *
     * @private
     * @method commit
     * @param {Object} context
     */
    SizeAwareView.prototype.commit = function commit(context) {
        var transform = context.transform;
        var opacity = context.opacity;
        var origin = context.origin;

        // Update the reference to view's parent size if it's out of sync with
        // the commit's context. Notify the element of the resize.
        if (!this._parentSize || this._parentSize[0] !== context.size[0] ||
            this._parentSize[1] !== context.size[1]) {
            this._parentSize[0] = context.size[0];
            this._parentSize[1] = context.size[1];
            this._eventInput.emit('parentResize', this._parentSize);
            if (this.onResize) this.onResize(this._parentSize);
        }

        if (this._parentSize) {
          transform = Transform.moveThen([
              -this._parentSize[0]*origin[0],
              -this._parentSize[1]*origin[1],
              0], transform);
        }

        return {
            transform: transform,
            opacity: opacity,
            size: this._parentSize,
            target: this._node.render()
        };
    };

    /*
     * Get view's parent size.
     * @method getSize
     */
    SizeAwareView.prototype.getParentSize = function getParentSize() {
        return this._parentSize;
    };

    /*
     * Actual rendering happens in commit.
     * @method render
     */
    SizeAwareView.prototype.render = function render() {
        return this._id;
    };

    module.exports = SizeAwareView;
});
