//!
//! @file               immutable-tree.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-23
//! @last-modified      2015-12-01
//! @brief              
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

//=========== npm MODULES ==========//
var immutable = require('immutable');

const nodeKeyParameterId = 'key';
const nodeNameParameterId = 'name';
const nodeChildrenParameterId = 'children';

//! @brief		Creates a root node. This must be called before
//!				any of the other functions in this module are used.
export function createRootNode() {
	console.log('createRootNode() called.');
	var rootNode = immutable.Map({
		//nodeNameParameterId: 'root',
		//nodeChildrenParameterId: immutable.List(),
	})

	// The key for the root node is always 0, this is easy!
	rootNode = rootNode.set(nodeKeyParameterId, immutable.List([0]));
	
	rootNode = rootNode.set(nodeNameParameterId, 'root');
	rootNode = rootNode.set(nodeChildrenParameterId, immutable.List());

	console.log('Create rootNode. rootNode.toJS() =');
	console.log(rootNode.toJS());
	return rootNode;
}

//! @brief		Searches for the nodeKey withing the given parentNode.
//! @returns	The first node that matches the key, or if no node is found, undefined.
export function getChildNode(parentNode, nodeKey) {
	console.log('getChildNode() called with parentNode.toJS() =');
	console.log(parentNode.toJS());
	console.log('and nodeKey = ' + nodeKey);

	var foundNode = parentNode.get(nodeChildrenParameterId).find((childNode) => {
		return childNode.get(nodeNameParameterId) == nodeKey;
	});

	console.log('foundNode = ' + foundNode);
	if(typeof(foundNode) == 'undefined') {
		console.log('Could not find node \"' + nodeKey + '\", so returning undefined.');
		return undefined;
	} else {
		console.log('Found node \"' + nodeKey + '\", so returning it.');
		return foundNode;
	}
}

//! @brief		Returns the index 
//! @returns	The first node that matches the key, or if no node is found, undefined.
export function getChildNodeIndex(parentNode, nodeKey) {
	console.log('getChildNodeIndex() called with parentNode.toJS() =');
	console.log(parentNode.toJS());
	console.log('and nodeKey = ' + nodeKey);

	var foundNodeIndex = parentNode.get(nodeChildrenParameterId).findIndex((childNode, index) => {
		return childNode.get(nodeNameParameterId) == nodeKey;
	});

	console.log('foundNodeIndex = ' + foundNodeIndex);
	if(foundNodeIndex == -1) {
		console.log('Could not find node \"' + nodeKey + '\", so returning undefined.');
		return undefined;
	} else {
		console.log('Found node \"' + nodeKey + '\", so returning it.');
		return foundNodeIndex;
	}
}

//! @brief		
//! @details	A new node will only be created if the key does not already exist.
//!				If it does exist, nothing will happen.
export function addChildNode(parentNode, newNodeKey) {
	console.log('addChildNode() called with existing parentNode.toJS() = ');
	console.log(parentNode.toJS());
	console.log('and newNodeKey = ' + newNodeKey);

	var foundNode = getChildNode(parentNode, newNodeKey);

	console.log('foundNode = ' + foundNode);
	if(typeof(foundNode) == 'undefined') {
		console.log('Could not find node \"' + newNodeKey + '\", so creating new node.');
		var length = parentNode.get(nodeChildrenParameterId).size;
		var newChildNode = immutable.Map({});

		// Create unique key, first get parent key
		var parentKey = parentNode.get(nodeKeyParameterId);
		// Unique key is the parent key (array), with an additional element
		// added at the end which is the index of this child
		var newChildKey = parentKey.push(length);
		newChildNode = newChildNode.set(nodeKeyParameterId, newChildKey);
		newChildNode = newChildNode.set(nodeNameParameterId, newNodeKey);
		newChildNode = newChildNode.set(nodeChildrenParameterId, immutable.List());
		
		parentNode = parentNode.setIn([nodeChildrenParameterId, length], newChildNode);
	} else {
		console.log('Found node \"' + newNodeKey + '\", so not creating new node.');
	}

	console.log('Modified parentNode = ');
	console.log(parentNode.toJS());

	return parentNode;
}

//! @brief		Adds an entire node path to the parent node
//!				(i.e. a child node, grandchild node, great-grandchild node, e.t.c)
export function addNodePath(parentNode, nodePath) {
	console.log('addNodePath() called with parentNode.toJS() = ');
	console.log(parentNode.toJS());
	console.log(' and nodePath.toJS() = ');
	console.log(nodePath.toJS());
	console.log('and nodePath.size = ' + nodePath.size);

	var newParentNode;
	if(nodePath.size != 0) {
		parentNode = addChildNode(parentNode, nodePath.get(0));
		var childNode = getChildNode(parentNode, nodePath.get(0));
		var childNodeIndex = getChildNodeIndex(parentNode, nodePath.get(0));
		nodePath = nodePath.shift();
		parentNode = parentNode.setIn([nodeChildrenParameterId, childNodeIndex], addNodePath(childNode, nodePath));
	}

	console.log('addNodePath() finished.');

	return parentNode;
}

/*export function createTextNodesTree(fromNode) {

	var textNodesTree = immutable.Map();

	textNodesTree = copyDataAndChildren(fromNode, textNodesTree);

	console.log('textNodesTree.toJS = ');
	console.log(textNodesTree.toJS());

	return textNodesTree;
	
}*/

/*
export function createNameChildrenTree(fromNode) {

	var textNodesTree = immutable.Map();

	textNodesTree = copyDataAndChildren(fromNode, textNodesTree);

	console.log('textNodesTree.toJS = ');
	console.log(textNodesTree.toJS());

	return textNodesTree;
	
}

function copyDataAndChildren(fromNode, toNode) {
	console.log('copyDataAndChildren() called with fromNode.toJS() =');
	console.log(fromNode.toJS());
	console.log('and toNode.toJS() = ');
	console.log(toNode.toJS());

	toNode = toNode.set('name', fromNode.get(nodeNameParameterId));
	toNode = toNode.set('children', immutable.List());

	for(var i = 0; i < fromNode.get(nodeChildrenParameterId).size; i++) {
		var childFromNode = fromNode.getIn([nodeChildrenParameterId, i]);
		var childToNode = copyDataAndChildren(childFromNode, immutable.Map());
		toNode = toNode.setIn(['children', i], childToNode);
	}

	return toNode;
}*/



