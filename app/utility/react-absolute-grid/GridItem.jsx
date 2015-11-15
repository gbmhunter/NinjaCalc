'use strict';

import React from 'react';
import BaseDisplayObject from './BaseDisplayObject.js';
import { Button } from 'react-bootstrap';

import * as calcActions from '../../actions/calc-actions.js';
console.log('calcActions = ');
console.log(calcActions);


export default class GridItem extends BaseDisplayObject{


    onClick() {
        console.log('GridItem.onClick() called. this.props.test = ' + this.props.item.test);
        this.props.item.dispatch(calcActions.openCalc(this.props.item.calcId));
    }

    render() {
    //IMPORTANT: Without the style, nothing happens :(
    var itemStyle = super.getStyle.call(this);

    return <div
            style={itemStyle}
            className="gridItem">
            	<a>{this.props.item.name}</a>
            	<br />
            	<Button onClick={this.onClick.bind(this)}>Open</Button>

            </div>;
    }
}