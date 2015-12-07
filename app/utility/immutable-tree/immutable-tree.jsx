//!
//! @file               immutable-tree.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-23
//! @last-modified      2015-12-06
//! @brief  			Contains helper functions for working with the category tree.            
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

//=========== npm MODULES ==========//
var immutable = require('immutable');

const nodeKeyParameterId = 'key';
const nodeNameParameterId = 'name';
const nodeChildrenParameterId = 'children';

// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


//! @brief		Creates a root node. This must be called before
//!				any of the other functions in this module are used.
export function createRootNode() {
	//console.log('createRootNode() called.');
	var rootNode = immutable.Map({
		//nodeNameParameterId: 'root',
		//nodeChildrenParameterId: immutable.List(),
	})

	// The key for the root node is always 0, this is easy!
	rootNode = rootNode.set(nodeKeyParameterId, immutable.List(['root']));
	
	rootNode = rootNode.set(nodeNameParameterId, 'root');
	rootNode = rootNode.set(nodeChildrenParameterId, immutable.List());

	//console.log('Create rootNode. rootNode.toJS() =');
	//console.log(rootNode.toJS());
	return rootNode;
}

//! @brief		Searches for the nodeKey withing the given parentNode.
//! @returns	The first node that matches the key, or if no node is found, undefined.
export function getChildNode(parentNode, nodeKey) {
	//console.log('getChildNode() called with parentNode.toJS() =');
	//console.log(parentNode.toJS());
	//console.log('and nodeKey = ' + nodeKey);

	var foundNode = parentNode.get(nodeChildrenParameterId).find((childNode) => {
		return childNode.get(nodeNameParameterId) == nodeKey;
	});

	//console.log('foundNode = ' + foundNode);
	if(typeof(foundNode) == 'undefined') {
		//console.log('Could not find node \"' + nodeKey + '\", so returning undefined.');
		return undefined;
	} else {
		//console.log('Found node \"' + nodeKey + '\", so returning it.');
		return foundNode;
	}
}

//! @brief		Returns the index 
//! @returns	The first node that matches the key, or if no node is found, undefined.
export function getChildNodeIndex(parentNode, nodeKey) {
	//console.log('getChildNodeIndex() called with parentNode.toJS() =');
	//console.log(parentNode.toJS());
	//console.log('and nodeKey = ' + nodeKey);

	var foundNodeIndex = parentNode.get(nodeChildrenParameterId).findIndex((childNode, index) => {
		return childNode.get(nodeNameParameterId) == nodeKey;
	});

	//console.log('foundNodeIndex = ' + foundNodeIndex);
	if(foundNodeIndex == -1) {
		//console.log('Could not find node \"' + nodeKey + '\", so returning undefined.');
		return undefined;
	} else {
		//console.log('Found node \"' + nodeKey + '\", so returning it.');
		return foundNodeIndex;
	}
}

//! @brief		
//! @details	A new node will only be created if the key does not already exist.
//!				If it does exist, nothing will happen.
//! @param      parentNode 		The parent node that the new child node will be added to.
//! @param 		newNodeName 	The name of the new node.  
export function addChildNode(parentNode, newNodeName) {
	//console.log('addChildNode() called with existing parentNode.toJS() = ');
	//console.log(parentNode.toJS());
	//console.log('and newNodeName = ' + newNodeName);

	var foundNode = getChildNode(parentNode, newNodeName);

	//console.log('foundNode = ' + foundNode);
	if(typeof(foundNode) == 'undefined') {
		//console.log('Could not find node \"' + newNodeName + '\", so creating new node.');
		var length = parentNode.get(nodeChildrenParameterId).size;
		var newChildNode = immutable.Map({});

		// Create unique key, first get parent key
		var parentKey = parentNode.get(nodeKeyParameterId);
		// Unique key is the parent key (array), with an additional element
		// added at the end which is the string name of this new node.
		var newChildKey = parentKey.push(newNodeName);
		newChildNode = newChildNode.set(nodeKeyParameterId, newChildKey);
		newChildNode = newChildNode.set(nodeNameParameterId, newNodeName);
		newChildNode = newChildNode.set(nodeChildrenParameterId, immutable.List());
		
		parentNode = parentNode.setIn([nodeChildrenParameterId, length], newChildNode);
	} else {
		// Requested new node already exists
		//console.log('Found node \"' + newNodeName + '\", so not creating new node.');
	}

	//console.log('Modified parentNode = ');
	//console.log(parentNode.toJS());

	return parentNode;
}

//! @brief		Adds an entire node path to the parent node
//!				(i.e. a child node, grandchild node, great-grandchild node, e.t.c)
export function addNodePath(parentNode, nodePath) {
	//console.log('addNodePath() called with parentNode.toJS() = ');
	//console.log(parentNode.toJS());
	//console.log(' and nodePath.toJS() = ');
	//console.log(nodePath.toJS());
	//console.log('and nodePath.size = ' + nodePath.size);

	var newParentNode;
	if(nodePath.size != 0) {
		parentNode = addChildNode(parentNode, nodePath.get(0));
		var childNode = getChildNode(parentNode, nodePath.get(0));
		var childNodeIndex = getChildNodeIndex(parentNode, nodePath.get(0));
		nodePath = nodePath.shift();
		parentNode = parentNode.setIn([nodeChildrenParameterId, childNodeIndex], addNodePath(childNode, nodePath));
	}

	//console.log('addNodePath() finished.');

	return parentNode;
}

//! @brief		Call to set a param in the node specified by key to the specified state within the tree structure
//!				defined by startNode.
export function setParam(startNode, key, param, state) {
	//console.log('immutableTree.setParam() called with startNode =')
	//console.log(startNode);
	//console.log('and key =');
	//console.log(key);
	//console.log('and param = ' + param);
	//console.log(' and state = ' + state);

	// We need to find the node, from the given key
	var foundNode = findNode(startNode, key);
	//console.log('foundNode = ');
	//console.log(foundNode);

	// Check to make sure a node was found
	if(typeof(foundNode) == 'undefined') {
		throw 'Could not find node with key ' + key + 'in startNode';
	}

	// Now that we have the right node, let's modify the parameter, 
	// setting it to the state provided
	foundNode[param] = state;
	
}

//! @brief		Finds a node based on the given key within a startNode (i.e. recursively looking at
//!				the startNode and all it's ancestors).
//! @param 		startNode	The node you want to begin the recursive search from.
//! @param 		key 		The unique key of the node you wish to find.
//! @returns 	The node that has the given key. If no node is found, returns undefined. 
function findNode(startNode, key) {
	//console.log('findNode() called with startNode = ');
	//console.log(startNode);
	//console.log('and key =');
	//console.log(key);

	if(startNode.key.equals(key)) {
		//console.log('Found node!');
		return startNode;
	}

	for(var x = 0; x < startNode.children.length; x++) {
		//console.log('startNode.children[x] = ');
		//console.log(startNode.children[x]);
		var foundNode = findNode(startNode.children[x], key);
		if(typeof(foundNode) != 'undefined') {
			//console.log('findNode() did not return undefined, when childNode =');
			//console.log(startNode.children[x]);
			return foundNode;
		}
	}

	//console.log('returning undefined.');
	return undefined;

}


