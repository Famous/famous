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
    var CanvasSurface = require('famous/surfaces/CanvasSurface');
    var GenericSync = require('famous/inputs/GenericSync');
    var Transform = require('famous/core/Transform');
    var EventHandler = require('famous/core/EventHandler');

    /** @constructor */
    function Slider(options)
    {
        this.options = {
            size: [200, 60],
            indicatorSize: [200, 30],
            labelSize: [200, 30],
            range: [0, 1],
            precision: 2,
            defaultValue: 0,
            label: '',
            fillColor: 'rgba(170, 170, 170, 1)'
        };

        if (options) this.setOptions(options);
        this.value = this.options.defaultValue;

        this.indicator = new CanvasSurface({
            size: this.options.indicatorSize
        });
        this.indicator.addClass('slider-back');

        this.label = new Surface({
            size: this.options.labelSize,
            content: this.options.label,
            classes: ['slider-label']
        });
        this.label.setProperties({ 'pointer-events': 'none' });

        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        this.sync = new GenericSync(this.get.bind(this), {
            scale: (this.options.range[1] - this.options.range[0])/this.options.indicatorSize[0],
            direction: GenericSync.DIRECTION_X
        });

        this.eventInput.on('update', function(data) {
            this.set(data.p);
        }.bind(this));

        this.indicator.pipe(this.sync).pipe(this.eventInput);

        this._drawPos = 0;
        _updateLabel.call(this);
    }

    function _updateLabel() {
        this.label.setContent(this.options.label + '<span style="float: right">' + this.get().toFixed(this.options.precision) + '</span>');
    }

    Slider.prototype.getOptions = function getOptions() {
        return this.options;
    };

    Slider.prototype.setOptions = function setOptions(options) {
        if (options.size !== undefined) this.options.size = options.size;
        if (options.indicatorSize !== undefined) this.options.indicatorSize = options.indicatorSize;
        if (options.labelSize !== undefined) this.options.labelSize = options.labelSize;
        if (options.range !== undefined) this.options.range = options.range;
        if (options.precision !== undefined) this.options.precision = options.precision;
        if (options.defaultValue !== undefined) this.options.defaultValue = options.defaultValue;
        if (options.label !== undefined) this.options.label = options.label;
        if (options.fillColor !== undefined) this.options.fillColor = options.fillColor;
    };

    Slider.prototype.get = function get()
    {
        return this.value;
    };

    Slider.prototype.set = function set(val)
    {
        this.value = Math.min(Math.max(this.options.range[0], val), this.options.range[1]);
        _updateLabel.call(this);
        this.eventOutput.emit('change', {value: this.get(), range: this.options.range});
    };

    Slider.prototype.getSize = function getSize() {
        return this.options.size;
    };

    Slider.prototype.render = function render()
    {
        var range = this.options.range;
        var fillSize = Math.floor(((this.get() - range[0]) / (range[1] - range[0])) * this.options.indicatorSize[0]);
        if (fillSize < this._drawPos) {
            this.indicator.getContext('2d').clearRect(fillSize, 0, this._drawPos - fillSize + 1, this.options.indicatorSize[1]);
        }
        else if (fillSize > this._drawPos) {
            var ctx = this.indicator.getContext('2d');
            ctx.fillStyle = this.options.fillColor;
            ctx.fillRect(this._drawPos-1, 0, fillSize - this._drawPos+1, this.options.indicatorSize[1]);
        }
        this._drawPos = fillSize;

        return {
            size: this.options.size,
            target: [
                {
                    origin: [0.5, 0],
                    target: this.indicator.render()
                },
                {
                    transform: Transform.translate(0, 0, 1),
                    origin: [0.5, 1],
                    target: this.label.render()
                }
            ]
        };
    };

    module.exports = Slider;
});
