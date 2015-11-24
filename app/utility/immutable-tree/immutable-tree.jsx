//!
//! @file               immutable-tree.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-23
//! @last-modified      2015-11-23
//! @brief              
//! @details
//!     See README.rst in repo root dir for more info.

'use strict';

//=========== npm MODULES ==========//
var immutable = require('immutable');

//! @brief		Creates a root node. This must be called before
//!				any of the other functions in this module are used.
export function createRootNode() {
	console.log('createRootNode() called.');
	var rootNode = immutable.Map({
		key: 'root',
		children: immutable.List(),
	})

	console.log('Create rootNode. rootNode.toJS() =');
	console.log(rootNode.toJS());
	return rootNode;
}

export function getChildNode(parentNode, nodeKey) {
	console.log('getChildNode() called.');
	var foundNode = parentNode.get('children').find((childNode) => {
		return childNode.key = nodeKey;
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

export function getChildNodeIndex(parentNode, nodeKey) {
	console.log('getChildNodeIndex() called.');
	var foundNodeIndex = parentNode.get('children').findIndex((childNode, index) => {
		return childNode.key = nodeKey;
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
	console.log('addChildNode() called with existing parent node = ');
	console.log(parentNode.toJS());

	var foundNode = getChildNode(parentNode, newNodeKey);

	console.log('foundNode = ' + foundNode);
	if(typeof(foundNode) == 'undefined') {
		console.log('Could not find node \"' + newNodeKey + '\", so creating new node.');
		var length = parentNode.get('children').size;
		parentNode = parentNode.setIn(['children', length], immutable.Map({
			key: newNodeKey,
			children: immutable.List(),
	  	}));
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
		parentNode = parentNode.setIn(['children', childNodeIndex], addNodePath(childNode, nodePath));
	}

	console.log('addNodePath() finished.');

	return parentNode;
}


