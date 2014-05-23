/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: david@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var OptionsManager = require('famous/core/OptionsManager');
    var Transitionable = require('famous/transitions/Transitionable');
    var EventHandler = require('famous/core/EventHandler');
    
    var DrawerLayout = function DrawerLayout(options) {
        this.options = Object.create(DrawerLayout.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this.setOptions(options);

        this._position = new Transitionable(0);    
        this._direction = _getDirectionFromSide(this.options.side);
        this._orientation = _getOrientationFromSide(this.options.side);
        this._isOpen = false;

        this.drawer = new RenderNode();
        this.content = new RenderNode();

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('update', _handleUpdate.bind(this));
        this._eventInput.on('end', _handleEnd.bind(this));
    }

    var DIRECTION_X = 0;
    var DIRECTION_Y = 1;

    DrawerLayout.SIDES = {
        LEFT   : 0,
        TOP    : 1,
        RIGHT  : 2,
        BOTTOM : 3
    };

    DrawerLayout.DEFAULT_OPTIONS = {
        side: DrawerLayout.SIDES.LEFT,
        defaultDrawerLength : 0,        
        velocityThreshold : 0,
        positionThreshold : 0,
        transition : true
    };

    function _getDirectionFromSide(side) {
        var SIDES = DrawerLayout.SIDES;
        return (side === SIDES.LEFT || side === SIDES.RIGHT) ? DIRECTION_X : DIRECTION_Y;
    }

    function _getOrientationFromSide(side){
        var SIDES = DrawerLayout.SIDES;
        return (side === SIDES.LEFT || side === SIDES.TOP) ? 1 : -1;
    }

    function _resolveNodeSize(node) {
        var options = this.options;        
        var size;
        if (options.defaultDrawerLength) size = options.defaultDrawerLength;
        else {
            var nodeSize = node.getSize();
            size = nodeSize ? nodeSize[this._direction] : options.defaultDrawerLength;    
        }
        return this._orientation * size;        
    }

    function _handleUpdate(data){
        var newPosition = this.getPosition() + data.delta;        
        
        var MIN_LENGTH;
        var MAX_LENGTH;
        if (this._orientation === 1){
            MIN_LENGTH = 0;
            MAX_LENGTH = _resolveNodeSize.call(this, this.drawer);    
        }
        else {
            MIN_LENGTH = _resolveNodeSize.call(this, this.drawer);
            MAX_LENGTH = 0; 
        }            

        if (newPosition > MAX_LENGTH) newPosition = MAX_LENGTH;
        else if (newPosition < MIN_LENGTH) newPosition = MIN_LENGTH;

        this.setPosition(newPosition);
    }

    function _handleEnd(data){
        var velocity = data.velocity;
        var position = this._orientation * this.getPosition();
        var options = this.options;  

        var MAX_LENGTH = this._orientation * _resolveNodeSize.call(this, this.drawer);
        var positionThreshold = options.positionThreshold || MAX_LENGTH / 2;
        var velocityThreshold = options.velocityThreshold;

        if (options.transition instanceof Object)
            options.transition.velocity = data.velocity;

        if (position === 0 || position === MAX_LENGTH) return;

        var toggle = Math.abs(velocity) > velocityThreshold || (!this._isOpen && position > positionThreshold) || (this._isOpen && position < positionThreshold)
        toggle ? this.toggle() : this.reset();
    }

    /**
     * Patches the HeaderFooterLayout instance's options with the passed-in ones.
     *
     * @method setOptions
     * @param {Options} options An object of configurable options for the HeaderFooterLayout instance.
     */
    DrawerLayout.prototype.setOptions = function setOptions(options) {
        this._optionsManager.setOptions(options);
        if (options.side !== undefined) {
            this._direction = _getDirectionFromSide(options.side)
            this._orientation = _getOrientationFromSide(options.side);
        }
    };

    DrawerLayout.prototype.open = function(transition, callback){
        if (transition instanceof Function) callback = transition;
        if (transition === undefined) transition = this.options.transition;
        var MAX_LENGTH = _resolveNodeSize.call(this, this.drawer);
        this.setPosition(MAX_LENGTH, transition, callback);
        if (!this._isOpen) {
            this._isOpen = true;
            this._eventOutput.emit('open');
        }
    };

    DrawerLayout.prototype.close = function(transition, callback){
        if (transition instanceof Function) callback = transition;
        if (transition === undefined) transition = this.options.transition;
        this.setPosition(0, transition, callback);
        if (this._isOpen){
            this._isOpen = false;
            this._eventOutput.emit('close');
        }
    };

    DrawerLayout.prototype.setPosition = function(position, transition, callback){
        if (this._position.isActive()) this._position.halt();
        this._position.set(position, transition, callback);
    };

    DrawerLayout.prototype.getPosition = function(){
        return this._position.get();
    };

    DrawerLayout.prototype.toggle = function(transition){
        if (this._isOpen) this.close(transition)
        else this.open(transition);
    };

    DrawerLayout.prototype.reset = function(transition){
        if (this._isOpen) this.open(transition)
        else this.close(transition);
    };

    DrawerLayout.prototype.render = function render() {
        var position = this.getPosition();

        // clamp transition on close
        if (!this._isOpen && (position < 0 && this._orientation === 1) || (position > 0 && this._orientation === -1)) {
            position = 0;
            this.setPosition(position);
        }

        var contentTransform = (this._direction === DIRECTION_X)
            ? Transform.translate(position, 0, 0)
            : Transform.translate(0, position, 0);

        return [
            {
                transform : Transform.behind,
                target: this.drawer.render()
            },
            {
                transform: contentTransform,
                target: this.content.render()
            }
        ];
    };

    module.exports = DrawerLayout;
});
