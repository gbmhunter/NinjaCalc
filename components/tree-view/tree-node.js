import React from "react"
import PropTypes from "prop-types"

class TreeNode extends React.Component {
  constructor(props) {
    super(props)
    let categories = this.props.parentCategories.slice()
    categories.push(this.props.data.name)
    this.state = {
      categories: categories
    }
  }

  onClick = () => {
    this.props.handleClick(this.state.categories)
  }

  render = () => {

    const childrenHtml = this.props.data.children.map((childNode, idx) => {
      return (<TreeNode key={idx} data={childNode} parentCategories={this.state.categories} handleClick={this.props.handleClick} />)
    })

    return (
      <div>
        <li onClick={this.onClick} className={this.props.data.selected ? 'selected-node' : ''}
          style={{ cursor: 'pointer' }}><span>{this.props.data.name} ({this.props.data.numChildren})</span></li>
        <ul>
          {childrenHtml}
        </ul>
        <style jsx>{`
          .selected-node {
            background-color: var(--primary-color);
          }

          .selected-node span {
            color: #ffffff;
          }
        `}</style>
      </div>
    )
  }
}

export default TreeNode