/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Transform = require('./Transform');
    var Modifier = require('./Modifier');
    var RenderNode = require('./RenderNode');

    /**
     * Builds and renders a scene graph based on a declarative structure definition.
     * See the Scene examples in the examples distribution (http://github.com/Famous/examples.git).
     *
     * @class Scene
     * @constructor
     * @param {Object|Array|Spec} definition in the format of a render spec.
     */
    function Scene(definition) {
        this.id = null;
        this._objects = null;

        this.node = new RenderNode();
        this._definition = null;

        if (definition) this.load(definition);
    }

    var _MATRIX_GENERATORS = {
        'translate': Transform.translate,
        'rotate': Transform.rotate,
        'rotateX': Transform.rotateX,
        'rotateY': Transform.rotateY,
        'rotateZ': Transform.rotateZ,
        'rotateAxis': Transform.rotateAxis,
        'scale': Transform.scale,
        'skew': Transform.skew,
        'matrix3d': function() {
            return arguments;
        }
    };

    /**
     * Clone this scene
     *
     * @method create
     * @return {Scene} deep copy of this scene
     */
    Scene.prototype.create = function create() {
        return new Scene(this._definition);
    };

    function _resolveTransformMatrix(matrixDefinition) {
        for (var type in _MATRIX_GENERATORS) {
            if (type in matrixDefinition) {
                var args = matrixDefinition[type];
                if (!(args instanceof Array)) args = [args];
                return _MATRIX_GENERATORS[type].apply(this, args);
            }
        }
    }

    // parse transform into tree of render nodes, doing matrix multiplication
    // when available
    function _parseTransform(definition) {
        var transformDefinition = definition.transform;
        var opacity = definition.opacity;
        var origin = definition.origin;
        var align = definition.align;
        var size = definition.size;
        var transform = Transform.identity;
        if (transformDefinition instanceof Array) {
            if (transformDefinition.length === 16 && typeof transformDefinition[0] === 'number') {
                transform = transformDefinition;
            }
            else {
                for (var i = 0; i < transformDefinition.length; i++) {
                    transform = Transform.multiply(transform, _resolveTransformMatrix(transformDefinition[i]));
                }
            }
        }
        else if (transformDefinition instanceof Function) {
            transform = transformDefinition;
        }
        else if (transformDefinition instanceof Object) {
            transform = _resolveTransformMatrix(transformDefinition);
        }

        var result = new Modifier({
            transform: transform,
            opacity: opacity,
            origin: origin,
            align: align,
            size: size
        });
        return result;
    }

    function _parseArray(definition) {
        var result = new RenderNode();
        for (var i = 0; i < definition.length; i++) {
            var obj = _parse.call(this, definition[i]);
            if (obj) result.add(obj);
        }
        return result;
    }

    // parse object directly into tree of RenderNodes
    function _parse(definition) {
        var result;
        var id;
        if (definition instanceof Array) {
            result = _parseArray.call(this, definition);
        }
        else {
            id = this._objects.length;
            if (definition.render && (definition.render instanceof Function)) {
                result = definition;
            }
            else if (definition.target) {
                var targetObj = _parse.call(this, definition.target);
                var obj = _parseTransform.call(this, definition);

                result = new RenderNode(obj);
                result.add(targetObj);
                if (definition.id) this.id[definition.id] = obj;
            }
            else if (definition.id) {
                result = new RenderNode();
                this.id[definition.id] = result;
            }
        }
        this._objects[id] = result;
        return result;
    }

    /**
     * Builds and renders a scene graph based on a canonical declarative scene definition.
     * See examples/Scene/example.js.
     *
     * @method load
     * @param {Object} definition definition in the format of a render spec.
     */
    Scene.prototype.load = function load(definition) {
        this._definition = definition;
        this.id = {};
        this._objects = [];
        this.node.set(_parse.call(this, definition));
    };

    /**
     * Add renderables to this component's render tree
     *
     * @method add
     *
     * @param {Object} obj renderable object
     * @return {RenderNode} Render wrapping provided object, if not already a RenderNode
     */
    Scene.prototype.add = function add() {
        return this.node.add.apply(this.node, arguments);
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scene.prototype.render = function render() {
        return this.node.render.apply(this.node, arguments);
    };

    module.exports = Scene;
});
