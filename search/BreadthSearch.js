define(function(require, exports, module) {

  /**
   *  Abstract Breadth First Search for Famo.us the render tree. 
   *  If you pass a function, and it returns a truthy value, the search will stop.
   *  @param rootNode {RenderNode} node to start the search from
   *  @param fn {Function} Fn to call when a node is found.
   *  @returns {RenderNode|undefined} 
   *    If the fn returns a truthy value, the search stops, and the currentNode is returned
   *    If that case never occurs, undefined is returned.
   *
   *  @method BreadthSearch
   */
  function BreadthSearch (rootNode, fn) {
    var queue = [];
    var set = {};
    queue.push(rootNode);
    set[rootNode._id] = rootNode;

    function enqueueNode (node) {
        var currId = node._id;
        if (!set[currId]) { 
            queue.push(node);
            set[currId] = node;
        }
    }

    var currentNode;
    while (currentNode = queue.shift()) { 
        if (fn(currentNode)) { 
            return currentNode;
        }
        if (currentNode._hasMultipleChildren) {
            var children = currentNode._child;
            for (var i = 0; i < children.length; i++) {
                enqueueNode(children[i]);
            };
        }
        else if (currentNode._child) {
            enqueueNode(currentNode._child);
        }
        else if (currentNode._object && currentNode._object._node) {
            enqueueNode(currentNode._object._node);
        }
    }
    return undefined; // found nothing.
  }

  module.exports = BreadthSearch;
});
