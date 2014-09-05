define(function(require, exports, module) {
  var BreadthSearch = require('./BreadthSearch');
  var Entity = require('famous/core/Entity');

  /**
   *  From a single point on the tree, unregister all nested surfaces from Entity
   *  @param rootNode {RenderNode} Parent node to start the search from
   *  @method EntityCleaner
   */
  function EntityCleaner (rootNode, allocator) {
    function findNode (currentNode) {
      if (currentNode._object && 
          currentNode._object.id !== undefined && 
          Entity.get(currentNode._object.id) == currentNode._object) { 

            if (allocator && currentNode._object.cleanup) { 
                currentNode._object.cleanup(allocator)
            }
            Entity.unregister(currentNode._object.id);
      }
    };
    return BreadthSearch(rootNode, findNode);
  }

  module.exports = EntityCleaner;
});
