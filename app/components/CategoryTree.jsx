//!
//! @file               CategoryTree.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-25
//! @last-modified      2015-12-01
//! @brief              React component which draws the calculator category tree element. Uses the
//!                     react-treebeard module.
//! @details
//!     See README.rst in repo root dir for more info.

// npm modules
import React from 'react';
import {Treebeard} from 'react-treebeard';

// User modules
import * as calcActions from '../actions/calc-actions.js';

/*
const data = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                {
                    name: 'child',
                    terminal: true
                }
            ]
        },
        {
            name: 'loading parent',
            loading: true
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        {
                            name: 'nested child',
                            //terminal: true
                        }
                    ]
                }
            ]
        }
    ]
};*/

var style = {
    tree: {
        base: {
            listStyle: 'none',
            backgroundColor: '#FFFFFF',
            margin: 0,
            padding: 0,
            color: '#333',
            fontFamily: 'lucida grande ,tahoma,verdana,arial,sans-serif',
            fontSize: '14px'
        },
        node: {
            base: {
                position: 'relative'
            },
            link: {
                position: 'relative',
                padding: '0px 5px',
                display: 'block'
            },
            activeLink: {
                background: '#000'
            },
            toggle: {
                base: {
                    position: 'relative',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    marginLeft: '-5px',
                    height: '24px',
                    width: '24px'
                },
                wrapper: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-7px 0 0 -7px',
                    height: '14px'
                },
                height: 14,
                width: 14,
                arrow: {
                    fill: '#333',
                    strokeWidth: 0
                }
            },
            header: {
                base: {
                    display: 'inline-block',
                    verticalAlign: 'top',
                    color: '#333'
                },
                connector: {
                    width: '2px',
                    height: '12px',
                    borderLeft: 'solid 2px black',
                    borderBottom: 'solid 2px black',
                    position: 'absolute',
                    top: '0px',
                    left: '-21px'
                },
                title: {
                    lineHeight: '24px',
                    verticalAlign: 'middle'
                }
            },
            subtree: {
                listStyle: 'none',
                paddingLeft: '19px'
            },
            loading: {
                color: '#E2C089'
            }
        }
    }
};

export class CategoryTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }

    //! @brief
    //! @details    Called by onToggle().
    onSubTreeToggled(node, toggled){
        console.log('CategoryTree.onSubTreeToggled() called.');
        // Store Toggle State
        //node.toggled = toggled;
    }

    //! @brief      Event handler for when a node in the category tree is wanted to be toggled (
    //!             i.e. user clicks the node arrow).
    onToggle(node, toggled){
        console.log('CategoryTree.onToggle() called with node =');
        console.log(node);
        console.log('and toggled = ' + toggled);

        //if(this.state.cursor){ 
        //    this.state.cursor.active = false;
        //}
        //node.active = true;
        
        // Check to make sure we are not at the tip of a branch
        // (if we are, we do not need/want to toggle)
        if(!node.terminal) {
            //this.onSubTreeToggled(node, toggled);

            // Dispatch action to change state of category tree data
            //this.props.dispatch(calcActions.toggleCategory(node, toggled));
        }
        //this.setState({ cursor: node });
    }

    render(){

        // The data variable has to be in a specific format for the tree structure to render correctly.
        // Doesn't seem like an array of siblings as the highest level object is supported
        return (
            <Treebeard
                data={this.props.data.toJS()}
                onToggle={this.onToggle}
                style={style}
            />
        );
    }

}