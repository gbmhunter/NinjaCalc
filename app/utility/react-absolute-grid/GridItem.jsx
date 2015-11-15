'use strict';

import React from 'react';
import BaseDisplayObject from './BaseDisplayObject.js';
import { Button, Thumbnail } from 'react-bootstrap';

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
                <Thumbnail src="./calculators/omega.png" alt="242x200">
                    <h3>{this.props.item.name}</h3>
                    <p>{this.props.item.description}</p>
                    <p>
                      <Button bsStyle="primary" onClick={this.onClick.bind(this)}>Open</Button>&nbsp;
                      <Button bsStyle="default">Button</Button>
                    </p>
                </Thumbnail>
            </div>;
    }
}