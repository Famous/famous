define(function(require, exports, module) {
  var BreadthSearch = require('./BreadthSearch');

  /**
   *  Perform a breadth first search on a rootnode, stopping when the desired
   *  Modifier, Surface or RenderNode is found
   *
   *  @param rootNode {RenderNode} Root renderNode to search from
   *  @param objectToFind {Surface|Modifier|RenderNode} 
   *    Surface, modifier, or renderNode to find somewhere in the tree.
   *
   *  @method NodeBreadthSearch
   */
  function NodeBreadthSearch (rootNode, objectToFind) {
    function findNode (currentNode) {
        return currentNode == objectToFind ||
            currentNode._object == objectToFind ||
            currentNode._child == objectToFind // renderNode
    }
    return BreadthSearch(rootNode, findNode);
  }

  module.exports = NodeBreadthSearch;
});
