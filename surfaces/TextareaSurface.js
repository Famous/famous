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
     * A Famo.us surface in the form of an HTML textarea element.
     *   This extends the Surface class.
     *
     * @class TextareaSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an <textarea> element
     * @param {string} [options.value] value of text
     * @param {string} [options.name] specifies the name of textarea
     * @param {string} [options.wrap] specify 'hard' or 'soft' wrap for textarea
     * @param {number} [options.cols] number of columns in textarea
     * @param {number} [options.rows] number of rows in textarea
     */
    function TextareaSurface(options) {
        this._placeholder = options.placeholder || '';
        this._value       = options.value || '';
        this._name        = options.name || '';
        this._wrap        = options.wrap || '';
        this._cols        = options.cols || '';
        this._rows        = options.rows || '';

        Surface.apply(this, arguments);
        this.on('click', this.focus.bind(this));
    }
    TextareaSurface.prototype = Object.create(Surface.prototype);
    TextareaSurface.prototype.constructor = TextareaSurface;

    TextareaSurface.prototype.elementType = 'textarea';
    TextareaSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set placeholder text.  Note: Triggers a repaint.
     *
     * @method setPlaceholder
     * @param {string} str Value to set the placeholder to.
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setPlaceholder = function setPlaceholder(str) {
        this._placeholder = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Focus on the current input, pulling up the keyboard on mobile.
     *
     * @method focus
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.focus = function focus() {
        if (this._currTarget) this._currTarget.focus();
        return this;
    };

    /**
     * Blur the current input, hiding the keyboard on mobile.
     *
     * @method focus
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.blur = function blur() {
        if (this._currTarget) this._currTarget.blur();
        return this;
    };

    /**
     * Set the value of textarea.
     *   Note: Triggers a repaint next tick.
     *
     * @method setValue
     * @param {string} str Value to set the main textarea value to.
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setValue = function setValue(str) {
        this._value = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Get the value of the inner content of the textarea (e.g. the entered text)
     *
     * @method getValue
     * @return {string} value of element
     */
    TextareaSurface.prototype.getValue = function getValue() {
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
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setName = function setName(str) {
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
    TextareaSurface.prototype.getName = function getName() {
        return this._name;
    };

    /**
     * Set the wrap of textarea.
     *   Note: Triggers a repaint next tick.
     *
     * @method setWrap
     * @param {string} str wrap of the textarea surface (e.g. 'soft', 'hard')
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setWrap = function setWrap(str) {
        this._wrap = str;
        this._contentDirty = true;
        return this;
    };

    /**
     * Set the number of columns visible in the textarea.
     *   Note: Overridden by surface size; set width to true. (eg. size: [true, *])
     *         Triggers a repaint next tick.
     *
     * @method setColumns
     * @param {number} num columns in textarea surface
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setColumns = function setColumns(num) {
        this._cols = num;
        this._contentDirty = true;
        return this;
    };

    /**
     * Set the number of rows visible in the textarea.
     *   Note: Overridden by surface size; set height to true. (eg. size: [*, true])
     *         Triggers a repaint next tick.
     *
     * @method setRows
     * @param {number} num rows in textarea surface
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.setRows = function setRows(num) {
        this._rows = num;
        this._contentDirty = true;
        return this;
    };

    /**
     * Place the document element this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    TextareaSurface.prototype.deploy = function deploy(target) {
        if (this._placeholder !== '') target.placeholder = this._placeholder;
        if (this._value !== '') target.value = this._value;
        if (this._name !== '') target.name = this._name;
        if (this._wrap !== '') target.wrap = this._wrap;
        if (this._cols !== '') target.cols = this._cols;
        if (this._rows !== '') target.rows = this._rows;
    };

    module.exports = TextareaSurface;
});
