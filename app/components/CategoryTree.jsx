//!
//! @file               CategoryTree.jsx
//! @author             Geoffrey Hunter <gbmhunter@gmail.com> (www.mbedded.ninja)
//! @created            2015-11-25
//! @last-modified      2015-11-25
//! @brief              
//! @details
//!     See README.rst in repo root dir for more info.

import React from 'react';
import {Treebeard} from 'react-treebeard';

export class CategoryTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onSubTreeToggled(node, toggled){
        // Store Toggle State
        node.toggled = toggled;
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(!node.terminal){ this.onSubTreeToggled(node, toggled); }
        this.setState({ cursor: node });
    }
    render(){
        return (
            <Treebeard
                data={this.props.data}
                onToggle={this.onToggle}
            />
        );
    }
}