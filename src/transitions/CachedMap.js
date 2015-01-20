/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    /**
     * A simple in-memory object cache.  Used as a helper for Views with
     * provider functions.
     * @class CachedMap
     * @constructor
     */
    function CachedMap(mappingFunction) {
        this._map = mappingFunction || null;
        this._cachedOutput = null;
        this._cachedInput = Number.NaN; //never valid as input
    }

    /**
     * Creates a mapping function with a cache.
     * This is the main entry point for this object.
     * @static
     * @method create
     * @param {function} mappingFunction mapping
     * @return {function} memorized mapping function
     */
    CachedMap.create = function create(mappingFunction) {
        var instance = new CachedMap(mappingFunction);
        return instance.get.bind(instance);
    };

    /**
     * Retrieve items from cache or from mapping function.
     *
     * @method get
     * @param {Object} input input key
     */
    CachedMap.prototype.get = function get(input) {
        if (input !== this._cachedInput) {
            this._cachedInput = input;
            this._cachedOutput = this._map(input);
        }
        return this._cachedOutput;
    };

    module.exports = CachedMap;
});
