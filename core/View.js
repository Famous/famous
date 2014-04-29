/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('./EventHandler');
    var OptionsManager = require('./OptionsManager');
    var RenderNode = require('./RenderNode');

    /**
     * Useful for quickly creating elements within applications
     *   with large event systems.  Consists of a RenderNode paired with
     *   an input EventHandler and an output EventHandler.
     *   Meant to be extended by the developer.
     *
     * @class View
     * @uses EventHandler
     * @uses OptionsManager
     * @uses RenderNode
     * @constructor
     */
    function View(options) {
        this._node = new RenderNode();

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS || View.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    }

    View.DEFAULT_OPTIONS = {}; // no defaults

    /**
     * Look up options value by key
     * @method getOptions
     *
     * @param {string} key key
     * @return {Object} associated object
     */
    View.prototype.getOptions = function getOptions() {
        return this._optionsManager.value();
    };

    /*
     *  Set internal options.
     *  No defaults options are set in View.
     *
     *  @method setOptions
     *  @param {Object} options
     */
    View.prototype.setOptions = function setOptions(options) {
        this._optionsManager.patch(options);
    };

    /**
     * Add a child renderable to the view.
     *   Note: This is meant to be used by an inheriting class
     *   rather than from outside the prototype chain.
     *
     * @method add
     * @return {RenderNode}
     * @protected
     */
    View.prototype.add = function add() {
        return this._node.add.apply(this._node, arguments);
    };

    /**
     * Alias for add
     * @method _add
     */
    View.prototype._add = View.prototype.add;

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    View.prototype.render = function render() {
        return this._node.render();
    };

    /**
     * Return size of contained element.
     *
     * @method getSize
     * @return {Array.Number} [width, height]
     */
    View.prototype.getSize = function getSize() {
        if (this._node && this._node.getSize) {
            return this._node.getSize.apply(this._node, arguments) || this.options.size;
        }
        else return this.options.size;
    };

    module.exports = View;
});
