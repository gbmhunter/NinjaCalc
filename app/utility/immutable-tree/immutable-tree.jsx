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

const nodeKeyName = 'name';
const nodeChildrenName = 'children';

//! @brief		Creates a root node. This must be called before
//!				any of the other functions in this module are used.
export function createRootNode() {
	console.log('createRootNode() called.');
	var rootNode = immutable.Map({
		//nodeKeyName: 'root',
		//nodeChildrenName: immutable.List(),
	})

	rootNode = rootNode.set(nodeKeyName, 'root');
	rootNode = rootNode.set(nodeChildrenName, immutable.List());

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

	var foundNode = parentNode.get(nodeChildrenName).find((childNode) => {
		return childNode.get(nodeKeyName) == nodeKey;
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

	var foundNodeIndex = parentNode.get(nodeChildrenName).findIndex((childNode, index) => {
		return childNode.get(nodeKeyName) == nodeKey;
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
		var length = parentNode.get(nodeChildrenName).size;
		var newChildNode = immutable.Map({});
		newChildNode = newChildNode.set(nodeKeyName, newNodeKey);
		newChildNode = newChildNode.set(nodeChildrenName, immutable.List());
		parentNode = parentNode.setIn([nodeChildrenName, length], newChildNode);
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
		parentNode = parentNode.setIn([nodeChildrenName, childNodeIndex], addNodePath(childNode, nodePath));
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

	toNode = toNode.set('name', fromNode.get(nodeKeyName));
	toNode = toNode.set('children', immutable.List());

	for(var i = 0; i < fromNode.get(nodeChildrenName).size; i++) {
		var childFromNode = fromNode.getIn([nodeChildrenName, i]);
		var childToNode = copyDataAndChildren(childFromNode, immutable.Map());
		toNode = toNode.setIn(['children', i], childToNode);
	}

	return toNode;
}*/



