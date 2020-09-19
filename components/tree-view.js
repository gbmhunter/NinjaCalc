import React from "react"
import PropTypes from "prop-types"

class TreeView extends React.Component {
  constructor(props) {
    super(props)

    // Create category tree data
    var output = {
      'name': 'root',
      'selected': false,
      'children': []
    }
    this.props.calculators.map((calculator) => {
      this.addCategoriesToTree(calculator.metadata.categories, output)
    })
    console.log(output)

  }

  addCategoriesToTree (categories, treeNode) {
    // console.log('addCategoriesToTree() called with categories =')
    // console.log(categories)
    // Copy array, we are going to modify it, and we don't want to touch
    // the original!
    console.log(categories)
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

  render() {
    return (<div>Test</div>)
  }
}

TreeView.propTypes = {
  calculators: PropTypes.array.isRequired,
};

export default TreeView