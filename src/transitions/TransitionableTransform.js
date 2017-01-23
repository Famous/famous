/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function(require, exports, module) {
    var Transitionable = require('./Transitionable');
    var Transform = require('../core/Transform');
    var Utility = require('../utilities/Utility');

    /**
     * A class for transitioning the state of a Transform by transitioning the
     * X, Y, and Z axes of it's translate, scale, skew and rotate components
     * independently.
     *
     * @class TransitionableTransform
     * @constructor
     *
     * @param [transform=Transform.identity] {Transform} The initial transform state
     */
    function TransitionableTransform(transform) {
        this._final = Transform.identity.slice();

        this._finalTranslate = [0, 0, 0];
        this._finalRotate = [0, 0, 0];
        this._finalSkew = [0, 0, 0];
        this._finalScale = [1, 1, 1];

        this.translate = [];
        this.rotate    = [];
        this.skew      = [];
        this.scale     = [];

        for (var i=0; i<3; i+=1) {
            this.translate[i] = new Transitionable(this._finalTranslate[i]);
            this.rotate[i]    = new Transitionable(this._finalRotate[i]);
            this.skew[i]      = new Transitionable(this._finalSkew[i]);
            this.scale[i]     = new Transitionable(this._finalScale[i]);
        }

        if (transform) this.set(transform);
    }

    function _build() {
        return Transform.build({
            translate: [this.translate[0].get(), this.translate[1].get(), this.translate[2].get()],
            rotate:    [this.rotate[0].get(),    this.rotate[1].get(),    this.rotate[2].get()],
            skew:      [this.skew[0].get(),      this.skew[1].get(),      this.skew[2].get()],
            scale:     [this.scale[0].get(),     this.scale[1].get(),     this.scale[2].get()]
        });
    }

    function _buildFinal() {
        return Transform.build({
            translate: this._finalTranslate,
            rotate: this._finalRotate,
            skew: this._finalSkew,
            scale: this._finalScale
        });
    }

    function _countOfType(array, type) {
        var count = 0;
        for (var i=0; i<array.length; i+=1) {
            if (typeof array[i] === type+'') {
                count+=1;
            }
        }
        return count;
    }

    /**
     * An optimized way of setting only the translation component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setTranslate
     * @chainable
     *
     * @param translate {Array}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslate = function setTranslate(translate, transition, callback) {
        var numberOfAxes = _countOfType(translate, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<translate.length; i+=1) {
            if (typeof translate[i] === 'number') {
                this.translate[i].set(translate[i], transition, _callback);
                this._finalTranslate[i] = translate[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Translate only along the X axis of the translation component of a Transform.
     *
     * @method setTranslateX
     * @chainable
     *
     * @param translate {Number}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslateX = function setTranslateX(translate, transition, callback) {
        this.translate[0].set(translate, transition, callback);
        this._finalTranslate[0] = translate;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Translate only along the Y axis of the translation component of a Transform.
     *
     * @method setTranslateY
     * @chainable
     *
     * @param translate {Number}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslateY = function setTranslateY(translate, transition, callback) {
        this.translate[1].set(translate, transition, callback);
        this._finalTranslate[1] = translate;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Translate only along the Z axis of the translation component of a Transform.
     *
     * @method setTranslateZ
     * @chainable
     *
     * @param translate {Number}     New translation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setTranslateZ = function setTranslateZ(translate, transition, callback) {
        this.translate[2].set(translate, transition, callback);
        this._finalTranslate[2] = translate;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the scale component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setScale
     * @chainable
     *
     * @param scale {Array}         New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScale = function setScale(scale, transition, callback) {
        var numberOfAxes = _countOfType(scale, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<scale.length; i+=1) {
            if (typeof scale[i] === 'number') {
                this.scale[i].set(scale[i], transition, _callback);
                this._finalScale[i] = scale[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Scale only along the X axis of the scale component of a Transform.
     *
     * @method setScaleX
     * @chainable
     *
     * @param scale {Number}     New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScaleX = function setScaleX(scale, transition, callback) {
        this.scale[0].set(scale, transition, callback);
        this._finalScale[0] = scale;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Scale only along the Y axis of the scale component of a Transform.
     *
     * @method setScaleY
     * @chainable
     *
     * @param scale {Number}     New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScaleY = function setScaleY(scale, transition, callback) {
        this.scale[1].set(scale, transition, callback);
        this._finalScale[1] = scale;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Scale only along the Z axis of the scale component of a Transform.
     *
     * @method setScaleZ
     * @chainable
     *
     * @param scale {Number}     New scale state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setScaleZ = function setScaleZ(scale, transition, callback) {
        this.scale[2].set(scale, transition, callback);
        this._finalScale[2] = scale;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the rotational component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setRotate
     * @chainable
     *
     * @param eulerAngles {Array}   Euler angles for new rotation state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotate = function setRotate(eulerAngles, transition, callback) {
        var numberOfAxes = _countOfType(eulerAngles, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<eulerAngles.length; i+=1) {
            if (typeof eulerAngles[i] === 'number') {
                this.rotate[i].set(eulerAngles[i], transition, _callback);
                this._finalRotate[i] = eulerAngles[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Rotate only about the X axis of the rotational component of a Transform.
     *
     * @method setScaleX
     * @chainable
     *
     * @param eulerAngle {Number}     New rotational state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotateX = function setRotateX(eulerAngle, transition, callback) {
        this.rotate[0].set(eulerAngle, transition, callback);
        this._finalRotate[0] = eulerAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Rotate only about the Y axis of the rotational component of a Transform.
     *
     * @method setScaleY
     * @chainable
     *
     * @param eulerAngle {Number}     New rotational state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotateY = function setRotateY(eulerAngle, transition, callback) {
        this.rotate[1].set(eulerAngle, transition, callback);
        this._finalRotate[1] = eulerAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Rotate only about the Z axis of the rotational component of a Transform.
     *
     * @method setScaleZ
     * @chainable
     *
     * @param eulerAngle {Number}     New rotational state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setRotateZ = function setRotateZ(eulerAngle, transition, callback) {
        this.rotate[2].set(eulerAngle, transition, callback);
        this._finalRotate[2] = eulerAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * An optimized way of setting only the skew component of a Transform. Axes who's values are null will not be affected.
     *
     * @method setSkew
     * @chainable
     *
     * @param skewAngles {Array}    New skew state. Axes who's values are null will not be affected.
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkew = function setSkew(skewAngles, transition, callback) {
        var numberOfAxes = _countOfType(skewAngles, 'number');
        var _callback = callback ? Utility.after(numberOfAxes, callback) : null;
        for (var i=0; i<skewAngles.length; i+=1) {
            if (typeof skewAngles[i] === 'number') {
                this.skew[i].set(skewAngles[i], transition, _callback);
                this._finalSkew[i] = skewAngles[i];
            }
        }
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Skew only about the X axis of the skew component of a Transform.
     *
     * @method setSkewX
     * @chainable
     *
     * @param skewAngle {Number}     New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkewX = function setSkewX(skewAngle, transition, callback) {
        this.skew[0].set(skewAngle, transition, callback);
        this._finalSkew[0] = skewAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Skew only about the Y axis of the skew component of a Transform.
     *
     * @method setSkewY
     * @chainable
     *
     * @param skewAngle {Number}     New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkewY = function setSkewY(skewAngle, transition, callback) {
        this.skew[1].set(skewAngle, transition, callback);
        this._finalSkew[1] = skewAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Skew only about the Z axis of the skew component of a Transform.
     *
     * @method setSkewZ
     * @chainable
     *
     * @param skewAngle {Number}     New skew state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.setSkewZ = function setSkewZ(skewAngle, transition, callback) {
        this.skew[2].set(skewAngle, transition, callback);
        this._finalSkew[2] = skewAngle;
        this._final = _buildFinal.call(this);
        return this;
    };

    /**
     * Setter for a TransitionableTransform with optional parameters to transition
     * between Transforms. Animates all axes of all components.
     *
     * @method set
     * @chainable
     *
     * @param transform {Array}     New transform state
     * @param [transition] {Object} Transition definition
     * @param [callback] {Function} Callback
     * @return {TransitionableTransform}
     */
    TransitionableTransform.prototype.set = function set(transform, transition, callback) {
        var components = Transform.interpret(transform);

        this._finalTranslate = components.translate;
        this._finalRotate = components.rotate;
        this._finalSkew = components.skew;
        this._finalScale = components.scale;
        this._final = transform;

        var _callback = callback ? Utility.after(12, callback) : null;
        for (var i=0; i<3; i+=1) {
            this.translate[i].set(components.translate[i], transition, _callback);
            this.rotate[i].set(components.rotate[i], transition, _callback);
            this.skew[i].set(components.skew[i], transition, _callback);
            this.scale[i].set(components.scale[i], transition, _callback);
        }
        return this;
    };

    /**
     * Sets the default transition to use for transitioning betwen Transform states
     *
     * @method setDefaultTransition
     *
     * @param transition {Object} Transition definition
     */
    TransitionableTransform.prototype.setDefaultTransition = function setDefaultTransition(transition) {
        for (var i=0; i<3; i+=1) {
            this.translate[i].setDefault(transition);
            this.rotate[i].setDefault(transition);
            this.skew[i].setDefault(transition);
            this.scale[i].setDefault(transition);
        }
    };

    /**
     * Getter. Returns the current state of the Transform
     *
     * @method get
     *
     * @return {Transform}
     */
    TransitionableTransform.prototype.get = function get() {
        if (this.isActive()) {
            return _build.call(this);
        }
        else return this._final;
    };

    /**
     * Get the destination state of the Transform
     *
     * @method getFinal
     *
     * @return Transform {Transform}
     */
    TransitionableTransform.prototype.getFinal = function getFinal() {
        return this._final;
    };

    /**
     * Determine if the TransitionableTransform is currently transitioning
     *
     * @method isActive
     *
     * @return {Boolean}
     */
    TransitionableTransform.prototype.isActive = function isActive() {
        var isActive = false;

        for (var i=0; i<3; i+=1) {
            if (
                this.translate[i].isActive()
                || this.rotate[i].isActive()
                || this.skew[i].isActive()
                || this.scale[i].isActive()
            ) {
                isActive = true; break;
            }
        }
        return isActive;
    };

    /**
     * Halts the transition
     *
     * @method halt
     */
    TransitionableTransform.prototype.halt = function halt() {
        for (var i=0; i<3; i+=1) {
            this.translate[i].halt();
            this.rotate[i].halt();
            this.skew[i].halt();
            this.scale[i].halt();

            this._finalTranslate[i] = this.translate[i].get();
            this._finalRotate[i] = this.rotate[i].get();
            this._finalSkew[i] = this.skew[i].get();
            this._finalScale[i] = this.scale[i].get();
        }

        this._final = this.get();

        return this;
    };

    module.exports = TransitionableTransform;
});
