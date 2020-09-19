import React from "react"
import PropTypes from "prop-types"

import TreeNode from './tree-node'


class TreeView extends React.Component {
  constructor(props) {
    super(props)

    // Create category tree data
    var output = {
      'name': 'All',
      'toggled': true,
      'children': []
    }
    this.props.calculators.map((calculator) => {
      this.addCategoriesToTree(calculator.metadata.categories, output)
    })
    console.log(output)

    this.state = {}
    this.state.treeData = output;
  }

  addCategoriesToTree (categories, treeNode) {
    // console.log('addCategoriesToTree() called with categories =')
    // console.log(categories)
    // Copy array, we are going to modify it, and we don't want to touch
    // the original!
    categories = categories.slice()
    // console.log(', treeNode =')
    // console.log(treeNode)
    var inTree = false
    treeNode.children.map(function (childNode) {
      if (childNode.name === categories[0]) {
        inTree = true
      }
    })
    // Add first category element if it doesn't already exist
    if (!inTree) {
      // console.log('Category ' + categories[0] + ' not found in tree.')
      var newTreeNode = {
        'name': categories[0],
        'selected': false,
        'children': []
      }
      treeNode.children.push(newTreeNode)
    }
    // Remove first category element
    categories.splice(0, 1)
    if (categories.length > 0) {
      this.addCategoriesToTree(categories, treeNode.children[treeNode.children.length - 1])
    }
  }

  handleClick = (node) => {
    this.props.nodeClicked(node)
  }

  render() {
    return (
    <div>
      <TreeNode
                data={this.state.treeData}
                parentCategories={[ ]}
                handleClick={this.handleClick}
            />

    </div>
      )
  }
}

TreeView.propTypes = {
  calculators: PropTypes.array.isRequired,
};

export default TreeView