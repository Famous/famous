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
    var CanvasSurface = require('../surfaces/CanvasSurface');
    var Transform = require('../core/Transform');
    var EventHandler = require('../core/EventHandler');
    var Utilities = require('../math/Utilities');
    var OptionsManager = require('../core/OptionsManager');

    var MouseSync = require('../inputs/MouseSync');
    var TouchSync = require('../inputs/TouchSync');
    var GenericSync = require('../inputs/GenericSync');

    GenericSync.register({
        mouse : MouseSync,
        touch : TouchSync
    });

    /** @constructor */
    function Slider(options) {
        this.options = Object.create(Slider.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this.indicator = new CanvasSurface({
            size: this.options.indicatorSize,
            classes : ['slider-back']
        });

        this.label = new Surface({
            size: this.options.labelSize,
            content: this.options.label,
            properties : {pointerEvents : 'none'},
            classes: ['slider-label']
        });

        this.eventOutput = new EventHandler();
        this.eventInput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var scale = (this.options.range[1] - this.options.range[0]) / this.options.indicatorSize[0];

        this.sync = new GenericSync(
            ['mouse', 'touch'],
            {
                scale : scale,
                direction : GenericSync.DIRECTION_X
            }
        );

        this.indicator.pipe(this.sync);
        this.sync.pipe(this);

        this.eventInput.on('update', function(data) {
            this.set(data.position);
        }.bind(this));

        this._drawPos = 0;
        _updateLabel.call(this);
    }

    Slider.DEFAULT_OPTIONS = {
        size: [200, 60],
        indicatorSize: [200, 30],
        labelSize: [200, 30],
        range: [0, 1],
        precision: 2,
        value: 0,
        label: '',
        fillColor: 'rgba(170, 170, 170, 1)'
    };

    function _updateLabel() {
        this.label.setContent(this.options.label + '<span style="float: right">' + this.get().toFixed(this.options.precision) + '</span>');
    }

    Slider.prototype.setOptions = function setOptions(options) {
        return this.optionsManager.setOptions(options);
    };

    Slider.prototype.get = function get() {
        return this.options.value;
    };

    Slider.prototype.set = function set(value) {
        if (value === this.options.value) return;
        this.options.value = Utilities.clamp(value, this.options.range);
        _updateLabel.call(this);
        this.eventOutput.emit('change', {value: value});
    };

    Slider.prototype.getSize = function getSize() {
        return this.options.size;
    };

    Slider.prototype.render = function render() {
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
                    origin: [0, 0],
                    target: this.indicator.render()
                },
                {
                    transform: Transform.translate(0, 0, 1),
                    origin: [0, 0],
                    target: this.label.render()
                }
            ]
        };
    };

    module.exports = Slider;
});
