/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {

    /**
     * A class to add and remove a chain of modifiers
     *   at a single point in the render tree
     *
     * @class ModifierChain
     * @constructor
     */
    function ModifierChain() {
        this._chain = [];
        if (arguments.length) this.addModifier.apply(this, arguments);
    }

    /**
     * Add a modifier, or comma separated modifiers, to the modifier chain.
     *
     * @method addModifier
     *
     * @param {...Modifier*} varargs args list of Modifiers
     */
    ModifierChain.prototype.addModifier = function addModifier(varargs) {
        Array.prototype.push.apply(this._chain, arguments);
    };

    /**
     * Remove a modifier from the modifier chain.
     *
     * @method removeModifier
     *
     * @param {Modifier} modifier
     */
    ModifierChain.prototype.removeModifier = function removeModifier(modifier) {
        var index = this._chain.indexOf(modifier);
        if (index < 0) return;
        this._chain.splice(index, 1);
    };

    /**
     * Return render spec for this Modifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} input (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this Modifier, including the
     *    provided target
     */
    ModifierChain.prototype.modify = function modify(input) {
        var chain  = this._chain;
        var result = input;
        for (var i = 0; i < chain.length; i++) {
            result = chain[i].modify(result);
        }
        return result;
    };

    module.exports = ModifierChain;
});
