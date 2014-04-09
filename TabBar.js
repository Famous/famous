/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Utility = require('famous/utilities/Utility');
    var View = require('famous/core/View');
    var GridLayout = require('famous/views/GridLayout');
    var ToggleButton = require('./ToggleButton');

    /**
     * A view for display various tabs that dispatch events
     *  based on the id of the button that was clicked
     *
     * @class TabBar
     * @extends View
     * @constructor
     *
     * @param {object} options overrides of deault options
     */
    function TabBar(options) {
        View.apply(this, arguments);

        this.layout = new GridLayout();
        this.buttons = [];
        this._buttonIds = {};
        this._buttonCallbacks = {};

        this.layout.sequenceFrom(this.buttons);
        this._add(this.layout);

        this._optionsManager.on('change', _updateOptions.bind(this));
    }

    TabBar.prototype = Object.create(View.prototype);
    TabBar.prototype.constructor = TabBar;

    TabBar.DEFAULT_OPTIONS = {
        sections: [],
        widget: ToggleButton,
        size: [undefined, 50],
        direction: Utility.Direction.X,
        buttons: {
            toggleMode: ToggleButton.ON
        }
    };

    /**
     * Update the options for all components of the view
     *
     * @method _updateOptions
     *
     * @param {object} data component options
     */
    function _updateOptions(data) {
        var id = data.id;
        var value = data.value;

        if (id === 'direction') {
            this.layout.setOptions({dimensions: _resolveGridDimensions.call(this.buttons.length, this.options.direction)});
        }
        else if (id === 'buttons') {
            for (var i in this.buttons) {
                this.buttons[i].setOptions(value);
            }
        }
        else if (id === 'sections') {
            for (var sectionId in this.options.sections) {
                this.defineSection(sectionId, this.options.sections[sectionId]);
            }
        }
    }

    /**
     * Return an array of the proper dimensions for the tabs
     *
     * @method _resolveGridDimensions
     *
     * @param {number} count number of buttons
     * @param {number} direction direction of the layout
     *
     * @return {array} the dimensions of the tab section
     */
    function _resolveGridDimensions(count, direction) {
        if (direction === Utility.Direction.X) return [count, 1];
        else return [1, count];
    }

    /**
     * Create a new button with the specified id.  If one already exists with
     *  that id, unbind all listeners.
     *
     * @method defineSection
     *
     * @param {string} id name of the button
     * @param {object} content data for the creation of a new ToggleButton
     */
    TabBar.prototype.defineSection = function defineSection(id, content) {
        var button;
        var i = this._buttonIds[id];

        if (i === undefined) {
            i = this.buttons.length;
            this._buttonIds[id] = i;
            var widget = this.options.widget;
            button = new widget();
            this.buttons[i] = button;
            this.layout.setOptions({dimensions: _resolveGridDimensions(this.buttons.length, this.options.direction)});
        }
        else {
            button = this.buttons[i];
            button.unbind('select', this._buttonCallbacks[id]);
        }

        if (this.options.buttons) button.setOptions(this.options.buttons);
        button.setOptions(content);

        this._buttonCallbacks[id] = this.select.bind(this, id);
        button.on('select', this._buttonCallbacks[id]);
    };

    /**
     * Select a particular button and dispatch the id of the selection
     *  to any listeners.  Deselect all others
     *
     * @method select
     *
     * @param {string} id button id
     */
    TabBar.prototype.select = function select(id) {
        var btn = this._buttonIds[id];
        // this prevents event loop
        if (this.buttons[btn] && this.buttons[btn].isSelected()) {
            this._eventOutput.emit('select', {id: id});
        }
        else if (this.buttons[btn]) {
            this.buttons[btn].select();
        }

        for (var i = 0; i < this.buttons.length; i++) {
            if (i !== btn) this.buttons[i].deselect();
        }
    };

    module.exports = TabBar;
});
