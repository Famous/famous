/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mike@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Entity = require('../core/Entity');
    var Transform = require('../core/Transform');
    var EventHandler = require('../core/EventHandler');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * ContextualView is an interface for creating views that need to
     *   be aware of their parent's transform, size, and/or origin.
     *   Consists of a OptionsManager paired with an input EventHandler
     *   and an output EventHandler. Meant to be extended by the developer.
     * @class ContextualView
     * @constructor
     * @param {Options} [options] An object of configurable options.
     *
     * Deprecated: Use SizeAwareView when creating views that need to be
     * aware of their parent's size.
     * @deprecated
     */
    function ContextualView(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS || ContextualView.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._id = Entity.register(this);
    }

    ContextualView.DEFAULT_OPTIONS = {};

    /**
     * Patches the ContextualLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the ContextualLayout instance.
     */
    ContextualView.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Returns ContextualLayout instance's options.
     *
     * @method setOptions
     * @param {string} key
     * @return {Options} options The instance's object of configurable options.
     */
    ContextualView.prototype.getOptions = function getOptions(key) {
        return this._optionsManager.getOptions(key);
    };

    /**
     * Return the registers Entity id for the ContextualView.
     *
     * @private
     * @method render
     * @return {Number} Registered Entity id
     */
    ContextualView.prototype.render = function render() {
        return this._id;
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
    ContextualView.prototype.commit = function commit(context) {};

    module.exports = ContextualView;
});
