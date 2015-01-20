/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */
define(function(require, exports, module) {

    var EventHandler = require('../core/EventHandler');

    /**
     * Combines multiple types of sync classes (e.g. mouse, touch,
     *  scrolling) into one standardized interface for inclusion in widgets.
     *
     *  Sync classes are first registered with a key, and then can be accessed
     *  globally by key.
     *
     *  Emits 'start', 'update' and 'end' events as a union of the sync class
     *  providers.
     *
     * @class GenericSync
     * @constructor
     * @param syncs {Object|Array} object with fields {sync key : sync options}
     *    or an array of registered sync keys
     * @param [options] {Object|Array} options object to set on all syncs
     */
    function GenericSync(syncs, options) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._syncs = {};
        if (syncs) this.addSync(syncs);
        if (options) this.setOptions(options);
    }

    GenericSync.DIRECTION_X = 0;
    GenericSync.DIRECTION_Y = 1;
    GenericSync.DIRECTION_Z = 2;

    // Global registry of sync classes. Append only.
    var registry = {};

    /**
     * Register a global sync class with an identifying key
     *
     * @static
     * @method register
     *
     * @param syncObject {Object} an object of {sync key : sync options} fields
     */
    GenericSync.register = function register(syncObject) {
        for (var key in syncObject){
            if (registry[key]){ // skip redundant registration
                if (registry[key] !== syncObject[key]) // only if same registered class
                    throw new Error('Conflicting sync classes for key: ' + key);
            }
            else registry[key] = syncObject[key];
        }
    };

    /**
     * Helper to set options on all sync instances
     *
     * @method setOptions
     * @param options {Object} options object
     */
    GenericSync.prototype.setOptions = function(options) {
        for (var key in this._syncs){
            this._syncs[key].setOptions(options);
        }
    };

    /**
     * Pipe events to a sync class
     *
     * @method pipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.pipeSync = function pipeToSync(key) {
        var sync = this._syncs[key];
        this._eventInput.pipe(sync);
        sync.pipe(this._eventOutput);
    };

    /**
     * Unpipe events from a sync class
     *
     * @method unpipeSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.unpipeSync = function unpipeFromSync(key) {
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync);
        sync.unpipe(this._eventOutput);
    };

    function _addSingleSync(key, options) {
        if (!registry[key]) return;
        this._syncs[key] = new (registry[key])(options);
        this.pipeSync(key);
    }

    /**
     * Add a sync class to from the registered classes
     *
     * @method addSync
     * @param syncs {Object|Array.String} an array of registered sync keys
     *    or an object with fields {sync key : sync options}
     */
    GenericSync.prototype.addSync = function addSync(syncs) {
        if (syncs instanceof Array)
            for (var i = 0; i < syncs.length; i++)
                _addSingleSync.call(this, syncs[i]);
        else if (syncs instanceof Object)
            for (var key in syncs)
                _addSingleSync.call(this, key, syncs[key]);
    };

    module.exports = GenericSync;
});
