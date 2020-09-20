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
    console.log('categories=')
    console.log(this.state.categories)
  }

  onClick = () => {
    this.props.handleClick(this.state.categories)
  }

  render = () => {

    const childrenHtml = this.props.data.children.map((childNode, idx) => {
      return (<TreeNode key={idx} data={childNode} parentCategories={this.state.categories} handleClick={this.props.handleClick}/>)
    })

    return (
      <div>
        <li onClick={this.onClick} className={this.props.data.selected ? 'selected' : ''}
          style={{ cursor: 'pointer' }}>{this.props.data.name}</li>
        <ul>
          {childrenHtml}
        </ul>
        <style jsx>{`
          li.selected {
            background-color: #aaffaa;
          }
        `}</style>
      </div>
    )
  }
}

export default TreeNode