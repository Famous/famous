/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Scene = require('famous/core/Scene');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');

    /**
     * A view for display for displaying the title of the current page
     *  as well as icons for navigating backwards and opening
     *  further options
     *
     * @class NavigationBar
     * @extends View
     * @constructor
     *
     * @param {object} [options] overrides of deault options
     * @param {Array.number} [options.size=(undefined,0.5)] Size of the navigation bar and it's componenets.
     * @param {Array.string} [options.backClasses=(back)] CSS Classes attached to back of Navigation.
     * @param {String} [options.backContent=(&#x25c0;)] Content of the back button.
     * @param {Array.string} [options.classes=(navigation)] CSS Classes attached to the surfaces.
     * @param {String} [options.content] Content to pass into title bar.
     * @param {Array.string} [options.classes=(more)] CSS Classes attached to the More surface.
     * @param {String} [options.moreContent=(&#x271a;)] Content of the more button.
     */
    function NavigationBar(options) {
        View.apply(this, arguments);

        this.title = new Surface({
            classes: this.options.classes,
            content: this.options.content
        });

        this.back = new Surface({
            size: [this.options.size[1], this.options.size[1]],
            classes: this.options.classes,
            content: this.options.backContent
        });
        this.back.on('click', function() {
            this._eventOutput.emit('back', {});
        }.bind(this));

        this.more = new Surface({
            size: [this.options.size[1], this.options.size[1]],
            classes: this.options.classes,
            content: this.options.moreContent
        });
        this.more.on('click', function() {
            this._eventOutput.emit('more', {});
        }.bind(this));

        this.layout = new Scene({
            id: 'master',
            size: this.options.size,
            target: [
                {
                    transform: Transform.inFront,
                    origin: [0, 0.5],
                    target: this.back
                },
                {
                    origin: [0.5, 0.5],
                    target: this.title
                },
                {
                    transform: Transform.inFront,
                    origin: [1, 0.5],
                    target: this.more
                }
            ]
        });

        this._add(this.layout);

        this.optionsManager.on('change', function(event) {
            var key = event.id;
            var data = event.value;
            if (key === 'size') {
                this.layout.id['master'].setSize(data);
                this.title.setSize(data);
                this.back.setSize([data[1], data[1]]);
                this.more.setSize([data[1], data[1]]);
            }
            else if (key === 'backClasses') {
                this.back.setOptions({classes: this.options.classes.concat(this.options.backClasses)});
            }
            else if (key === 'backContent') {
                this.back.setContent(this.options.backContent);
            }
            else if (key === 'classes') {
                this.title.setOptions({classes: this.options.classes});
                this.back.setOptions({classes: this.options.classes.concat(this.options.backClasses)});
                this.more.setOptions({classes: this.options.classes.concat(this.options.moreClasses)});
            }
            else if (key === 'content') {
                this.setContent(this.options.content);
            }
            else if (key === 'moreClasses') {
                this.more.setOptions({classes: this.options.classes.concat(this.options.moreClasses)});
            }
            else if (key === 'moreContent') {
                this.more.setContent(this.options.content);
            }
        }.bind(this));
    }

    NavigationBar.prototype = Object.create(View.prototype);
    NavigationBar.prototype.constructor = NavigationBar;

    NavigationBar.DEFAULT_OPTIONS = {
        size: [undefined, 50],
        backClasses: ['back'],
        backContent: '&#x25c0;',
        classes: ['navigation'],
        content: '',
        moreClasses: ['more'],
        moreContent: '&#x271a;'
    };

    /**
     * Set the title of the NavigationBar
     *
     * @method setContent
     *
     * @param {object} content JSON object containing title information
     *
     * @return {undefined}
     */
    NavigationBar.prototype.setContent = function setContent(content) {
        return this.title.setContent(content);
    };

    module.exports = NavigationBar;
});
