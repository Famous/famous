
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('../core/Surface');

    /**
     * A surface containing image content.
     *   This extends the Surface class.
     *
     * @class ImageSurface
     *
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     */
    function ImageSurface(options) {
        this._imageUrl = undefined;
        Surface.apply(this, arguments);
    }

    var urlCache = [];
    var countCache = [];
    var nodeCache = [];
    var cacheEnabled = true;

    ImageSurface.enableCache = function enableCache() {
        cacheEnabled = true;
    };

    ImageSurface.disableCache = function disableCache() {
        cacheEnabled = false;
    };

    ImageSurface.clearCache = function clearCache() {
        urlCache = [];
        countCache = [];
        nodeCache = [];
    };

    ImageSurface.getCache = function getCache() {
        return {
            urlCache: urlCache,
            countCache: countCache,
            nodeCache: countCache
        };
    };

    ImageSurface.prototype = Object.create(Surface.prototype);
    ImageSurface.prototype.constructor = ImageSurface;
    ImageSurface.prototype.elementType = 'img';
    ImageSurface.prototype.elementClass = 'famous-surface';

    /**
     * Set content URL.  This will cause a re-rendering.
     * @method setContent
     * @param {string} imageUrl
     */
    ImageSurface.prototype.setContent = function setContent(imageUrl) {
        var urlIndex = urlCache.indexOf(this._imageUrl);
        if (urlIndex !== -1) {
            if (countCache[urlIndex] === 1) {
                urlCache.splice(urlIndex, 1);
                countCache.splice(urlIndex, 1);
                nodeCache.splice(urlIndex, 1);
            } else {
                countCache[urlIndex]--;
            }
        }

        urlIndex = urlCache.indexOf(imageUrl);
        if (urlIndex === -1) {
            urlCache.push(imageUrl);
            countCache.push(1);
        }
        else {
            countCache[urlIndex]++;
        }

        this._imageUrl = imageUrl;
        this._contentDirty = true;
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * @private
     * @method deploy
     * @param {Node} target document parent of this container
     */
    ImageSurface.prototype.deploy = function deploy(target) {
        var urlIndex = urlCache.indexOf(this._imageUrl);
        if (nodeCache[urlIndex] === undefined && cacheEnabled) {
            var img = new Image();
            img.src = this._imageUrl || '';
            nodeCache[urlIndex] = img;
        }

        target.src = this._imageUrl || '';
    };

    /**
     * Remove this component and contained content from the document
     *
     * @private
     * @method recall
     *
     * @param {Node} target node to which the component was deployed
     */
    ImageSurface.prototype.recall = function recall(target) {
        target.src = '';
    };

    module.exports = ImageSurface;
});
