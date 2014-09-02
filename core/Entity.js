/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    /**
     * A singleton that maintains a global registry of Surfaces.
     *   Private.
     *
     * @private
     * @static
     * @class Entity
     */

    var entities = [];

    /**
     * Get entity from global index.
     *
     * @private
     * @method get
     * @param {Number} id entity registration id
     * @return {Surface} entity in the global index
     */
    function get(id) {
        return entities[id];
    }

    /**
     * Overwrite entity in the global index
     *
     * @private
     * @method set
     * @param {Number} id entity registration id
     * @param {Surface} entity to add to the global index
     */
    function set(id, entity) {
        entities[id] = entity;
    }

    /**
     * Add entity to global index
     *
     * @private
     * @method register
     * @param {Surface} entity to add to global index
     * @return {Number} new id
     */
    function register(entity) {
        var id = entities.length;
        set(id, entity);
        return id;
    }

    /**
     * Remove entity from global index
     *
     * @private
     * @method unregister
     * @param {Number} id entity registration id
     */
    function unregister(id) {
        set(id, null);
    }

    module.exports = {
        register: register,
        unregister: unregister,
        get: get,
        set: set
    };
});
