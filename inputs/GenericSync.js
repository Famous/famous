/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var TouchSync = require('./TouchSync');
    var ScrollSync = require('./ScrollSync');

    var defaultClasses = [TouchSync, ScrollSync];

    /**
     * Combines multiple types of event handling (e.g. touch, trackpad
     *     scrolling) into one standardized interface for inclusion in
     *     widgets. TouchSync and ScrollSync are enabled by default.
     *     Emits 'start', 'update', and 'end' events as a union
     *     of the input sync providers.
     * @class GenericSync
     * @constructor
     * @param {function} legacyGetter position getter function object (Deprecated)
     * @param {Object} [options] default options overrides, passed to all sync classes
     * @param {Array.Object} [options.syncClasses] array of classes in inputs/ which
     *   will feed input to GenericSync.
     */
    function GenericSync(legacyGetter, options) {
        if (arguments.length === 2){
            this._legacyPositionGetter = legacyGetter;
        }
        else {
            this._legacyPositionGetter = null;
            options = legacyGetter;
        }

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this._handlers = undefined;

        if (options) {
            this.options = options;
            if (!options.syncClasses) this.options.syncClasses = defaultClasses;
            this.setOptions(options);
        }
        else this.options = {syncClasses : defaultClasses};

        if (this._handlers) _updateHandlers.call(this);
    }

    /**
     * Add another sync type to the sources for this class
     *
     * @static
     * @method register
     *
     * @param {Object} syncClass class to add to GenericSync's inputs.
     */
    GenericSync.register = function register(syncClass) {
        if (defaultClasses.indexOf(syncClass) < 0) defaultClasses.push(syncClass);
    };

    GenericSync.DIRECTION_X = 0;
    GenericSync.DIRECTION_Y = 1;
    GenericSync.DIRECTION_Z = 2;

    function _updateHandlers() {
        var SyncClass = null;
        var i = 0;
        if (this._handlers) {
            for (i = 0; i < this._handlers.length; i++) {
                this.eventInput.unpipe(this._handlers[i]);
                this._handlers[i].unpipe(this.eventOutput);
            }
        }
        this._handlers = [];

        for (i = 0; i < this.options.syncClasses.length; i++) {
            SyncClass = this.options.syncClasses[i];
            this._handlers[i] = new SyncClass(this._legacyPositionGetter, this._handlerOptions);
            this.eventInput.pipe(this._handlers[i]);
            this._handlers[i].pipe(this.eventOutput);
        }
    }

    /**
     * Set internal options, overriding any default options.
     *   Note that these options will be passed to every class added
     *   to 'syncClasses'
     * @method setOptions
     *
     * @param {Object} [options] overrides of default options
     * @param {Array.Object} [options.syncClasses] array of classes in inputs/ which
     *   will feed input to GenericSync.
     */
    GenericSync.prototype.setOptions = function setOptions(options) {
        this._handlerOptions = options;
        if (options.syncClasses) {
            this.options.syncClasses = options.syncClasses;
            _updateHandlers.call(this);
        }
        if (this._handlers) {
            for (var i = 0; i < this._handlers.length; i++) {
                this._handlers[i].setOptions(this._handlerOptions);
            }
        }
    };

    module.exports = GenericSync;
});
