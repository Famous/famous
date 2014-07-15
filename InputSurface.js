/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');

    /**
     * A Famo.us surface in the form of an HTML input element.
     *   This extends the Surface class.
     *
     * @class InputSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an <input> element
     * @param {string} [options.type] specifies the type of element to display (e.g. 'datetime', 'text', 'button', etc.)
     * @param {string} [options.value] value of text
     */
    function InputSurface(options) {
        this._placeholder = options.placeholder || '';
        this._value       = options.value || '';
        this._type        = options.type || 'text';
        this._name        = options.name || '';

        Surface.apply(this, arguments);

        this.on('click', this.focus.bind(this));
        window.addEventListener('click', function(event) {
            if (event.target !== this._currTarget) this.blur();
        }.bind(this));
    }
    InputSurface.prototype = Object.create(Surface.prototype);
    InputSurface.prototype.constructor = InputSurface;

    InputSurface.prototype.elementType = 'input';
    InputSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set placeholder text.  Note: Triggers a repaint.
     *
     * @method setPlaceholder
     * @param {string} str Value to set the placeholder to.
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setPlaceholder = function setPlaceholder(str) {
        this._placeholder = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Focus on the current input, pulling up the keyboard on mobile.
     *
     * @method focus
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.focus = function focus() {
        if (this._currTarget) this._currTarget.focus();
        return this;
    };

    /**
     * Blur the current input, hiding the keyboard on mobile.
     *
     * @method blur
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.blur = function blur() {
        if (this._currTarget) this._currTarget.blur();
        return this;
    };

    /**
     * Set the placeholder conent.
     *   Note: Triggers a repaint next tick.
     *
     * @method setValue
     * @param {string} str Value to set the main input value to.
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setValue = function setValue(str) {
        this._value = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Set the type of element to display conent.
     *   Note: Triggers a repaint next tick.
     *
     * @method setType
     * @param {string} str type of the input surface (e.g. 'button', 'text')
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setType = function setType(str) {
        this._type = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the value of the inner content of the element (e.g. the entered text)
     *
     * @method getValue
     * @return {string} value of element
     */
    InputSurface.prototype.getValue = function getValue() {
        if (this._currTarget) {
            return this._currTarget.value;
        }
        else {
            return this._value;
        }
    };

    /**
     * Set the name attribute of the element.
     *   Note: Triggers a repaint next tick.
     *
     * @method setName
     * @param {string} str element name
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.setName = function setName(str) {
        this._name = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the name attribute of the element.
     *
     * @method getName
     * @return {string} name of element
     */
    InputSurface.prototype.getName = function getName() {
        return this._name;
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    InputSurface.prototype.deploy = function deploy(target) {
        if (this._placeholder !== '') target.placeholder = this._placeholder;
        target.value = this._value;
        target.type = this._type;
        target.name = this._name;
    };

    module.exports = InputSurface;
});
