
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform = require('./Transform');

    /**
     *
     * This object translates the rendering instructions ("render specs")
     *   that renderable components generate into document update
     *   instructions ("update specs").  Private.
     *
     * @private
     * @class SpecParser
     * @constructor
     */
    function SpecParser() {
        this.result = {};
    }
    SpecParser._instance = new SpecParser();

    /**
     * Convert a render spec coming from the context's render chain to an
     *    update spec for the update chain. This is the only major entry point
     *    for a consumer of this class.
     *
     * @method parse
     * @static
     * @private
     *
     * @param {renderSpec} spec input render spec
     * @param {Object} context context to do the parse in
     * @return {Object} the resulting update spec (if no callback
     *   specified, else none)
     */
    SpecParser.parse = function parse(spec, context) {
        return SpecParser._instance.parse(spec, context);
    };

    /**
     * Convert a renderSpec coming from the context's render chain to an update
     *    spec for the update chain. This is the only major entrypoint for a
     *    consumer of this class.
     *
     * @method parse
     *
     * @private
     * @param {renderSpec} spec input render spec
     * @param {Context} context
     * @return {updateSpec} the resulting update spec
     */
    SpecParser.prototype.parse = function parse(spec, context) {
        this.reset();
        this._parseSpec(spec, context, Transform.identity);
        return this.result;
    };

    /**
     * Prepare SpecParser for re-use (or first use) by setting internal state
     *  to blank.
     *
     * @private
     * @method reset
     */
    SpecParser.prototype.reset = function reset() {
        this.result = {};
    };

    // Multiply matrix M by vector v
    function _vecInContext(v, m) {
        return [
            v[0] * m[0] + v[1] * m[4] + v[2] * m[8],
            v[0] * m[1] + v[1] * m[5] + v[2] * m[9],
            v[0] * m[2] + v[1] * m[6] + v[2] * m[10]
        ];
    }

    var _originZeroZero = [0, 0];

    // From the provided renderSpec tree, recursively compose opacities,
    //    origins, transforms, and sizes corresponding to each surface id from
    //    the provided renderSpec tree structure. On completion, those
    //    properties of 'this' object should be ready to use to build an
    //    updateSpec.
    SpecParser.prototype._parseSpec = function _parseSpec(spec, parentContext, sizeContext) {
        var id;
        var target;
        var transform;
        var opacity;
        var origin;
        var align;
        var size;

        if (typeof spec === 'number') {
            id = spec;
            transform = parentContext.transform;
            align = parentContext.align || parentContext.origin;
            if (parentContext.size && align && (align[0] || align[1])) {
                var alignAdjust = [align[0] * parentContext.size[0], align[1] * parentContext.size[1], 0];
                transform = Transform.thenMove(transform, _vecInContext(alignAdjust, sizeContext));
            }
            this.result[id] = {
                transform: transform,
                opacity: parentContext.opacity,
                origin: parentContext.origin || _originZeroZero,
                align: parentContext.align || parentContext.origin || _originZeroZero,
                size: parentContext.size
            };
        }
        else if (!spec) { // placed here so 0 will be cached earlier
            return;
        }
        else if (spec instanceof Array) {
            for (var i = 0; i < spec.length; i++) {
                this._parseSpec(spec[i], parentContext, sizeContext);
            }
        }
        else {
            target = spec.target;
            transform = parentContext.transform;
            opacity = parentContext.opacity;
            origin = parentContext.origin;
            align = parentContext.align;
            size = parentContext.size;
            var nextSizeContext = sizeContext;

            if (spec.opacity !== undefined) opacity = parentContext.opacity * spec.opacity;
            if (spec.transform) transform = Transform.multiply(parentContext.transform, spec.transform);
            if (spec.origin) {
                origin = spec.origin;
                nextSizeContext = parentContext.transform;
            }
            if (spec.align) align = spec.align;
            if (spec.size) {
                var parentSize = parentContext.size;
                size = [
                    spec.size[0] !== undefined ? spec.size[0] : parentSize[0],
                    spec.size[1] !== undefined ? spec.size[1] : parentSize[1]
                ];
                if (parentSize) {
                    if (!align) align = origin;
                    if (align && (align[0] || align[1])) transform = Transform.thenMove(transform, _vecInContext([align[0] * parentSize[0], align[1] * parentSize[1], 0], sizeContext));
                    if (origin && (origin[0] || origin[1])) transform = Transform.moveThen([-origin[0] * size[0], -origin[1] * size[1], 0], transform);
                }
                nextSizeContext = parentContext.transform;
                origin = null;
                align = null;
            }

            this._parseSpec(target, {
                transform: transform,
                opacity: opacity,
                origin: origin,
                align: align,
                size: size
            }, nextSizeContext);
        }
    };

    module.exports = SpecParser;
});
