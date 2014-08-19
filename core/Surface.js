/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var ElementOutput = require('./ElementOutput');

    /**
     * A base class for viewable content and event
     *   targets inside a Famo.us application, containing a renderable document
     *   fragment. Like an HTML div, it can accept internal markup,
     *   properties, classes, and handle events.
     *
     * @class Surface
     * @constructor
     *
     * @param {Object} [options] default option overrides
     * @param {Array.Number} [options.size] [width, height] in pixels
     * @param {Array.string} [options.classes] CSS classes to set on target div
     * @param {Array} [options.properties] string dictionary of HTML attributes to set on target div
     * @param {string} [options.content] inner (HTML) content of surface
     */
    function Surface(options) {
        ElementOutput.call(this);

        this.options = {};

        this.properties = {};
        this.attributes = {};
        this.content = '';
        this.classList = [];
        this.size = null;

        this._classesDirty = true;
        this._stylesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;

        this._dirtyClasses = [];

        if (options) this.setOptions(options);

        this._currentTarget = null;
    }
    Surface.prototype = Object.create(ElementOutput.prototype);
    Surface.prototype.constructor = Surface;
    Surface.prototype.elementType = 'div';
    Surface.prototype.elementClass = 'famous-surface';

    /**
     * Bind a callback function to an event type handled by this object.
     *
     * @method "on"
     *
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler callback
     * @return {EventHandler} this
     */
    Surface.prototype.on = function on(type, fn) {
        if (this._currTarget) this._currTarget.addEventListener(type, this.eventForwarder);
        this.eventHandler.on(type, fn);
    };

    /**
     * Unbind an event by type and handler.
     *   This undoes the work of "on"
     *
     * @method removeListener
     * @param {string} type event type key (for example, 'click')
     * @param {function(string, Object)} fn handler
     */
    Surface.prototype.removeListener = function removeListener(type, fn) {
        this.eventHandler.removeListener(type, fn);
    };

    /**
     * Trigger an event, sending to all downstream handlers
     *   listening for provided 'type' key.
     *
     * @method emit
     *
     * @param {string} type event type key (for example, 'click')
     * @param {Object} [event] event data
     * @return {EventHandler} this
     */
    Surface.prototype.emit = function emit(type, event) {
        if (event && !event.origin) event.origin = this;
        var handled = this.eventHandler.emit(type, event);
        if (handled && event && event.stopPropagation) event.stopPropagation();
        return handled;
    };

    /**
     * Add event handler object to set of downstream handlers.
     *
     * @method pipe
     *
     * @param {EventHandler} target event handler target object
     * @return {EventHandler} passed event handler
     */
    Surface.prototype.pipe = function pipe(target) {
        return this.eventHandler.pipe(target);
    };

    /**
     * Remove handler object from set of downstream handlers.
     *   Undoes work of "pipe"
     *
     * @method unpipe
     *
     * @param {EventHandler} target target handler object
     * @return {EventHandler} provided target
     */
    Surface.prototype.unpipe = function unpipe(target) {
        return this.eventHandler.unpipe(target);
    };

    /**
     * Return spec for this surface. Note that for a base surface, this is
     *    simply an id.
     *
     * @method render
     * @private
     * @return {Object} render spec for this surface (spec id)
     */
    Surface.prototype.render = function render() {
        return this.id;
    };

    /**
     * Set HTML attributes on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setAttributes
    * @param {Object} attributes property dictionary of "key" => "value"
     */
    Surface.prototype.setAttributes = function setAttributes(attributes) {
        for (var n in attributes) {
            this.attributes[n] = attributes[n];
        }
        this._attributesDirty = true;
    };

    /**
     * Get HTML attributes on this Surface.
     *
     * @method getAttributes
     *
     * @return {Object} Dictionary of this Surface's attributes.
     */
    Surface.prototype.getAttributes = function getAttributes() {
        return this.attributes;
    };

    /**
     * Set CSS-style properties on this Surface. Note that this will cause
     *    dirtying and thus re-rendering, even if values do not change.
     *
     * @method setProperties
     * @chainable
     * @param {Object} properties property dictionary of "key" => "value"
     */
    Surface.prototype.setProperties = function setProperties(properties) {
        for (var n in properties) {
            this.properties[n] = properties[n];
        }
        this._stylesDirty = true;
        return this;
    };

    /**
     * Get CSS-style properties on this Surface.
     *
     * @method getProperties
     *
     * @return {Object} Dictionary of this Surface's properties.
     */
    Surface.prototype.getProperties = function getProperties() {
        return this.properties;
    };

    /**
     * Add CSS-style class to the list of classes on this Surface. Note
     *   this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method addClass
     * @chainable
     * @param {string} className name of class to add
     */
    Surface.prototype.addClass = function addClass(className) {
        if (this.classList.indexOf(className) < 0) {
            this.classList.push(className);
            this._classesDirty = true;
        }
        return this;
    };

    /**
     * Remove CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method removeClass
     * @chainable
     * @param {string} className name of class to remove
     */
    Surface.prototype.removeClass = function removeClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this._dirtyClasses.push(this.classList.splice(i, 1)[0]);
            this._classesDirty = true;
        }
        return this;
    };

    /**
     * Toggle CSS-style class from the list of classes on this Surface.
     *   Note this will map directly to the HTML property of the actual
     *   corresponding rendered <div>.
     *
     * @method toggleClass
     * @param {string} className name of class to toggle
     */
    Surface.prototype.toggleClass = function toggleClass(className) {
        var i = this.classList.indexOf(className);
        if (i >= 0) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
        return this;
    };

    /**
     * Reset class list to provided dictionary.
     * @method setClasses
     * @chainable
     * @param {Array.string} classList
     */
    Surface.prototype.setClasses = function setClasses(classList) {
        var i = 0;
        var removal = [];
        for (i = 0; i < this.classList.length; i++) {
            if (classList.indexOf(this.classList[i]) < 0) removal.push(this.classList[i]);
        }
        for (i = 0; i < removal.length; i++) this.removeClass(removal[i]);
        // duplicates are already checked by addClass()
        for (i = 0; i < classList.length; i++) this.addClass(classList[i]);
        return this;
    };

    /**
     * Get array of CSS-style classes attached to this div.
     *
     * @method getClasslist
     * @return {Array.string} array of class names
     */
    Surface.prototype.getClassList = function getClassList() {
        return this.classList;
    };

    /**
     * Set or overwrite inner (HTML) content of this surface. Note that this
     *    causes a re-rendering if the content has changed.
     *
     * @method setContent
     * @chainable
     * @param {string|Document Fragment} content HTML content
     */
    Surface.prototype.setContent = function setContent(content) {
        if (this.content !== content) {
            this.content = content;
            this._contentDirty = true;
        }
        return this;
    };

    /**
     * Return inner (HTML) content of this surface.
     *
     * @method getContent
     *
     * @return {string} inner (HTML) content
     */
    Surface.prototype.getContent = function getContent() {
        return this.content;
    };

    /**
     * Set options for this surface
     *
     * @method setOptions
     * @chainable
     * @param {Object} [options] overrides for default options.  See constructor.
     */
    Surface.prototype.setOptions = function setOptions(options) {
        if (options.size) this.setSize(options.size);
        if (options.classes) this.setClasses(options.classes);
        if (options.properties) this.setProperties(options.properties);
        if (options.attributes) this.setAttributes(options.attributes);
        if (options.content) this.setContent(options.content);
        return this;
    };

    //  Apply to document all changes from removeClass() since last setup().
    function _cleanupClasses(target) {
        for (var i = 0; i < this._dirtyClasses.length; i++) target.classList.remove(this._dirtyClasses[i]);
        this._dirtyClasses = [];
    }

    // Apply values of all Famous-managed styles to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyStyles(target) {
        for (var n in this.properties) {
            target.style[n] = this.properties[n];
        }
    }

    // Clear all Famous-managed styles from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupStyles(target) {
        for (var n in this.properties) {
            target.style[n] = '';
        }
    }

    // Apply values of all Famous-managed attributes to the document element.
    //  These will be deployed to the document on call to #setup().
    function _applyAttributes(target) {
        for (var n in this.attributes) {
            target.setAttribute(n, this.attributes[n]);
        }
    }

    // Clear all Famous-managed attributes from the document element.
    // These will be deployed to the document on call to #setup().
    function _cleanupAttributes(target) {
        for (var n in this.attributes) {
            target.removeAttribute(n);
        }
    }

    /**
     * Return a Matrix's webkit css representation to be used with the
     *    CSS3 -webkit-transform style.
     *    Example: -webkit-transform: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
     *
     * @method _formatCSSTransform
     * @private
     * @param {FamousMatrix} m matrix
     * @return {string} matrix3d CSS style representation of the transform
     */
    function _formatCSSTransform(m) {
        m[12] = Math.round(m[12] * devicePixelRatio) / devicePixelRatio;
        m[13] = Math.round(m[13] * devicePixelRatio) / devicePixelRatio;

        var result = 'matrix3d(';
        for (var i = 0; i < 15; i++) {
            result += (m[i] < 0.000001 && m[i] > -0.000001) ? '0,' : m[i] + ',';
        }
        result += m[15] + ')';
        return result;
    }

    /**
     * Directly apply given FamousMatrix to the document element as the
     *   appropriate webkit CSS style.
     *
     * @method setMatrix
     *
     * @static
     * @private
     * @param {Element} element document element
     * @param {FamousMatrix} matrix
     */

    var _setMatrix;
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        _setMatrix = function(element, matrix) {
            element.style.zIndex = (matrix[14] * 1000000) | 0;    // fix for Firefox z-buffer issues
            element.style.transform = _formatCSSTransform(matrix);
        };
    }
    else if (usePrefix) {
        _setMatrix = function(element, matrix) {
            element.style.webkitTransform = _formatCSSTransform(matrix);
        };
    }
    else {
        _setMatrix = function(element, matrix) {
            element.style.transform = _formatCSSTransform(matrix);
        };
    }

    // format origin as CSS percentage string
    function _formatCSSOrigin(origin) {
        return (100 * origin[0]) + '% ' + (100 * origin[1]) + '%';
    }

     // Directly apply given origin coordinates to the document element as the
     // appropriate webkit CSS style.
    var _setOrigin = usePrefix ? function(element, origin) {
        element.style.webkitTransformOrigin = _formatCSSOrigin(origin);
    } : function(element, origin) {
        element.style.transformOrigin = _formatCSSOrigin(origin);
    };

     // Shrink given document element until it is effectively invisible.
    var _setInvisible = usePrefix ? function(element) {
        element.style.webkitTransform = 'scale3d(0.0001,0.0001,1)';
        element.style.opacity = 0;
    } : function(element) {
        element.style.transform = 'scale3d(0.0001,0.0001,1)';
        element.style.opacity = 0;
    };

    function _xyNotEquals(a, b) {
        return (a && b) ? (a[0] !== b[0] || a[1] !== b[1]) : a !== b;
    }

    /**
     * One-time setup for an element to be ready for commits to document.
     *
     * @private
     * @method setup
     *
     * @param {ElementAllocator} allocator document element pool for this context
     */
    Surface.prototype.setup = function setup(allocator) {
        var target = allocator.allocate(this.elementType);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (var i = 0; i < this.elementClass.length; i++) {
                    target.classList.add(this.elementClass[i]);
                }
            }
            else {
                target.classList.add(this.elementClass);
            }
        }
        target.style.display = '';
        this.attach(target);
        this._opacity = null;
        this._currentTarget = target;
        this._stylesDirty = true;
        this._classesDirty = true;
        this._attributesDirty = true;
        this._sizeDirty = true;
        this._contentDirty = true;
        this._originDirty = true;
        this._transformDirty = true;
    };

    /**
     * Apply changes from this component to the corresponding document element.
     * This includes changes to classes, styles, size, content, opacity, origin,
     * and matrix transforms.
     *
     * @private
     * @method commit
     * @param {Context} context commit context
     */
    Surface.prototype.commit = function commit(context) {
        if (!this._currentTarget) this.setup(context.allocator);
        var target = this._currentTarget;
        var size = context.size;

        if (this._classesDirty) {
            _cleanupClasses.call(this, target);
            var classList = this.getClassList();
            for (var i = 0; i < classList.length; i++) target.classList.add(classList[i]);
            this._classesDirty = false;
        }

        if (this._stylesDirty) {
            _applyStyles.call(this, target);
            this._stylesDirty = false;
        }

        if (this._attributesDirty) {
            _applyAttributes.call(this, target);
            this._attributesDirty = false;
        }

        if (this._contentDirty) {
            this.deploy(target);
            this.eventHandler.emit('deploy');
            this._contentDirty = false;
        }

        if (this.size) {
            var origSize = context.size;
            size = [this.size[0], this.size[1]];
            if (size[0] === undefined) size[0] = origSize[0];
            else if (size[0] === true) size[0] = target.clientWidth;
            if (size[1] === undefined) size[1] = origSize[1];
            else if (size[1] === true) size[1] = target.clientHeight;
        }

        if (_xyNotEquals(this._size, size)) {
            if (!this._size) this._size = [0, 0];
            this._size[0] = size[0];
            this._size[1] = size[1];
            this._sizeDirty = true;
        }

        if (this._sizeDirty) {
            if (this._size) {
                target.style.width = (this.size && this.size[0] === true) ? '' : this._size[0] + 'px';
                target.style.height = (this.size && this.size[1] === true) ?  '' : this._size[1] + 'px';
            }
            this._sizeDirty = false;
        }

        if (this._contentDirty) {
            this.deploy(target);
            this._eventOutput.emit('deploy');
            this._contentDirty = false;
        }

        ElementOutput.prototype.commit.call(this, context);
    };

    /**
     *  Remove all Famous-relevant attributes from a document element.
     *    This is called by SurfaceManager's detach().
     *    This is in some sense the reverse of .deploy().
     *
     * @private
     * @method cleanup
     * @param {ElementAllocator} allocator
     */
    Surface.prototype.cleanup = function cleanup(allocator) {
        var i = 0;
        var target = this._currentTarget;
        this._eventOutput.emit('recall');
        this.recall(target);
        target.style.display = 'none';
        target.style.opacity = '';
        target.style.width = '';
        target.style.height = '';
        this._size = null;
        _cleanupStyles.call(this, target);
        _cleanupAttributes.call(this, target);
        var classList = this.getClassList();
        _cleanupClasses.call(this, target);
        for (i = 0; i < classList.length; i++) target.classList.remove(classList[i]);
        if (this.elementClass) {
            if (this.elementClass instanceof Array) {
                for (i = 0; i < this.elementClass.length; i++) {
                    target.classList.remove(this.elementClass[i]);
                }
            }
            else {
                target.classList.remove(this.elementClass);
            }
        }
        this.detach(target);
        this._currentTarget = null;
        allocator.deallocate(target);
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    Surface.prototype.deploy = function deploy(target) {
        var content = this.getContent();
        if (content instanceof Node) {
            while (target.hasChildNodes()) target.removeChild(target.firstChild);
            target.appendChild(content);
        }
        else target.innerHTML = content;
    };

    /**
     * Remove any contained document content associated with this surface
     *   from the actual document.
     *
     * @private
     * @method recall
     */
    Surface.prototype.recall = function recall(target) {
        var df = document.createDocumentFragment();
        while (target.hasChildNodes()) df.appendChild(target.firstChild);
        this.setContent(df);
    };

    /**
     *  Get the x and y dimensions of the surface.
     *
     * @method getSize
     * @return {Array.Number} [x,y] size of surface
     */
    Surface.prototype.getSize = function getSize() {
        return this._size;
    };

    /**
     * Set x and y dimensions of the surface.
     *
     * @method setSize
     * @chainable
     * @param {Array.Number} size as [width, height]
     */
    Surface.prototype.setSize = function setSize(size) {
        this.size = size ? [size[0], size[1]] : null;
        this._sizeDirty = true;
        return this;
    };

    module.exports = Surface;
});
