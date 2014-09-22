/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var ContainerSurface = require('../surfaces/ContainerSurface');
    var EventHandler = require('../core/EventHandler');
    var Scrollview = require('./Scrollview');
    var Utility = require('../utilities/Utility');
    var OptionsManager = require('../core/OptionsManager');

    /**
     * A Container surface with a scrollview automatically added. The convenience of ScrollContainer lies in
     * being able to clip out portions of the associated scrollview that lie outside the bounding surface,
     * and in being able to move the scrollview more easily by applying modifiers to the parent container
     * surface.
     * @class ScrollContainer
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Options} [options.container=undefined] Options for the ScrollContainer instance's surface.
     * @param {Options} [options.scrollview={direction:Utility.Direction.X}]  Options for the ScrollContainer instance's scrollview.
     */
    function ScrollContainer(options) {
        this.options = Object.create(ScrollContainer.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);

        this.container = new ContainerSurface(this.options.container);
        this.scrollview = new Scrollview(this.options.scrollview);

        this.container.add(this.scrollview);

        this._eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);

        this._eventInput.pipe(this.scrollview);

        this._eventOutput = new EventHandler();
        EventHandler.setOutputHandler(this, this._eventOutput);

        this.container.pipe(this._eventOutput);
        this.scrollview.pipe(this._eventOutput);
    }

    ScrollContainer.DEFAULT_OPTIONS = {
        container: {
            properties: {overflow : 'hidden'}
        },
        scrollview: {}
    };

    /**
     * Patches the ScrollContainer instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the ScrollContainer instance.
     */
    ScrollContainer.prototype.setOptions = function setOptions(options) {
        return this._optionsManager.setOptions(options);
    };

    /**
     * Sets the collection of renderables under the ScrollContainer instance scrollview's control.
     *
     * @method sequenceFrom
     * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous ViewSequence.
     */
    ScrollContainer.prototype.sequenceFrom = function sequenceFrom() {
        return this.scrollview.sequenceFrom.apply(this.scrollview, arguments);
    };

    /**
     * Returns the width and the height of the ScrollContainer instance.
     *
     * @method getSize
     * @return {Array} A two value array of the ScrollContainer instance's current width and height (in that order).
     */
    ScrollContainer.prototype.getSize = function getSize() {
        return this.container.getSize.apply(this.container, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    ScrollContainer.prototype.render = function render() {
        return this.container.render();
    };

    module.exports = ScrollContainer;
});
