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
   var OptionsManager = require('../core/OptionsManager');
   var RenderNode = require('../core/RenderNode');
   var Surface = require('../core/Surface');
   var Transform = require('../core/Transform');
   var ContainerSurface = require('../surfaces/ContainerSurface');

   /**
    * A layout that provides distinct regions (north, south, east, west, center, northeast,
    * southeast, northwest, and southwest) to place components.  BorderLayouts can be placed
    * within other BorderLayouts to create complex layouts.
    *
    * @class BorderLayout
    * @constructor
    *
    * @param {Options} [options] An object of configurable options.
    * @param {String} [options.id] An ID that is added to the classes for the layout. Allows styling per layout.
    * @param {Array} [options.size=[]] Size of layout. Ignored if placed in context or center in another BorderLayout.
    * @param {Boolean} [options.debug=false] Debug flag to log size and transform information to the console.
    * @param {Ratios} [options.ratios=[]] The proportions for the renderables to maintain
    */
   function BorderLayout(options) {
      this.options = Object.create(this.constructor.DEFAULT_OPTIONS || BorderLayout.DEFAULT_OPTIONS);
      this._optionsManager = new OptionsManager(this.options);
      this.setOptions(options);

      this.regId = Entity.register(this);
      this.layoutSize = [undefined, undefined];   //holds full layout size from context
      this.resolvedNodeSizes = null;               //resolved node sizes calculated on resize
      this.transforms = {};
      this.nodeCount = 0;
      this.originalNodeSizes = {};                 //original sizes to maintain undefined values

      this.nodes = {                               //contains RenderNode or null
         north: null,
         south: null,
         east: null,
         west: null,
         center: null,
         northWest: null,
         northEast: null,
         southWest: null,
         southEast: null
      };
   }

   //Statics for add
   BorderLayout.NORTH = 'north';
   BorderLayout.SOUTH = 'south';
   BorderLayout.EAST = 'east';
   BorderLayout.WEST = 'west';
   BorderLayout.CENTER = 'center';
   BorderLayout.NW = 'northWest';
   BorderLayout.NE = 'northEast';
   BorderLayout.SW = 'southWest';
   BorderLayout.SE = 'southEast';

   /**
    * Default options
    */
   BorderLayout.DEFAULT_OPTIONS = {
      classes: ['BorderLayout'],
      size: [undefined, undefined],
      autoContainer: false,
      debug: false
   };

   /**
    * Set the options
    *
    * @method setOptions
    * @param {Options} [options] An object of configurable options.
    */
   BorderLayout.prototype.setOptions = function setOption(options) {
      this._optionsManager.setOptions(options);
      this.size = this.options.size;
   };

   /**
    * Generate a render spec from the contents of this component.
    *
    * @method render
    * @return {Object} Render spec for this component
    */
   BorderLayout.prototype.render = function render() {
      return this.regId;
   };

   /**
    * Return the component at the given location.
    *
    * @method get
    * @param {String} location The location for the component (BorderLayout.NORTH, BorderLayout.CENTER, etc.)
    * @returns {Node} Returns the node or null if it doesn't exist.
    */
   BorderLayout.prototype.get = function get(location) {
      var component = null;
      if (location) {
         component = this.nodes[location];   //renderNode
         component = component.get();

         //if autoContainer was true, pull object from ContainerSurface
         if (component instanceof ContainerSurface)
         {
            component = component.context._node.get();
         }
      }

      return component;
   };

   /**
    * Remove a component at the given location from the layout.
    *
    * @method remove
    * @param {String} location The location for the component (BorderLayout.NORTH, BorderLayout.CENTER, etc.)
    * @returns {Node} Returns the node or null if it doesn't exist.
    */
   BorderLayout.prototype.remove = function remove(location) {
      var node = this.get(location);
      if (node) {
         this.nodes[location] = null;
         this.originalNodeSizes[location] = null;
         this._dirtySize = true;
      }

      return node;
   };

   /**
    * Add a component to the layout at the specified location.
    *
    * @method add
    * @param {Object} component A renderable object with a location, or a modifier without a location.
    * @param {String} location The location for the component (BorderLayout.NORTH, BorderLayout.CENTER, etc.)
    */
   BorderLayout.prototype.add = function add(component, location) {

      var node = null;
      if (location) {
         var firstNode;
         var lastNode;
         //get the first and last nodes (modifiers)
         if (this._chainedNodes) {
            firstNode = this._chainedNodes[0];
            for (var i=0; i<this._chainedNodes.length; i++) {
               var n = this._chainedNodes[i];
               if (lastNode) {
                  lastNode.add(n);  //add modifier to previous modifier
               }
               lastNode = n;
            }
         }

         //process the component
         node = _processComponent.call(this, component, location, firstNode, lastNode);

         this.nodes[location] = node;
         this.nodeCount++;
         this._dirtySize = true;
      }
      else {
         //add the modifier
         node = (component instanceof RenderNode) ? component : new RenderNode(component);
         if (!this._chainedNodes) {
            this._chainedNodes = [];
         }
         this._chainedNodes.push(node);

         //return a chain back to add() so location can be processed
         node = _chainNode.apply(this, [this]);
      }

      return node;
   };

   /**
    * Chain the node to return an add function.  This allows us to add modifiers
    * to the components.  An example would be:
    *
    *  myLayout.add(mod1).add(mod2).add(myComponent, BorderLayout.CENTER)
    *
    * @private
    * @method _chainNode
    * @param {Object} scope This BorderLayout
    */
   function _chainNode(scope) {
      var result = {
         add: function(component, location) {
            return scope.add(component, location);
         }
      };

      return result;
   }

   /**
    * Process the added component to see if it needs to be converted or wrapped.
    *
    * @param {Object} component The component added to the border layout
    * @param {String} location The location for the component (BorderLayout.NORTH, BorderLayout.CENTER, etc.)
    * @param {Object} rootNode The first RenderNode (optional)
    * @param {Object} lastNode The last RenderNode (optional)
    */
   function _processComponent(component, location, rootNode, lastNode) {

      //save for proper sizing
      var margin = component.margin || [];

      if (this.options.autoContainer && !(component instanceof ContainerSurface || component instanceof BorderLayout)) {

         //wrap Surface and OmniScrollview in a ContainerSurface for clipping
         var container = new ContainerSurface({
            size: component.size,
            margin: component.margin,
            classes: component.classes,
            attributes: component.attributes,
            properties: component.properties
         });

         //add modifiers after container
         if (rootNode) {
            rootNode.add(component);
            component = rootNode;     //set rootNode as the renderable object
            lastNode = null;         //clear flag
         }

         container.add(component);    //add the component to the container
         component = container;       //set container as the renderable object
      }

      //if overflow not defined, set to hidden
      var props = component.properties || {};
      if (props.overflow === undefined) {
         props.overflow = 'hidden';
      }

      //set classes
      if (component.addClass) {
         if (this.options.id) {
            component.addClass(this.options.id);
         }
         component.addClass('borderLayout');
         _setLocationClass(component, location);
      }

      //save the size before undefined is changed to the final value
      var size = component.size;
      if (size) {
         this.originalNodeSizes[location] = [size[0], size[1], margin];
         if (margin && margin.length > 0) {
            //adjust the size on the original component to include margins
            this.setMargin(component.size, margin);
         }
      }

      //wrap in a RenderNode if not one
      var node = (component instanceof RenderNode) ? component : new RenderNode(component);

      if (lastNode) {
         lastNode.add(component);
         node = lastNode;
      }

      return node;
   }

   /**
    * Returns the classes used for the given location.
    *
    * @param {Object} component The component
    * @param {String} location The location for the component (BorderLayout.NORTH, BorderLayout.CENTER, etc.)
    */
   function _setLocationClass(component, location) {
      var tmp = location;

      //if not north, south, or center
      if (location.length > 6) {
         tmp = location.toLowerCase();
         component.addClass(tmp.slice(0, 5));
         component.addClass(tmp.slice(5));
         component.addClass('corner');
      }
      else {
         component.addClass(tmp);
         if (location !== BorderLayout.CENTER) {
            component.addClass('side');
         }
      }
      return tmp;
   }

   /**
    * Reset the size for all components.  This happens on startup, resize, orientation
    * change, or when a component is added or removed.
    *
    * @private
    * @method _resetSize
    * @param {Context} context The context
    */
   function _resetSize(context) {
      //save current size to recognize rotation
      this.layoutSize[0] = context.size[0];
      this.layoutSize[1] = context.size[1];

      //resolve the node sizes. Sets null nodes to a size of [0,0]
      this.resolvedNodeSizes = _initResolvedNodeSizes.call(this);

      //fill out resolvedNodesSizes with true sizes based on context
      this.resolvedNodeSizes = _adjustComponents.call(this, this.resolvedNodeSizes);

      //make sure something was added
      if (this.nodeCount === 0) {
         this.add(new Surface({size: [undefined, undefined], content: 'BorderLayout<br>No components added'}), BorderLayout.CENTER);
      }
      else {
         this._dirtySize = false;
      }

      //log size and transform info is debug is on
      if (this.options.debug) {
         _debug.call(this);
      }
   }

   /**
    * Initialize the array that will contain the resolved node sizes.  Missing
    * nodes are set to [0,0].
    *
    * @private
    * @method _initResolvedNodeSizes
    * @returns {object} Object with initialized arrays of node sizes.
    */
   function _initResolvedNodeSizes() {
      var retVal = {};

      //loop through each component.  If null, use 0 width and height.
      var keys = Object.keys(this.nodes);
      for (var i=0; i<keys.length; i++) {
         var id = keys[i];
         var originalNodeSize = this.originalNodeSizes[id];

         if (originalNodeSize) {
            retVal[id] = [originalNodeSize[0], originalNodeSize[1], originalNodeSize[2]];
         }
         else {
            retVal[id] = [0, 0, []];          //if no size array, create one of 0,0 with empty margins array
         }
      }
      return retVal;
   }

   /**
    * Adjusts the size for components that have undefined values.  Local variables
    * are created for readability.
    *
    * @private
    * @method _adjustComponents
    * @param {Object} sizes Object containing array of sizes for each component
    * @returns {Object} Object containing array of final sizes for each component
    */
   function _adjustComponents(sizes) {

      //get full size of layout
      var fullWidth = this.layoutSize[0];
      var fullHeight = this.layoutSize[1];

      //set north & south heights
      var northH = sizes.north[1] || 0;
      var southH = sizes.south[1] || 0;

      //set east & west widths
      var eastW = sizes.east[0] || 0;
      var westW = sizes.west[0] || 0;

      //adjust corners if original node was defined but had no size
      //new array is [width || defaultW, height || defaultH];
      if (this.nodes.northWest) {
         sizes.northWest = [sizes.northWest[0] || westW, sizes.northWest[1] || northH];
      }
      if (this.nodes.northEast) {
         sizes.northEast = [sizes.northEast[0] || eastW, sizes.northEast[1] || northH];
      }
      if (this.nodes.southWest) {
         sizes.southWest = [sizes.southWest[0] || westW, sizes.southWest[1] || southH];
      }
      if (this.nodes.southEast) {
         sizes.southEast = [sizes.southEast[0] || eastW, sizes.southEast[1] || southH];
      }

      //set center to the left over space
      var centerW = fullWidth - westW - eastW;
      var centerH = fullHeight - northH - southH;

      //set corners
      var northWestW = sizes.northWest[0] || 0;
      var northWestH = sizes.northWest[1] || 0;

      var northEastW = sizes.northEast[0] || 0;
      var northEastH = sizes.northEast[1] || 0;

      var southWestW = sizes.southWest[0] || 0;
      var southWestH = sizes.southWest[1] || 0;

      var southEastW = sizes.southEast[0] || 0;
      var southEastH = sizes.southEast[1] || 0;

      //set north & south widths
      var northW = sizes.north[0] || (fullWidth - northWestW - northEastW);
      var southW = sizes.south[0] || (fullWidth - southWestW - southEastW);

      //set east & west heights
      var eastH = sizes.east[1] || (fullHeight - (northEastH || northH) - (southEastH || southH));
      var westH = sizes.west[1] || (fullHeight - (northWestH || northH) - (southWestH || southH));

      //save true sizes getComponentSize()
      sizes.center[0] = centerW;
      sizes.center[1] = centerH;
      sizes.north[0] = northW;
      sizes.north[1] = northH;
      sizes.south[0] = southW;
      sizes.south[1] = southH;
      sizes.east[0] = eastW;
      sizes.east[1] = eastH;
      sizes.west[0] = westW;
      sizes.west[1] = westH;
      sizes.northWest[0] = northWestW;
      sizes.northWest[1] = northWestH;
      sizes.northEast[0] = northEastW;
      sizes.northEast[1] = northEastH;
      sizes.southWest[0] = southWestW;
      sizes.southWest[1] = southWestH;
      sizes.southEast[0] = southEastW;
      sizes.southEast[1] = southEastH;

      //adjust sizes for margins
      this.processMargins(sizes);

      //translate components without margins!
      this.transforms.center = Transform.translate(westW, northH, -1);    //place lower than corners
      this.transforms.north = Transform.translate(northWestW, 0, 0);
      this.transforms.south = Transform.translate(southWestW, fullHeight - southH, 0);
      this.transforms.west = Transform.translate(0, northWestH || northH, 0);
      this.transforms.east = Transform.translate(fullWidth - eastW, northEastH || northH, 0);
      this.transforms.northWest = Transform.translate(0, 0 ,0);
      this.transforms.northEast = Transform.translate(fullWidth - northEastW, 0, 0);
      this.transforms.southWest = Transform.translate(0, fullHeight - southWestH, 0);
      this.transforms.southEast = Transform.translate(fullWidth - southEastW, fullHeight - southEastH, 0);

      return sizes;
   }

   /**
    * Process the margins for each component after the true size is found.
    *
    * @param {Object} sizes Object containing array of sizes for each component.
    */
   BorderLayout.prototype.processMargins = function processMargins(sizes) {
      for (var i in sizes) {
         var size = sizes[i];
         this.setMargin(size, size[2]);
      }
   };

   /**
    * Adjust the size array with the margin if it exists.
    *
    * @param {Array} size Array containing the size for a component.
    * @param {Array} margin Array containing the margin for a component.
    */
   BorderLayout.prototype.setMargin = function setMargin(size, margin) {
      if (size && margin && margin.length > 1) {
         if (size[0] !== undefined) {
               size[0] -= margin[1] + margin[3];
         }
         if (size[1] !== undefined) {
            size[1] -= margin[0] + margin[2];
         }
      }
   };

   /**
    * Returns the current size and transform information for the specified component
    * with all undefined values resolved.
    *
    * @method getComponentInfo
    * @param {String} location The location for the component (BorderLayout.NORTH, BorderLayout.CENTER, etc.)
    * @return {Object} Object containing the size and transform for the component.
    */
   BorderLayout.prototype.getComponentInfo = function getComponentInfo(location) {
      return {size: this.resolvedNodeSizes[location], location: this.transforms[location]};
   };

   /**
    * Tests if two size arrays are equal.
    *
    * @private
    * @method _isSizeEqual
    * @param {Array} sizeA First array to test
    * @param {Array} sizeB Second array to test
    * @return {Boolean} true if the arrays are equal
    */
   function _isSizeEqual(sizeA, sizeB) {
      return sizeA && sizeB ? (sizeA[0] === sizeB[0] && sizeA[1] === sizeB[1]) : sizeA === sizeB;
   }

   /**
    * Log all component sizes and transforms.
    *
    * @private
    * @method _debug
    */
   function _debug() {
      var keys = Object.keys(this.nodes);
      var id = this.options.id ? this.options.id+'.' : '';

      /* eslint no-console: 0 */
      for (var i=0; i< keys.length; i++) {
         var key = keys[i];            //id of the component (north, south, center, etc)
         if (this.nodes[key]) {
            var info = this.getComponentInfo(key);
            console.log(id+key + ': '+info.size + '  '+info.location);
         }
      }
   }

   /**
    * Render each node in the layout.  This returns an array of each node, it's size,
    * and the transform that positions the node.  This lays out all components in the
    * border layout.
    *
    * @private
    * @param {Object} nodes The object containing the nodes for this border layout.
    */
   function _renderNodes(nodes) {
      var keys = Object.keys(this.nodes);
      var result =[];
      for (var i=0; i< keys.length; i++) {
         var id = keys[i];            //id of the component (north, south, center, etc)
         var node = this.nodes[id];   //RenderNode

         //process it only if the node exists
         if (node) {
            result.push({
               target: node.render(),
               size: this.resolvedNodeSizes[id],
               transform: this.transforms[id]
            });
         }
      }

      return result;
   }

   /**
    * Apply changes from this component to the corresponding document element.
    * This includes changes to classes, styles, size, content, opacity, origin,
    * and matrix transforms.
    *
    * @private
    * @method commit
    * @param {Context} context commit context
    */
   BorderLayout.prototype.commit = function commit(context) {
      var size = context.size;
      var origin = context.origin;
      var opacity = context.opacity;
      var transform = context.transform;

      //screen orientation change or flagged dirty?
      var rotated = !_isSizeEqual.call(this, context.size, this.layoutSize);
      if (rotated || this._dirtySize) {
         _resetSize.call(this, context);
      }

      //adjust origin
      if (size) {
         transform = Transform.moveThen([-size[0]*origin[0], -size[1]*origin[1], 0], transform);
      }

      //adjust nodes
      var result = {
         transform: transform,
         opacity: opacity,
         size: size,
         target: _renderNodes.call(this)
      };

      return result;
   };

   module.exports = BorderLayout;
});
