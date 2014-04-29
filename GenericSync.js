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
     * @param keys {String|Array.String}        identifier from sync class
     * @param [options] {Object|Array.Object}   options for sync class
     */
    function GenericSync(syncs) {
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._syncs = {};
        if (syncs) this.addSync(syncs);
    }

    GenericSync.DIRECTION_X = 0;
    GenericSync.DIRECTION_Y = 1;

    // Global registry of sync classes. Append only.
    var registry = {};

    /**
     * Register a global sync class with an identifying key
     *
     * @static
     * @method register
     *
     * @param key {String}  identifier for sync class
     * @param sync {Sync}   sync class
     */
    GenericSync.register = function register(syncObject) {
        for (var key in syncObject){
            if (registry[key]){
                if (registry[key] === syncObject[key]) return; // redundant registration
                else throw new Error('this key is registered to a different sync class');
            }
            else registry[key] = syncObject[key];
        }
    };

    /**
     * Pipe events to a sync class
     *
     * @method pipeToSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.pipeToSync = function pipeToSync(key){
        var sync = this._syncs[key];
        this._eventInput.pipe(sync);
        sync.pipe(this._eventOutput);
    };

    /**
     * Unpipe events from a sync class
     *
     * @method pipeToSync
     * @param key {String} identifier for sync class
     */
    GenericSync.prototype.unpipeFromSync = function unpipeFromSync(key){
        var sync = this._syncs[key];
        this._eventInput.unpipe(sync);
        sync.unpipe(this._eventOutput);
    };

    function _addSingleSync(key, options){
        if (!registry[key]) return;
        this._syncs[key] = new registry[key](options);
        this.pipeToSync(key);
    }

    /**
     * Add a sync class to from the registered classes
     *
     * @method addSync
     * @param keys {String|Array.String}        identifier for sync class
     * @param [options] {Object|Array.Object}   options for sync class
     */
    GenericSync.prototype.addSync = function addSync(syncs){
        if (syncs instanceof Array)
            for (var i = 0; i < syncs.length; i++)
                _addSingleSync.call(this, syncs[i]);
        else if (syncs instanceof Object)
            for (var key in syncs)
                _addSingleSync.call(this, key, syncs[key]);
    };

    module.exports = GenericSync;
});
