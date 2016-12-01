/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: someone@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

/* global console */

define(function(require, exports, module) {
   var Entity = require('../core/Entity');
   var EventHandler = require('../core/EventHandler');
   var OptionsManager = require('../core/OptionsManager');
   var RenderNode = require('../core/RenderNode');
   var Transform = require('../core/Transform');
   var GenericSync = require('../inputs/GenericSync');
   var MouseSync = require('../inputs/MouseSync');
   var TouchSync = require('../inputs/TouchSync');
   var PhysicsEngine = require('../physics/PhysicsEngine');
   var Particle = require('../physics/bodies/Particle');
   var Drag = require('../physics/forces/Drag');

   /**
    * OmniScrollview is an omni-directional container for scrolling components.
    *
    * TODO: Move scrolling to OmniScroller subcomponent, add multi-node processing
    *       and wrap-around like ViewSequence, honor edge effects, pass properties
    *       to subcomponents, and add pinch zoom.
    *
    * @class OmniScrollview
    * @constructor
    *
    * @param {Options} [options] An object of configurable options.
    * @param {Array} [options.size=[]] Size of scroller.  Honored by some components, such as BorderLayout
    * @param {number} [options.direction] The allowed direction to scroll or any direction if undefined. Can use Utility.Direction.
    * @param {Boolean} [options.rails] Scrolling locks to horizontal or vertical, whichever is more prevalent.
    * @param {Boolean} [options.debug=false] Debug flag to log scroll information to the console.
    * @param {Object} [options.properties] string dictionary of HTML attributes to set on target div.
    */
   function OmniScrollview(options) {
      this.options = Object.create(OmniScrollview.DEFAULT_OPTIONS);
      this._optionsManager = new OptionsManager(this.options);
      this.setOptions(options);

      this.regId = Entity.register(this);

      this.position = [0, 0];
      this.lastPosition = [-1, -1];
      this._node = new RenderNode();
      this._dirtySize = true;
      this._emit = true;

      this.setPhysics();
      this.setIOHandlers();
      this.bindEvents();
   }

   /**
    * Default options
    */
   OmniScrollview.DEFAULT_OPTIONS = {
      size: [undefined, undefined],
      margin: [0, 0, 0, 0],
      classes: ['omniScrollview'],
      properties: {overflow: 'hidden'},
      rails: false,
      debug: false
   };

   /**
    * Set the options
    *
    * @method setOptions
    * @param {Options} [options] An object of configurable options.
    */
   OmniScrollview.prototype.setOptions = function setOption(options) {
      this._optionsManager.setOptions(options);
      this.direction = this.options.direction;

      //these options are used by BorderLayout
      this.size = this.options.size;
      this.margin = this.options.margin;
      this.classes = this.options.classes;
      this.attributes = this.options.attributes;
      this.properties = this.options.properties;

      //convert margins to style for div
      if (options && options.margin) {
         var m = this.options.margin;
         if (options.margin.length === 1) {
            m[0]=m[1]=m[2]=m[3]=options.margin[0];
         }
         else if (options.margin.length === 2) {
            m[0]=m[2]=options.margin[0];
            m[1]=m[3]=options.margin[1];
         }
         else {
            m[0]=options.margin[0];
            m[1]=options.margin[1];
            m[2]=options.margin[2];
            m[3]=options.margin[3];
         }
         this.properties.margin = m[0]+'px '+m[1]+'px '+m[2]+'px '+m[3]+'px';
      }
   };

   /**
    * Set the physics engine and surface particle.
    *
    * @method setPhysics
    */
   OmniScrollview.prototype.setPhysics = function setPhysics() {
      this._physicsEngine = new PhysicsEngine();
      this._particle = new Particle();
      this._physicsEngine.addBody(this._particle);
      this.drag = new Drag({
         forceFunction: Drag.FORCE_FUNCTIONS.QUADRATIC,
         strength: 0.001
      });
      this.friction = new Drag({
         forceFunction: Drag.FORCE_FUNCTIONS.LINEAR,
         strength: 0.0001
      });
      this._physicsEngine.attach([this.drag, this.friction], this._particle);
   };

   /**
    * Set the input and output handlers
    *
    * @method setIOHandlers
    */
   OmniScrollview.prototype.setIOHandlers = function setIOHandlers() {
      GenericSync.register({touch: TouchSync, mouse: MouseSync});
      this.sync = new GenericSync(['touch', 'mouse'],{});

      this._eventInput = new EventHandler();
      this._eventOutput = new EventHandler();

      this._eventInput.pipe(this.sync);
      this.sync.pipe(this._eventInput);

      EventHandler.setInputHandler(this, this._eventInput);
      EventHandler.setOutputHandler(this, this._eventOutput);
   };

   /**
    * Link OmniScrollviews together
    *
    * @method
    * @param {Array} components Array of OmniScrollview objects to link together
    */
   OmniScrollview.link = function link(components) {
      for (var i=0; i < components.length; i++) {
         var source = components[i];
         for (var j=0; j < components.length; j++) {
            var target = components[j];
            if (i !== j) {
               source.on('onScroll', target.handleScroll.bind(target));
            }
         }
      }
   };

   /**
    * Bind all events
    *
    * @method bindEvents
    */
   OmniScrollview.prototype.bindEvents = function bindEvents() {
      this._eventInput.bindThis(this);
      this._eventInput.on('start', _handleStart);
      this._eventInput.on('update', _handleMove);
      this._eventInput.on('end', _handleEnd);
      this._eventInput.on('resize', function() {
         _resetSize.call(this, {size:[this.size]});
      }.bind(this));
      this.on('onEdge', function(data) {
         _handleEdge.call(this, data);
      }.bind(this));
   };

   /**
    * Handle an external scroll event.
    *
    * @method handleScroll
    * @param event Event from another OmniScrollview object
    */
   OmniScrollview.prototype.handleScroll = function handleScroll(event) {
      if (event.position) {
         //only set value if defined
         var pos = event.position;
         var x = pos.x === undefined ? this.position[0] : pos.x;
         var y = pos.y === undefined ? this.position[1] : pos.y;
         this.setPosition([x, y, 0]);

         //position was external, don't refire
         this._emit = false;
      }
      if (event.velocity) {
         //if available, it is 0
         this.setVelocity(event.velocity);
      }
   };

   /**
    * Handle the start event.  This resets velocity back to 0.
    *
    * @method _handleStart
    * @param event Start event from GenericSync
    */
   function _handleStart(event) {
      if (this.options.debug) {
         /* eslint no-console: 0 */
         console.log('START D:'+event.delta+'  P:'+event.position+'  V:'+event.velocity);
      }
      this.setVelocity([0, 0, 0]);
      this._eventOutput.emit('onScroll', {velocity: [0, 0, 0]});
   }

   /**
    * Handle the move to process the current position.  This keeps the position
    * from moving beyond the bounds.
    *
    * @method _handleMove
    * @param event Move event from GenericSync
    */
   function _handleMove(event) {
      var p = this.getPosition();
      var x = p[0];
      var y = p[1];

      var d = event.delta;
      var dx = d[0];
      var dy = d[1];

      //don't let position go out of bounds
      if (x === 0 && dx > 0) {
         dx = 0;   //stay on right edge
      }
      if (x <= this.bounds[0] && dx < 0) {
         dx = 0;   //stay on left edge
      }
      if (y === 0 && dy > 0) {
         dy = 0;   //stay on top edge
      }
      if (y <= this.bounds[1] && dy < 0) {
         dy = 0;   //stay on bottom edge
      }

      //lock to rails if set
      if (this.options.rails) {
         if (Math.abs(dx) > Math.abs(dy)) {
            dy = 0;
         }
         else {
            dx = 0;
         }
      }

      this._emit = true;
      this.setPosition([x+dx, y+dy, 0]);
      if (this.options.debug) {
         console.log('MOVE D:'+d+'  P:'+this.position+'  V:'+event.velocity);
      }
   }

   /**
    * Handle the end event to set the velocity.  If the delta is small, the finger
    * stopped so set the velocity to 0.
    *
    * @method _handleEnd
    * @param event End event from GenericSync
    */
   function _handleEnd(event) {
      var vx = event.velocity[0];
      var vy = event.velocity[1];
      var dx = event.delta[0];
      var dy = event.delta[1];
      this._emit = true;

      //Stop velocity for small delta.  Keeps from scrolling if finger stopped
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
         this.setVelocity([0, 0, 0]);
      }
      else {
         //lock to rails if set
         if (this.options.rails) {
            var ratio = (Math.abs(dy)+1) / (Math.abs(dx)+1);
            if (ratio > 1) {
               vx = 0;
            }
            else {
               vy = 0;
            }
         }
         this.setVelocity([vx, vy, 0]);
      }

      if (this.options.debug) {
         console.log('END  D: ['+dx+','+dy+']  P:'+event.position+'  V:['+vx+','+vy+']');
      }
   }

   /**
    * Handle an edge collision.  This keeps the position (and velocity) from moving
    * beyond the bounds.
    *
    * @method _handleStart
    * @param data Event from commit
    */
   function _handleEdge(data) {
      var p = this.position;     //don't use getPosition(), causes extra tick
      var x = p[0];
      var y = p[1];

      var v = this.getVelocity();
      var vx = v[0];
      var vy = v[1];

      //lock to 0 or bounds and clear velocity if we hit a boundary
      if (data.LEFT) {
         x = 0;
         vx = 0;
      }
      if (data.RIGHT) {
         x = this.bounds[0];
         vx = 0;
      }
      if (data.TOP) {
         y = 0;
         vy = 0;
      }
      if (data.BOTTOM) {
         y = this.bounds[1];
         vy = 0;
      }

      this.setPosition([x, y, 0]);
      this.setVelocity([vx, vy, 0]);
   }

   /**
    * Reset the size for this view.  This calculates the overlap of the surface node
    * and the container (context) to determine how much movement (bounds) is allowed.
    *
    * @private
    * @method _resetSize
    * @param {Context} context The context
    */
   function _resetSize(context) {
      //save current size to recognize rotation
      this.size[0] = context.size[0];
      this.size[1] = context.size[1];

      //The bounds are calculated from the overlap
      var nodeSize = this._node.getSize();

      var width = nodeSize[0] - context.size[0];
      var height = nodeSize[1] - context.size[1];
      if (this.options.rotate)
      {
         //swap width and height
         width = nodeSize[1] - context.size[0];
         height = nodeSize[0] - context.size[1];
      }

      width = width > 0 ? width : 0;
      height = height > 0 ? height : 0;

      //if direction set, lock down the bounds
      if (this.direction !== undefined) {
         if (this.direction === 0) {
            height = 0;
         }
         else {
            width = 0;
         }
      }
      this.bounds = [-width, -height];
      this._dirtySize = false;
      this._eventOutput.emit('resize', {size: this.size, bounds: this.bounds});
   }

   /**
    * Add a component to scroll.
    *
    * @method add
    * @param {Object} component A renderable object.
    */
   OmniScrollview.prototype.add = function add(component) {
      return this._node.add(component);
   };

   /**
    * Set the position of the main node
    *
    * @method setPosition
    * @param {Array} position The new position
    */
   OmniScrollview.prototype.setPosition = function setPosition(position) {
      this.position = position;    //track for quick access
      this._particle.setPosition(position);
   };

   /**
    * Returns the position of the main node
    *
    * @method getPosition
    */
   OmniScrollview.prototype.getPosition = function getPosition() {
      return this._particle.getPosition();
   };

   /**
    * Set the velocity of the main node
    *
    * @method setVelocity
    * @param {Array} v velocity The new velocity
    */
   OmniScrollview.prototype.setVelocity = function setVelocity(v) {
      this._particle.setVelocity(v);
   };

   /**
    * Returns the velocity of the main node
    *
    * @method getVelocity
    */
   OmniScrollview.prototype.getVelocity = function getVelocity() {
      return this._particle.getVelocity();
   };

   /**
    * Tests if two arrays are not equal
    *
    * @private
    * @method notEqual
    * @param {Array} array1 First array to test
    * @param {Array} array2 Second array to test
    * @return {Boolean} true if the arrays are not equal
    */
   OmniScrollview.prototype.notEqual = function notEqual(array1, array2) {
      return array1 && array2 ? (array1[0] !== array2[0] || array1[1] !== array2[1]) : array1 !== array2;
   };

   /**
    * Generate a render spec for this component.
    *
    * @method render
    * @return {Object} Render spec for this component
    */
   OmniScrollview.prototype.render = function render() {
      //tack position, may have been updated from physics engine
      this.position = this.getPosition();

      return this.regId;
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
   OmniScrollview.prototype.commit = function commit(context) {
      var size = context.size;
      var origin = context.origin;
      var opacity = context.opacity;
      var transform = context.transform;

      //screen orientation change or flagged dirty?
      var rotated = this.notEqual(context.size, this.size);
      if (rotated || this._dirtySize) {
         _resetSize.call(this, context);
      }

      //adjust origin
      if (size) {
         transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
      }

      //notify if we hit an edge of the bounds
      var x = this.position[0];
      var y = this.position[1];
      if ((x < this.bounds[0]) || (x > 0) || (y < this.bounds[1]) || (y > 0)) {
         //side we hit is true, others are false
         this._eventOutput.emit('onEdge', {
            LEFT:   x > 0,
            RIGHT:  x < this.bounds[0],
            TOP:    y > 0,
            BOTTOM: y < this.bounds[1]
         });
      }

      //broadcast onScroll event if position has changed by touch/mouse
      if (this._emit && this.notEqual(this.position, this.lastPosition)) {
         var position = {x: this.position[0], y: this.position[1]};
         if (this.direction === 0) {
            position.y = undefined;
         }
         if (this.direction === 1) {
            position.x = undefined;
         }
         this._eventOutput.emit('onScroll', {position: position});
      }
      this.lastPosition = this.position;

      //adjust main node
      var newPosition = Transform.translate(this.position[0], this.position[1]);
      var result = {
         transform: Transform.multiply(transform, newPosition),
         opacity: opacity,
         size: size,
         target: this._node.render()
      };

      return result;
   };

   module.exports = OmniScrollview;
});
